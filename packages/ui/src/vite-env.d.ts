/// <reference types="vite/client" />

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

type ElementSize = 'sm' | 'md' | 'lg';

type User = {
    id: string;
    nom: string;
    prenoms: string;
    age: number;
    sexe: "H" | "F" | "Homme" | "Femme" | "Masculin" | "Féminin" | "Garçon" | "Fille";
}