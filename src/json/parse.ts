import {assert} from '../assert';
import {TypeFromTypeInfo} from '../type-from-type-info';
import {TypeInfo} from '../type-info';


export function parse<T extends TypeInfo>(t: T, s: string): TypeFromTypeInfo<T> {
    let result = JSON.parse(s);
    assert(t, result);
    return result;
}


// TODO: reviver with special handling for:
// - date
// - undefined
// - NaN
