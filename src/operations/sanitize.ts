import cloneDeep from 'lodash.clonedeep';
import {Descriptor} from '../descriptor';
import {isValid} from './is-valid';


// TODO: doc... precond: The runtime value `v` conforms to the type described by `t`.
export function sanitize(d: Descriptor, v: unknown): unknown {
    switch (d.kind) {

        case 'array':
        case 'tuple': {
            let ar = v as unknown[];
            return ar.map((el, i) => sanitize(d.kind === 'tuple' ? d.elements[i] : d.element, el));
        }

        case 'object': {
            let obj = v as any;
            let clonedObj = {} as any;
            for (let propName of Object.keys(d.properties)) {
                let propType = d.properties[propName];
                let isOptional = propType.kind === 'optional';
                propType = propType.kind === 'optional' ? propType.type as Descriptor : propType;
                let propValue = obj[propName];
                if (propValue === undefined && isOptional) continue;
                clonedObj[propName] = sanitize(propType, obj[propName]);
            }
            return clonedObj;
        }
            
        case 'intersection': {
            // Do excess property removal against an Object descriptor with the union
            // of all the properties of intersection members which are Object descriptors.
            return sanitize({
                kind: 'object',
                properties: d.members.reduce(
                    (props, member) => member.kind === 'object' ? Object.assign(props, member.properties) : props,
                    {} as Record<string, Descriptor>
                ),
            }, v);
        }

        case 'union': {
            // Find the first union member type that matches the value `v`. There must be one according to preconds.
            let matchingType = d.members.find(m => isValid(m, v))!;

            // Do excess property removal against the matching member type found above.
            return sanitize(matchingType, v);
        }

        case 'any':
        case 'boolean':
        case 'brandedString':
        case 'date':
        case 'never':
        case 'null':
        case 'number':
        case 'string':
        case 'undefined':
        case 'unit':
        case 'unknown':
            return cloneDeep(v);

        default:
            ((type: never) => { throw new Error(`Unhandled type '${type}'`) })(d);
    }
}
