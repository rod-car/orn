/// <reference types="vite/client" />
declare module 'react-laravel-paginex'

type Person = {
    id: number;
    firstname: string;
    lastname: string;
    birth_date: string;
    gender: string;
    parents: string;
    height: number;
    weight: number;
    z_ia: number;
    z_hw: number;
    z_ha: number;
    z_wa: number;
}

type Consommation = Record<string, Record<string, string | number>>;
type ConsommationModel = {
    id: number;
    scholar_year: string|number;
    scholar_year_id: string|number;
    food_id: number;
    school_id: number;
    consommations: Consommation[]
}

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
    classes?: { scholar_year: Classes, category: string }[]
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
    occupation: string;
    email: string
    role: number
    username: string
    password: string
    password_confirmation: string
    created_at: string;
}

type Survey = {
    id: number
    date: string
    phase: number
    label: string
    scholar_year_id: number | string;
    scholar_year: string
    students: Student[]
}

type Activity = {
    id: number
    title: string
    date: string
    place: string
    details: string
    images?: {path: string, id: number}[]
    files: File[] | null
}

type Unit = {
    id: number
    name: string
    notation: string
}

type Site = {
    id: number
    name: string
    commune_id: number
    commune?: Commune
    district?: District
}

type Article = {
    id: number
    designation: string
    code?: string
    description?: string
}

type ArticlePrice = {
    id: number
    site_id: number
    article_id: number
    unit_id: number
    year: number
    month: number
    price: number
    article?: Article
    site?: Site
    unit?: Unit
    acn?: string
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

type Semence = {
    id: number
    name: string
    unit: string
}

type Materiel = {
    key: Key | null | undefined
    id: number
    name: string
    description: string
}

type Engrais = {
    id: number
    name: string
    unit: string
    type: string
}

type Garden = {
    id: number
    problem: string,
    solution: string,
    perspective: string,
    annex: string,
    year: number,
    school_id: number,
    school?: School
    materials?: Partial<Materiel>[],
    engrais?: Partial<Engrais>[],
    semences?: Partial<Semence>[]
}

type Steps = {
    id: number
    title: string
    table: string
    columns_data?: Record<string, string>
}

type APIError = {
    message: string;
    status: number;
    data: {
        errors: Record<string, string[]>
    }
};

type FileDocument = {
    id: number;
    title: string;
    path?: string;
    date: string;
    type?: 'pdf' | 'excel' | 'word' | 'powerpoint';
    abstract?: string;
    file?: File;
    creator?: User;
    updator?: User;
}

type StudentImport = Student & {
    scholar_year: number | string;
    students: Partial<Student>[]
    school_id: number;
    classe_id: number;
    category: string;
}

type Food = {
    id: number;
    label: string;
    unit: string;
}

type InputChange = ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>

type OneSheet = Record<string, string>[];
type MultiSheet = Record<string, OneSheet>
type ScholarYear = { id: string; label: string }