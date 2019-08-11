import {TypeOf} from './type-of';
import * as t from './types';
import {Type} from './types';




export function is<T extends Type>(v: unknown, t: T): v is TypeOf<T>;
export function is(v: unknown, t: Type): boolean {
    switch (t.kind) {
        case 'any': return true;
        case 'array': return Array.isArray(v) && v.every(el => is(el, t.element));
        case 'boolean': return typeof v === 'boolean';
        case 'brandedString': return typeof v === 'string';
        case 'date': return v instanceof Date;
        case 'intersection': return (t.members as Type[]).every(type => is(v, type));
        case 'never': return false;
        case 'null': return v === null;
        case 'number': return typeof v === 'number';
        case 'object':
            if (typeof v !== 'object' || v === null) return false;
            let properties = t.properties as Record<string, Type | t.optional>;
            for (let propName of Object.keys(properties)) {
                let propType = properties[propName];
                let isOptional = propType.kind === 'optional';
                propType = propType.kind === 'optional' ? propType.type as Type : propType;
                if (!v.hasOwnProperty(propName)) {
                    if (isOptional) continue;
                    return false;
                }
                if (!is((v as any)[propName], propType)) return false;
            }
            return true;
        case 'string': return typeof v === 'string';
        case 'tuple':
            let elements = t.elements as Type[];
            return Array.isArray(v)
                && v.length === elements.length
                && v.every((el, i) => is(el, elements[i]));
        case 'undefined': return v === undefined;
        case 'union': return (t.members as Type[]).some(type => is(v, type));
        case 'unit': return v === t.value;
        case 'unknown': return true;
        default: throw ((type: never) => new Error(`Unhandled type '${type}'`))(t);
    }
}
