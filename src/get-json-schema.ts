import {optional, TypeInfo} from './type-info';


export function getJsonSchema(t: TypeInfo): unknown {
    switch (t.kind) {
        case 'any': return {$comment: 'any value permitted'};
        case 'array': return {type: 'array', items: getJsonSchema(t.element)};
        case 'boolean': return {type: 'boolean'};
        case 'brandedString': return {type: 'string', $comment: `branded with '${t.brand}'`}
        case 'date': return {type: 'string', format: 'date-time'};
        case 'intersection': return {allOf: t.members.map(getJsonSchema)};
        case 'never': throw new Error(`Cannot produce JSON schema for 'never' type`);
        case 'null': return {type: 'null'};
        case 'number': return {type: 'number'};
        case 'object': {
            const json = {type: 'object', properties: {}} as any;
            const required: string[] = [];
            const properties = t.properties as Record<string, TypeInfo | optional>;
            for (const propName of Object.keys(properties)) {
                let propType = properties[propName];
                const isOptional = propType.kind === 'optional';
                propType = propType.kind === 'optional' ? propType.type as TypeInfo : propType;
                json.properties[propName] = getJsonSchema(propType);
                if (!isOptional) required.push(propName);
            }
            if (required.length > 0) json.required = required;
            return json;
        }
        case 'string': return {type: 'string'};
        case 'tuple': return {type: 'array', items: t.elements.map(getJsonSchema)};
        case 'undefined': throw new Error(`Cannot produce JSON schema for 'undefined' type`);
        case 'union': return {anyOf: t.members.map(getJsonSchema)};
        case 'unit': return {const: t.value};
        case 'unknown': return {$comment: 'any value permitted'};
        default: ((type: never) => { throw new Error(`Unhandled type '${type}'`) })(t);
    }
}
