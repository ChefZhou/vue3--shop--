<template>
  <div class="layout-container">
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom fixed-top">
      <div class="container">
        <router-link to="/" class="navbar-brand">
          <i class="bi bi-shop me-2"></i>Vue Shop
        </router-link>

        <div class="d-flex align-items-center">
          <CartDropdown />
        </div>
      </div>
    </nav>

    <main class="main-content">
      <slot></slot>
    </main>
  </div>
</template>

<script>
import CartDropdown from '../components/CartDropdown.vue'

export default {
  name: 'MainLayout',
  components: {
    CartDropdown,
  },
}
</script>

<style scoped>
.layout-container {
  padding-top: 56px;
}

.main-content {
  min-height: calc(100vh - 56px);
}
</style>
