import {Descriptor} from '../descriptor';
import {CheckOptions} from './check';

export function isValid(d: Descriptor, v: unknown, options?: CheckOptions): boolean {
    switch (d.kind) {
        case 'any': return true;
        case 'array': return Array.isArray(v) && v.every(el => isValid(d.element, el, options));
        case 'boolean': return typeof v === 'boolean';
        case 'brandedString': return typeof v === 'string';
        case 'date': return v instanceof Date;
        case 'intersection': return d.members.every(md => isValid(md, v, options));
        case 'never': return false;
        case 'null': return v === null;
        case 'number': return typeof v === 'number';
        case 'object': {
            if (typeof v !== 'object' || v === null) return false;
            let propNames = Object.keys(d.properties);
            for (let propName of propNames) {
                let propDesc = d.properties[propName];
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
            return Array.isArray(v)
                && v.length === d.elements.length
                && v.every((el, i) => isValid(d.elements[i], el, options));
        }
        case 'undefined': return v === undefined;
        case 'union': return d.members.some(md => isValid(md, v, options));
        case 'unit': return v === d.value;
        case 'unknown': return true;
        default: ((desc: never) => { throw new Error(`Unhandled case '${desc}'`) })(d);
    }
}
