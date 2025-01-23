import { defineStore } from 'pinia'
import axiosInstance from '@/utils/axios'

const apiPath = import.meta.env.VITE_APP_PATH

export const useCouponStore = defineStore('coupon', {
  state: () => ({
    coupons: [],
    isLoading: false,
    rules: {
      minAmount: 100,
      maxDiscount: 1000,
      maxUsagePerUser: 1,
      expirationDays: 30,
      allowedCategories: [],
      excludedProducts: [],
    },
  }),

  actions: {
    async getCoupons(page = 1) {
      this.isLoading = true
      try {
        const res = await axiosInstance.get(`v2/api/${apiPath}/admin/coupons?page=${page}`)
        if (res.data.success) {
          this.coupons = res.data.coupons
        }
        return res.data
      } catch (error) {
        return { success: false, message: error.response?.data?.message }
      } finally {
        this.isLoading = false
      }
    },

    async createCoupon(couponData) {
      this.isLoading = true
      try {
        if (!this.validateCouponRules(couponData)) {
          throw new Error('優惠券不符合規則')
        }

        const res = await axiosInstance.post(`v2/api/${apiPath}/admin/coupon`, {
          data: {
            ...couponData,
            due_date: this.calculateExpirationDate(couponData.due_date),
          },
        })
        if (res.data.success) {
          await this.getCoupons()
        }
        return res.data
      } catch (error) {
        return { success: false, message: error.message || '創建失敗' }
      } finally {
        this.isLoading = false
      }
    },

    async deleteCoupon(id) {
      this.isLoading = true
      try {
        const res = await axiosInstance.delete(`v2/api/${apiPath}/admin/coupon/${id}`)
        if (res.data.success) {
          await this.getCoupons()
        }
        return res.data
      } catch (error) {
        return { success: false, message: error.response?.data?.message || '刪除失敗' }
      } finally {
        this.isLoading = false
      }
    },

    async updateCoupon(couponData) {
      this.isLoading = true
      try {
        const res = await axiosInstance.put(`v2/api/${apiPath}/admin/coupon/${couponData.id}`, {
          data: couponData,
        })
        if (res.data.success) {
          await this.getCoupons()
        }
        return res.data
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || '更新失敗',
        }
      } finally {
        this.isLoading = false
      }
    },

    validateCouponRules(couponData) {
      if (couponData.minimum < this.rules.minAmount) {
        return false
      }

      if (couponData.price > this.rules.maxDiscount) {
        return false
      }

      return true
    },

    calculateExpirationDate(dueDate) {
      if (!dueDate) {
        const date = new Date()
        date.setDate(date.getDate() + this.rules.expirationDays)
        return Math.floor(date.getTime() / 1000)
      }
      return Math.floor(new Date(dueDate).getTime() / 1000)
    },

    async verifyCoupon(code) {
      try {
        const res = await axiosInstance.post(`v2/api/${apiPath}/verify_coupon`, {
          data: { code },
        })
        return res.data
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || '優惠券驗證失敗',
        }
      }
    },

    async updateCouponRules(newRules) {
      this.rules = {
        ...this.rules,
        ...newRules,
      }
    },

    getCouponStatus(coupon) {
      const now = Math.floor(Date.now() / 1000)
      return {
        isExpired: coupon.due_date < now,
        isActive: coupon.is_enabled && coupon.due_date > now,
      }
    },
  },
})
