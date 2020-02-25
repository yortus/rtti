import * as t from './type-info';
import {TypeInfo} from './type-info';


// IMPLEMENTATION NOTE:
// Instantiating TypeFromTypeInfo<T> for a complex nested type T may result in the error TS2589 "Type instantiation is
// excessively deep and possibly infinite". The definition of TypeFromTypeInfo<T> in v0.1.10 exacerbated this by its
// construction as a conditional type chain. It turns out each link in the chain counts toward a depth=50 type
// instantiation limit hardcoded into the TS compiler. So nested types quickly hit this limit. Using types further
// down the chain would also make the error more likely, even though this 'implementation detail' is not (and should not
// be) visible to consumers. Furthermore, the construction in v0.1.10 needed an unusual and seemingly pointless envelope
// to work around the error TS2456 "Type alias 'TypeFromTypeInfo' circularly references itself" that would otherwise
// occur.
//
// The new construction below does not suffer from the TS2456 problem at all. It also greatly alleviates the TS2589
// problem by using an indexed access type instead of a conditional type chain, thereby allowing much more complex T
// types before hitting the depth=50 limit.


// (A) TypeOf<T> generic type operator
export type TypeFromTypeInfo<T extends TypeInfo> = {
    any: any,
    array: T extends t.array<infer Elem> ? TypeFromTypeInfo<Elem>[] : never,
    boolean: boolean,
    brandedString: T extends t.brandedString<infer Brand> ? string & {'🎫': Brand} : never,
    date: Date,
    intersection: T extends t.intersection<infer Members> ? TypeOfIntersection<Members> : never,
    never: never,
    null: null,
    number: number,
    object: T extends t.object<infer Props> ? TypeOfObject<Props> : never,
    string: string,
    tuple: T extends t.tuple<infer Elements> ? ({[K in keyof Elements]: Elements[K] extends TypeInfo ? TypeFromTypeInfo<Elements[K]> : 0}) : never,
    undefined: undefined,
    union: T extends t.union<infer Members> ? TypeOfUnion<Members> : never,
    unit: T extends t.unit<infer Value> ? Value : never,
    unknown: unknown,

}[T['kind']];


type TypeOfIntersection<Members extends TypeInfo[]>
    = Members[any] extends infer E ? (E extends TypeInfo ? (x: TypeFromTypeInfo<E>) => 0 : 0) extends ((x: infer I) => 0) ? I : 0 : 0;

type TypeOfUnion<Members extends TypeInfo[]>
    = Members[any] extends infer E ? (E extends TypeInfo ? TypeFromTypeInfo<E> : 0) : 0;

type TypeOfObject<Props extends Record<string, TypeInfo | t.optional>> =
    & {[K in RequiredPropNames<Props>]: Props[K] extends TypeInfo ? TypeFromTypeInfo<Props[K]> : 0}
    & {[K in OptionalPropNames<Props>]?: Props[K] extends t.optional ? TypeFromTypeInfo<Props[K]['type']> : 0};
type RequiredPropNames<Props> = {[K in keyof Props]: Props[K] extends t.optional ? never : K}[keyof Props];
type OptionalPropNames<Props> = {[K in keyof Props]: Props[K] extends t.optional ? K : never}[keyof Props];


// (B) typeOf(v) function
