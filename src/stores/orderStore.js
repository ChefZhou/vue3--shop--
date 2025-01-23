import { defineStore } from 'pinia'
import axiosInstance from '@/utils/axios'

const { VITE_APP_PATH } = import.meta.env

const testOrders = [
  {
    id: 'test-001',
    num: 'TEST20240101',
    create_at: 1704067200,
    is_paid: true,
    paid_date: 1704067800,
    message: '這是測試訂單1',
    payment_method: 'credit_card',
    total: 1280,
    user: {
      name: '測試用戶1',
      email: 'test1@example.com',
      tel: '0912345678',
      address: '測試市測試區測試路1號',
    },
  },
  {
    id: 'test-002',
    num: 'TEST20240102',
    create_at: 1704153600,
    is_paid: false,
    message: '這是測試訂單2',
    payment_method: 'ATM',
    total: 2380,
    user: {
      name: '測試用戶2',
      email: 'test2@example.com',
      tel: '0923456789',
      address: '測試市測試區測試路2號',
    },
  },
]

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [],
    pagination: {},
    isTestMode: false,
  }),
  actions: {
    async getOrders(page = 1) {
      try {
        if (this.isTestMode) {
          this.orders = testOrders
          this.pagination = {
            total_pages: 1,
            current_page: 1,
            has_pre: false,
            has_next: false,
          }
          return
        }

        const res = await axiosInstance.get(`/api/${VITE_APP_PATH}/admin/orders?page=${page}`)
        if (res.data.success) {
          this.orders = res.data.orders
          this.pagination = res.data.pagination
        } else {
          this.orders = []
          this.pagination = {}
          throw new Error('獲取訂單失敗')
        }
      } catch (error) {
        console.error('獲取訂單失敗')

        if (this.isTestMode) {
          this.orders = testOrders
          this.pagination = {
            total_pages: 1,
            current_page: 1,
            has_pre: false,
            has_next: false,
          }
        } else {
          this.orders = []
          this.pagination = {}
        }
      }
    },

    async updateOrder(orderId, orderData) {
      if (this.isTestMode) {
        const index = this.orders.findIndex((order) => order.id === orderId)
        if (index !== -1) {
          this.orders[index] = { ...this.orders[index], ...orderData }
        }
        return {
          success: true,
          message: '已更新訂單資訊',
        }
      }

      try {
        const res = await axiosInstance.put(`/api/${VITE_APP_PATH}/admin/order/${orderId}`, {
          data: orderData,
        })
        if (res.data.success) {
          await this.getOrders()
        }
        return res.data
      } catch (error) {
        console.error('更新訂單失敗')
        throw error
      }
    },

    async deleteOrder(orderId) {
      if (this.isTestMode) {
        this.orders = this.orders.filter((order) => order.id !== orderId)
        return {
          success: true,
          message: '已刪除',
        }
      }

      try {
        const res = await axiosInstance.delete(`/api/${VITE_APP_PATH}/admin/order/${orderId}`)
        if (res.data.success) {
          await this.getOrders()
        }
        return res.data
      } catch (error) {
        console.error('刪除訂單失敗')
        throw error
      }
    },

    async deleteAllOrders() {
      if (this.isTestMode) {
        this.orders = []
        return {
          success: true,
          message: '已刪除全部訂單',
        }
      }

      try {
        const res = await axiosInstance.delete(`/api/${VITE_APP_PATH}/admin/orders/all`)
        if (res.data.success) {
          await this.getOrders()
        }
        return res.data
      } catch (error) {
        console.error('刪除全部訂單失敗')
        throw error
      }
    },

    toggleTestMode() {
      this.isTestMode = !this.isTestMode
      this.getOrders()
    },
  },
})
