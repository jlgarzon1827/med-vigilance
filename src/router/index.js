import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import DashboardPage from '../views/DashboardPage.vue'
import ProfilePage from '../views/ProfilePage.vue'
import store from '../store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: { requiresAuth: true }
  },
  // Rutas protegidas para profesionales
  {
    path: '/dashboard/statistics',
    name: 'Statistics',
    component: () => import('@/components/dashboard/StatisticsPanel.vue'),
    meta: { requiresAuth: true, requiresProfessional: true }
  },
  {
    path: '/dashboard/reports',
    name: 'Reports',
    component: () => import('@/components/dashboard/ReportsList.vue'),
    meta: { requiresAuth: true, requiresProfessional: true }
  },
  {
    path: '/dashboard/pending',
    name: 'PendingReviews',
    component: () => import('@/components/dashboard/PendingReviews.vue'),
    meta: { requiresAuth: true, requiresProfessional: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters.isLoggedIn
  const isProfessional = store.getters.isProfessional
  
  // Verificar si la ruta requiere autenticación
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLoggedIn) {
      next('/login')
    } else if (to.matched.some(record => record.meta.requiresProfessional) && !isProfessional) {
      // Si la ruta requiere ser profesional y el usuario no lo es
      next('/dashboard')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
