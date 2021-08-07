import {t} from '../src';

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
t1.check({}, {allowExcessProperties: false})


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
