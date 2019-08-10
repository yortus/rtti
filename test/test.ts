import t from 'rtti';
import { is } from '../dist/commonjs/rtti';




const x1 = t.object({
    0: t.optional(t.never),
    foo: t.number,
    bar: t.boolean,
    baz: t.optional(t.string),
    quux: t.date,
});
const x2 = t.array(t.union(t.date, t.null, t.undefined));
const x3 = t.union(t.string, t.number);
const x4 = t.any;
const x5 = t.intersection(x2, x3);
const x6 = t.union(t.unit(false), t.unit('yes'), t.unit(1));
const x7 = t.brandedString('my-brand');
const x8 = t.date;
const x9 = t.tuple(t.string, t.string, t.number);




const results = [
    t.is(42, t.number),
    t.is({foo: 'bar'}, x1),
    t.is([new Date(), null, null], x2),
    t.is({foo: 42, bar: true, quux: new Date()}, x1),
    t.is([42, 42, 42], x9),
    t.is(['42', undefined, 42], x9),
    t.is(['42', '42', 42], x9),
    t.is({foo: 42, bar: true, quux: new Date(), baz: 42}, x1),
    t.is({foo: 42, bar: true, quux: new Date(), baz: '42'}, x1),
];


let u!: unknown;
if (is(u, x1)) u.quux.toISOString();



[] = [x1, x2, x3, x4, x5, x6, x7, x8, x9, results];




// type T1 = t.TypeOf<typeof x1>;
// type T2 = t.TypeOf<typeof x2>;
// type T3 = t.TypeOf<typeof x3>;
// type T4 = t.TypeOf<typeof x4>;
// type T5 = t.TypeOf<typeof x5>;
// type T6 = t.TypeOf<typeof x6>;
// type T7 = t.TypeOf<typeof x7>;
// type T8 = t.TypeOf<typeof x8>;
// type T9 = t.TypeOf<typeof x9>;
