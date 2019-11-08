import {inspect} from 'util';
import {getValidationErrors} from './get-validation-errors';
import {is} from './is';
import {toString} from './to-string';
import {TypeFromTypeInfo} from './type-from-type-info';
import {TypeInfo} from './type-info';


export function assert<T extends TypeInfo>(t: T, v: unknown): asserts v is TypeFromTypeInfo<T> {
    if (is(t, v)) return;
    let d = inspect(v, {depth: 0, compact: true, breakLength: Infinity});
    throw Object.assign(
        new Error(`${d} does not conform to type ${toString(t)}`),
        getValidationErrors(t, v)
    );
}
