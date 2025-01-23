const apiUrl = (process.env.NODE_ENV && process.env.NODE_ENV === 'development') ? "http://localhost:8000/api" : "https://api.orn-atsinanana.mg/api"

export const config = {
    apiUrl: apiUrl
}