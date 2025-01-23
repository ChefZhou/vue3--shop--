import { defineStore } from 'pinia'
import axiosInstance from '@/utils/axios'

const { VITE_APP_API, VITE_APP_PATH } = import.meta.env

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    pagination: {},
    isLoading: false,
  }),
  actions: {
    async getProducts() {
      this.isLoading = true
      try {
        const res = await axiosInstance.get(`/api/${VITE_APP_PATH}/admin/products`)
        if (res.data.success) {
          this.products = res.data.products
          this.pagination = res.data.pagination
        } else {
          throw new Error(res.data.message)
        }
      } catch (error) {
        throw error
      } finally {
        this.isLoading = false
      }
    },
    async deleteProduct(id) {
      try {
        const res = await axiosInstance.delete(`/api/${VITE_APP_PATH}/admin/product/${id}`)
        if (res.data.success) {
          await this.getProducts()
        }
        return res.data
      } catch (error) {
        throw error
      }
    },
    async updateProduct(product, isNew) {
      try {
        const method = isNew ? 'post' : 'put'
        const url = `/api/${VITE_APP_PATH}/admin/product${isNew ? '' : `/${product.id}`}`

        const res = await axiosInstance[method](url, { data: product })
        if (res.data.success) {
          await this.getProducts()
        }
        return res.data
      } catch (error) {
        throw error
      }
    },
  },
})
