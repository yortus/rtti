import {createTypeInfo} from './create-type-info';
import type {Optional} from './descriptor';
import {CheckOptions} from './operations';

/** Type builder for creating runtime representations of types. */
export const t = {
    /**
     * A type containing all possible values, but whose values can also be assigned to all other types.
     * This is an unsound pseudo-type that corresponds to the TypeScript `any` type.
     */
    any: createTypeInfo({kind: 'any'}),

    /** A type containing all arrays whose elements all conform to the element type. */
    array: <E extends TypeInfo>(element: E) => createTypeInfo({kind: 'array', element}),

    /** A type containing only the values `true` and `false`. */
    boolean: createTypeInfo({kind: 'boolean'}),

    /**
     * A plain string at runtime, but with nominal type-checking behaviours. In TypeScript terms, it is a subtype of
     * `string`. Branded strings can only be assigned to/from other branded strings if they have the same brand. All
     * branded strings can be assigned to strings. Plain strings can only be assigned to branded strings if the brand
     * ends in a question mark (eg 'usd?'), otherwise a type-cast must be used.
     */
    brandedString: <Brand extends string>(brand: Brand) => createTypeInfo({kind: 'brandedString', brand}),

    /** A type representing a JavaScript Date object. */
    date: createTypeInfo({kind: 'date'}),

    /** A type that is the conjunction of all its member types. */
    intersection: <M extends TypeInfo[]>(...members: M) => createTypeInfo({kind: 'intersection', members}),

    /** A type that contains no values. Corresponds to TypeScripts bottom type `never`. */
    never: createTypeInfo({kind: 'never'}),

    /** A type that only contains the value `null`. */
    null: createTypeInfo({kind: 'null'}),

    /** A type that contains all JavaScript numbers (but not BigInts). */
    number: createTypeInfo({kind: 'number'}),

    /** A type containing all objects with the given property names and types. */
    object: <P extends Record<string, TypeInfo | Optional>>(properties: P) => createTypeInfo({kind: 'object', properties}),

    /** An operator for declaring that an object property is optional. */
    optional: <T extends TypeInfo>(type: T) => ({kind: 'optional' as const, type}),

    /** A type containing all strings. */
    string: createTypeInfo({kind: 'string'}),

    /** A type containing all arrays where each element conforms to the element type at the corresponding position. */
    tuple: <E extends TypeInfo[]>(...elements: E) => createTypeInfo({kind: 'tuple', elements}),

    /** A type that only contains the value `undefined`. */
    undefined: createTypeInfo({kind: 'undefined'}),

    /** A type that is the disjunction of all its member types. */
    union: <M extends TypeInfo[]>(...members: M) => createTypeInfo({kind: 'union', members}),

    /** A type representing a single literal string/number/boolean value. */
    unit: <V extends string | number | boolean>(value: V) => createTypeInfo({kind: 'unit', value}),

    /** A type containing all possible values. */
    unknown: createTypeInfo({kind: 'unknown'}),
};

/** A runtime representation of a type. */
export type TypeInfo<T = unknown> = {
    /**
     * Throws an error if the value `v` does not conform to the type, otherwise returns. Errors thrown by `assertValid`
     * have an `errors` property with detailed information about the errors encountered during type checking.
     */
    assertValid(v: unknown, options?: CheckOptions): asserts v is T;

    /**
     * Checks whether the value `v` conforms to the type, returning detailed information about any type-checking errors
     * encountered. If the value conforms to the type, the return value has `{isValid: true}`.
     */
    check(v: unknown, options?: CheckOptions): {isValid: boolean, errors: Array<{path: string, message: string}>};

    /**
     * A getter that generates a sample conforming value. The value may change on each access. NOTE: This getter throws
     * an error on access for types that have no valid values (such as `t.never`).
     */
    example: T;

    /** Returns true if the value `v` conforms to the type, or false otherwise. */
    isValid(v: unknown, options?: CheckOptions): v is T;

    /**
     * Returns a deep clone of the value `v` containing only properties that are explicitly present in the type.
     * That is, all excess properties are removed in the returned value.
     */
    sanitize(v: T): T;

    /**
     * Returns a JSON Schema representation of the type.
     */
    toJsonSchema(): unknown;

    /**
     * Returns a human-readable representation of the type.
     */
    toString(): string;
}

export {CheckOptions};
