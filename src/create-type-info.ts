import type {Descriptor, Optional} from './descriptor';
import * as op from './operations';
import type {TypeInfo} from './type-info'; // NB: type-only import (no cyclic imports at runtime)
import type {Anonymize} from './utils';

/**
 * Internal factory function for creating a TypeInfo object from a Descriptor. An important implementation detail (ie
 * a detail that is not exposed outside the library but is relied on within the library) is that every TypeInfo object
 * is-a Descriptor object at runtime. However the descriptor properties are omitted from the TypeInfo type since the
 * public API does not require this detail.
 */
export function createTypeInfo<D extends Descriptor<TypeInfo>, T = TypeFromDescriptor<D>>(descriptor: D): TypeInfo<T> {

    // Since we know that a TypeInfo is-a Descriptor at runtime, it is safe to type-cast Descriptor's `Nested`
    // type param from `TypeInfo` to `Descriptor` here. That makes the type usable for the operation functions.
    let d = descriptor as Descriptor<Descriptor>;
    d = simplify(d);
    const result: TypeInfo<T> = {
        assertValid: (v, opts) => op.assertValid(d, v, opts),
        check: (v, opts) => op.check(d, v, opts),
        get example() { return op.generateValue(d) as T},
        isValid: (v, opts): v is T => op.isValid(d, v, opts),
        sanitize: v => op.sanitize(d, v) as T,
        toJsonSchema: () => op.toJsonSchema(d),
        toString: () => op.toString(d),
    };

    // Make the TypeInfo value a descriptor at runtime, even though the type doesn't reveal the Descriptor props.
    return Object.assign(result, d);
}

// Helper function to flatten directly-nested intersections and unions.
// TODO: add other simplifications...
function simplify<D extends Descriptor>(d: D): D {
    if (d.kind !== 'intersection' && d.kind !== 'union') return d;
    const members = d.members.reduce(
        (flattened, member) => flattened.concat(member.kind === d.kind ? member.members : member),
        [] as Descriptor[],
    );
    return {...d, members};
}

// Helper type to map from a Descriptor type to the TypeScript type most closely resembling it.
type TypeFromDescriptor<D extends Descriptor<TypeInfo>> = {
    any: any,
    array: D extends {element: TypeInfo<infer Elem>} ? Elem[] : never,
    boolean: boolean,
    brandedString: D extends {brand: infer Brand}
        ? Brand extends `${string}?`
            ? string & {__brand?: {[K in string & Brand]: never}}
            : string & {__brand: {[K in string & Brand]: never}}
        : never,
    date: Date,
    intersection: D extends {members: infer Members} ? TypeOfIntersection<Members> : never,
    never: never,
    null: null,
    number: number,
    object: D extends {properties: infer Props} ? TypeOfObject<Props> : never,
    string: string,
    tuple: D extends {elements: infer Elements}
        ? ({[K in keyof Elements]: Elements[K] extends TypeInfo<infer T> ? T : 0})
        : never,
    undefined: undefined,
    union: D extends {members: infer Members} ? TypeOfUnion<Members> : never,
    unit: D extends {value: infer Value} ? Value : never,
    unknown: unknown,
}[D['kind']];

type TypeOfIntersection<Members> = Anonymize<
    Members[any] extends infer E ? (E extends TypeInfo<infer T> ? (x: T) => 0 : 0) extends ((x: infer I) => 0) ? I : 0 : 0
>;

type TypeOfUnion<Members> = Members[any] extends infer E ? (E extends TypeInfo<infer T> ? T : 0) : 0;

type TypeOfObject<Props> = Anonymize<
    & {[K in RequiredPropNames<Props>]: Props[K] extends TypeInfo<infer T> ? T : 0}
    & {[K in OptionalPropNames<Props>]?: Props[K] extends Optional<TypeInfo<infer T>> ? T : 0}
>;
type RequiredPropNames<Props> = {[K in keyof Props]: Props[K] extends Optional ? never : K}[keyof Props];
type OptionalPropNames<Props> = {[K in keyof Props]: Props[K] extends Optional ? K : never}[keyof Props];
