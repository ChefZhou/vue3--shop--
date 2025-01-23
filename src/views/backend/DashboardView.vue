<template>
  <div class="dashboard">
    <Navbar />
    <div class="container py-4">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'DashboardView',
  components: {
    Navbar,
  },
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background-color: #f8f9fa;
}
</style>
