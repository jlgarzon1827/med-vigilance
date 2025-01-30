<template>
  <div class="register">
    <h2>Register</h2>
    <form @submit.prevent="handleRegister">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required>
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="userPassword" required>
      </div>
      <div>
        <label for="confirmPassword">Confirm Password:</label>
        <input type="password" id="confirmPassword" v-model="confirmUserPassword" required>
      </div>
      <button type="submit">Register</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'RegisterPage',
  data() {
    return {
      username: '',
      email: '',
      userPassword: '',
      confirmUserPassword: '',
      error: null
    }
  },
  methods: {
    ...mapActions(['register']),
    async handleRegister() {
      this.error = null
      if (this.userPassword !== this.confirmUserPassword) {
        this.error = 'Passwords do not match'
        return
      }
      const success = await this.register({
        username: this.username,
        email: this.email,
        userPassword: this.userPassword
      })
      if (success) {
        this.$router.push('/login')
      } else {
        this.error = 'Registration failed. Please try again.'
      }
    }
  }
}
</script>
