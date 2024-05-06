/**
 * Signe qui marque qu'un champ est automatique
 */
export function AutoSign({ value } : { value: boolean }) {
    return <>{value && <span className='ml-1 text-warning'>*</span>}</>;
}