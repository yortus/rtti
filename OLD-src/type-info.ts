export type TypeInfo =
    | Any
    | Array_
    | Boolean_
    | BrandedString
    | Date_
    | Intersection
    | Never
    | Null
    | Number_
    | Object_
    // NB: Optional is *not* a type, it is a type-operator only valid inside objects and tuples
    | String_
    | Tuple
    | Undefined
    | Union
    | Unit
    | Unknown
;




type Any = {kind: 'any'};
type Array_<Element extends TypeInfo = any> = {kind: 'array', element: Element};
type Boolean_ = {kind: 'boolean'};
type BrandedString<Brand extends string = any> = {kind: 'brandedString', brand: Brand};
type Date_ = {kind: 'date'};
type Intersection<Members extends TypeInfo[] = any[]> = {kind: 'intersection', members: Members};
type Never = {kind: 'never'};
type Null = {kind: 'null'};
type Number_ = {kind: 'number'};
type Object_<Properties extends Record<string, TypeInfo | Optional> = Record<string, any>> = {kind: 'object', properties: Properties};
type Optional<T extends TypeInfo = any> = {kind: 'optional', type: T};
type String_ = {kind: 'string'};
type Tuple<Elements extends TypeInfo[] = any[]> = {kind: 'tuple', elements: Elements};
type Undefined = {kind: 'undefined'};
type Union<Members extends TypeInfo[] = any[]> = {kind: 'union', members: Members};
type Unit<T extends string | number | boolean = any> = {kind: 'unit', value: T};
type Unknown = {kind: 'unknown'};


const Any: Any = {kind: 'any'};
const Array_ = <E extends TypeInfo>(element: E): Array_<E> => ({kind: 'array', element});
const Boolean_: Boolean_ = {kind: 'boolean'};
const BrandedString = <Brand extends string>(brand: Brand): BrandedString<Brand> => ({kind: 'brandedString', brand});
const Date_: Date_ = {kind: 'date'};
const Intersection = <M extends TypeInfo[]>(...members: M): Intersection<M> => flatten({kind: 'intersection', members});
const Never: Never = {kind: 'never'};
const Null: Null = {kind: 'null'};
const Number_: Number_ = {kind: 'number'};
const Object_ = <P extends Record<string, TypeInfo|Optional>>(properties: P): Object_<P> => ({kind: 'object', properties});
const Optional = <T extends TypeInfo>(type: T): Optional<T> => ({kind: 'optional', type});
const String_: String_ = {kind: 'string'};
const Tuple = <E extends TypeInfo[]>(...elements: E): Tuple<E> => ({kind: 'tuple', elements});
const Undefined: Undefined = {kind: 'undefined'};
const Union = <M extends TypeInfo[]>(...members: M): Union<M> => flatten({kind: 'union', members});
const Unit = <V extends string | number | boolean>(value: V): Unit<V> => ({kind: 'unit', value});
const Unknown: Unknown = {kind: 'unknown'};


export {
    Any as any,
    Array_ as array,
    Boolean_ as boolean,
    BrandedString as brandedString,
    Date_ as date,
    Intersection as intersection,
    Never as never,
    Null as null,
    Number_ as number,
    Object_ as object,
    Optional as optional,
    String_ as string,
    Tuple as tuple,
    Undefined as undefined,
    Union as union,
    Unit as unit,
    Unknown as unknown,
};


// Helper function to flatten directly-nested intersections and unions.
function flatten<T extends Intersection<TypeInfo[]> | Union<TypeInfo[]>>(t: T) {
    const kind = t.kind;
    const members = t.members.reduce(
        (flattened, member) => flattened.concat(member.kind === kind ? member.members : member),
        [] as TypeInfo[],
    );
    return {kind, members} as T;
}
