import { differenceInMonths, differenceInYears, getDate, getYear } from 'date-fns'


/**
 * Recuperer une liste d'années scolaires
 * @param deep 
 * @returns 
 */
export const scholar_years = (deep: number = 5): string[] => {
    const current_year = getYear(new Date) + 1
    const scholar_years: string[] = []

    for (let i = 0; i < deep; i++)
    {
        scholar_years.push((current_year - (i + 1)) + "-" + (current_year - i))
    }

    return scholar_years
}

/**
 * Calculer l'age
 * @param birth_date 
 * @returns 
 */
export const ageLong = (birth_date: string | null): string => {
    if (birth_date === null) return ""
    const ageYear = getAgeYear(birth_date)
    const ageMonth = getAgeMonth(birth_date)

    const normalMonths = ageYear * 12;
    const leftMonths = ageMonth - normalMonths

    return ageYear.toString() + " ans " + leftMonths.toString() + " mois"
}

export const getAgeYear = (birth_date: string): number => {
    const date = parse(birth_date)
    const currentDate = new Date
    return differenceInYears(currentDate, date)
}

export const getAgeMonth = (birth_date: string): number => {
    const date = parse(birth_date)
    const currentDate = new Date
    return differenceInMonths(currentDate, date)
}

const parse = (_date: string, _format: string = "yyyy-MM-dd", _delimiter: string = "-") => {
    let formatLowerCase = _format.toLowerCase();
    let formatItems = formatLowerCase.split(_delimiter);
    let dateItems = _date.split(_delimiter);
    let monthIndex = formatItems.indexOf("mm");
    let dayIndex = formatItems.indexOf("dd");
    let yearIndex = formatItems.indexOf("yyyy");
    let month = parseInt(dateItems[monthIndex]);
    month -= 1;

    let formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
    return formatedDate;
}