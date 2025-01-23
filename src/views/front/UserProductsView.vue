<template>
  <div class="container py-5">
    <div class="row mb-4">
      <div class="col">
        <h2 class="fw-bold mb-0">商品列表</h2>
      </div>
    </div>

    <div v-if="isLoading" class="text-center mt-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="products.length === 0" class="text-center mt-5">
      <h3>目前無商品</h3>
    </div>

    <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div v-for="item in products" :key="item.id" class="col">
        <div class="card h-100 border-0 shadow-sm product-card">
          <router-link
            :to="{ name: 'ProductDetail', params: { id: item.id } }"
            class="text-decoration-none"
          >
            <img
              :src="item.imageUrl"
              class="card-img-top"
              :alt="item.title"
              style="height: 280px; object-fit: cover"
            />
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <span class="badge bg-primary rounded-pill px-3 py-2">{{ item.category }}</span>
              </div>
              <h5 class="card-title fw-bold mb-3">{{ item.title }}</h5>
              <p class="card-text text-muted small mb-4">{{ item.description }}</p>
              <div class="price-section text-end">
                <div class="text-muted text-decoration-line-through mb-1">
                  原價 {{ formatPrice(item.origin_price) }}
                </div>
                <div class="fs-4 text-danger fw-bold">特價 {{ formatPrice(item.price) }}</div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <nav v-show="!isLoading && products.length > 0" aria-label="Page navigation" class="mt-5">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: pagination.currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="changePage(pagination.currentPage - 1)">
            上一頁
          </a>
        </li>
        <li
          v-for="page in pagination.totalPages"
          :key="page"
          class="page-item"
          :class="{ active: page === pagination.currentPage }"
        >
          <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
        </li>
        <li
          class="page-item"
          :class="{ disabled: pagination.currentPage === pagination.totalPages }"
        >
          <a class="page-link" href="#" @click.prevent="changePage(pagination.currentPage + 1)">
            下一頁
          </a>
        </li>
      </ul>
    </nav>

    <div v-if="error" class="alert alert-danger text-center" role="alert">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { useUserProductStore } from '@/stores/userProductStore'

export default {
  data() {
    return {
      products: [],
      isLoading: false,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        itemsPerPage: 5,
        hasNext: false,
        hasPrev: false,
      },
      error: null,
    }
  },
  methods: {
    async getProducts() {
      if (this.isLoading) return

      try {
        this.isLoading = true
        this.error = null
        const store = useUserProductStore()
        const result = await store.getProducts(this.pagination.currentPage)

        if (result.success) {
          this.products = result.products
          this.pagination = {
            ...result.pagination,
            currentPage: Number(result.pagination.currentPage),
            totalPages: Number(result.pagination.totalPages),
          }
        }
      } catch (error) {
        console.error('讀取產品失敗:', error)
        this.error = '無法載入商品，請稍後再試'
        this.products = []
      } finally {
        this.isLoading = false
      }
    },
    async changePage(page) {
      if (
        page >= 1 &&
        page <= this.pagination.totalPages &&
        page !== this.pagination.currentPage &&
        !this.isLoading
      ) {
        this.pagination.currentPage = page
        window.scrollTo({ top: 0, behavior: 'smooth' })
        await this.getProducts()
      }
    },
    formatPrice(price) {
      return `NT$ ${price.toLocaleString()}`
    },
  },
  watch: {
    $route() {
      this.getProducts()
    },
  },
  mounted() {
    this.getProducts()
  },
}
</script>

<style scoped>
.product-card {
  transition: transform 0.3s ease;
}
.product-card:hover {
  transform: translateY(-5px);
}
.price-section {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 1rem;
}
</style>
