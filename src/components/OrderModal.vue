<template>
  <div class="modal fade" ref="modal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">訂單詳情</h5>
          <button type="button" class="btn-close" @click="hideModal"></button>
        </div>
        <div class="modal-body" v-if="tempOrder.id">
          <div class="row mb-3">
            <div class="col-md-6">
              <p><strong>訂單編號：</strong> {{ tempOrder.num }}</p>
              <p><strong>下單時間：</strong> {{ formatDate(tempOrder.create_at) }}</p>
              <p><strong>付款狀態：</strong> {{ tempOrder.is_paid ? '已付款' : '未付款' }}</p>
              <p v-if="tempOrder.paid_date">
                <strong>付款時間：</strong> {{ formatDate(tempOrder.paid_date) }}
              </p>
            </div>
            <div class="col-md-6">
              <p><strong>購買者：</strong> {{ tempOrder.user.name }}</p>
              <p><strong>Email：</strong> {{ tempOrder.user.email }}</p>
              <p><strong>電話：</strong> {{ tempOrder.user.tel }}</p>
              <p><strong>地址：</strong> {{ tempOrder.user.address }}</p>
            </div>
          </div>
          <p><strong>留言：</strong> {{ tempOrder.message }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger me-2" @click="deleteOrderItem">
            刪除訂單
          </button>
          <button
            type="button"
            class="btn"
            :class="tempOrder.is_paid ? 'btn-danger' : 'btn-primary'"
            @click="togglePaidStatus"
          >
            {{ tempOrder.is_paid ? '標記為未付款' : '標記為已付款' }}
          </button>
          <button type="button" class="btn btn-secondary" @click="hideModal">關閉</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'
import { useOrdersStore } from '@/stores/orderStore'

export default {
  name: 'OrderModal',
  emits: ['update-success', 'update-error'],
  data() {
    return {
      modal: null,
      tempOrder: {},
      store: useOrdersStore(),
    }
  },
  methods: {
    formatDate(timestamp) {
      return new Date(timestamp * 1000).toLocaleDateString()
    },
    showModal(item) {
      this.tempOrder = { ...item }
      this.modal.show()
    },
    hideModal() {
      this.modal.hide()
    },
    async togglePaidStatus() {
      try {
        const updatedOrder = {
          ...this.tempOrder,
          is_paid: !this.tempOrder.is_paid,
          paid_date: !this.tempOrder.is_paid ? Math.floor(Date.now() / 1000) : null,
        }
        const res = await this.store.updateOrder(this.tempOrder.id, updatedOrder)
        if (res.success) {
          this.hideModal()
          this.$emit('update-success', `訂單${this.tempOrder.is_paid ? '取消付款' : '付款'}成功`)
        }
      } catch (error) {
        this.$emit('update-error', error.message || '更新失敗')
      }
    },
    async deleteOrderItem() {
      try {
        if (confirm('確定要刪除此訂單嗎？')) {
          const res = await this.store.deleteOrder(this.tempOrder.id)
          if (res.success) {
            this.hideModal()
            this.$emit('update-success', res.message)
          }
        }
      } catch (error) {
        this.$emit('update-error', error.message || '刪除失敗')
      }
    },
  },
  mounted() {
    this.modal = new Modal(this.$refs.modal)
  },
  beforeUnmount() {
    if (this.modal) {
      this.modal.dispose()
    }
  },
}
</script>
