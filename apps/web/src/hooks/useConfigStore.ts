import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Config = {
    firstTime: boolean;
    pageTitle: string;
    alreadyPassed: () => void;
}

export const useConfigStore = create(
    persist<Config>(
        (set) => ({
            pageTitle: "Gestion & Suivi Nutritionnel - Cantines Scolaires",
            firstTime: true,
            alreadyPassed: () => {
                set({ firstTime: false })
            }
        }),
        {
            name: 'config',
        }
    )
);