import axios from "axios"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        const originalReq = error.config;
        if (error.response?.status === 401 && !originalReq._retry) {
            originalReq._retry = true

            const refresh = localStorage.getItem(REFRESH_TOKEN)
            if (!refresh) {
                localStorage.clear()
                window.location.href = '/login'
                return Promise.reject(error)
            }

            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/token/refresh/`,
                    { refresh: refresh }
                )
                localStorage.setItem("ACCESS_TOKEN", res.data.access)
                originalReq.headers.Authorization = `Bearer ${res.data.access}`

                return api(originalReq)
            } catch (err) {
                localStorage.clear()
                window.location.href = '/login'
                return Promise.reject(err)
            }
        }
        return Promise.reject(error);
    } 
)

export default api

