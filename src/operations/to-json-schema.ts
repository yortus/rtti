import {Descriptor, Optional} from '../descriptor';

export function toJsonSchema(d: Descriptor): unknown {
    switch (d.kind) {
        case 'any': return {$comment: 'any value permitted'};
        case 'array': return {type: 'array', items: toJsonSchema(d.element)};
        case 'boolean': return {type: 'boolean'};
        case 'brandedString': return {type: 'string', $comment: `branded with '${d.brand}'`}
        case 'date': return {type: 'string', format: 'date-time'};
        case 'intersection': return {allOf: d.members.map(toJsonSchema)};
        case 'never': throw new Error(`Cannot produce JSON schema for 'never' type`);
        case 'null': return {type: 'null'};
        case 'number': return {type: 'number'};
        case 'object': {
            const json = {type: 'object', properties: {}} as any;
            const required: string[] = [];
            const properties = d.properties as Record<string, Descriptor | Optional>;
            for (const propName of Object.keys(properties)) {
                let propType = properties[propName];
                const isOptional = propType.kind === 'optional';
                propType = propType.kind === 'optional' ? propType.type as Descriptor : propType;
                json.properties[propName] = toJsonSchema(propType);
                if (!isOptional) required.push(propName);
            }
            if (required.length > 0) json.required = required;
            return json;
        }
        case 'string': return {type: 'string'};
        case 'tuple': return {type: 'array', items: d.elements.map(toJsonSchema)};
        case 'undefined': throw new Error(`Cannot produce JSON schema for 'undefined' type`);
        case 'union': return {anyOf: d.members.map(toJsonSchema)};
        case 'unit': return {const: d.value};
        case 'unknown': return {$comment: 'any value permitted'};
        default: ((type: never) => { throw new Error(`Unhandled type '${type}'`) })(d);
    }
}
