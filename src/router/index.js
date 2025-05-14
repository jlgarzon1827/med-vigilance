import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import DataProtectionPage from '../views/DataProtectionPage.vue'
import DashboardPage from '../views/DashboardPage.vue'
import ProfilePage from '../views/ProfilePage.vue'
import AdminPage from '../views/AdminPage.vue'
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
    path: '/data-protection',
    name: 'DataProtection',
    component: DataProtectionPage
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
  // Rutas protegidas para administradores
  {
    path: '/admin',
    name: 'AdminPage',
    component: AdminPage,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  // Rutas protegidas para supervisores
  {
      path: '/supervisor-dashboard',
      name: 'SupervisorDashboard',
      component: () => import('@/components/dashboard/SupervisorDashboard.vue'),
      meta: { requiresAuth: true, requiresSupervisor: true }
  },
  {
    path: '/dashboard/trends',
    name: 'TrendsPanel',
    component: () => import('@/components/dashboard/TrendsPanel.vue'),
    meta: { requiresAuth: true, requiresSupervisor: true }
},
  // Rutas protegidas para profesionales
  {
    path: '/dashboard/statistics',
    name: 'Statistics',
    component: () => import('@/components/dashboard/StatisticsPanel.vue'),
    meta: { requiresAuth: true, requiresSupervisor: true }
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
  const isAdmin = store.getters.isAdmin
  const isSupervisor = store.getters.isSupervisor
  const isProfessional = store.getters.isProfessional

  // Verificar si la ruta requiere autenticación
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLoggedIn) {
      next('/login')
      return
    }

    // Verificar permisos específicos para administradores
    if (to.matched.some(record => record.meta.requiresAdmin) && !isAdmin) {
      next('/dashboard')
      return
    }

    // Verificar permisos específicos para supervisores
    if (to.matched.some(record => record.meta.requiresSupervisor) && !isSupervisor) {
      next('/dashboard')
      return
    }

    // Verificar permisos específicos para profesionales o roles superiores (supervisores o administradores)
    if (
      to.matched.some(record => record.meta.requiresProfessionalOrSupervisorOrAdmin) &&
      !(isProfessional || isSupervisor || isAdmin)
    ) {
      next('/dashboard')
      return
    }

    next()
  } else {
    next()
  }
})

export default router
