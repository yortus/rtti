import {CheckOptions, CheckResult} from './operations';

export interface Methods<T> {
    assertValid(v: unknown, options?: CheckOptions): asserts v is T;
    check(v: unknown, options?: CheckOptions): CheckResult;
    example: T; // getter
    isValid(v: unknown, options?: CheckOptions): v is T;
    sanitize(v: T): T;
    toJsonSchema(): unknown;
    toString(): string;
}
