import axios from "axios"
import { getToken, logout } from "../utils/auth"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
})

// Request Interceptor to attach Bearer token
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor to intercept 401 rejections and log out
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const status = error.response?.status
    const url = error.config?.url || ""

    if (status === 401 && !url.includes("/auth/login")) {
      logout()
    }
    return Promise.reject(error)
  }
)

export default api
