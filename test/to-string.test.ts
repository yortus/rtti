import {expect} from 'chai';
import * as d from '../descriptors';
import {toString} from './to-string';


describe('The toString() function', () => {

    const tests = [
        {
            type: d.string,
            text: 'string',
        },
        {
            type: d.union(d.unit('foo'), d.unit('bar')),
            text: '"foo" | "bar"',
        },
        {
            type: d.number,
            text: 'number',
        },
        {
            type: d.unit(42),
            text: '42',
        },
        {
            type: d.object({foo: d.string}),
            text: '{foo: string}',
        },
        {
            type: d.object({foo: d.optional(d.string)}),
            text: '{foo?: string}',
        },
        {
            type: d.array(d.unknown),
            text: 'Array<unknown>',
        },
        {
            type: d.array(d.number),
            text: 'Array<number>',
        },
        {
            type: d.intersection(
                d.object({foo: d.string}),
                d.object({bar: d.number}),
            ),
            text: '{foo: string} & {bar: number}',
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
