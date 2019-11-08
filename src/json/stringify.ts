import {TypeFromTypeInfo} from '../type-from-type-info';
import {TypeInfo} from '../type-info';


// TODO: doc... precond: The runtime value `v` conforms to the type described by `t`.
// TODO: doc... if `v` has excess properties they will not be removed. Use `removeExcessProperties` beforehand.
export function stringify<T extends TypeInfo>(_: T, v: TypeFromTypeInfo<T>): string {
    let result = JSON.stringify(v);
    return result;
}


// TODO: replacer with special handling for:
// - date
// - undefined
// - NaN
