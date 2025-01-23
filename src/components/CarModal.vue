<template>
  <dialog ref="dialog" class="modal fade">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">刪除商品數量</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">要刪除多少數量？（目前數量：{{ item?.qty }}）</label>
            <input
              type="number"
              class="form-control"
              v-model.number="quantity"
              :max="item?.qty - 1"
              min="1"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">取消</button>
          <button type="button" class="btn btn-danger" @click="confirm" :disabled="isLoading">
            {{ isLoading ? '處理中...' : '確認刪除' }}
          </button>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script>
export default {
  name: 'CarModal',
  props: {
    item: {
      type: Object,
      default: null,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      quantity: 1,
    }
  },
  methods: {
    show() {
      this.quantity = 1
      this.$refs.dialog.showModal()
      this.$refs.dialog.classList.add('show')
      document.body.classList.add('modal-open')
    },
    close() {
      this.$refs.dialog.close()
      this.$refs.dialog.classList.remove('show')
      document.body.classList.remove('modal-open')
      this.$emit('close')
    },
    confirm() {
      if (!this.item || !this.quantity) return
      this.$emit('confirm', {
        id: this.item.id,
        productId: this.item.product_id,
        qty: this.quantity,
      })
    },
  },
}
</script>

<style scoped>
dialog {
  padding: 0;
  border: none;
  background: transparent;
}

dialog::backdrop {
  background: rgba(0, 0, 0, 0.5);
}

dialog.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
}

dialog.show {
  display: block;
}
</style>
