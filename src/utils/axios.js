import axios from 'axios'
import router from '@/router'
import { useAuthStore } from '@/stores/authStore'

const apiUrl = import.meta.env.VITE_APP_API.endsWith('/')
  ? import.meta.env.VITE_APP_API
  : `${import.meta.env.VITE_APP_API}/`

const axiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 20000,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1')
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      await authStore.logout()
      router.push('/login')
    }
    console.error('API Error:', error.response?.data?.message || error.message)
    return Promise.reject(error)
  },
)

export default axiosInstance
