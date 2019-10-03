import {is} from './is';
import {TypeOf} from './type-of';
import * as t from './types';




// validate<T extends Type>(value: unknown): TypeOf<T>
// check, ensure, verify


// truncate<T extends Type, U extends TypeOf<T>>(value: U): TypeOf<T>
// purify, cleanse, screen, censor, whitelist, sanitise, remove excess props, reduce, shave

// fuzz (generate, synthesize)

// jsonParse (fromJson)
// jsonStringify (toJson)





export {is, TypeOf, t};




// class MyObj extends t.object({foo: t.string}) {}
// let x: MyObj;





// const Object$ = function() {
//     return class Object$$ {
//         private constructor() {}
//         test = 'blah' as const;
//     };
// }

// class MyObj2 extends Object$() {}

// let tt = MyObj2();
