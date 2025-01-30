<template>
  <div class="login">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="userPassword" required>
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      userPassword: '',
      error: null
    }
  },
  methods: {
    ...mapActions(['login']),
    async handleLogin() {
      this.error = null
      console.log("user: %s", this.username)
      const success = await this.login({
        username: this.username,
        userPassword: this.userPassword
      })
      if (success) {
        this.$router.push('/dashboard')
      } else {
        this.error = 'Login failed. Please check your credentials.'
      }
    }
  }
}
</script>
