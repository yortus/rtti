import {Descriptor} from '../descriptor';
import {isValid} from './is-valid';

// Precondition: `v` must already be known to conform to the type descriptor `d`.
export function sanitize(d: Descriptor, v: unknown): unknown {
    switch (d.kind) {

        // Arrays/tuples: recursively sanitize only recognised elements into a new array instance.
        case 'array':
        case 'tuple': {
            let ar = v as unknown[];
            return ar.map((el, i) => sanitize(d.kind === 'tuple' ? d.elements[i] : d.element, el));
        }

        // Objects: recursively sanitize only recognised properties into a new object instance.
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
            
        // Intersections: perform excess property removal against an Object descriptor with the
        // union of all the properties of intersection members which are Object descriptors.
        case 'intersection': {
            return sanitize({
                kind: 'object',
                properties: d.members.reduce(
                    (props, member) => member.kind === 'object' ? Object.assign(props, member.properties) : props,
                    {} as Record<string, Descriptor>
                ),
            }, v);
        }

        // Unions: perform excess property removal against the first union member type that
        // matches the value `v` (there must be at least one according to preconditions).
        case 'union': {
            let matchingType = d.members.find(m => isValid(m, v))!;
            return sanitize(matchingType, v);
        }

        // Primitive values: copy the value.
        case 'boolean':
        case 'brandedString':
        case 'null':
        case 'number':
        case 'string':
        case 'undefined':
        case 'unit':
            return v;

        // Supported reference types: Shallow-copy the reference.
        case 'date':
            return v;

        // Any/unknown: Shallow-copy the reference since the type does not retrict the internal structure.
        case 'any':
        case 'unknown':
            return v;

        // Never: This type has no values, so it is an error to reach this code.
        case 'never':
            throw new Error(`Precondition violation: sanitize() called on a value that does not conform to the type.`);

        default:
            ((type: never) => { throw new Error(`Unhandled type '${type}'`) })(d);
    }
}
