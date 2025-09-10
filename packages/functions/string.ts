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

export function ucWords(str: string): string {
    return str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
    });
};

export function escapeHtml(unsafeString: string): string
{
    return unsafeString.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}