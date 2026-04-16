import axios, { type AxiosError } from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

http.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

http.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosError['config'] & { _retry?: boolean }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        await http.post('/auth/refresh-token')
        return http(originalRequest)
      } catch (refreshError) {
        const refreshAxiosError = refreshError as AxiosError
        
        if (refreshAxiosError.response?.status === 409) {
          localStorage.removeItem('auth-storage')
          window.location.href = '/login'
          await http.post('/auth/logout')
        }

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default http
