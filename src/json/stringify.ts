import {assert} from '../assert';
import {TypeFromTypeInfo} from '../type-from-type-info';
import {TypeInfo} from '../type-info';


export function stringify<T extends TypeInfo>(t: T, v: TypeFromTypeInfo<T>): string {
    assert(t, v); // TODO: replace this line with: v = removeExcessProperties(t, v)
    let result = JSON.stringify(v);
    return result;
}


// TODO: replacer with special handling for:
// - date
// - undefined
// - NaN
