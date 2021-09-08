import {expect} from 'chai';
import {t, TypeInfo} from '../src';

describe('The toJsonSchema() function', () => {
    const testCases: Array<{type: TypeInfo, jsonSchema: unknown}> = [
        {
            type: t.string,
            jsonSchema: {type: 'string'},
        },
        {
            type: t.number,
            jsonSchema: {type: 'number'},
        },
        {
            type: t.boolean,
            jsonSchema: {type: 'boolean'},
        },
        {
            type: t.null,
            jsonSchema: {type: 'null'},
        },
        {
            type: t.any,
            jsonSchema: {$comment: 'any value permitted'},
        },
        {
            type: t.unknown,
            jsonSchema: {$comment: 'any value permitted'},
        },
        {
            type: t.undefined,
            jsonSchema: Error,
        },
        {
            type: t.never,
            jsonSchema: Error,
        },
        {
            type: t.date,
            jsonSchema: {type: 'string', format: 'date-time'},
        },
        {
            type: t.brandedString('userId'),
            jsonSchema: {type: 'string', $comment: `branded with 'userId'`},
        },
        {
            type: t.unit('meatball'),
            jsonSchema: {const: 'meatball'},
        },
        {
            type: t.unit(42),
            jsonSchema: {const: 42},
        },
        {
            type: t.union(t.unit('foo'), t.unit('bar')),
            jsonSchema: {anyOf: [{const: 'foo'}, {const: 'bar'}]},
        },
        {
            type: t.union(t.unit('foo'), t.null, t.unit(42)),
            jsonSchema: {anyOf: [{const: 'foo'}, {type: 'null'}, {const: 42}]},
        },
        {
            type: t.object({foo: t.string}),
            jsonSchema: {type: 'object', properties: {foo: {type: 'string'}}, required: ['foo']},
        },
        {
            type: t.object({bar: t.optional(t.number)}),
            jsonSchema: {type: 'object', properties: {bar: {type: 'number'}}},
        },
        {
            type: t.object({foo: t.string, bar: t.optional(t.number)}),
            jsonSchema: {type: 'object', properties: {foo: {type: 'string'}, bar: {type: 'number'}}, required: ['foo']},
        },
        {
            type: t.array(t.union(t.string, t.boolean)),
            jsonSchema: {type: 'array', items: {anyOf: [{type: 'string'}, {type: 'boolean'}]}},
        },
        {
            type: t.array(t.unknown),
            jsonSchema: {type: 'array', items: {$comment: 'any value permitted'}},
        },
        {
            type: t.tuple(t.string, t.string, t.number),
            jsonSchema: {type: 'array', items: [{type: 'string'}, {type: 'string'}, {type: 'number'}]},
        },
        {
            type: t.intersection(
                t.object({base1: t.string, base2: t.optional(t.tuple(t.string)), base3: t.union(t.unit(42), t.null)}),
                t.object({extra1: t.optional(t.object({
                    ex11: t.boolean,
                    ex12: t.unknown,
                }))}),
                t.object({extra2: t.array(t.union(t.number, t.string))}),
            ),
            jsonSchema: {
                allOf: [
                    {
                        type: 'object',
                        properties: {
                            base1: {type: 'string'},
                            base2: {type: 'array', items: [{type: 'string'}]},
                            base3: {anyOf: [{const: 42}, {type: 'null'}]},
                        },
                        required: ['base1', 'base3'],
                    },
                    {
                        type: 'object',
                        properties: {
                            extra1: {
                                type: 'object',
                                properties: {ex11: {type: 'boolean'}, ex12: {$comment: 'any value permitted'}},
                                required: ['ex11', 'ex12'],
                            },
                        },
                    },
                    {
                        type: 'object',
                        properties: {
                            extra2: {type: 'array', items: {anyOf: [{type: 'number'}, {type: 'string'}]}},
                        },
                        required: ['extra2'],
                    },
                ],
            },
        },
    ];


    for (let {type, jsonSchema: expected} of testCases) {
        it(`JSON schema for ${type}`, () => {
            let actual: unknown;
            try {
                actual = type.toJsonSchema();
            }
            catch {
                actual = Error;
            }
            expect(actual).to.deep.equal(expected);
        });
    }
});
