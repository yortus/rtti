export type Anonymize<Obj> = Anonymize2<{[K in keyof Obj]: Obj[K]}>;
type Anonymize2<T> = T;
