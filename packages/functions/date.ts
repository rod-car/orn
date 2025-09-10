import { differenceInMonths, differenceInYears, format as dateFnsFormat, getYear } from 'date-fns'
import { fr } from 'date-fns/locale'
import { capitalize } from '.'

/**
 * Recuperer une liste d'années scolaires
 * @param deep 
 * @returns 
 */
export const scholar_years = (deep: number = 5): string[] => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-based in JavaScript

    const startYear =
        currentMonth < 6
            ? currentYear - 1
            : currentYear;

    const years = [];
    for (let i = 0; i < deep; i++) {
        const start = startYear - i;
        const end = start + 1;
        years.push(`${start}-${end}`);
    }
    return years;
    /*
    const current_year = getYear(new Date) + 1
    const scholar_years: string[] = []

    for (let i = 0; i < deep; i++) {
        scholar_years.push((current_year - (i + 1)) + "-" + (current_year - i))
    }

    return scholar_years*/
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

    const age = (ageYear > 0 ? ageYear.toString() + " an(s) " : "") + (leftMonths > 0 ? (leftMonths.toString() + " mois") : "")

    if (age.trim() === "") return "Moins d'un mois"
    return age
}


/**
 * Permet de calculer l'age en année
 * 
 * @param birth_date 
 * @param date_compare 
 * @returns number
 */
export const getAgeYear = (birth_date: string, date_compare: string | undefined = undefined): number => {
    const date = parse(birth_date)
    const currentDate = date_compare === undefined ? new Date : parse(date_compare)
    return differenceInYears(currentDate, date)
}


/**
 * Permet de calculer l'age en mois
 * 
 * @param birth_date 
 * @param date_compare 
 * @returns number
 */
export const getAgeMonth = (birth_date: string, date_compare: string | undefined = undefined): number => {
    const date = parse(birth_date)
    const currentDate = date_compare === undefined ? new Date : parse(date_compare)
    return differenceInMonths(currentDate, date)
}


/**
 * Permet de parser une date donnée
 * @param _date 
 * @param _format 
 * @param _delimiter 
 * @returns Date
 */
const parse = (_date: string, _format: string = "yyyy-MM-dd", _delimiter: string = "-"): Date => {
    let formatLowerCase = _format.toLowerCase();
    let formatItems = formatLowerCase.split(_delimiter);
    let dateItems = _date.split(_delimiter);
    let monthIndex = formatItems.indexOf("mm");
    let dayIndex = formatItems.indexOf("dd");
    let yearIndex = formatItems.indexOf("yyyy");
    let month = parseInt(dateItems[monthIndex]);
    month -= 1;

    let formatedDate = new Date(parseInt(dateItems[yearIndex]), month, parseInt(dateItems[dayIndex]));
    return formatedDate;
}

export const format = (date: string, format: string = "dd/MM/y"): string => {
    try {
        return dateFnsFormat(date, format, { locale: fr })
    } catch (error) {
        return ''
    }
}

function getYears(depth: number = 5): number[] {
    const current_year = getYear(new Date) + 1
    const years: number[] = []

    for (let i = 0; i < depth; i++) {
        years.push(current_year - (i + 1))
    }
    return years
}

type Month = {
    id: number
    label: string
}

function getMonths(): Month[] {
    const months: Month[] = []
    for (let i = 1; i <= 12; i++) {
        months.push({
            id: i,
            label: capitalize(new Date(2000, i - 1, 1).toLocaleString('fr-FR', { month: 'long' }))
        })
    }

    return months
}

export const months = getMonths()
export const reverseYears = getYears().reverse()
export const years = getYears()