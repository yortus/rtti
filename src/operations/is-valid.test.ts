import {expect} from 'chai';
import * as d from '../descriptors';
import {isValid} from './is-valid';

// TODO: test with allowExcessProperties: false

describe('The isValid() function', () => {

    const values = {
        string: 'kasdjfkjasdfgasjkdhgfkasjdhgf',
        stringFooOrBar: 'foo',
        number: 253153124123,
        number42: 42,
        // object: {a: 1, bbb: 'blah', xyz123: [true, false]},
        objectWithFoo: {foo: 'bar'},
        array: [1, 'foo', false],
        arrayOfNum: [1, 2, 3, 4],
        objectWithOptionalBarMissing: {baz: 10},
        objectWithOptionalBarUndefined: {bar: undefined, baz: 10},
    };

    const types = {
        string: d.string,
        stringFooOrBar: d.union(d.unit('foo'), d.unit('bar')),
        number: d.number,
        number42: d.unit(42),
        objectWithFoo: d.object({foo: d.string}),
        array: d.array(d.unknown),
        arrayOfNum: d.array(d.number),
        objectWithOptionalBar: d.object({bar: d.optional(d.string), baz: d.number}),
    };

    for (let [valueName, value] of Object.entries(values)) {
        for (let [typeName, type] of Object.entries(types)) {
            let expected = valueName.startsWith(typeName);
            it(`Value ${JSON.stringify(value)} is ${expected ? '' : 'not '}of type '${typeName}'`, () => {
                expect(isValid(type, value)).to.equal(expected);
            });
        }
    }
});
