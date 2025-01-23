<template>
  <div v-if="shouldShowCart" class="dropdown">
    <button
      class="btn btn-outline-primary position-relative"
      type="button"
      @click="goToCart"
      @contextmenu.prevent="toggleDropdown"
    >
      <i class="bi bi-cart3"></i>
      <span
        v-if="cartItemCount > 0"
        class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
      >
        {{ cartItemCount }}
      </span>
    </button>
    <div class="dropdown-menu dropdown-menu-end p-0" style="width: 320px">
      <div class="p-3">
        <h6 class="mb-3">購物車</h6>
        <div v-if="isLoading" class="text-center py-3">
          <div class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <template v-else>
          <div v-if="!hasItems" class="text-center py-3">
            <p class="text-muted mb-0">購物車是空的</p>
          </div>
          <div v-else>
            <div class="cart-items" style="max-height: 300px; overflow-y: auto">
              <div v-for="item in cartItems" :key="item.id" class="d-flex align-items-center mb-3">
                <img
                  :src="item.product.imageUrl"
                  :alt="item.product.title"
                  class="rounded me-2"
                  style="width: 50px; height: 50px; object-fit: cover"
                />
                <div class="flex-grow-1">
                  <h6 class="mb-0 text-truncate" style="max-width: 150px">
                    {{ item.product.title }}
                  </h6>
                  <small class="text-muted">{{ item.qty }} x NT$ {{ item.product.price }}</small>
                </div>
                <div class="ms-2">
                  <button class="btn btn-sm btn-link text-danger p-0" @click="removeItem(item.id)">
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="border-top mt-3 pt-3">
              <div class="d-flex justify-content-between mb-2">
                <span>總計：</span>
                <span class="text-danger fw-bold">NT$ {{ formatPrice(cart.final_total) }}</span>
              </div>
              <div class="d-grid gap-2">
                <router-link to="/cart" class="btn btn-primary btn-sm">查看購物車</router-link>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '@/stores/cartStore'

export default {
  name: 'CartDropdown',
  emits: ['update-cart', 'error'],
  data() {
    return {
      cartStore: null,
      isLoading: false,
    }
  },
  computed: {
    cart() {
      return this.cartStore?.cart || { carts: [], total: 0, final_total: 0 }
    },
    cartItems() {
      return this.cart.carts || []
    },
    hasItems() {
      return this.cartItems.length > 0
    },
    cartItemCount() {
      return this.cartItems.reduce((sum, item) => sum + item.qty, 0)
    },
    shouldShowCart() {
      const currentPath = this.$route.path

      const excludedPaths = ['/', '/login']
      const isDashboard = currentPath.startsWith('/dashboard')

      return !excludedPaths.includes(currentPath) && !isDashboard
    },
  },
  methods: {
    formatPrice(price) {
      return price.toLocaleString()
    },
    goToCart() {
      this.$router.push('/cart')
    },
    toggleDropdown(event) {
      const dropdownEl = event.target.closest('.dropdown')
      const dropdown = new bootstrap.Dropdown(
        dropdownEl.querySelector('[data-bs-toggle="dropdown"]'),
      )
      dropdown.toggle()
    },
    async removeItem(id) {
      try {
        this.isLoading = true
        await this.cartStore.removeCartItem(id)
        this.$emit('update-cart')
      } catch (error) {
        this.$emit('error', '刪除商品失敗')
      } finally {
        this.isLoading = false
      }
    },
    async refreshCart() {
      try {
        this.isLoading = true
        await this.cartStore.getCart()
      } catch (error) {
        console.error('更新購物車失敗:', error)
      } finally {
        this.isLoading = false
      }
    },
  },
  created() {
    this.cartStore = useCartStore()
    this.refreshCart()
  },
}
</script>

<style scoped>
.dropdown-menu {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}
</style>
