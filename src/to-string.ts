import {Type} from './types';


export function toString(t: Type): string {
    switch (t.kind) {
        case 'any': return 'any';
        case 'array': return `Array<${toString(t.element)}>`;
        case 'boolean': return 'boolean';
        case 'brandedString': return `BrandedString<${JSON.stringify(t.brand)}>`;
        case 'date': return 'Date';
        case 'intersection':
            if (t.members.length === 0) return `unknown`;
            return t.members.map((m: Type) => {
                let result = toString(m);
                if (m.kind === 'intersection' || m.kind === 'union') result = `(${result})`;
                return result;
            }).join(' & ');
        case 'never': return 'never';
        case 'null': return 'null';
        case 'number': return 'number';
        case 'object':
            let propNames = Object.keys(t.properties);
            let kvps = propNames.map(n => `${n}: ${toString(t.properties[n])}`);
            return `{${kvps.join(', ')}}`;
        case 'string': return 'string';
        case 'tuple': return `[${t.elements.map(toString).join(', ')}]`;
        case 'undefined': return 'undefined';
        case 'union':
            if (t.members.length === 0) return `never`;
            return t.members.map((m: Type) => {
                let result = toString(m);
                if (m.kind === 'intersection' || m.kind === 'union') result = `(${result})`;
                return result;
            }).join(' | ');
        case 'unit': return JSON.stringify(t.value);
        case 'unknown': return 'unknown';
        default: throw ((type: never) => new Error(`Unhandled type '${type}'`))(t);
    }
}
