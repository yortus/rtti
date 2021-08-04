import {expect} from 'chai';
import {inspect} from 'util';
import * as t from '../descriptors';
import {check} from './check';
import {toString} from './to-string';

describe('The check() function', () => {

    const tests = [
        {
            type: t.string,
            value: 'foo',
            expectedErrors: [],
            expectedStrictErrors: [],
        },
        {
            type: t.string,
            value: 42,
            expectedErrors: [{path: '^', message: `Expected a string but got 42`}],
            expectedStrictErrors: [],
        },
        {
            type: t.union(t.unit('foo'), t.unit('bar')),
            value: 'foo',
            expectedErrors: [],
            expectedStrictErrors: [],
        },
        {
            type: t.union(t.unit('foo'), t.unit('bar')),
            value: 'baz',
            expectedErrors: [{path: '^', message: `The value 'baz' does not conform to the union type`}],
            expectedStrictErrors: [],
        },
        {
            type: t.object({foo: t.string}),
            value: {foo: 42, bar: [1, 2, 3]},
            expectedErrors: [{path: '^.foo', message: `Expected a string but got 42`}],
            expectedStrictErrors: [{path: '^', message: `The object has excess properties: bar`}],
        },
        {
            type: t.object({foo: t.object({str: t.string, num: t.number})}),
            value: {foo: {str: true, num: {pi: 3.14}}},
            expectedErrors: [
                {path: '^.foo.str', message: `Expected a string but got true`},
                {path: '^.foo.num', message: `Expected a number but got { pi: 3.14 }`}
            ],
            expectedStrictErrors: [],
        },
        {
            type: t.object({nums: t.array(t.number)}),
            value: {nums: [3.14, -1, NaN, 'one', 42, '3', {zero: true}]},
            expectedErrors: [
                {path: '^.nums[3]', message: `Expected a number but got 'one'`},
                {path: '^.nums[5]', message: `Expected a number but got '3'`},
                {path: '^.nums[6]', message: `Expected a number but got { zero: true }`},
            ],
            expectedStrictErrors: [],
        },
        {
            type: t.object({foo: t.optional(t.string)}),
            value: {foo: undefined},
            expectedErrors: [],
            expectedStrictErrors: [],
        },
        {
            type: t.object({foo: t.optional(t.object({bar: t.number}))}),
            value: {foo: undefined},
            expectedErrors: [],
            expectedStrictErrors: [],
        },
    ];

    for (let {type, value, expectedErrors, expectedStrictErrors} of tests) {
        let d = inspect(value, {depth: 0, compact: true, breakLength: Infinity});
        it(`${d} as ${toString(type)}`, () => {
            let actualLoose = check(type, value, {allowExcessProperties: true});
            expect(actualLoose.errors).to.deep.equal(expectedErrors);

            let actualStrict = check(type, value, {allowExcessProperties: false});
            expect(actualStrict.errors).to.deep.equal([...expectedErrors, ...expectedStrictErrors]);
        });
    }
});
