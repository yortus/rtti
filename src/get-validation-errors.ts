import {inspect} from 'util';
import {is} from './is';
import {optional, TypeInfo} from './type-info';


export interface ValidationErrors {
    errors: Array<{path: string, message: string}>;
    warnings: Array<{path: string, message: string}>;
}


export function getValidationErrors<T extends TypeInfo>(t: T, v: unknown): ValidationErrors {
    let errors = [] as ValidationErrors['errors'];
    let warnings = [] as ValidationErrors['warnings'];
    recurse(t, v, '^');
    return {errors, warnings};

    function recurse(t: TypeInfo, v: unknown, path: string): void {
        let d = inspect(v, {depth: 0, compact: true, breakLength: Infinity});
        switch (t.kind) {
            case 'any':
                return;
            case 'array':
                if (!Array.isArray(v)) {
                    errors.push({path, message: `Expected an array but got ${d}`});
                }
                else {
                    v.forEach((el, i) => recurse(t.element, el, `${path}[${i}]`));
                }
                return;
            case 'boolean':
                if (typeof v !== 'boolean') errors.push({path, message: `Expected a boolean but got ${d}`});
                return;
            case 'date':
                if (!(v instanceof Date)) errors.push({path, message: `Expected a Date object but got ${d}`});
                return;
            case 'intersection':
                let isEvery = (t.members as TypeInfo[]).every(t => is(t, v));
                if (!isEvery) errors.push({path, message: `The value ${d} does not conform to the intersection type`});
                return;
            case 'never':
                errors.push({path, message: `Expected no value but got ${d}`});
                return;
            case 'null':
                if (v !== null) errors.push({path, message: `Expected the value 'null' but got ${d}`});
                return;
            case 'number':
                if (typeof v !== 'number') errors.push({path, message: `Expected a number but got ${d}`});
                return;
            case 'object':
                if (typeof v !== 'object' || v === null) {
                    errors.push({path, message: `Expected an object but got ${d}`});
                    return;
                }
                let requiredPropNames = Object.keys(t.properties).filter(n => t.properties[n].kind !== 'optional');
                let optionalPropNames = Object.keys(t.properties).filter(n => t.properties[n].kind === 'optional');
                let actualPropNames = Object.keys(v);
                let missingPropNames = requiredPropNames.filter(n => !actualPropNames.includes(n));
                let excessPropNames = actualPropNames.filter(n => !requiredPropNames.includes(n) && !optionalPropNames.includes(n));
                if (missingPropNames.length > 0) errors.push({path, message: `The following properties are missing: ${missingPropNames.join(', ')}`});
                if (excessPropNames.length > 0) warnings.push({path, message: `The object has excess properties: ${excessPropNames.join(', ')}`});
                let properties = t.properties as Record<string, TypeInfo | optional>;
                for (let propName of Object.keys(properties)) {
                    let propType = properties[propName];
                    let isOptional = propType.kind === 'optional';
                    propType = propType.kind === 'optional' ? propType.type as TypeInfo : propType;
                    if (!v.hasOwnProperty(propName) && isOptional) continue;
                    recurse(propType, (v as any)[propName], `${path}.${propName}`)
                }
                return;
            case 'string':
            case 'brandedString':
                if (typeof v !== 'string') errors.push({path, message: `Expected a string but got ${d}`});
                return;
            case 'tuple':
                let len = t.elements.length;
                if (!Array.isArray(v)) {
                    errors.push({path, message: `Expected an array but got ${d}`});
                }
                else if (v.length !== len) {
                    errors.push({path, message: `Expected ${len} element(s) but got ${v.length} element(s)`});
                    return;
                }
                else {
                    v.forEach((el, i) => recurse(t.elements[i], el, `${path}[${i}]`));
                }
                return;
            case 'undefined':
                if (v !== undefined) errors.push({path, message: `Expected the value 'undefined' but got ${d}`});
                return;
            case 'union':
                let isSome = (t.members as TypeInfo[]).some(t => is(t, v));
                if (!isSome) errors.push({path, message: `The value ${d} does not conform to the union type`});
                return;
            case 'unit':
                if (v !== t.value) errors.push({path, message: `Expected the value ${JSON.stringify(t.value)} but got ${d}`});
                return;
            case 'unknown':
                return;
            default:
                throw ((type: never) => new Error(`Unhandled type '${type}'`))(t);
        }
    }
}
