import cloneDeep from 'lodash.clonedeep';
import {assert} from './assert';
import {TypeFromTypeInfo} from './type-from-type-info';
import {TypeInfo} from './type-info';


export function removeExcessProperties<T extends TypeInfo>(t: T, v: TypeFromTypeInfo<T>): TypeFromTypeInfo<T>;
export function removeExcessProperties(t: TypeInfo, v: unknown) {
    assert(t, v);
    switch (t.kind) {

        case 'array':
            return (v as any[]).map(el => removeExcessProperties(t.element, el));

        case 'intersection':
            // TODO: ...
            throw new Error('Not supported');

        case 'object':
            // TODO: ...
            throw new Error('Not supported');

        case 'tuple':
            return (v as any[]).map((el, i) => removeExcessProperties(t.elements[i], el));
    
        case 'union':
            // TODO: ...
            throw new Error('Not supported');

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

        //default: throw ((type: never) => new Error(`Unhandled type '${type}'`))(t);
    }
}
