import {isValid} from './is-valid';
import {Descriptor} from '../descriptor';
import {inspect} from '../utils';

/** Options for checking whether a value confirms to a type. */
export interface CheckOptions {
    /**
     * If true, excess properties (ie properties not declared as part of the type) that are present in the value being
     * checked are ignored during type checking. If false, excess properties are flagged as errors. Default value: true.
     */
    allowExcessProperties?: boolean;
}

export type CheckResult =
    | {isValid: true, errors: []}
    | {isValid: false, errors: Array<{path: string, message: string}>}
;

export function check(d: Descriptor, v: unknown, options?: CheckOptions): CheckResult {
    const allowExcessProperties = options?.allowExcessProperties ?? true;
    let errors = [] as Array<{path: string, message: string}>;
    recurse(d, v, '^');
    return errors.length === 0 ? {isValid: true, errors: []} : {isValid: false, errors};

    function recurse(d: Descriptor, v: unknown, path: string): void {
        let desc = inspect(v);
        switch (d.kind) {
            case 'any':
                return;
            case 'array':
                if (!Array.isArray(v)) {
                    errors.push({path, message: `Expected an array but got ${desc}`});
                }
                else {
                    v.forEach((el, i) => recurse(d.element, el, `${path}[${i}]`));
                }
                return;
            case 'boolean':
                if (typeof v !== 'boolean') errors.push({path, message: `Expected a boolean but got ${desc}`});
                return;
            case 'date':
                if (!(v instanceof Date)) errors.push({path, message: `Expected a Date object but got ${desc}`});
                return;
            case 'intersection':
                let isEvery = d.members.every(t => isValid(t, v, options));
                // TODO: improve this message with specifics
                if (!isEvery) errors.push({path, message: `The value ${desc} does not conform to the intersection type`});
                return;
            case 'never':
                errors.push({path, message: `Expected no value but got ${desc}`});
                return;
            case 'null':
                if (v !== null) errors.push({path, message: `Expected the value 'null' but got ${desc}`});
                return;
            case 'number':
                if (typeof v !== 'number') errors.push({path, message: `Expected a number but got ${desc}`});
                return;
            case 'object': {
                if (typeof v !== 'object' || v === null) {
                    errors.push({path, message: `Expected an object but got ${desc}`});
                    return;
                }
                let requiredPropNames = Object.keys(d.properties).filter(n => d.properties[n].kind !== 'optional');
                let optionalPropNames = Object.keys(d.properties).filter(n => d.properties[n].kind === 'optional');
                let actualPropNames = Object.keys(v);
                let missingPropNames = requiredPropNames.filter(n => !actualPropNames.includes(n));
                let excessPropNames = actualPropNames.filter(n => !requiredPropNames.includes(n) && !optionalPropNames.includes(n));
                if (missingPropNames.length > 0) errors.push({path, message: `The following properties are missing: ${missingPropNames.join(', ')}`});
                if (excessPropNames.length > 0 && !allowExcessProperties) errors.push({path, message: `The object has excess properties: ${excessPropNames.join(', ')}`});
                for (let propName of Object.keys(d.properties)) {
                    let propType = d.properties[propName];
                    let isOptional = propType.kind === 'optional';
                    propType = propType.kind === 'optional' ? propType.type as Descriptor : propType;
                    let propValue = (v as any)[propName];
                    if (propValue === undefined && isOptional) continue;
                    recurse(propType, propValue, `${path}.${propName}`);
                }
                return;
            }
            case 'string':
            case 'brandedString':
                if (typeof v !== 'string') errors.push({path, message: `Expected a string but got ${desc}`});
                return;
            case 'tuple': {
                let len = d.elements.length;
                if (!Array.isArray(v)) {
                    errors.push({path, message: `Expected an array but got ${desc}`});
                }
                else if (v.length !== len) {
                    errors.push({path, message: `Expected ${len} element(s) but got ${v.length} element(s)`});
                    return;
                }
                else {
                    v.forEach((el, i) => recurse(d.elements[i], el, `${path}[${i}]`));
                }
                return;
            }
            case 'undefined':
                if (v !== undefined) errors.push({path, message: `Expected the value 'undefined' but got ${desc}`});
                return;
            case 'union':
                let isSome = d.members.some(t => isValid(t, v, options));
                // TODO: improve this message with specifics
                if (!isSome) errors.push({path, message: `The value ${desc} does not conform to the union type`});
                return;
            case 'unit':
                if (v !== d.value) errors.push({path, message: `Expected the value ${JSON.stringify(d.value)} but got ${desc}`});
                return;
            case 'unknown':
                return;
            default:
                ((desc: never) => { throw new Error(`Unhandled case '${desc}'`) })(d);
            }
    }
}
