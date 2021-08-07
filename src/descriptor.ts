/** Runtime information describing a value type. This is an internal type used within the library */
export type Descriptor<Nested = Descriptor<any>> =
    | Any
    | Array<Nested>
    | Boolean
    | BrandedString<string>
    | Date
    | Intersection<Nested[]>
    | Never
    | Null
    | Number
    | Object<Record<string, Nested | Optional<Nested>>>
    | String
    | Tuple<Nested[]>
    | Undefined
    | Union<Nested[]>
    | Unit<string | number | boolean>
    | Unknown
;

/** `Optional` is an 'operator' only valid inside object and tuple descriptors. It is *not* itself a descriptor. */
export type Optional<Nested = any, T extends Nested = any> = {kind: 'optional', type: T};

type Any = {kind: 'any'};
type Array<Element> = {kind: 'array', element: Element};
type Boolean = {kind: 'boolean'};
type BrandedString<Brand extends string> = {kind: 'brandedString', brand: Brand};
type Date = {kind: 'date'};
type Intersection<Members extends any[]> = {kind: 'intersection', members: Members};
type Never = {kind: 'never'};
type Null = {kind: 'null'};
type Number = {kind: 'number'};
type Object<Properties extends Record<string, any>> = {kind: 'object', properties: Properties};
type String = {kind: 'string'};
type Tuple<Elements extends any[]> = {kind: 'tuple', elements: Elements};
type Undefined = {kind: 'undefined'};
type Union<Members extends any[]> = {kind: 'union', members: Members};
type Unit<T extends string | number | boolean> = {kind: 'unit', value: T};
type Unknown = {kind: 'unknown'};
