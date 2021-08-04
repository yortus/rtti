import * as d from './descriptors';
import {Descriptor} from './descriptors';
import {Anonymize} from './utils';

export type TypeFromDescriptor<D extends Descriptor> = {
    any: any,
    array: D extends d.Array<infer Elem> ? TypeFromDescriptor<Elem>[] : never,
    boolean: boolean,
    brandedString: D extends d.BrandedString<infer Brand>
        ? Brand extends `${string}?`
            ? string & {__brand?: {[K in Brand]: never}}
            : string & {__brand: {[K in Brand]: never}}
        : never,
    date: Date,
    intersection: D extends d.Intersection<infer Members> ? TypeOfIntersection<Members> : never,
    never: never,
    null: null,
    number: number,
    object: D extends d.Object<infer Props> ? TypeOfObject<Props> : never,
    string: string,
    tuple: D extends d.Tuple<infer Elements>
        ? ({[K in keyof Elements]: Elements[K] extends Descriptor ? TypeFromDescriptor<Elements[K]> : 0})
        : never,
    undefined: undefined,
    union: D extends d.Union<infer Members> ? TypeOfUnion<Members> : never,
    unit: D extends d.Unit<infer Value> ? Value : never,
    unknown: unknown,
}[D['kind']];

type TypeOfIntersection<Members extends Descriptor[]> = Anonymize<
    Members[any] extends infer E
        ? (E extends Descriptor ? (x: TypeFromDescriptor<E>) => 0 : 0) extends ((x: infer I) => 0)
            ? I
            : 0
        : 0
>;

type TypeOfUnion<Members extends Descriptor[]>
    = Anonymize<Members[any] extends infer E ? (E extends Descriptor ? TypeFromDescriptor<E> : 0) : 0>;

type TypeOfObject<Props extends Record<string, Descriptor | d.Optional>> = Anonymize<
    & {[K in RequiredPropNames<Props>]: Props[K] extends Descriptor ? TypeFromDescriptor<Props[K]> : 0}
    & {[K in OptionalPropNames<Props>]?: Props[K] extends d.Optional ? TypeFromDescriptor<Props[K]['type']> : 0}
>;
type RequiredPropNames<Props> = {[K in keyof Props]: Props[K] extends d.Optional ? never : K}[keyof Props];
type OptionalPropNames<Props> = {[K in keyof Props]: Props[K] extends d.Optional ? K : never}[keyof Props];
