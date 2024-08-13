import { ToastPosition } from 'react-toastify'

export const config = {
    // baseUrl: 'https://api.clinique-hugney.mg/api',
    baseUrl: 'http://localhost:8000/api',
    toastPosition: 'bottom-right' as ToastPosition,
    pagination: {
        containerClass: 'pagination justify-content-center pagination-sm',
        buttonIcons: false,
        prevButtonClass: 'page-item',
        prevButtonIcon: 'bi bi-chevron-left',
        nextButtonClass: 'page-item',
        nextButtonIcon: 'bi bi-chevron-right',
        numberButtonClass: 'page-item',
        numberClass: 'page-link',
        numbersCountForShow: 3,
        activeClass: 'active',
        prevButtonText: "Précedent",
        nextButtonText: "Suivant"
    }
}

const abaqueTypes = [
    {
        id: 'imc-age',
        label: 'IMC pour age'
    },
    {
        id: 'length-weight',
        label: 'Taille pour poids'
    },
    {
        id: 'length-age-male',
        label: 'Taille pour age garçon'
    },
    {
        id: 'length-age-female',
        label: 'Taille pour age fille'
    },
    {
        id: 'weight-age-male',
        label: 'Poids pour age garçon'
    },
    {
        id: 'weight-age-female',
        label: 'Poids pour age fille'
    }
]

const find = (key: string): string | null => {
    const pairsKey: Record<string, unknown> = {}
    abaqueTypes.map((type) => {
        pairsKey[type.id] = type.label
    })
    if (Object.keys(pairsKey).includes(key)) return pairsKey[key] as string
    return null
}

const defaultFields = {
    age: 0,
    ['Z-3']: 0,
    ['Z-2']: 0,
    ['Z-1']: 0,
    ['Z+0']: 0,
    ['Z+1']: 0,
    ['Z+2']: 0,
    ['Z+3']: 0,
    ['taille']: 0,
    ['TS-4']: 0,
    ['MAS-3']: 0,
    ['MAM-2']: 0,
    ['SORTIE-1_5']: 0,
    ['NORMAL-1']: 0,
    ['MEDIAN-0']: 0
}

export const abaque = {
    defaultFields,
    abaqueTypes,
    find
}

export const class_categories = ['A', 'B', 'C', 'I', 'II', 'III', 'ZA', 'ZB'];