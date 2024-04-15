export const config = {
    baseUrl: 'http://localhost:8000/api'
    // baseUrl: 'http://192.168.88.47/api'
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
    const pairsKey: string[] = []
    abaqueTypes.map((type) => {
        pairsKey[type.id] = type.label
    })
    if (Object.keys(pairsKey).includes(key)) return pairsKey[key]
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
