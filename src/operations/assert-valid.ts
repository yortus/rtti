import {inspect} from 'util';
import {Descriptor} from '../descriptor';
import {check, CheckOptions} from './check';
import {toString} from './to-string';


export function assertValid(d: Descriptor, v: unknown, options?: CheckOptions): void {
    const {isValid, errors} = check(d, v, options);
    if (isValid) return;

    let desc = inspect(v, {depth: 0, compact: true, breakLength: Infinity});
    throw Object.assign(new Error(`${desc} does not conform to type ${toString(d)}`), {errors});
}
