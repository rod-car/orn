export { scholar_years, months, years, reverseYears, getAgeYear as ageYear, getAgeMonth as ageMonth, ageLong as ageFull, format } from "./date";
export { capitalize, gender, wrap, ucWords } from "./string";
export { number_array, range, round, isNumber, formatPrice } from "./number";
export { addDays, subDays, isDate } from 'date-fns'

export async function post(data: Record<string, unknown>): Promise<any> {
    return false;
}