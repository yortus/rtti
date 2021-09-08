import {Descriptor} from '../descriptor';

// TODO: better fuzzing/randomization. Don't always return same values eg for any/string/number/etc
// TODO: add tests

export function generateValue(d: Descriptor): unknown {
    switch (d.kind) {
        case 'any': return ['any', 'value'];
        case 'array': return range(nat(5)).map(_ => generateValue(d.element));
        case 'boolean': return nat(2) === 0;
        case 'brandedString': return 'a branded string';
        case 'date': return new Date();
        case 'intersection': {
            if (d.members.length === 0) return ['any', 'value'];
            return Object.assign({}, ...d.members.map(generateValue));
        }
        case 'never': throw new Error(`Cannot generate a value for the 'never' type`);
        case 'null': return null;
        case 'number': return nat(1000);
        case 'object': {
            let propNames = Object.keys(d.properties);
            const obj: any = {};
            for (let propName of propNames) {
                let propDesc = d.properties[propName];
                let isOptional = propDesc.kind === 'optional';
                propDesc = propDesc.kind === 'optional' ? propDesc.type as Descriptor : propDesc;
                if (isOptional && nat(2) === 0) continue;
                obj[propName] = generateValue(propDesc);
            }
            return obj;
        }
        case 'string': return 'any string'
        case 'tuple': return d.elements.map(generateValue);
        case 'undefined': return undefined;
        case 'union': {
            if (d.members.length === 0) throw new Error(`Cannot generate a value for an empty union`);
            return generateValue(d.members[nat(d.members.length)]);
        }
        case 'unit': return d.value;
        case 'unknown': return ['any', 'value'];
        default: ((desc: never) => { throw new Error(`Unhandled case '${desc}'`) })(d);
    }
}

// returns a random integer from 0..upperBound (exclusive of upperBound)
function nat(upperBound: number): number {
    return Math.floor(Math.random() * upperBound);
}

// returns an array of all the natural numbers 0..upperBound (exclusive of upperBound).
// eg range(6) returns [0, 1, 2, 3, 4, 5]
function range(upperBound: number): number[] {
    const result: number[] = [];
    for (let i = 0; i < upperBound; ++i) result.push(i);
    return result;
}
