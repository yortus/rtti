// Type tests: the code here is not executed, it just needs to pass type checks to be considered successful.

// --------------------------------------------------
// Regression test for bug caused by https://github.com/microsoft/TypeScript/issues/46655.
// Note that `t` is imported from the built declaration files, since that's where the regression occurred.
import {t} from '../dist/commonjs';
export {test1, test2};

// Intersection
const T1 = t.intersection(
    t.object({foo: t.string, bar: t.number}),
    t.object({bar: t.unknown, baz: t.number}),
    t.object({quux: t.array(t.string)}),
);
function test1(t1: typeof T1.example) {
    t1.foo.padStart;
    t1.bar.toFixed;
    t1.baz.toFixed;
    t1.quux.map(el => el.padStart);
}

// Union
const T2 = t.union(
    t.object({kind: t.unit('A'), foo: t.number}),
    t.object({kind: t.unit('B'), bar: t.boolean}),
    t.object({kind: t.unit('C'), baz: t.string}),
);
function test2(t2: typeof T2.example) {
    switch (t2.kind) {
        case 'A': t2.foo.toFixed; break;
        case 'B': t2.bar; break;
        case 'C': t2.baz.padStart; break;
        default: ((x: never) => x)(t2);
    }
}

// --------------------------------------------------
// Regression test for https://github.com/yortus/http-schemas/issues/30
const Result = t.object({
    date: t.string,
    foobar: t.optional(t.number),
});
type Result = typeof Result.example;
let result: Result = {date: '1234'};
if (result.foobar) result.foobar.toExponential;
