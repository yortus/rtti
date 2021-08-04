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
    return {
        check: (v, opts) => op.check(descriptor, v, opts),
        get example() { return op.generateValue(descriptor)},
        isValid: (v, opts): v is T => op.isValid(descriptor, v, opts),
        toString: () => op.toString(descriptor),

        assertValid: null!,
        sanitize: null!,
        toJsonSchema: null!,
    };
}


type Descriptor =
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

type Any = {kind: 'any'};
type Array<Element extends TypeInfo = any> = {kind: 'array', element: Element};
type Boolean = {kind: 'boolean'};
type BrandedString<Brand extends string = any> = {kind: 'brandedString', brand: Brand};
type Date = {kind: 'date'};
type Intersection<Members extends TypeInfo[] = any[]> = {kind: 'intersection', members: Members};
type Never = {kind: 'never'};
type Null = {kind: 'null'};
type Number = {kind: 'number'};
type Object<Properties extends Record<string, TypeInfo | Optional> = Record<string, any>> = {kind: 'object', properties: Properties};
type String = {kind: 'string'};
type Tuple<Elements extends TypeInfo[] = any[]> = {kind: 'tuple', elements: Elements};
type Undefined = {kind: 'undefined'};
type Union<Members extends TypeInfo[] = any[]> = {kind: 'union', members: Members};
type Unit<T extends string | number | boolean = any> = {kind: 'unit', value: T};
type Unknown = {kind: 'unknown'};

/** NB: Optional is *not* a descriptor, it is an 'operator' only valid inside object and tuple descriptors. */
type Optional<T extends TypeInfo = any> = {kind: 'optional', type: T};















const t1 = t.union(
    t.intersection(
        t.object({foo: t.boolean}),
        t.object({
            bar: t.brandedString('bar'),
            baz: t.optional(t.number),
            quux: t.array(t.tuple(t.number, t.number)),
        }),
        //Never,
    ),
    t.object({a: t.unit(42), b: t.unit('bar')}),
    t.union(t.unit(1), t.unit(2), t.unit(4))
);
type T1 = typeof t1.example;


const t2a = t.string;
const t2b = t.brandedString('B')
const t2c = t.brandedString('C')
type T2a = typeof t2a.example;
type T2b = typeof t2b.example;
type T2c = typeof t2c.example;

let s1!: T2a;
let s2!: T2b & T2c;
let s3!: T2c;
s1 = s1;
s1 = s2;
s1 = s3;
s2 = s1;
s2 = s2;
s2 = s3;
s3 = s1;
s3 = s2;
s3 = s3;



const t3 = t.object({
    foo: t.string//brandedString('B')
});
type T3 = typeof t3.example;

















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

type TypeOfIntersection<Members extends TypeInfo[]> = Anonymize<
    Members[any] extends infer E ? (E extends TypeInfo<infer T> ? (x: T) => 0 : 0) extends ((x: infer I) => 0) ? I : 0 : 0
>;

type TypeOfUnion<Members extends TypeInfo[]>
    = Anonymize<Members[any] extends infer E ? (E extends TypeInfo<infer T> ? T : 0) : 0>;

type TypeOfObject<Props extends Record<string, TypeInfo | Optional>> = Anonymize<
    & {[K in RequiredPropNames<Props>]: Props[K] extends TypeInfo<infer T> ? T : 0}
    & {[K in OptionalPropNames<Props>]?: Props[K] extends Optional<TypeInfo<infer T>> ? T : 0}
>;
type RequiredPropNames<Props> = {[K in keyof Props]: Props[K] extends Optional ? never : K}[keyof Props];
type OptionalPropNames<Props> = {[K in keyof Props]: Props[K] extends Optional ? K : never}[keyof Props];
