<template>
  <div class="register-container">
    <div class="register-card">
      <h2>Registro</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <div class="input-row">
            <label for="username">Usuario:</label>
            <input 
              type="text" 
              id="username" 
              v-model="username" 
              placeholder="Introduce tu nombre de usuario"
              required
            >
          </div>
          <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
        </div>
        <div class="form-group">
          <div class="input-row">
            <label for="email">Email:</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              placeholder="Introduce tu email"
              required
            >
          </div>
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
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
        <div class="form-group">
          <div class="input-row">
            <label for="confirmPassword">Confirmar Contraseña:</label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="confirmUserPassword" 
              placeholder="Confirma tu contraseña"
              required
            >
          </div>
          <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
        </div>
        <div class="button-group">
          <button type="submit" class="btn-register">Registrarse</button>
        </div>
        <div class="login-link">
          <p>¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link></p>
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
  name: 'RegisterPage',
  setup() {
    const store = useStore()
    const router = useRouter()
    const username = ref('')
    const email = ref('')
    const userPassword = ref('')
    const confirmUserPassword = ref('')
    const error = ref(null)
    const errors = reactive({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })

    const validateForm = () => {
      let isValid = true
      errors.username = ''
      errors.email = ''
      errors.password = ''
      errors.confirmPassword = ''

      if (!username.value) {
        errors.username = 'El usuario es requerido'
        isValid = false
      }

      if (!email.value) {
        errors.email = 'El email es requerido'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        errors.email = 'El email no es válido'
        isValid = false
      }

      if (!userPassword.value) {
        errors.password = 'La contraseña es requerida'
        isValid = false
      } else if (userPassword.value.length < 8) {
        errors.password = 'La contraseña debe tener al menos 8 caracteres'
        isValid = false
      }

      if (!confirmUserPassword.value) {
        errors.confirmPassword = 'Confirma tu contraseña'
        isValid = false
      } else if (userPassword.value !== confirmUserPassword.value) {
        errors.confirmPassword = 'Las contraseñas no coinciden'
        isValid = false
      }

      return isValid
    }

    const handleRegister = async () => {
      error.value = null
      
      if (!validateForm()) {
        return
      }

      const success = await store.dispatch('register', {
        username: username.value,
        email: email.value,
        userPassword: userPassword.value
      })

      if (success) {
        router.push('/login')
      } else {
        error.value = 'Error en el registro. Por favor, inténtalo de nuevo.'
      }
    }

    return {
      username,
      email,
      userPassword,
      confirmUserPassword,
      error,
      errors,
      handleRegister
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.register-card {
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

.btn-register {
  width: 100%;
  padding: 0.75rem;
  background-color: #e4fdff;
  color: #000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-register:hover {
  background-color: #7da9bd;
}

.login-link {
  text-align: center;
  margin-top: 1rem;
}

.login-link a {
  color: #42b983;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
