import { defineStore } from 'pinia'
import axios from '@/utils/axios'

export const useUserProductStore = defineStore('userProduct', {
  state: () => ({
    products: [],
    isLoading: false,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
      itemsPerPage: 5,
    },
    currentProduct: null,
  }),

  actions: {
    async getProducts(page = 1) {
      this.isLoading = true
      try {
        const api = `/api/${import.meta.env.VITE_APP_PATH}/products`
        const response = await axios.get(`${api}?page=${page}`)
        if (!response.data.success) {
          throw new Error('獲取商品失敗')
        }

        const allProducts = response.data.products
        const itemsPerPage = 5

        const totalPages = Math.ceil(allProducts.length / itemsPerPage)

        const startIndex = (page - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        this.products = allProducts.slice(startIndex, endIndex)

        this.pagination = {
          currentPage: page,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
          itemsPerPage,
        }
        return {
          ...response.data,
          products: this.products,
          pagination: this.pagination,
        }
      } catch (error) {
        console.error('獲取商品列表失敗:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async getAllProducts() {
      try {
        const response = await axios.get(`/api/${import.meta.env.VITE_APP_PATH}/products/all`)
        return response.data
      } catch (error) {
        throw error
      }
    },

    async getProduct(id) {
      this.isLoading = true
      try {
        const api = `/api/${import.meta.env.VITE_APP_PATH}/product/${id}`
        const response = await axios.get(api)
        if (response.data.success) {
          this.currentProduct = response.data.product
        }
        return response.data
      } catch (error) {
        console.error('獲取商品詳情失敗:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },
  },
})
