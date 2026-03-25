import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { isAuthenticated } from '../utils/storage'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, _from, next) => {
  const authenticated = isAuthenticated()
  const requiresAuth = to.meta.requiresAuth as boolean | undefined

  if (requiresAuth && !authenticated) {
    next('/')
  } else if (!requiresAuth && authenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
