import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Config = {
    firstTime: boolean;
    alreadyPassed: () => void;
}

export const useConfigStore = create(
    persist<Config>(
        (set) => ({
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