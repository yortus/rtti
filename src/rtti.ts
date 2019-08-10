// TODO:
// - [x] never
// - [x] Date
// - [x] BrandedString
// - [x] Unit
// - [x] Optional
// - [x] Tuple
// - [x] fix: TypeOf<Object> for optional props
// - [x] fix: t.optional is *not* a Type, it is only valid inside objects and tuples
// - [ ] fix: support t.optional in tuples
// - [ ] is()
// - [ ] Other builtins: RegExp, Symbol, Promise, Function, BigInt
// - [ ] Other type operators: keyof, index access, mapped, conditional, spread, rest




export type Type =
    | Any
    | Array$
    | Boolean
    | BrandedString
    | Date$
    | Intersection
    | Never
    | Null
    | Number
    | Object$
    // NB: Optional is *not* a type, it is a type-operator only valid inside objects and tuples
    | String
    | Tuple
    | Undefined
    | Union
    | Unit
    | Unknown
;




type Any = {kind: 'any'};
type Array$<Element extends Type = any> = {kind: 'array', element: Element};
type Boolean = {kind: 'boolean'};
type BrandedString<Brand extends string = any> = {kind: 'brandedString', brand: Brand};
type Date$ = {kind: 'date'};
type Intersection<Members extends Type[] = any> = {kind: 'intersection', members: Members};
type Never = {kind: 'never'};
type Null = {kind: 'null'};
type Number = {kind: 'number'};
type Object$<Properties extends Record<string, Type | Optional> = any> = {kind: 'object', properties: Properties};
type Optional<T extends Type = any> = {kind: 'optional', type: T};
type String = {kind: 'string'};
type Tuple<Elements extends Type[] = any> = {kind: 'tuple', elements: Elements};
type Undefined = {kind: 'undefined'};
type Union<Members extends Type[] = any> = {kind: 'union', members: Members};
type Unit<T extends string | number | boolean = any> = {kind: 'unit', value: T};
type Unknown = {kind: 'unknown'};




const Any: Any = {kind: 'any'};
const Array$ = <E extends Type>(element: E): Array$<E> => ({kind: 'array', element});
const Boolean: Boolean = {kind: 'boolean'};
const BrandedString = <Brand extends string>(brand: Brand): BrandedString<Brand> => ({kind: 'brandedString', brand});
const Date$: Date$ = {kind: 'date'};
const Intersection = <M extends Type[]>(...members: M): Intersection<M> => ({kind: 'intersection', members});
const Never: Never = {kind: 'never'};
const Null: Null = {kind: 'null'};
const Number: Number = {kind: 'number'};
const Object$ = <P extends Record<string, Type|Optional>>(properties: P): Object$<P> => ({kind: 'object', properties});
const Optional = <T extends Type>(type: T): Optional<T> => ({kind: 'optional', type});
const String: String = {kind: 'string'};
const Tuple = <E extends Type[]>(...elements: E): Tuple<E> => ({kind: 'tuple', elements});
const Undefined: Undefined = {kind: 'undefined'};
const Union = <M extends Type[]>(...members: M): Union<M> => ({kind: 'union', members});
const Unit = <V extends string | number | boolean>(value: V): Unit<V> => ({kind: 'unit', value});
const Unknown: Unknown = {kind: 'unknown'};




export {
    Any as any,
    Array$ as array,
    Boolean as boolean,
    BrandedString as brandedString,
    Date$ as date,
    Intersection as intersection,
    Never as never,
    Null as null,
    Number as number,
    Object$ as object,
    Optional as optional,
    String as string,
    Tuple as tuple,
    Undefined as undefined,
    Union as union,
    Unit as unit,
    Unknown as unknown,
};




export type TypeOf<T extends Type> = {0:
    T extends Any ? any :
    T extends Array$<infer Elem> ? TypeOfArray<Elem> :
    T extends Boolean ? boolean :
    T extends BrandedString<infer Brand> ? TypeOfBrandedString<Brand> :
    T extends Date$ ? Date :
    T extends Intersection<infer Mems> ? TypeOfIntersection<Mems> :
    T extends Never ? never :
    T extends Null ? null :
    T extends Number ? number :
    T extends Object$<infer Props> ? TypeOfObject<Props> :
    T extends String ? string :
    T extends Tuple<infer Elements> ? TypeOfTuple<Elements> :
    T extends Undefined ? undefined :
    T extends Union<infer Members> ? TypeOfUnion<Members> :
    T extends Unit<infer Value> ? Value :
    T extends Unknown ? unknown :
    never
}[never extends T ? 0 : 0]; // silly envelope to break tsc's direct recursion check




export function is<T extends Type>(v: unknown, t: T): v is TypeOf<T>;
export function is(v: unknown, t: Type): boolean {
    switch (t.kind) {
        case 'any': return true;
        case 'array': return Array.isArray(v) && v.every(el => is(el, t.element));
        case 'boolean': return typeof v === 'boolean';
        case 'brandedString': return typeof v === 'string';
        case 'date': return v instanceof Date;
        case 'intersection': return (t.members as Type[]).every(type => is(v, type));
        case 'never': return false;
        case 'null': return v === null;
        case 'number': return typeof v === 'number';
        case 'object':
            if (typeof v !== 'object' || v === null) return false;
            let properties = t.properties as Record<string, Type | Optional>;
            for (let propName of Object.keys(properties)) {
                let propType = properties[propName];
                let isOptional = propType.kind === 'optional';
                propType = propType.kind === 'optional' ? propType.type as Type : propType;
                if (!v.hasOwnProperty(propName)) {
                    if (isOptional) continue;
                    return false;
                }
                if (!is((v as any)[propName], propType)) return false;
            }
            return true;
        case 'string': return typeof v === 'string';
        case 'tuple':
            let elements = t.elements as Type[];
            return Array.isArray(v)
                && v.length === elements.length
                && v.every((el, i) => is(el, elements[i]));
        case 'undefined': return v === undefined;
        case 'union': return (t.members as Type[]).some(type => is(v, type));
        case 'unit': return v === t.value;
        case 'unknown': return true;
        default: throw ((type: never) => new Error(`Unhandled type '${type}'`))(t);
    }
}




type TypeOfArray<Elem extends Type> = TypeOf<Elem>[];

type TypeOfBrandedString<Brand extends string> = string & {'🎫': Brand};

type TypeOfIntersection<Members extends Type[]>
    = Members[any] extends infer E ? (E extends Type ? (x: TypeOf<E>) => 0 : 0) extends ((x: infer I) => 0) ? I : 0 : 0;

type TypeOfObject<Props extends Record<string, Type | Optional>> =
    & {[K in RequiredPropNames<Props>]: Props[K] extends Type ? TypeOf<Props[K]> : 0}
    & {[K in OptionalPropNames<Props>]?: Props[K] extends Optional ? TypeOf<Props[K]['type']> : 0};
type RequiredPropNames<Props> = {[K in keyof Props]: Props[K] extends Optional ? never : K}[keyof Props];
type OptionalPropNames<Props> = {[K in keyof Props]: Props[K] extends Optional ? K : never}[keyof Props];

type TypeOfTuple<Elements> = {[K in keyof Elements]: Elements[K] extends Type ? TypeOf<Elements[K]> : 0};

type TypeOfUnion<Members extends Type[]> = Members[any] extends infer E ? (E extends Type ? TypeOf<E> : 0) : 0;
