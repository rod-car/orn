import { create } from 'zustand';

type Config = {
    baseUrl: string;
}

const apiUrl = (process.env.NODE_ENV && process.env.NODE_ENV === 'development') ? "http://localhost:8000/api" : "https://api.orn-atsinanana.mg/api"


export const useConfigStore = create<Config>(
    () => ({
        baseUrl: apiUrl
    })
);