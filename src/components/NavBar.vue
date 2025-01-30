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
nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  margin-right: 10px;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
