import {expect} from 'chai';
import {inspect} from 'util';
import {t} from 'rtti';

describe('The sanitize() method', () => {

    const tests = [
        {
            type: t.string,
            value: 'foo',
            expected: 'foo',
        },
        {
            type: t.string,
            value: 42,
            expected: 42,
        },
        {
            type: t.union(t.unit('foo'), t.unit('bar')),
            value: 'bar',
            expected: 'bar',
        },
        {
            type: t.union(t.unit('foo'), t.object({foo: t.number})),
            value: {foo: 42, bar: 'hi'},
            expected: {foo: 42},
        },
        {
            type: t.object({foo: t.string}),
            value: {foo: 'hi', bar: [1, 2, 3]},
            expected: {foo: 'hi'},
        },
        {
            type: t.object({foo: t.optional(t.string)}),
            value: {foo: 'hi', bar: [1, 2, 3]},
            expected: {foo: 'hi'},
        },
        {
            type: t.object({foo: t.optional(t.string)}),
            value: {quux: 'hi', bar: [1, 2, 3]},
            expected: {},
        },
        {
            type: t.object({foo: t.optional(t.string)}),
            value: {foo: undefined, quux: 'hi'},
            expected: {},
        },
        {
            type: t.object({foo: t.optional(t.object({bar: t.number}))}),
            value: {foo: undefined, quux: 'hi'},
            expected: {},
        },
        {
            type: t.object({foo: t.object({str: t.string, num: t.number})}),
            value: {foo: {str: 'hi', num: 3.14}},
            expected: {foo: {str: 'hi', num: 3.14}},
        },
        {
            type: t.object({foo: t.object({str: t.string, num: t.number})}),
            value: {foo: {x: true, str: 'hi', num: 3.14}, bar: 43},
            expected: {foo: {str: 'hi', num: 3.14}},
        },
        {
            type: t.object({nums: t.array(t.number)}),
            value: {nums: [3.14, -1, 42], chars: 'abc'},
            expected: {nums: [3.14, -1, 42]},
        },
        {
            type: t.array(t.object({a: t.optional(t.number), b: t.optional(t.number)})),
            value: [{}, {a: 1}, {b: 2}, {c: 3}, {a: 1, c: 3}, {b: 2, c: 3}, {a: 1, b: 2, c: 3, d: 4}],
            expected: [{}, {a: 1}, {b: 2}, {}, {a: 1}, {b: 2}, {a: 1, b: 2}],
        },
        {
            type: t.intersection(t.object({num: t.number}), t.object({str: t.string})), 
            value: {num: 42, str: 'hi', bool: true},
            expected: {num: 42, str: 'hi'},
        },
        {
            type: t.intersection(t.array(t.any), t.object({num: t.number}), t.object({str: t.string})),
            value: Object.assign([1, 2, 4], {num: 42, str: 'hi', bool: true}),
            expected: {num: 42, str: 'hi'},
        },
        {
            type: t.union(t.object({num: t.number}), t.object({str: t.string})), 
            value: {num: 42, str: 'hi', bool: true},
            expected: {num: 42},
        },
        {
            type: t.union(t.array(t.any), t.object({num: t.number}), t.object({str: t.string})),
            value: Object.assign([1, 2, 4], {num: 42, str: 'hi', bool: true}),
            expected: [1, 2, 4],
        },
        {
            type: t.unknown,
            value: {foo: {x: true, str: 'hi', num: 3.14}, bar: 43},
            expected: {foo: {x: true, str: 'hi', num: 3.14}, bar: 43},
        },
        {
            type: t.any,
            value: {foo: {x: true, str: 'hi', num: 3.14}, bar: 43},
            expected: {foo: {x: true, str: 'hi', num: 3.14}, bar: 43},
        },

        // Regression test for https://github.com/yortus/rtti/issues/3
        {
            type: t.intersection(t.intersection(t.object({a: t.any}), t.object({b: t.any})), t.object({c: t.any})),
            value: Object.assign([1, 2, 4], {a: 42, b: 'hi', c: true, d: [1, 2, 3]}),
            expected: {a: 42, b: 'hi', c: true},
        },
    ];

    for (let {type, value, expected} of tests) {
        let d = inspect(value, {depth: 0, compact: true, breakLength: Infinity});
        it(`${d} as ${type}`, () => {
            let actual = type.sanitize(value as any);
            expect(actual).to.deep.equal(expected);
        });
    }
});
