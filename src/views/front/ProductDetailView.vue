<template>
  <div class="container py-5">
    <nav aria-label="breadcrumb" class="mb-4">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/user-products" class="text-decoration-none">
            <i class="bi bi-arrow-left me-2"></i>返回商品列表
          </router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">商品詳情</li>
      </ol>
    </nav>

    <div v-if="isLoading" class="text-center my-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger text-center" role="alert">
      {{ error }}
    </div>

    <div v-else-if="product" class="row">
      <div class="col-md-6 mb-4">
        <img
          :src="currentImage"
          class="img-fluid rounded shadow-sm mb-3"
          :alt="product.title"
          style="width: 100%; height: 400px; object-fit: cover"
        />

        <div class="row g-2" v-if="product.imagesUrl && product.imagesUrl.length">
          <div class="col-2" v-for="(image, index) in allImages" :key="index">
            <img
              :src="image"
              class="img-thumbnail cursor-pointer"
              :class="{ 'border-primary': currentImage === image }"
              @click="currentImage = image"
              :alt="`${product.title} 圖片 ${index + 1}`"
              style="width: 100%; height: 60px; object-fit: cover"
            />
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <span
          class="badge rounded-pill mb-3"
          :class="product.is_enabled ? 'bg-success' : 'bg-secondary'"
        >
          {{ product.is_enabled ? '現正販售' : '未上架' }}
        </span>
        <h2 class="mb-3">{{ product.title }}</h2>
        <span class="badge bg-primary mb-3">{{ product.category }}</span>

        <div class="mb-4">
          <p class="text-muted mb-2">{{ product.description }}</p>
          <p class="text-muted small">{{ product.content }}</p>
        </div>

        <div class="price-section mb-4">
          <del class="text-muted me-2">原價 NT$ {{ product.origin_price }}</del>
          <span class="fs-3 text-danger fw-bold">特價 NT$ {{ product.price }}</span>
        </div>

        <div class="product-info">
          <p class="mb-2">
            <small class="text-muted">商品數量：</small>
            <span :class="{ 'text-danger': availableStock <= 0 }">
              {{ availableStock <= 0 ? '已售完' : availableStock }}
            </span>
          </p>
        </div>

        <div class="card border-0 bg-light mt-4">
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label">選擇數量</label>
              <QuantitySelector
                v-model="quantity"
                :max="availableStock"
                :disabled="availableStock <= 0"
              />
            </div>
            <div class="d-grid">
              <button
                class="btn btn-primary"
                @click="addToCart"
                :disabled="!product.is_enabled || availableStock <= 0"
              >
                <i class="bi bi-cart-plus me-2"></i>
                {{ availableStock <= 0 ? '暫時售完' : '加入購物車' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div
        class="toast align-items-center text-white border-0"
        :class="toastType"
        role="alert"
        ref="toast"
      >
        <div class="d-flex">
          <div class="toast-body">{{ toastMessage }}</div>
          <button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserProductStore } from '@/stores/userProductStore'
import { useCartStore } from '@/stores/cartStore'
import { Toast } from 'bootstrap'
import QuantitySelector from '@/components/QuantitySelector.vue'

export default {
  name: 'ProductDetail',
  components: {
    QuantitySelector,
  },
  data() {
    return {
      currentImage: '',
      error: '',
      quantity: 1,
      toastMessage: '',
      toastType: 'bg-success',
      product: null,
      isLoading: false,
    }
  },
  methods: {
    async fetchProduct() {
      try {
        const id = this.$route.params.id
        const store = useUserProductStore()
        this.isLoading = true
        await store.getProduct(id)
        this.product = store.currentProduct
        if (this.product) {
          this.currentImage = this.product.imageUrl
          this.product.unit = Number(this.product.unit)
          this.error = ''
        }
      } catch (error) {
        this.error = error.response?.data?.message || '商品載入失敗'
      } finally {
        this.isLoading = false
      }
    },
    async addToCart() {
      try {
        const cartStore = useCartStore()
        const result = await cartStore.addToCart(this.product.id, this.quantity)
        this.showToast(result.message)
        this.quantity = 1
      } catch (error) {
        this.showToast('加入購物車失敗', 'bg-danger')
      }
    },
    showToast(message, type = 'bg-success') {
      this.toastMessage = message
      this.toastType = type
      const toast = new Toast(this.$refs.toast)
      toast.show()
    },
  },
  computed: {
    allImages() {
      if (!this.product) return []
      return [this.product.imageUrl, ...(this.product.imagesUrl || [])]
    },
    availableStock() {
      if (!this.product) return 0
      const cartStore = useCartStore()
      const cartItem = cartStore.cart.carts.find((item) => item.product_id === this.product.id)
      const cartQuantity = cartItem ? cartItem.qty : 0
      return this.product.unit - cartQuantity
    },
  },
  mounted() {
    this.fetchProduct()
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.fetchProduct()
      },
    },
  },
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.price-section {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
}

.toast-container {
  z-index: 1050;
}
</style>
