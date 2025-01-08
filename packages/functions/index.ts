export { scholar_years, months, years, reverseYears, getAgeYear as ageYear, getAgeMonth as ageMonth, ageLong as ageFull, format } from "./date";
export { capitalize, gender, wrap, ucWords } from "./string";
export { number_array, range, round, isNumber, formatPrice } from "./number";
export { addDays, subDays, isDate } from 'date-fns'

/**
 * Detecte si un élémént se trouve dans un tableau
 * @param array Le tableau
 * @param value La valeur à rechercher
 * @returns 
 */
export function in_array(array: unknown[], value: unknown): boolean {
    return array.includes(value)
}