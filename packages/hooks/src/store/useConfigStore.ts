import { create } from 'zustand';

type Config = {
    baseUrl: string;
}

export const useConfigStore = create<Config>(
    () => ({
        baseUrl: 'http://localhost:8000/api/'
    })
);