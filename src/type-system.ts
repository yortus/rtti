// TODO:
// values:
// - toString() to pretty-print the type
// - validate() to throw a user-friendly error describing validation error(s) if any
// types:
// - add Promises?
// - add functions?
// - add symbols?
// - add intersection?
// - add keyof?
import {Type, TYPE_TAG} from './type';





export {
    // Values
    anyValue as any,
    unknownValue as unknown,
    neverValue as never,
    numberValue as number,
    stringValue as string,
    booleanValue as boolean,
    nullValue as null,
    undefinedValue as undefined,
    voidValue as void,
    arrayValue as array,
    objectValue as object,
    dateValue as date,
    unionValue as union,
    optionalValue as optional,

    // Types
    AnyType as Any,
    UnknownType as Unknown,
    NeverType as Never,
    NumberType as Number,
    StringType as String,
    BooleanType as Boolean,
    NullType as Null,
    UndefinedType as Undefined,
    VoidType as Void,
    ArrayType as Array,
    ObjectType as Object,
    DateType as Date,
    UnionType as Union,
    OptionalType as Optional,

    // Type Operators
    TypeOf,
};





// ========================================
// ||            Value Space             ||
// ========================================
// Top and bottom types
let anyValue = makeValue<AnyType>(() => true);
let unknownValue = makeValue<UnknownType>(() => true);
let neverValue = makeValue<NeverType>(() => false);

// Primitive types
let numberValue = makeValue<NumberType>(v => typeof v === 'number');
let stringValue = makeValue<StringType>(v => typeof v === 'string');
let booleanValue = makeValue<BooleanType>(v => typeof v === 'boolean');
let nullValue = makeValue<NullType>(v => v === null);
let undefinedValue = makeValue<UndefinedType>(v => v === undefined);
let voidValue = makeValue<VoidType>(v => v === null || v === undefined);

// Built-in types
let dateValue = makeValue<DateType>(v => v instanceof Date);

// Compound types
function arrayValue<T extends Type>(elementType: T) {
    return makeValue<ArrayType<T>>(value => {
        if (!Array.isArray(value)) return false;
        return value.every(elementType.isValid);
    });
}
function objectValue<T extends {[x: string]: Type}>(propTypes: T) {
    return makeValue<ObjectType<T>>(value => {
        if (!value || typeof value !== 'object') return false;
        return Object.keys(propTypes).every(key => propTypes[key].isValid((value as any)[key]));
    });
}

// Type combinators
function unionValue<T1 extends Type, T2 extends Type, T3 extends Type, T4 extends Type>(t1: T1, t2: T2, t3: T3, t4: T4):
    UnionType<T1, T2, T3, T4>;
function unionValue<T1 extends Type, T2 extends Type, T3 extends Type>(t1: T1, t2: T2, t3: T3): UnionType<T1, T2, T3>;
function unionValue<T1 extends Type, T2 extends Type>(t1: T1, t2: T2): UnionType<T1, T2>;
function unionValue<T1 extends Type>(t1: T1): UnionType<T1>;
function unionValue(): UnionType;
function unionValue<T extends Type>(...ts: T[]) {
    return makeValue<any>(value => {
        return ts.some(t => t.isValid(value));
    });
}
function optionalValue<T extends Type>(t: T) {
    return makeValue<OptionalType<T>>(value => {
        return value === undefined || t.isValid(value);
    });
}





// ========================================
// ||             Type Space             ||
// ========================================
// Top and bottom types
interface AnyType extends Type<any> { }
interface UnknownType extends Type<{} | null | undefined> { } // TODO: use `unknown` when TS3 is released
interface NeverType extends Type<never> { }

// Primitive types - these simple ones don't do much except make intellisense/quickinfo more readable
interface NumberType extends Type<number> { }
interface StringType extends Type<string> { }
interface BooleanType extends Type<boolean> { }
interface NullType extends Type<null> { }
interface UndefinedType extends Type<undefined> { }
interface VoidType extends Type<void> { }

// Built-in types
interface DateType extends Type<Date> { }

// Compound types
interface ArrayType<T extends Type> extends Type<Array<TypeOf<T>>> { }
interface ObjectType<T extends {[x: string]: Type}> extends Type<
    {[K in RequiredPropNames<T>]: TypeOf<T[K]>} &
    {[K in OptionalPropNames<T>]?: TypeOf<T[K]>}
> { }
export type RequiredPropNames<T extends {[x: string]: Type}> =
    keyof T extends never
        ? never
        : {[P in keyof T]: undefined extends TypeOf<T[P]> ? never : P}[keyof T];
export type OptionalPropNames<T extends {[x: string]: Type}> =
    keyof T extends never
        ? never
        : {[P in keyof T]: undefined extends TypeOf<T[P]> ? P : never}[keyof T];

// Type combinators
interface UnionType<T1 extends Type = NeverType,
                    T2 extends Type = NeverType,
                    T3 extends Type = NeverType,
                    T4 extends Type = NeverType> extends Type<TypeOf<T1> | TypeOf<T2> | TypeOf<T3> | TypeOf<T4>> { }
interface OptionalType<T extends Type> extends Type<TypeOf<T> | undefined> { } // TODO: improve? This is approx





// ========================================
// ||           Type Operators           ||
// ========================================
// Helpers

// Type operators to wrap and unwrap Type<T> representations of types

type TypeOf<T extends Type> = T[TYPE_TAG];





// ========================================
// ||               Helpers              ||
// ========================================
function makeValue<T extends Type>(isValid: (value: {} | null | undefined) => boolean) {
    return {isValid} as T;
}
