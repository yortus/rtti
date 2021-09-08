# rtti

**Runtime type validation for JavaScript and TypeScript programs.**

This library bring the benefits of TypeScript's type system to runtime code. By declaring types using runtime constructs, it is possible to add an extra level of runtime type safety that static checking alone cannot provide. For example:
- ensure that a parsed JSON string produces a value that conforms to an expected schema
- verify that a HTTP request body conforms to an expected schema
- ensure that a HTTP response body does not send additional properties other that those intended for the client

There is no need to declare any type twice (i.e., once for JS and once TS), since the TypeScript type can be inferred from the `example` property of any given `TypeInfo` value.

## Installation

`npm install rtti`

## Usage Example

```ts
import {t} from 'rtti';

const myType = t.union(
    t.unit('foo'),
    t.unit('bar')
);

// prints: "foo" | "bar"
console.log(myType.toString());

// prints: true
console.log(myType.isValid('foo'));

// prints: false
console.log(myType.isValid('baz'));

// prints: {
//     isValid: false,
//     errors: [
//         {path: '^', message: 'The value "baz" does not conform to the union type'}
//     ]
// }
console.log(myType.check('baz'));

// TypeScript only - static type inference:
type MyType = typeof myType.example; // type MyType = "foo" | "bar"
```


## API

---
##### `t.string`, `t.object(...)`, etc
Construct a `TypeInfo` instance that matches a particular set of runtime values.
<br/>

---
##### `myType.assertValid(value: unknown): void`
Ensures the given `value` matches the given `type`, otherwise throws an error. The error object has an `errors`
property containing details about the validation error(s).
<br/>

---
##### `myType.check(value: unknown): {isValid: boolean, errors: Array<{path: string, message: string}>}`
Returns a list of descriptive validation errors explaining why the given `value` does not match the given `type`.
<br/>

---
##### `myType.example`
An example value that conforms to the given `TypeInfo` type. The TypeScript type can be inferred from this property.
<br/>

---
##### `myType.isValid(value: unknown): boolean`
Returns `true` if the given `value` matches the given `type`, or `false` otherwise.
<br/>

---
##### `myType.sanitize(value: typeof myType.example): typeof myType.example`
Returns a copy of the given `value`, but where any properties not declared in `type` have been removed.
<br/>

---
##### `myType.toJsonSchema(type: TypeInfo): unknown`
Returns a JSON schema representation of the given type.
<br/>

---
##### `myType.toString(): string`
Returns a descriptive string for the given `type`.
<br/>

---
##### `TypeInfo`
An object used by the RTTI library to describes a set of matching runtime values. These objects may be created using the `t.<kind>` syntax. See the following table for examples.
<br/>


## Supported Types


|                | PRIMITIVE JAVASCRIPT TYPES                                   |                                  |                                           |                                              |
| -------------- | ------------------------------------------------------------ | -------------------------------- | ----------------------------------------- | -------------------------------------------- |
| **Datatype**   | **Example RTTI Declaration**                                 | **TS Type**                      | **Matching JS Values**                    | **Non-Matching JS Values**                   |
| Boolean        | `t.boolean`                                                  | `boolean`                        | `true`, `false`                           | `0`, `''`, `'yes'`, `null`                   |
| Date           | `t.date`                                                     | `Date`                           | `new Date()`                              | `'2020-01-01'`                               |
| Null           | `t.null`                                                     | `null`                           | `null`                                    | `undefined`, `0`                             |
| Number         | `t.number`                                                   | `number`                         | `42`, `3.14`                              | `'three'`, `false`                           |
| String         | `t.string`                                                   | `string`                         | `'foo'`, `'1:1'`                          | `42`, `{foo: 1}`                             |
| Undefined      | `t.undefined`                                                | `undefined`                      | `undefined`                               | `null`, `0`                                  |
|                | **COMPOUND JAVASCRIPT TYPES**                                |                                  |                                           |                                              |
| **Datatype**   | **Example RTTI Declaration**                                 | **TS Type**                      | **Matching JS Values**                    | **Non-Matching JS Values**                   |
| Array          | `t.array(t.number)`                                          | `number[]`                       | `[1, 2, 3]`                               | `123`, `[1, 'a']`                            |
| Object         | `t.object({foo: t.string, isBar: t.optional(t.boolean)})`    | `{foo: string, isBar?: boolean}` | `{foo: 'foo'}`, `{foo: 'x', isBar: true}` | `{bar: 'bar'}`, `{foo: true}`                |
|                | **ADDITIONAL TYPESCRIPT TYPES**                              |                                  |                                           |                                              |
| **Datatype**   | **Example RTTI Declaration**                                 | **TS Type**                      | **Matching JS Values**                    | **Non-Matching JS Values**                   |
| Any            | `t.any`                                                      | `any`                            | `42`, `'foo'`, `null`, `[1, 2]`, `{}`     | -                                            |
| Branded String | `t.brandedString('usd')`                                     |                                  |                                           |                                              |
| Intersection   | `t.intersection(t.object({foo: t.string}), t.object({bar: t.number}))` | `{foo: string} & {bar: number}`  | `{foo: 'abc', bar: 42}`                   | `{bar: 42}`                                  |
| Never          | `t.never`                                                    | `never`                          | -                                         | `42`, `'foo'`, `null`, `[1, 2]`, `{}`        |
| Tuple          | `t.tuple(t.string, t.number)`                                | `[string, number]`               | `['foo', 42]`                             | `['foo']`, `['foo', 'bar']`, `['foo', 4, 2]` |
| Union          | `t.union(t.object({foo: t.string}), t.object({bar: t.number}))` | `{foo: string} | {bar: number}`  | `{foo: 'abc'}`, `{bar: 42}`               | `{baz: 0}`, `{foo: 42}`                      |
| Unit Type      | `t.unit('foo')`                                              | `'foo'`                          | `'foo'`                                   | `'bar'`, `'abc'`, `42`                       |
| Unknown        | `t.unknown`                                                  |                                  | `42`, `'foo'`, `null`, `[1, 2]`, `{}`     | -                                            |

