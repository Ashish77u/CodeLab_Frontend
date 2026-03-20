import axiosLib from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axiosLib.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    // First try Zustand store token
    let token = useAuthStore.getState().getToken()

    // Fallback to temp_token during OAuth2 callback
    if (!token) {
      token = localStorage.getItem('temp_token')
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.userMessage = 'Cannot connect to server. Is the backend running?'
      return Promise.reject(error)
    }

    const status = error.response.status

    if (status === 401) {
      localStorage.removeItem('temp_token')
      useAuthStore.getState().logout()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    if (status === 403) {
      error.userMessage = 'You do not have permission to do this'
      return Promise.reject(error)
    }

    if (status === 404) {
      error.userMessage = error.response.data?.message || 'Not found'
      return Promise.reject(error)
    }

    if (status === 409) {
      error.userMessage = error.response.data?.message || 'Already exists'
      return Promise.reject(error)
    }

    if (status >= 500) {
      error.userMessage = 'Server error. Please try again later.'
      return Promise.reject(error)
    }

    return Promise.reject(error)
  }
)

export default api