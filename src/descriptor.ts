import {Anonymize} from './utils';

// TODO: doc...
export type Descriptor =
    | Any
    | Array
    | Boolean
    | BrandedString
    | Date
    | Intersection
    | Never
    | Null
    | Number
    | Object
    | String
    | Tuple
    | Undefined
    | Union
    | Unit
    | Unknown
;

export type Any = {kind: 'any'};
export type Array<Element = any> = {kind: 'array', element: Element};
export type Boolean = {kind: 'boolean'};
export type BrandedString<Brand extends string = any> = {kind: 'brandedString', brand: Brand};
export type Date = {kind: 'date'};
export type Intersection<Members = any[]> = {kind: 'intersection', members: Members};
export type Never = {kind: 'never'};
export type Null = {kind: 'null'};
export type Number = {kind: 'number'};
export type Object<Properties = Record<string, any>> = {kind: 'object', properties: Properties};
export type String = {kind: 'string'};
export type Tuple<Elements = any[]> = {kind: 'tuple', elements: Elements};
export type Undefined = {kind: 'undefined'};
export type Union<Members = any[]> = {kind: 'union', members: Members};
export type Unit<T extends string | number | boolean = any> = {kind: 'unit', value: T};
export type Unknown = {kind: 'unknown'};

/** NB: Optional is *not* a descriptor, it is an 'operator' only valid inside object and tuple descriptors. */
export type Optional<T = any> = {kind: 'optional', type: T};

// TODO: doc...
export type TypeFromDescriptor<D extends Descriptor> = {
    any: any,
    array: D extends Array<infer Element> ? Element extends Descriptor ? TypeFromDescriptor<Element>[] : never : never,
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
        ? ({[K in keyof Elements]: Elements[K] extends Descriptor ? TypeFromDescriptor<Elements[K]> : 0})
        : never,
    undefined: undefined,
    union: D extends Union<infer Members> ? TypeOfUnion<Members> : never,
    unit: D extends Unit<infer Value> ? Value : never,
    unknown: unknown,
}[D['kind']];

type TypeOfIntersection<Members> = Anonymize<
    Members[any] extends infer E ? (E extends Descriptor ? (x: TypeFromDescriptor<E>) => 0 : 0) extends ((x: infer I) => 0) ? I : 0 : 0
>;

type TypeOfUnion<Members>
    = Anonymize<Members[any] extends infer E ? (E extends Descriptor ? TypeFromDescriptor<E> : 0) : 0>;

type TypeOfObject<Props> = Anonymize<
    & {[K in RequiredPropNames<Props>]: Props[K] extends Descriptor ? TypeFromDescriptor<Props[K]> : 0}
    & {[K in OptionalPropNames<Props>]?: Props[K] extends Optional<infer T> ? T extends Descriptor ? TypeFromDescriptor<T> : 0 : 0}
>;
type RequiredPropNames<Props> = {[K in keyof Props]: Props[K] extends Optional ? never : K}[keyof Props];
type OptionalPropNames<Props> = {[K in keyof Props]: Props[K] extends Optional ? K : never}[keyof Props];
