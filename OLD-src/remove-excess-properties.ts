import cloneDeep from 'lodash.clonedeep';
import {is} from './is';
import {TypeFromTypeInfo} from './type-from-type-info';
import {TypeInfo} from './type-info';
import * as t from './type-info';


// TODO: doc... precond: The runtime value `v` conforms to the type described by `t`.
export function removeExcessProperties<T extends TypeInfo>(t: T, v: TypeFromTypeInfo<T>): TypeFromTypeInfo<T>;
export function removeExcessProperties(ti: TypeInfo, v: unknown) {
    switch (ti.kind) {

        case 'array':
        case 'tuple': {
            let ar = v as unknown[];
            return ar.map((el, i) => removeExcessProperties(ti.kind === 'tuple' ? ti.elements[i] : ti.element, el));
        }

        case 'object': {
            let obj = v as any;
            let clonedObj = {} as any;
            let properties = ti.properties as Record<string, TypeInfo | t.optional>;
            for (let propName of Object.keys(properties)) {
                let propType = properties[propName];
                let isOptional = propType.kind === 'optional';
                propType = propType.kind === 'optional' ? propType.type as TypeInfo : propType;
                let propValue = obj[propName];
                if (propValue === undefined && isOptional) continue;
                clonedObj[propName] = removeExcessProperties(propType, obj[propName]);
            }
            return clonedObj;
        }
            
        case 'intersection': {
            // Create a t.object with the union of all the properties of intersection members which are t.objects.
            let combinedProps = t.object(ti.members.reduce(
                (props, m: t.TypeInfo) => m.kind === 'object' ? Object.assign(props, m.properties) : props,
                {} as Record<string, TypeInfo>
            ));

            // Do excess property removal against the t.object created above.
            return removeExcessProperties(combinedProps, v as object);
        }

        case 'union': {
            // Find the first union member type that matches the value `v`. There must be one according to preconds.
            let matchingType = (ti.members as TypeInfo[]).find(m => is(m, v))!;

            // Do excess property removal against the matching member type found above.
            return removeExcessProperties(matchingType, v);
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
            ((type: never) => { throw new Error(`Unhandled type '${type}'`) })(ti);
    }
}
