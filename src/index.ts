import {assert} from './assert';
import {getValidationErrors, ValidationErrors} from './get-validation-errors';
import {is} from './is';
import {JSON} from './json';
import {removeExcessProperties} from './remove-excess-properties';
import {toString} from './to-string';
import {TypeFromTypeInfo} from './type-from-type-info';
import * as t from './type-info';


export {assert, getValidationErrors, is, JSON, removeExcessProperties, toString, TypeFromTypeInfo, t, ValidationErrors};


// TODO: ...
/*

// Types:
TypeInfo        // discriminated union of many specific TypeInfo kinds
TypeFromTypeInfo<T extends TypeInfo>

// Free functions:
is(t: TypeInfo, v: unknown, options: 'exact' | {...}): boolean;   // checks for structural compatibility also a type guard
assert(t: TypeInfo, v: unknown, options: 'exact' | {...});        // like `is` but throws, also an `asserts` CFA guard
getDescription(t: TypeInfo, options: 'full' | 'short' | {...}): string;    // aka toString
getValidationErrors(t: TypeInfo, v: value, options: 'exact' | {...}): ValidationError[] // more info than `is`/`assert`
trim(t: TypeInfo, v: value): ...        // return a clone of `v` with excess properties recursively removed
// TODO: replace trim() with clone() with mode option?

// Objects:
JSON: {
    parse(t: TypeInfo, s: string, , options: 'exact' | {...}): ...
    stringify(t: TypeInfo, v: ..., , options: 'trim' | {...}): string
}


Mode:
'exact':
    - reject excess properties when checking values
    - exclude excess properties when generating values

'loose':
    - accept excess properties when checking values
    - include excess properties when generating values

'robust': // see https://en.wikipedia.org/wiki/Robustness_principle
    - accept excess properties when checking values
    - exclude excess properties when generating values

'default':
    - ???
*/
