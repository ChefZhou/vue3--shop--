<template>
  <div class="checkout-view container">
    <div class="my-5 row justify-content-center">
      <div class="col-md-6" v-if="order">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2>訂單資訊</h2>
          <span class="badge" :class="order.is_paid ? 'bg-success' : 'bg-warning'">
            {{ order.is_paid ? '已付款' : '未付款' }}
          </span>
        </div>

        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">訂單明細</h5>
          </div>
          <div class="card-body">
            <table class="table align-middle">
              <thead>
                <tr>
                  <th>商品</th>
                  <th>數量</th>
                  <th class="text-end">小計</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in order.products" :key="item.id">
                  <td>{{ item.product?.title || '商品已不存在' }}</td>
                  <td>{{ item.qty }}</td>
                  <td class="text-end">NT$ {{ item.total?.toLocaleString() || 0 }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" class="text-end">小計</td>
                  <td class="text-end">NT$ {{ order.total?.toLocaleString() || 0 }}</td>
                </tr>
                <tr v-if="order.total !== order.final_total">
                  <td colspan="2" class="text-end text-success">優惠折扣</td>
                  <td class="text-end text-success">
                    -NT$ {{ (order.total - order.final_total)?.toLocaleString() || 0 }}
                  </td>
                </tr>
                <tr>
                  <td colspan="2" class="text-end fw-bold">結帳金額</td>
                  <td class="text-end fw-bold">
                    NT$ {{ order.final_total?.toLocaleString() || 0 }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">收件資訊</h5>
          </div>
          <div class="card-body">
            <table class="table">
              <tbody>
                <tr>
                  <th>訂單編號</th>
                  <td>{{ order.id }}</td>
                </tr>
                <tr>
                  <th>付款方式</th>
                  <td>{{ order.payment_method }}</td>
                </tr>
                <tr>
                  <th>姓名</th>
                  <td>{{ order.user.name }}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{{ order.user.email }}</td>
                </tr>
                <tr>
                  <th>電話</th>
                  <td>{{ order.user.tel }}</td>
                </tr>
                <tr>
                  <th>地址</th>
                  <td>{{ order.user.address }}</td>
                </tr>
                <tr>
                  <th>留言</th>
                  <td>{{ order.message }}</td>
                </tr>
              </tbody>
            </table>

            <div class="text-end">
              <button
                class="btn btn-danger"
                @click="handlePayment"
                :disabled="order.is_paid || isLoading"
              >
                {{ isLoading ? '處理中...' : order.is_paid ? '已完成付款' : '確認付款' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="col-md-6 text-center">
        <div class="spinner-border" role="status" v-if="isLoading">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useOrderStore } from '@/stores/order'

export default {
  name: 'CheckOutView',

  data() {
    return {
      orderStore: null,
      order: null,
      isLoading: false,
    }
  },

  async created() {
    this.orderStore = useOrderStore()
    const orderId = this.$route.params.orderId
    if (orderId) {
      await this.getOrder(orderId)
    }
  },

  methods: {
    async getOrder(orderId) {
      this.isLoading = true
      try {
        const result = await this.orderStore.getOrderById(orderId)
        const processedProducts = Object.entries(result.products || {}).map(([id, item]) => ({
          id,
          ...item,
          total: parseInt(item.price || 0) * parseInt(item.qty || 0),
        }))

        this.order = {
          ...result,
          products: processedProducts,
          total: parseInt(result.total || 0),
          final_total: parseInt(result.final_total || 0),
          payment_method: result.payment_method || '尚未選擇',
          user: {
            name: result.user?.name || '',
            email: result.user?.email || '',
            tel: result.user?.tel || '',
            address: result.user?.address || '',
          },
        }
      } catch (error) {
        this.$toast?.error('載入訂單失敗')
      } finally {
        this.isLoading = false
      }
    },

    async handlePayment() {
      if (!this.order || this.order.is_paid || this.isLoading) return

      try {
        this.isLoading = true
        const result = await this.orderStore.payOrder(this.order.id)
        if (result.success) {
          this.order.is_paid = true
          this.$toast?.success('付款成功！')
          await this.getOrder(this.order.id)
        }
      } catch {
        this.$toast?.error('付款失敗，請稍後再試')
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>

<style scoped>
.checkout-view {
  margin-top: 2rem;
}

.card {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.badge {
  padding: 0.5em 1em;
}
</style>
