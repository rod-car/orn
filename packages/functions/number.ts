import { getOrdinal } from "french-ordinals"

export const number_array = (max: number, step: number): number[] => {
    const numbers: number[] = []
    for (let i = step; i <= max; i += step) {
        numbers.push(i);
    }
    return numbers
}

export const range = (length: number): number[] => {
    let numbers: number[] = [];
    for (let i = 0; i < length; i++) {
        numbers.push(i + 1);
    }
    return numbers
}

export const isNumber = (str: string) => {
    return parseInt(str) > 0
}

export const round = (nb: number, decimal: number = 2): number => {
    const factor = Math.pow(10, decimal);
    return Math.round((nb + Number.EPSILON) * factor) / factor;
}

export const formatPrice = (price: number, format: string = 'mg-MG', currency: string = 'MGA'): string => {
    const formatter = new Intl.NumberFormat(format, {
        style: 'currency',
        currency: currency
    });
    return formatter.format(price);
}

export const ordinalLetters = (n: number, gender: 'M' | 'F' = 'M'): string => {
    return getOrdinal(n, gender)
}