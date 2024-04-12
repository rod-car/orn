import axios from "axios";

const axiosClient = axios.create()

axiosClient.interceptors.request.use(config => {
    // config.headers.Authorization = `Bearer ${token}`
    config.headers.Accept = ["application/json", "application/ld+json"]
    return config;
})

export default axiosClient;