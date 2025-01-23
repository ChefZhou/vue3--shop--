import { defineStore } from 'pinia'
import axios from '@/utils/axios'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: {
      carts: [],
      total: 0,
      final_total: 0,
    },
    isLoading: false,
  }),

  getters: {
    cartItemCount: (state) => state.cart.carts.reduce((sum, item) => sum + item.qty, 0),
    totalAmount: (state) => state.cart.final_total || 0,
  },

  actions: {
    async getCart() {
      try {
        const response = await axios.get(`/api/${import.meta.env.VITE_APP_PATH}/cart`)
        if (response.data.success) {
          this.cart = response.data.data
        }
        return response.data
      } catch (error) {
        throw error
      }
    },

    async addToCart(productId, qty = 1) {
      try {
        const currentItem = this.cart.carts.find((item) => item.product_id === productId)
        const currentQty = currentItem ? currentItem.qty : 0

        if (currentItem) {
          const product = currentItem.product
          if (currentQty + qty > product.num) {
            throw new Error(`超過商品可用庫存數量 ${product.num}`)
          }
        }

        const data = {
          product_id: productId,
          qty,
        }
        const response = await axios.post(`/api/${import.meta.env.VITE_APP_PATH}/cart`, { data })
        if (response.data.success) {
          await this.getCart()
        }
        return response.data
      } catch (error) {
        throw error
      }
    },

    async updateCart(cartId, productId, qty) {
      try {
        const data = {
          product_id: productId,
          qty,
        }
        const response = await axios.put(`/api/${import.meta.env.VITE_APP_PATH}/cart/${cartId}`, {
          data,
        })
        if (response.data.success) {
          await this.getCart()
        }
        return response.data
      } catch (error) {
        throw error
      }
    },

    async removeCartItem(cartId) {
      try {
        const response = await axios.delete(`/api/${import.meta.env.VITE_APP_PATH}/cart/${cartId}`)
        if (response.data.success) {
          await this.getCart()
        }
        return response.data
      } catch (error) {
        throw error
      }
    },

    async clearCart() {
      try {
        if (!this.cart.carts || this.cart.carts.length === 0) {
          return {
            success: true,
            message: '購物車已經是空的',
          }
        }

        const response = await axios.delete(`/api/${import.meta.env.VITE_APP_PATH}/carts`)

        if (response.data.success) {
          this.cart = {
            carts: [],
            total: 0,
            final_total: 0,
          }
        }

        return response.data
      } catch (error) {
        console.error('清空購物車失敗:', error)
        throw error
      }
    },

    async refreshCart() {
      return await this.getCart()
    },

    async createOrder(orderData) {
      try {
        const cartResponse = await this.getCart()
        if (!cartResponse.data?.carts?.length) {
          throw new Error('購物車內無商品')
        }

        const response = await axios.post(`/api/${import.meta.env.VITE_APP_PATH}/order`, {
          data: {
            user: orderData.user,
            message: orderData.message,
          },
        })

        if (!response.data.success) {
          throw new Error(response.data.message)
        }

        const orderId = response.data.orderId

        try {
          for (const item of this.cart.carts) {
            await this.removeCartItem(item.id)
          }

          this.cart = {
            carts: [],
            total: 0,
            final_total: 0,
          }
        } catch (error) {
          console.warn('清空購物車時發生問題，但訂單已建立:', error)
        }

        return {
          success: true,
          orderId,
        }
      } catch (error) {
        console.error('建立訂單失敗:', error)
        throw error
      }
    },

    async removeItemQuantity(cartId, productId, removeQty) {
      try {
        const cartItem = this.cart.carts.find((item) => item.id === cartId)
        if (!cartItem) throw new Error('找不到購物車項目')

        const newQty = cartItem.qty - removeQty
        if (newQty <= 0) {
          return await this.removeCartItem(cartId)
        }

        return await this.updateCart(cartId, productId, newQty)
      } catch (error) {
        throw error
      }
    },

    validateQuantity(cartItem, newQty) {
      return newQty <= cartItem.product.num
    },

    async applyCoupon(code) {
      try {
        const response = await axios.post(`/api/${import.meta.env.VITE_APP_PATH}/coupon`, {
          data: { code },
        })

        if (!response.data.success) {
          throw new Error(response.data.message)
        }

        await this.getCart()

        return {
          success: true,
          data: response.data.data,
        }
      } catch (error) {
        throw error
      }
    },
  },
})
