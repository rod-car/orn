export const number_array  = (max: number, step: number): number[] => {
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