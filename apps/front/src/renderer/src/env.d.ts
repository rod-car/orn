/// <reference types="vite/client" />

type MeasureLength = {
    id: number
    age: number
    'Z-3': number
    'Z-2': number
    'Z-1': number
    'Z+0': number
    'Z+1': number
    'Z+2': number
    'Z+3': number
    taille: number
    'TS-4': number
    'MAS-3': number
    'MAM-2': number
    'SORTIE-1_5': number
    'NORMAL-1': number
    'MEDIAN-0': number
}

type Student = {
    id: number
    number: number
    lastname: string
    firstname: string
    fullname: string
    birth_date: string
    birth_place: string
    count: number
    father: string
    mother: string
    parents: string
    gender: 'Garçon' | 'Fille'
    schools?: { scholar_year: School }[]
    classes?: { scholar_year: Classes }[]
}

type School = {
    id: number
    name: string
    localisation: string
    responsable: string
    commune_id: number
    commune?: Commune
}

type Commune = {
    id: number
    name: string
    district_id: number
    district: District
}

type District = {
    id: number
    name: string
}

type Niveau = {
    id: number
    label: string
    description?: string
}

type Classes = {
    id: string | number
    name: string
    notation?: string
    level_id?: number
    level?: Niveau
}

type ElementMode =
    | 'default'
    | 'primary'
    | 'secondary'
    | 'secondary'
    | 'danger'
    | 'warning'
    | 'success'
    | 'dark'
    | 'light'
    | 'info'

type ElementSize = 'sm' | 'md' | 'lg'

type User = {
    id: number
    name: string
    email: string
    username: string
    password: string
    password_confirmation: string
}

type Survey = {
    id: number
    date: string
    phase: number
    students: Student[]
}

interface SchoolZ {
    [schoolName: string]: {
        'Nb élève pesé': number
        MA: {
            G: number
            M: {
                value: number
                percent: number
            }
            S: {
                value: number
                percent: number
            }
        }
        IP: {
            G: number
            M: {
                value: number
                percent: number
            }
            S: {
                value: number
                percent: number
            }
        }
        CH: {
            G: number
            M: {
                value: number
                percent: number
            }
            S: {
                value: number
                percent: number
            }
        }
    }
}

interface SurveySchoolZ {
    [id: string]: School
}
