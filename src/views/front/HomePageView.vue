<template>
  <div class="container-fluid bg-light min-vh-100">
    <div class="row min-vh-100 align-items-center justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow-lg">
          <div class="card-body text-center p-5">
            <h1 class="display-5 mb-4">歡迎光臨購物網站</h1>
            <div class="d-grid gap-3">
              <router-link to="/login" class="btn btn-primary btn-lg">
                <i class="bi bi-person-circle me-2"></i>員工登入
              </router-link>
              <router-link to="/user-products" class="btn btn-success btn-lg">
                <i class="bi bi-cart-fill me-2"></i>立即購物
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePageView',
  data() {
    return {
      title: '歡迎光臨購物網站',
    }
  },
}
</script>

<style scoped>
.card {
  border: none;
  border-radius: 1rem;
}

.btn {
  transition: transform 0.2s;
}

.btn:hover {
  transform: translateY(-2px);
}
</style>
