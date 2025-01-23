import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../views/front/HomePageView.vue'),
    },
    {
      path: '/login',
      component: () => import('../views/backend/LoginView.vue'),
    },
    {
      path: '/user-products',
      component: () => import('../views/front/UserProductsView.vue'),
    },
    {
      path: '/product/:id',
      name: 'ProductDetail',
      component: () => import('../views/front/ProductDetailView.vue'),
    },
    {
      path: '/cart',
      name: 'Cart',
      component: () => import('@/views/front/CartView.vue'),
    },
    {
      path: '/checkout/:orderId',
      name: 'Checkout',
      component: () => import('../views/front/CheckOutView.vue'),
    },
    {
      path: '/dashboard',
      component: () => import('../views/backend/DashboardView.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'products',
          component: () => import('../views/backend/ProductsView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'orders',
          component: () => import('../views/backend/OrdersView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'coupons',
          component: () => import('../views/backend/CouponsView.vue'),
          meta: { requiresAuth: true },
        },
      ],
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // 檢查路由是否需要驗證
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  try {
    // 如果已登入要去登入頁，直接轉到產品管理
    if (to.path === '/login' && authStore.isLoggedIn) {
      return next('/dashboard/products')
    }

    // 需要驗證的路由
    if (requiresAuth) {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1')

      if (!token || token === 'undefined' || token === 'null') {
        await authStore.logout()
        return next('/login')
      }

      const isAuthenticated = await authStore.checkAuth()
      if (!isAuthenticated) {
        await authStore.logout()
        return next('/login')
      }
    }

    next()
  } catch (error) {
    console.error('路由驗證錯誤：', error)
    if (requiresAuth) {
      await authStore.logout()
      next('/login')
    } else {
      next()
    }
  }
})

export default router
