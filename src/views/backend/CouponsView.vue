<template>
  <div class="" text-end>
    <button class="btn btn-primary" type="button" @click="openModal()">新增優惠券</button>
  </div>
  <div v-if="isLoading" class="text-center mt-5">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <table v-else class="table mt-4 container-fluid align-middle">
    <thead>
      <tr>
        <th>優惠券名稱</th>
        <th>優惠碼</th>
        <th width="120" class="text-end">折扣率</th>
        <th width="150">到期日期</th>
        <th width="100" class="text-center">是否啟用</th>
        <th width="200" class="text-center">編輯</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in store.coupons" :key="item.id">
        <td>{{ item.title }}</td>
        <td>{{ item.code }}</td>
        <td class="text-end">{{ item.percent }}%</td>
        <td>{{ formatDate(item.due_date) }}</td>
        <td class="text-center">
          <span :class="{ 'text-success': item.is_enabled }">
            {{ item.is_enabled ? '啟用' : '未啟用' }}
          </span>
        </td>
        <td class="text-center">
          <div class="btn-group">
            <button class="btn btn-outline-primary btn-sm" @click="openModal(item)">編輯</button>
            <button class="btn btn-outline-danger btn-sm" @click="deleteCoupon(item.id)">
              刪除
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <nav v-if="store.coupons.length > 0" aria-label="Page navigation" class="mt-4">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: !pagination.has_pre }">
        <a class="page-link" href="#" @click.prevent="changePage(pagination.current_page - 1)">
          上一頁
        </a>
      </li>
      <li class="page-item active">
        <span class="page-link">{{ pagination.current_page || 1 }}</span>
      </li>
      <li class="page-item" :class="{ disabled: !pagination.has_next }">
        <a class="page-link" href="#" @click.prevent="changePage(pagination.current_page + 1)">
          下一頁
        </a>
      </li>
    </ul>
  </nav>
  <CouponModal
    ref="couponModal"
    @update-success="handleSuccess"
    @update-failed="handleError"
  ></CouponModal>

  <div class="toast-container position-fixed top-0 start-50 translate-middle-x pt-4">
    <div
      class="toast align-items-center text-white border-0"
      :class="toastType"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      ref="toast"
    >
      <div class="d-flex">
        <div class="toast-body text-center px-4">
          {{ toastMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useCouponStore } from '../../stores/CouponStore'
import CouponModal from '../../components/CouponModal.vue'
import { Toast } from 'bootstrap'

export default {
  name: 'CouponsView',
  components: {
    CouponModal,
  },
  data() {
    return {
      store: useCouponStore(),
      isLoading: false,
      toastMessage: '',
      toastType: 'bg-success',
      pagination: {},
      currentPage: 1,
    }
  },
  methods: {
    openModal(item) {
      this.$refs.couponModal?.openModal(item)
    },
    async deleteCoupon(id) {
      if (!id || !confirm('確定要刪除此優惠券嗎？')) return

      try {
        this.isLoading = true
        const res = await this.store.deleteCoupon(id)
        this.showToast(res.success ? '刪除成功' : res.message, res.success ? 'success' : 'danger')
        if (res.success) {
          // 如果當前頁已無數據，返回上一頁
          await this.getCoupons(
            this.store.coupons.length === 1 ? Math.max(1, this.currentPage - 1) : this.currentPage,
          )
        }
      } catch {
        this.showToast('刪除失敗', 'danger')
      } finally {
        this.isLoading = false
      }
    },
    formatDate(timestamp) {
      return new Date(timestamp * 1000).toLocaleDateString()
    },
    showToast(message, type = 'success') {
      this.toastMessage = message
      this.toastType = `bg-${type}`
      this.toast?.show()
    },
    async getCoupons(page = 1) {
      if (this.isLoading) return

      this.isLoading = true
      try {
        const res = await this.store.getCoupons(page, 5)
        if (res.success) {
          this.pagination = res.pagination
          // 確保頁碼在有效範圍內
          if (page > this.pagination.total_pages) {
            this.currentPage = 1
            await this.getCoupons(1)
          }
        }
      } finally {
        this.isLoading = false
      }
    },
    async changePage(page) {
      if (page > 0 && page <= this.pagination.total_pages) {
        this.currentPage = page
        await this.getCoupons(page)
      }
    },
    handleSuccess(action) {
      this.showToast(`${action}成功！`)
      this.getCoupons(this.currentPage)
    },
    handleError(message) {
      this.showToast(message, 'danger')
    },
  },
  mounted() {
    this.toast = new Toast(this.$refs.toast)
    this.getCoupons(1)
  },
}
</script>
