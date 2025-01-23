<template>
  <div class="" text-end>
    <button class="btn btn-primary" type="button" @click="openModal()">增加一個產品</button>
  </div>
  <div v-if="isLoading" class="text-center mt-5">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <table v-else class="table mt-4 container-fluid align-middle">
    <thead>
      <tr>
        <th width="120">分類</th>
        <th>產品名稱</th>
        <th width="120" class="text-end">原價</th>
        <th width="120" class="text-end">售價</th>
        <th width="100" class="text-center">是否啟用</th>
        <th width="200" class="text-center">編輯</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in paginatedProducts" :key="item.id">
        <td>{{ item.category }}</td>
        <td>{{ item.title }}</td>
        <td class="text-end">{{ formatPrice(item.origin_price) }}</td>
        <td class="text-end">{{ formatPrice(item.price) }}</td>
        <td class="text-center">
          <span :class="{ 'text-success': item.is_enabled }">
            {{ item.is_enabled ? '啟用' : '未啟用' }}
          </span>
        </td>
        <td class="text-center">
          <div class="btn-group">
            <button class="btn btn-outline-primary btn-sm" @click="openModal(item)">編輯</button>
            <button class="btn btn-outline-danger btn-sm" @click="deleteProduct(item.id)">
              刪除
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <nav v-if="paginatedProducts.length > 0" aria-label="Page navigation" class="mt-4">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">上一頁</a>
      </li>
      <li
        v-for="page in totalPages"
        :key="page"
        class="page-item"
        :class="{ active: page === currentPage }"
      >
        <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
      </li>
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">下一頁</a>
      </li>
    </ul>
  </nav>
  <ProductModal ref="productModal"></ProductModal>

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
import { useProductStore } from '@/stores/productStore'
import ProductModal from '@/components/ProductModal.vue'
import { Toast } from 'bootstrap'

export default {
  components: {
    ProductModal,
  },
  data() {
    return {
      store: useProductStore(),
      isLoading: false,
      toastMessage: '',
      toastType: 'bg-success',
      toast: null,
      currentPage: 1,
      itemsPerPage: 5,
    }
  },
  computed: {
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.store.products.slice(start, end)
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.store.products.length / this.itemsPerPage))
    },
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat().format(price)
    },
    showToast(message, type = 'success') {
      this.toastMessage = message
      this.toastType = `bg-${type}`
      this.toast.show()
    },
    async deleteProduct(id) {
      try {
        await this.store.deleteProduct(id)
        this.showToast('產品已刪除')
      } catch (error) {
        this.showToast(error.message, 'danger')
      }
    },
    openModal(item = null) {
      if (this.$refs.productModal) {
        this.$refs.productModal.showModal(item)
      }
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
      }
    },
  },
  async created() {
    this.isLoading = true
    try {
      await this.store.getProducts()
    } catch (error) {
      this.showToast('載入產品資料失敗', 'danger')
    } finally {
      this.isLoading = false
    }
  },
  mounted() {
    this.toast = new Toast(this.$refs.toast)
  },
}
</script>

<style>
.toast-container {
  z-index: 9999;
}

.toast {
  min-width: 200px;
  backdrop-filter: blur(4px);
}

.bg-success {
  background-color: rgba(25, 135, 84, 0.9) !important;
}

.bg-danger {
  background-color: rgba(220, 53, 69, 0.9) !important;
}
</style>
