<template>
  <div class="modal fade" id="couponModal" tabindex="-1" ref="modal">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ isNew ? '新增優惠券' : '編輯優惠券' }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="title" class="form-label">標題<span class="text-danger">*</span></label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.title }"
              id="title"
              v-model="tempCoupon.title"
            />
            <div class="invalid-feedback">{{ errors.title }}</div>
          </div>
          <div class="mb-3">
            <label for="code" class="form-label">優惠碼<span class="text-danger">*</span></label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.code }"
              id="code"
              v-model="tempCoupon.code"
            />
            <div class="invalid-feedback">{{ errors.code }}</div>
          </div>
          <div class="mb-3">
            <label for="percent" class="form-label"
              >折扣百分比<span class="text-danger">*</span></label
            >
            <input
              type="number"
              class="form-control"
              :class="{ 'is-invalid': errors.percent }"
              id="percent"
              v-model.number="tempCoupon.percent"
            />
            <div class="invalid-feedback">{{ errors.percent }}</div>
          </div>
          <div class="mb-3">
            <label for="due_date" class="form-label">到期日期</label>
            <input type="date" class="form-control" id="due_date" v-model="date" />
          </div>
          <div class="mb-3">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                id="is_enabled"
                v-model="tempCoupon.is_enabled"
              />
              <label class="form-check-label" for="is_enabled">是否啟用</label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" @click="submit">確認</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'
import { useCouponStore } from '../stores/CouponStore'

export default {
  name: 'CouponModal',
  data() {
    const defaultCoupon = {
      title: '',
      code: '',
      percent: 0,
      due_date: Math.floor(Date.now() / 1000),
      is_enabled: 0,
    }

    return {
      store: useCouponStore(),
      modalInstance: null,
      isNew: true,
      tempCoupon: { ...defaultCoupon },
      errors: {},
      defaultCoupon,
    }
  },
  computed: {
    date: {
      get() {
        return new Date(this.tempCoupon.due_date * 1000).toISOString().split('T')[0]
      },
      set(value) {
        this.tempCoupon.due_date = Math.floor(new Date(value).getTime() / 1000)
      },
    },
  },
  mounted() {
    this.modalInstance = new Modal(this.$refs.modal)
  },
  methods: {
    validateForm() {
      const validations = {
        title: () => {
          if (!this.tempCoupon.title) return '標題為必填'
          return true
        },
        code: () => {
          if (!this.tempCoupon.code) return '優惠碼為必填'
          return true
        },
        percent: () => {
          const percent = Number(this.tempCoupon.percent)
          if (!percent) return '折扣率為必填'
          if (percent <= 0 || percent > 100) return '折扣率必須在 1-100 之間'
          return true
        },
      }

      this.errors = {}
      let isValid = true

      Object.entries(validations).forEach(([key, validate]) => {
        const result = validate()
        if (result !== true) {
          this.errors[key] = result
          isValid = false
        }
      })

      return isValid
    },
    async submit() {
      if (!this.validateForm()) return

      try {
        const submitData = {
          ...this.tempCoupon,
          is_enabled: this.tempCoupon.is_enabled ? 1 : 0,
          percent: Number(this.tempCoupon.percent),
          due_date: Math.floor(new Date(this.date).getTime() / 1000),
        }

        const res = await (this.isNew
          ? this.store.createCoupon(submitData)
          : this.store.updateCoupon(submitData))

        if (res.success) {
          this.modalInstance.hide()
          this.$emit('update-success', this.isNew ? '新增' : '更新')
        } else {
          this.$emit('update-failed', res.message || '操作失敗')
        }
      } catch (error) {
        this.$emit('update-failed', '系統錯誤，請稍後再試')
      }
    },
    openModal(item) {
      this.tempCoupon = item ? { ...item } : { ...this.defaultCoupon }
      this.isNew = !item
      this.modalInstance.show()
    },
  },
}
</script>
