<template>
  <MainLayout>
    <RouterView />
  </MainLayout>
</template>

<script>
import MainLayout from '@/layouts/MainLayout.vue'

export default {
  name: 'App',
  components: {
    MainLayout,
  },
}
</script>

<style lang="scss">
@import '@/assets/all.scss';

body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
