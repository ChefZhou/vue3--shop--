import { defineStore } from 'pinia'
import router from '@/router'
import axiosInstance from '@/utils/axios'

const { VITE_APP_API, VITE_APP_PATH } = import.meta.env

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    token: '',
  }),
  actions: {
    async login(username, password) {
      try {
        const res = await axiosInstance.post('/admin/signin', { username, password })

        if (res.data.success) {
          const { token, expired } = res.data
          document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`
          axiosInstance.defaults.headers.common.Authorization = token
          this.isLoggedIn = true
          this.token = token
          await router.push('/dashboard/products')
          return res.data
        }
      } catch (error) {
        throw error
      }
    },
    async logout() {
      try {
        this.isLoggedIn = false
        this.token = ''

        const domains = [window.location.hostname, '']
        const paths = ['/', '/dashboard', '']

        domains.forEach((domain) => {
          paths.forEach((path) => {
            document.cookie = `hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}${domain ? `; domain=${domain}` : ''}`
          })
        })

        delete axiosInstance.defaults.headers.common.Authorization
        axiosInstance.defaults.headers.common.Authorization = null

        localStorage.clear()
        sessionStorage.clear()

        await router.push('/login')
        return { success: true }
      } catch (error) {
        throw error
      }
    },
    async checkAuth() {
      try {
        const token = document.cookie.replace(
          /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
          '$1',
        )

        if (!token) {
          await this.logout()
          return false
        }

        axiosInstance.defaults.headers.common.Authorization = token
        const res = await axiosInstance.post('/api/user/check')

        if (!res.data.success) {
          await this.logout()
          return false
        }

        this.isLoggedIn = true
        this.token = token
        return true
      } catch (error) {
        await this.logout()
        return false
      }
    },
  },
})
