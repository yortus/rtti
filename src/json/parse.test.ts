import {expect} from 'chai';
import {parse} from './parse';
import {toString} from '../to-string';
import * as t from '../type-info';


describe('The parse() function', () => {

    const tests = [
        {
            type: t.string,
            value: `"kasdjfkjasdfgasjkdhgfkasjdhgf"`,
            expected: 'kasdjfkjasdfgasjkdhgfkasjdhgf',
        },
        {
            type: t.union(t.unit('foo'), t.unit('bar')),
            value: `"foo"`,
            expected: 'foo',
        },
        {
            type: t.number,
            value: `253153124123`,
            expected: 253153124123,
        },
        {
            type: t.unit(42),
            value: `42`,
            expected: 42,
        },
        {
            type: t.object({foo: t.string}),
            value: `{"foo":"bar"}`,
            expected: {foo: 'bar'},
        },
        {
            type: t.array(t.unknown),
            value: `[1,"foo",false]`,
            expected: [1, 'foo', false],
        },
        {
            type: t.array(t.number),
            value: `[1,2,3,4]`,
            expected: [1, 2, 3, 4],
        },
        // TODO: add error cases...
    ];

    for (let {type, value, expected} of tests) {
        it(`${value} as ${toString(type)}`, () => {
            let actual = parse(type, value);
            expect(actual).to.deep.equal(expected);
        });
    }
});
