<template>
  <div>
    <!-- NavBar solo se muestra si está logueado y NO está en data-protection -->
    <nav v-if="showNavBar" class="NavBar">
      <router-link to="/" class="NavBar-link">Home</router-link>
      <span class="separator"> | </span>
      <router-link to="/dashboard" class="NavBar-link">Dashboard</router-link>
      
      <!-- Enlaces específicos para administradores -->
      <template v-if="isAdmin">
        <span class="separator"> | </span>
        <router-link to="/admin" class="NavBar-link">Panel de Administración</router-link>
      </template>

      <!-- Enlaces específicos para supervisores -->
      <template v-if="isSupervisor">
        <span class="separator"> | </span>
        <router-link to="/dashboard/statistics" class="NavBar-link">Estadísticas</router-link>
        <span class="separator"> | </span>
        <router-link to="/dashboard/trends" class="NavBar-link">Tendencias</router-link>
      </template>
      
      <!-- Enlaces específicos para profesionales -->
      <template v-if="isProfessional">
        <span class="separator"> | </span>
        <router-link to="/dashboard/reports" class="NavBar-link">Reportes</router-link>
        <span class="separator"> | </span>
        <router-link to="/dashboard/pending" class="NavBar-link">
          Pendientes
          <span v-if="pendingCount" class="badge">{{ pendingCount }}</span>
        </router-link>
      </template>
      
      <!-- Enlaces específicos para pacientes -->
      <template v-if="isPatient">
        <span class="separator"> | </span>
        <router-link to="/dashboard/report-adverse" class="NavBar-link">Reportar Efecto Adverso</router-link>
        <span class="separator"> | </span>
        <router-link to="/dashboard/my-reports" class="NavBar-link">Mis Reportes</router-link>
      </template>
      
      <span class="separator"> | </span>
      <router-link to="/profile" class="NavBar-link">Mi Perfil</router-link>
      <span class="separator"> | </span>
      <a href="#" @click.prevent="handleLogout" class="NavBar-link">Logout</a>
    </nav>

    <!-- NavBar simple si no está logueado y NO está en data-protection -->
    <nav v-else-if="showNonLoggedNav" class="NavBar">
      <router-link to="/" class="NavBar-link">Home</router-link>
      <span class="separator"> | </span>
      <router-link to="/login" class="NavBar-link">Login</router-link>
      <span class="separator"> | </span>
      <router-link to="/register" class="NavBar-link">Registro</router-link>
    </nav>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'NavBar',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    
    const isLoggedIn = computed(() => store.getters.isLoggedIn)
    const isProfessional = computed(() => store.getters.isProfessional)
    const isSupervisor = computed(() => store.getters.isSupervisor)
    const isAdmin = computed(() => store.getters.isAdmin)
    const isPatient = computed(() => store.getters.isPatient)
    const pendingCount = computed(() => {
      return store.state.pendingReviews?.pending || 0
    })

    // Nombre de la ruta actual
    const currentRouteName = computed(() => route.name)

    // NavBar logueado solo si no está en la page de data protection
    const showNavBar = computed(() => {
      return isLoggedIn.value && currentRouteName.value !== 'DataProtection'
    })

    // NavBar no logueado solo si no está en la page de data protection
    const showNonLoggedNav = computed(() => {
      return !isLoggedIn.value && currentRouteName.value !== 'DataProtection'
    })

    const handleLogout = async () => {
      await store.dispatch('logout')
      router.push('/login')
    }

    return {
      isLoggedIn,
      isProfessional,
      isSupervisor,
      isAdmin,
      isPatient,
      pendingCount,
      handleLogout,
      showNavBar,
      showNonLoggedNav
    }
  }
}
</script>

<style scoped>
.NavBar {
  text-align: center;
  padding: 1rem 0;
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
}

.NavBar-link {
  text-decoration: none;
  color: #2c3e50;
  padding: 0.5rem;
}

.separator {
  color: #2c3e50;
  margin: 0 0.5rem;
}

.router-link-active {
  color: #42b983;
  font-weight: bold;
}

.NavBar-link:hover {
  color: #42b983;
}

.badge {
  display: inline-block;
  background-color: #dc3545;
  color: white;
  font-size: 0.75rem;
  padding: 0.1rem 0.4rem;
  border-radius: 10px;
  margin-left: 5px;
}
</style>
