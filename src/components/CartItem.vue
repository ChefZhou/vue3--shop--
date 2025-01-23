<template>
  <div class="cart-item border-bottom py-3">
    <div class="row align-items-center">
      <div class="col-auto">
        <img
          :src="item.product.imageUrl"
          :alt="item.product.title"
          class="rounded"
          style="width: 80px; height: 80px; object-fit: cover"
        />
      </div>
      <div class="col">
        <h6 class="mb-1">{{ item.product.title }}</h6>
        <div class="d-flex justify-content-between align-items-center">
          <div class="quantity-wrapper" style="width: 120px">
            <QuantitySelector
              v-model:value="quantity"
              :max="item.product.num"
              @update:value="updateQuantity"
            />
          </div>
          <div class="text-end">
            <del class="text-muted small">NT$ {{ item.product.origin_price }}</del>
            <div class="text-danger">NT$ {{ item.product.price }}</div>
          </div>
        </div>
      </div>
      <div class="col-auto">
        <button class="btn btn-link text-danger" @click="removeItem">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import QuantitySelector from './QuantitySelector.vue'

export default {
  name: 'CartItem',
  components: {
    QuantitySelector,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      quantity: this.item.qty,
    }
  },
  methods: {
    updateQuantity(value) {
      this.$emit('update-qty', {
        id: this.item.id,
        productId: this.item.product_id,
        qty: value,
      })
    },
    removeItem() {
      if (confirm('確定要移除此商品嗎？')) {
        this.$emit('remove-item', this.item.id)
      }
    },
  },
  watch: {
    'item.qty'(newVal) {
      this.quantity = newVal
    },
  },
}
</script>
