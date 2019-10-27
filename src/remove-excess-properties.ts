export const removeExcessProperties = 0;

// import cloneDeep from 'lodash.clonedeep';
// import {assert} from './assert';
// import {TypeFromTypeInfo} from './type-from-type-info';
// import {TypeInfo, intersection} from './type-info';
// import * as t from './type-info';


// export function removeExcessProperties<T extends TypeInfo>(t: T, v: TypeFromTypeInfo<T>): TypeFromTypeInfo<T>;
// export function removeExcessProperties(t: TypeInfo, v: unknown) {
//     assert(t, v);
//     switch (t.kind) {

//         case 'array':
//             return (v as any[]).map(el => removeExcessProperties(t.element, el));

//         case 'intersection': {
//             // TODO: ...

//             // Q: when is this operation valid?
//             // A: v and all t.members are objects -OR- v and all t.members are primitives

//             // Q: what properties to copy in an intersection of several objects? eg {s: string} & {n: number}
//             // A: properties that are in *some* member of the intersection

//             // Q: what about optional properties? how do they affect this?
//             // A: for excess-property-checking purposes, there is no difference between required and optional properties

//             if (typeof v !== 'object' || v === null) return cloneDeep(v);
//             let clonedObj = {} as any;

//             let objectTypes = (t.members as TypeInfo[]).filter(m => m.kind === 'object') as t.object[];

//             let properties = objectTypes.reduce(
//                 (props, objectType) => {
//                     for (let propName of Object.keys(objectType.properties)) {
//                         let prop = objectType.properties[propName] as TypeInfo | t.optional;
//                         let propType = prop.kind === 'optional' ? prop.type as TypeInfo : prop;
//                         if (!props.hasOwnProperty(propName)) {
//                             props[propName] = propType;
//                         }
//                         else {
//                             props[propName] = intersection
//                         }


//                     }
//                     return props;
//                 },
//                 {} as Record<string, any>
//             );


//             for (let propName of Object.keys(properties)) {
//                 let propType = properties[propName];
//                 propType = propType.kind === 'optional' ? propType.type as TypeInfo : propType;
//                 if (v.hasOwnProperty(propName)) clonedObj[propName] = removeExcessProperties(propType, v[propName]);
//             }
//             return clonedObj;





//             throw new Error('Not supported');
//         }

//         case 'object': {
//             let clonedObj = {} as any;
//             let properties = t.properties as Record<string, TypeInfo | t.optional>;
//             for (let propName of Object.keys(properties)) {
//                 let propType = properties[propName];
//                 propType = propType.kind === 'optional' ? propType.type as TypeInfo : propType;
//                 if (v.hasOwnProperty(propName)) clonedObj[propName] = removeExcessProperties(propType, v[propName]);
//             }
//             return clonedObj;
//         }

//         case 'tuple':
//             return (v as any[]).map((el, i) => removeExcessProperties(t.elements[i], el));
    
//         case 'union':
//             // TODO: ...

//             // Q: when is this operation valid?
//             // A: v and all t.members are objects -OR- v and all t.members are primitives

//             // Q: what properties to copy in a union of several objects? eg {s: string} | {n: number}
//             // A: properties that are in *some* member of the union (after filtering to union members that `v` conforms to)
//             throw new Error('Not supported');

//         case 'any':
//         case 'boolean':
//         case 'brandedString':
//         case 'date':
//         case 'never':
//         case 'null':
//         case 'number':
//         case 'string':
//         case 'undefined':
//         case 'unit':
//         case 'unknown':
//             return cloneDeep(v);

//         //default: throw ((type: never) => new Error(`Unhandled type '${type}'`))(t);
//     }
// }
