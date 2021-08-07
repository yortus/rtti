import {Descriptor} from './descriptor';
import {Array, BrandedString, Intersection, Object, Optional, Tuple, Union, Unit} from './descriptor';
import * as op from './operations';
import {Anonymize} from './utils';

export const t = {
    any: createTypeInfo({kind: 'any'}),
    array: <E extends TypeInfo>(element: E) => createTypeInfo({kind: 'array', element}),
    boolean: createTypeInfo({kind: 'boolean'}),
    brandedString: <Brand extends string>(brand: Brand) => createTypeInfo({kind: 'brandedString', brand}),
    date: createTypeInfo({kind: 'date'}),
    intersection: <M extends TypeInfo[]>(...members: M) => createTypeInfo({kind: 'intersection', members}),
    never: createTypeInfo({kind: 'never'}),
    null: createTypeInfo({kind: 'null'}),
    number: createTypeInfo({kind: 'number'}),
    object: <P extends Record<string, TypeInfo | Optional>>(properties: P) => createTypeInfo({kind: 'object', properties}),
    optional: <T extends TypeInfo>(type: T) => ({kind: 'optional' as const, type}),
    string: createTypeInfo({kind: 'string'}),
    tuple: <E extends TypeInfo[]>(...elements: E) => createTypeInfo({kind: 'tuple', elements}),
    undefined: createTypeInfo({kind: 'undefined'}),
    union: <M extends TypeInfo[]>(...members: M) => createTypeInfo({kind: 'union', members}),
    unit: <V extends string | number | boolean>(value: V) => createTypeInfo({kind: 'unit', value}),
    unknown: createTypeInfo({kind: 'unknown'}),
};

export type TypeInfo<T = unknown> = {
    assertValid(v: unknown, options?: op.CheckOptions): asserts v is T;
    check(v: unknown, options?: op.CheckOptions): op.CheckResult;
    example: T; // getter
    isValid(v: unknown, options?: op.CheckOptions): v is T;
    sanitize(v: T): T;
    toJsonSchema(): unknown;
    toString(): string;
}










// helper ctor
function createTypeInfo<D extends Descriptor, T = TypeFromDescriptor<D>>(descriptor: D): TypeInfo<T> {
    descriptor = flatten(descriptor);
    const result: TypeInfo<T> = {
        assertValid: (v, opts) => op.assertValid(descriptor, v, opts),
        check: (v, opts) => op.check(descriptor, v, opts),
        get example() { return op.generateValue(descriptor) as T},
        isValid: (v, opts): v is T => op.isValid(descriptor, v, opts),
        sanitize: v => op.sanitize(descriptor, v) as T,
        toJsonSchema: () => op.toJsonSchema(descriptor),
        toString: () => op.toString(descriptor),
    };
    // NB: TypeInfo is-a descriptor at runtime, but the public TypeInfo type is simpler without the Descriptor part.
    return Object.assign(result, descriptor);
}


































// Helper function to flatten directly-nested intersections and unions.
function flatten<D extends Descriptor>(d: D): D {
    if (d.kind !== 'intersection' && d.kind !== 'union') return d;
    const members = d.members.reduce(
        (flattened, member) => flattened.concat(member.kind === d.kind ? member.members : member),
        [] as TypeInfo[],
    );
    return {...d, members};
}




type TypeFromDescriptor<D extends Descriptor> = {
    any: any,
    array: D extends Array<TypeInfo<infer Elem>> ? Elem[] : never,
    boolean: boolean,
    brandedString: D extends BrandedString<infer Brand>
        ? Brand extends `${string}?`
            ? string & {__brand?: {[K in Brand]: never}}
            : string & {__brand: {[K in Brand]: never}}
        : never,
    date: Date,
    intersection: D extends Intersection<infer Members> ? TypeOfIntersection<Members> : never,
    never: never,
    null: null,
    number: number,
    object: D extends Object<infer Props> ? TypeOfObject<Props> : never,
    string: string,
    tuple: D extends Tuple<infer Elements>
        ? ({[K in keyof Elements]: Elements[K] extends TypeInfo<infer T> ? T : 0})
        : never,
    undefined: undefined,
    union: D extends Union<infer Members> ? TypeOfUnion<Members> : never,
    unit: D extends Unit<infer Value> ? Value : never,
    unknown: unknown,
}[D['kind']];

type TypeOfIntersection<Members> = Anonymize<
    Members[any] extends infer E ? (E extends TypeInfo<infer T> ? (x: T) => 0 : 0) extends ((x: infer I) => 0) ? I : 0 : 0
>;

type TypeOfUnion<Members>
    = Anonymize<Members[any] extends infer E ? (E extends TypeInfo<infer T> ? T : 0) : 0>;

type TypeOfObject<Props> = Anonymize<
    & {[K in RequiredPropNames<Props>]: Props[K] extends TypeInfo<infer T> ? T : 0}
    & {[K in OptionalPropNames<Props>]?: Props[K] extends Optional<TypeInfo<infer T>> ? T : 0}
>;
type RequiredPropNames<Props> = {[K in keyof Props]: Props[K] extends Optional ? never : K}[keyof Props];
type OptionalPropNames<Props> = {[K in keyof Props]: Props[K] extends Optional ? K : never}[keyof Props];
