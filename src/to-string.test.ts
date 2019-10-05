import {expect} from 'chai';
import {toString} from './to-string';
import * as t from './types';


describe('The toString() function', () => {

    const tests = [
        {
            type: t.string,
            text: 'string',
        },
        {
            type: t.union(t.unit('foo'), t.unit('bar')),
            text: '"foo" | "bar"',
        },
        {
            type: t.number,
            text: 'number',
        },
        {
            type: t.unit(42),
            text: '42',
        },
        {
            type: t.object({foo: t.string}),
            text: '{foo: string}',
        },
        {
            type: t.array(t.unknown),
            text: 'Array<unknown>',
        },
        {
            type: t.array(t.number),
            text: 'Array<number>',
        },
    ];

    for (let {type, text} of tests) {
        it(text, () => {
            let expected = text;
            let actual = toString(type);
            expect(actual).to.equal(expected);
        });
    }
});
