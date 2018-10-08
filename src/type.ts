

export interface Type<T = any> {
    isValid(value: {} | null | undefined): value is T;

    // is       // returns true/false
    // assert   // nice error message if invalid
}


// TODO: temp testing...
export type TypeOf<T extends Type> = T extends Type<infer U> ? U : never;
type T1 = TypeOf<Type<number>>;
