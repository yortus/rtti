import {TypeFromDescriptor} from '../type-from-descriptor';
import {Descriptor, optional} from '../descriptors';
import {CheckOptions} from './check';

export function isValid<D extends Descriptor>(d: D, v: unknown, options?: CheckOptions): v is TypeFromDescriptor<D> {
    switch (d.kind) {
        case 'any': return true;
        case 'array': return Array.isArray(v) && v.every(el => isValid(d.element, el, options));
        case 'boolean': return typeof v === 'boolean';
        case 'brandedString': return typeof v === 'string';
        case 'date': return v instanceof Date;
        case 'intersection': return (d.members as Descriptor[]).every(md => isValid(md, v, options));
        case 'never': return false;
        case 'null': return v === null;
        case 'number': return typeof v === 'number';
        case 'object': {
            if (typeof v !== 'object' || v === null) return false;
            let propDescs = d.properties as Record<string, Descriptor | optional>;
            let propNames = Object.keys(propDescs);
            for (let propName of propNames) {
                let propDesc = propDescs[propName];
                let isOptional = propDesc.kind === 'optional';
                propDesc = propDesc.kind === 'optional' ? propDesc.type as Descriptor : propDesc;
                let propValue = (v as any)[propName];
                if (propValue === undefined && isOptional) continue;
                if (!isValid(propDesc, propValue, options)) return false;
            }
            const allowExcessProperties = options?.allowExcessProperties ?? true;
            if (!allowExcessProperties) {
                if (Object.keys(v).some(name => !propNames.includes(name))) return false;
            }
            return true;
        }
        case 'string': return typeof v === 'string';
        case 'tuple': {
            let elemDescs = d.elements as Descriptor[];
            return Array.isArray(v)
                && v.length === elemDescs.length
                && v.every((el, i) => isValid(elemDescs[i], el, options));
        }
        case 'undefined': return v === undefined;
        case 'union': return (d.members as Descriptor[]).some(md => isValid(md, v, options));
        case 'unit': return v === d.value;
        case 'unknown': return true;
        default: ((desc: never) => { throw new Error(`Unhandled case '${desc}'`) })(d);
    }
}
