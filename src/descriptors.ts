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
