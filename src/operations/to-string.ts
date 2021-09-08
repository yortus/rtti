import {Descriptor} from '../descriptor';

// TODO: return compact/abbreviated string for complex types

export function toString(d: Descriptor): string {
    switch (d.kind) {
        case 'any': return 'any';
        case 'array': return `Array<${toString(d.element)}>`;
        case 'boolean': return 'boolean';
        case 'brandedString': return `BrandedString<${JSON.stringify(d.brand)}>`;
        case 'date': return 'Date';
        case 'intersection':
            if (d.members.length === 0) return `unknown`;
            return d.members.map(md => {
                let result = toString(md);
                if (md.kind === 'intersection' || md.kind === 'union') result = `(${result})`;
                return result;
            }).join(' & ');
        case 'never': return 'never';
        case 'null': return 'null';
        case 'number': return 'number';
        case 'object':
            let propNames = Object.keys(d.properties);
            let kvps = propNames.map(n => {
                let propDesc = d.properties[n];
                let isOpt = propDesc.kind === 'optional';
                return `${n}${isOpt ? '?' : ''}: ${toString(propDesc.kind === 'optional' ? propDesc.type : propDesc)}`;
            });
            return `{${kvps.join(', ')}}`;
        case 'string': return 'string';
        case 'tuple': return `[${d.elements.map(toString).join(', ')}]`;
        case 'undefined': return 'undefined';
        case 'union':
            if (d.members.length === 0) return `never`;
            return d.members.map(md => {
                let result = toString(md);
                if (md.kind === 'intersection' || md.kind === 'union') result = `(${result})`;
                return result;
            }).join(' | ');
        case 'unit': return JSON.stringify(d.value);
        case 'unknown': return 'unknown';
        default: ((desc: never) => { throw new Error(`Unhandled case '${desc}'`) })(d);
    }
}
