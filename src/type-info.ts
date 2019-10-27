export type TypeInfo =
    | Any
    | Array
    | Boolean
    | BrandedString
    | Date
    | Intersection
    | Never
    | Null
    | Number
    | Object_
    // NB: Optional is *not* a type, it is a type-operator only valid inside objects and tuples
    | String
    | Tuple
    | Undefined
    | Union
    | Unit
    | Unknown
;




type Any = {kind: 'any'};
type Array<Element extends TypeInfo = any> = {kind: 'array', element: Element};
type Boolean = {kind: 'boolean'};
type BrandedString<Brand extends string = any> = {kind: 'brandedString', brand: Brand};
type Date = {kind: 'date'};
type Intersection<Members extends TypeInfo[] = any[]> = {kind: 'intersection', members: Members};
type Never = {kind: 'never'};
type Null = {kind: 'null'};
type Number = {kind: 'number'};
type Object_<Properties extends Record<string, TypeInfo | Optional> = Record<string, any>> = {kind: 'object', properties: Properties};
type Optional<T extends TypeInfo = any> = {kind: 'optional', type: T};
type String = {kind: 'string'};
type Tuple<Elements extends TypeInfo[] = any[]> = {kind: 'tuple', elements: Elements};
type Undefined = {kind: 'undefined'};
type Union<Members extends TypeInfo[] = any[]> = {kind: 'union', members: Members};
type Unit<T extends string | number | boolean = any> = {kind: 'unit', value: T};
type Unknown = {kind: 'unknown'};


const Any: Any = {kind: 'any'};
const Array = <E extends TypeInfo>(element: E): Array<E> => ({kind: 'array', element});
const Boolean: Boolean = {kind: 'boolean'};
const BrandedString = <Brand extends string>(brand: Brand): BrandedString<Brand> => ({kind: 'brandedString', brand});
const Date: Date = {kind: 'date'};
const Intersection = <M extends TypeInfo[]>(...members: M): Intersection<M> => ({kind: 'intersection', members});
const Never: Never = {kind: 'never'};
const Null: Null = {kind: 'null'};
const Number: Number = {kind: 'number'};
const Object_ = <P extends Record<string, TypeInfo|Optional>>(properties: P): Object_<P> => ({kind: 'object', properties});
const Optional = <T extends TypeInfo>(type: T): Optional<T> => ({kind: 'optional', type});
const String: String = {kind: 'string'};
const Tuple = <E extends TypeInfo[]>(...elements: E): Tuple<E> => ({kind: 'tuple', elements});
const Undefined: Undefined = {kind: 'undefined'};
const Union = <M extends TypeInfo[]>(...members: M): Union<M> => ({kind: 'union', members});
const Unit = <V extends string | number | boolean>(value: V): Unit<V> => ({kind: 'unit', value});
const Unknown: Unknown = {kind: 'unknown'};


export {
    Any as any,
    Array as array,
    Boolean as boolean,
    BrandedString as brandedString,
    Date as date,
    Intersection as intersection,
    Never as never,
    Null as null,
    Number as number,
    Object_ as object,
    Optional as optional,
    String as string,
    Tuple as tuple,
    Undefined as undefined,
    Union as union,
    Unit as unit,
    Unknown as unknown,
};
