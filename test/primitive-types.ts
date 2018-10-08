import {expect} from 'chai';
import * as t from 'rtti';


describe('primitive types', () => {

    const tests = [
        `42 as any ==> pass`,
        `'foo' as any ==> pass`,
        `{} as any ==> pass`,
        `42 as string ==> fail`,
        `'foo' as string ==> pass`,
        `null as string ==> fail`,
        `undefined as string ==> fail`,
        `42 as number ==> pass`,
        `'foo' as number ==> fail`,
        `true as boolean ==> pass`,
        `false as boolean ==> pass`,
        `null as boolean ==> fail`,
        `0 as boolean ==> fail`,
    ];

    tests.forEach(test => {
        it(test, () => {
            let [lhs, expected] = test.split(' ==> ');
            let [source, typeName] = lhs.split(' as ');
            let value = eval(source);
            let type = (t as any)[typeName];
            let actual = type.isValid(value) ? 'pass' : 'fail';
            expect(actual).to.equal(expected);
        });
    });
});
