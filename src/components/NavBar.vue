<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <template v-if="isLoggedIn">
      <router-link to="/dashboard">Dashboard</router-link> |
      <a href="#" @click.prevent="handleLogout">Logout</a>
    </template>
    <template v-else>
      <router-link to="/login">Login</router-link> |
      <router-link to="/register">Register</router-link>
    </template>
  </nav>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'NavBar',
  setup() {
    const store = useStore()
    const router = useRouter()

    const isLoggedIn = computed(() => store.getters.isLoggedIn)

    const handleLogout = async () => {
      await store.dispatch('logout')
      router.push('/login')
    }

    return {
      isLoggedIn,
      handleLogout
    }
  }
}
</script>

<style scoped>
.nav {
  text-align: center;
  padding: 1rem 0;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e0e0e0;
}

.nav a {
  text-decoration: none;
  color: #333;
  margin: 0 1rem;
  padding: 0.5rem 1rem;
  transition: color 0.3s ease;
}

.nav a.active {
  color: #42b983;
  font-weight: bold;
}

.nav a:hover {
  color: #42b983;
}
</style>
