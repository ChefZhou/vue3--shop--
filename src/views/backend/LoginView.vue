<template>
  <div class="container mt-5">
    <form class="row justify-content-center" @submit="login">
      <div class="col-md-6">
        <h1 class="h3 mb-3 font-weight-normal">請先登入</h1>
        <div class="mb-2">
          <label for="inputEmail" class="sr-only">Email address</label>
          <input
            type="email"
            id="inputEmail"
            class="form-control"
            placeholder="Email address"
            v-model="username"
            required
            autofocus
          />
        </div>
        <div class="mb-2">
          <label for="inputPassword" class="sr-only">Password</label>
          <input
            type="password"
            id="inputPassword"
            class="form-control"
            placeholder="Password"
            v-model="password"
            required
          />
        </div>

        <div class="text-end mt-4">
          <button class="btn btn-lg btn-primary btn-block" type="submit" :disabled="isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
            {{ isLoading ? '登入中...' : '登入' }}
          </button>
        </div>
      </div>
    </form>
  </div>

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
        <div class="toast-body text-center px-4">{{ toastMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'
import Toast from 'bootstrap/js/dist/toast'

export default {
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      username: '',
      password: '',
      isLoading: false,
      toast: null,
      toastMessage: '',
      toastType: 'bg-success',
    }
  },
  methods: {
    showToast(message, type = 'success') {
      this.toastMessage = message
      this.toastType = `bg-${type}`
      this.toast.show()
    },
    async login(event) {
      event.preventDefault()
      if (!this.validateForm()) {
        return
      }

      this.isLoading = true
      try {
        await this.authStore.login(this.username, this.password)
      } catch (error) {
        this.showToast(error.response?.data?.message || '登入失敗，請檢查帳號密碼', 'danger')
        this.password = ''
      } finally {
        this.isLoading = false
      }
    },
    validateForm() {
      if (!this.username || !this.password) {
        this.showToast('請填寫完整的登入資訊', 'danger')
        return false
      }
      if (!this.validateEmail(this.username)) {
        this.showToast('請輸入有效的 Email 格式', 'danger')
        return false
      }
      return true
    },
    validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    },
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
