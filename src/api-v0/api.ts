import {CheckOptions} from '../operations';
import {TypeInfo} from '../type-info';

/**
 * Throws an error if the value `v` does not conform to the type, otherwise returns. Errors thrown by `assert`
 * have an `errors` property with detailed information about the errors encountered during type checking.
 * @deprecated since 1.0; use t.assertValid(v, opts) instead
 */
export function assert<T>(t: TypeInfo<T>, v: unknown): asserts v is T {
    return t.assertValid(v, checkOptionsForV0);
}

/**
 * Returns a JSON Schema representation of the type.
 * @deprecated since 1.0; use t.toJsonSchema() instead
 */
export function getJsonSchema(t: TypeInfo): unknown {
    return t.toJsonSchema();
}

/**
 * Checks whether the value `v` conforms to the type, returning details about any type-checking errors encountered.
 * @deprecated since 1.0; use t.check(v, opts) instead
 */
export function getValidationErrors<T extends TypeInfo>(t: T, v: unknown): ValidationErrors {
    const checkResult = t.check(v, {allowExcessProperties: false});
    const errors = checkResult.errors.filter(({message}) => !isWarningInV0(message));
    const warnings = checkResult.errors.filter(({message}) => isWarningInV0(message));
    return {errors, warnings};
}

/**
 * Returns true if the value `v` conforms to the type, or false otherwise.
 * @deprecated since 1.0; use t.isValid(v, opts) instead
 */
export function is<T>(t: TypeInfo<T>, v: unknown): v is T {
    return t.isValid(v, checkOptionsForV0);
}

/**
 * Returns a deep clone of the value `v` containing only properties that are explicitly present in the type.
 * That is, all excess properties are removed in the returned value.
 * @deprecated since 1.0; use t.sanitize(v) instead
 */
export function removeExcessProperties<T>(t: TypeInfo<T>, v: T): T {
    return t.sanitize(v);
}

/**
 * Returns a human-readable representation of the type.
 * @deprecated since 1.0; use t.toString() instead
 */
export function toString(t: TypeInfo): string {
    return t.toString();
}

export type TypeFromTypeInfo<T extends TypeInfo> = T['example'];

export interface ValidationErrors {
    errors: Array<{path: string, message: string}>;
    warnings: Array<{path: string, message: string}>;
}

const checkOptionsForV0: CheckOptions = {allowExcessProperties: true};

const isWarningInV0 = (message: string) => message.includes('The object has excess properties');
