export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export const gender = [
    {
        id: 'Garçon',
        label: 'Garçon'
    },
    {
        id: 'Fille',
        label: 'Fille'
    }
]

export function wrap(str: string, end: number = 100): string {
    return str.substring(0, end)
}