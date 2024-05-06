/**
 * Signe qui marque qu'un champ est obligatoire
 */
export function RequiredSign({ value } : { value: boolean }) {
    return <>{value && <span className='ml-1 text-danger'>*</span>}</>;
}