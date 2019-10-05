import {expect} from 'chai';
import {is} from './is';
import * as t from './types';


describe('The is() function', () => {

    const values = {
        string: 'kasdjfkjasdfgasjkdhgfkasjdhgf',
        stringFooOrBar: 'foo',
        number: 253153124123,
        number42: 42,
        // object: {a: 1, bbb: 'blah', xyz123: [true, false]},
        objectWithFoo: {foo: 'bar'},
        array: [1, 'foo', false],
        arrayOfNum: [1, 2, 3, 4],
    };

    const types = {
        string: t.string,
        stringFooOrBar: t.union(t.unit('foo'), t.unit('bar')),
        number: t.number,
        number42: t.unit(42),
        objectWithFoo: t.object({foo: t.string}),
        array: t.array(t.unknown),
        arrayOfNum: t.array(t.number),
    };

    for (let [valueName, value] of Object.entries(values)) {
        for (let [typeName, type] of Object.entries(types)) {
            let expected = valueName.startsWith(typeName);
            it(`Value ${JSON.stringify(value)} is ${expected ? '' : 'not '}of type '${typeName}'`, () => {
                expect(is(type, value)).to.equal(expected);
            });
        }
    }
});
