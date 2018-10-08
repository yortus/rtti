import {Type} from '../type';


export const numberValue: Number = {
    isValid: (v): v is number => typeof v === 'number',
};
export {numberValue as number};


// Primitive types - these simple ones don't do much except make intellisense/quickinfo more readable
export interface Number extends Type<number> {
}
