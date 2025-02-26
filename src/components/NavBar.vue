<template>
  <div>
    <!-- NavBar solo se muestra si está logueado -->
    <nav v-if="isLoggedIn" class="NavBar">
      <router-link to="/" class="NavBar-link">Home</router-link>
      <span class="separator"> | </span>
      <router-link to="/dashboard" class="NavBar-link">Dashboard</router-link>
      
      <!-- Enlaces específicos para profesionales -->
      <template v-if="isProfessional">
        <span class="separator"> | </span>
        <router-link to="/dashboard/statistics" class="NavBar-link">Estadísticas</router-link>
        <span class="separator"> | </span>
        <router-link to="/dashboard/reports" class="NavBar-link">Reportes</router-link>
        <span class="separator"> | </span>
        <router-link to="/dashboard/pending" class="NavBar-link">
          Pendientes
          <span v-if="pendingCount" class="badge">{{ pendingCount }}</span>
        </router-link>
      </template>
      
      <span class="separator"> | </span>
      <router-link to="/profile" class="NavBar-link">Mi Perfil</router-link>
      <span class="separator"> | </span>
      <a href="#" @click.prevent="handleLogout" class="NavBar-link">Logout</a>
    </nav>

    <!-- Navegación simple cuando no está logueado -->
    <nav v-else class="NavBar">
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
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'NavBar',
  setup() {
    const router = useRouter()
    const store = useStore()
    const isLoggedIn = computed(() => store.getters.isLoggedIn)
    const isProfessional = computed(() => store.getters.isProfessional)
    const pendingCount = computed(() => {
      return store.state.pendingReviews?.pending || 0
    })

    const handleLogout = async () => {
      await store.dispatch('logout')
      router.push('/login')
    }

    return {
      isLoggedIn,
      isProfessional,
      pendingCount,
      handleLogout
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
