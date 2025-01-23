import { defineStore } from 'pinia'
import axios from '@/utils/axios'

export const useOrderStore = defineStore('order', {
  state: () => ({
    currentOrder: null,
    isLoading: false,
    error: null,
  }),

  actions: {
    async getOrderById(orderId) {
      this.isLoading = true
      try {
        const response = await axios.get(`/api/${import.meta.env.VITE_APP_PATH}/order/${orderId}`)
        if (!response.data.success) {
          throw new Error(response.data.message)
        }

        const order = response.data.order
        order.total = parseInt(order.total || 0)
        order.final_total = parseInt(order.final_total || 0)

        if (order.products) {
          Object.entries(order.products).forEach(([id, item]) => {
            item.id = id
            item.total = parseInt(item.price || 0) * parseInt(item.qty || 0)
          })
        }

        this.currentOrder = order
        return order
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async payOrder(orderId) {
      this.isLoading = true
      try {
        const response = await axios.post(`/api/${import.meta.env.VITE_APP_PATH}/pay/${orderId}`)
        if (!response.data.success) {
          throw new Error(response.data.message)
        }
        if (response.data.success) {
          this.currentOrder.is_paid = true
        }
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },
  },
})
