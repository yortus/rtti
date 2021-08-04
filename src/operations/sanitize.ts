import cloneDeep from 'lodash.clonedeep';
import {Descriptor, Object, Optional} from '../descriptors';
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
            let properties = d.properties as Record<string, Descriptor | Optional>;
            for (let propName of Object.keys(properties)) {
                let propType = properties[propName];
                let isOptional = propType.kind === 'optional';
                propType = propType.kind === 'optional' ? propType.type as Descriptor : propType;
                let propValue = obj[propName];
                if (propValue === undefined && isOptional) continue;
                clonedObj[propName] = sanitize(propType, obj[propName]);
            }
            return clonedObj;
        }
            
        case 'intersection': {
            // Create an Object descriptor with the union of all the properties of intersection members which are Object descriptors.
            let combinedProps: Object = {
                kind: 'object',
                properties: d.members.reduce(
                    (props, m: Descriptor) => m.kind === 'object' ? Object.assign(props, m.properties) : props,
                    {} as Record<string, Descriptor>
                ),
            };

            // Do excess property removal against the Object descriptor created above.
            return sanitize(combinedProps, v as object);
        }

        case 'union': {
            // Find the first union member type that matches the value `v`. There must be one according to preconds.
            let matchingType = (d.members as Descriptor[]).find(m => isValid(m, v))!;

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
