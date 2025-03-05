<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Iniciar Sesión</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <div class="input-row">
            <label for="username">Usuario:</label>
            <input 
              type="text" 
              id="username" 
              v-model="username" 
              placeholder="Introduce tu usuario"
              required
            >
          </div>
          <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
        </div>
        <div class="form-group">
          <div class="input-row">
            <label for="password">Contraseña:</label>
            <input 
              type="password" 
              id="password" 
              v-model="userPassword" 
              placeholder="Introduce tu contraseña"
              required
            >
          </div>
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>
        <div class="button-group">
          <button type="submit" class="btn-login">Iniciar Sesión</button>
        </div>
        <div class="register-link">
          <p>¿No tienes cuenta? <router-link to="/register">Regístrate</router-link></p>
        </div>
      </form>
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'LoginPage',
  setup() {
    const store = useStore()
    const router = useRouter()
    const username = ref('')
    const userPassword = ref('')
    const error = ref(null)
    const errors = reactive({
      username: '',
      password: ''
    })

    const validateForm = () => {
      let isValid = true
      errors.username = ''
      errors.password = ''

      if (!username.value) {
        errors.username = 'El usuario es requerido'
        isValid = false
      }

      if (!userPassword.value) {
        errors.password = 'La contraseña es requerida'
        isValid = false
      } else if (userPassword.value.length < 8) {
        errors.password = 'La contraseña debe tener al menos 8 caracteres'
        isValid = false
      }

      return isValid
    }

    const handleLogin = async () => {
      error.value = null
      
      if (!validateForm()) {
        return
      }

      const success = await store.dispatch('login', {
        username: username.value,
        userPassword: userPassword.value
      })

      if (success) {
        // Fetch user profile with role information immediately after login
        await store.dispatch('fetchUserProfile')
        router.push('/dashboard')
      } else {
        error.value = 'Error al iniciar sesión. Por favor, verifica tus credenciales.'
      }
    }


    return {
      username,
      userPassword,
      error,
      errors,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.input-row {
  display: flex;
  align-items: center;
}

.input-row label {
  width: 150px;
  text-align: right;
  margin-right: 1rem;
  color: #495057;
}

.input-row input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  margin-left: calc(150px + 1rem);
}

.button-group {
  margin-top: 1.5rem;
}

.btn-login {
  width: 100%;
  padding: 0.75rem;
  background-color: #e4fdff;
  color: #000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-login:hover {
  background-color: #7da9bd;
}

.register-link {
  text-align: center;
  margin-top: 1rem;
}

.register-link a {
  color: #42b983;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
