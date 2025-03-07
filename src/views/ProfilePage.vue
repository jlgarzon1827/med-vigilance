<template>
  <div class="profile">
    <h1>Mi Perfil</h1>
    <div class="profile-content">
      <div class="profile-card">
        <h2>Información Personal</h2>
        <div class="form-group">
          <label>Nombre de usuario:</label>
          <span class="profile-data">{{ userProfile?.username }}</span>
        </div>
        <div class="form-group">
          <label>Email:</label>
          <span class="profile-data">{{ userProfile?.email }}</span>
        </div>
        <div class="form-group">
          <label>Tipo de usuario:</label>
          <span class="profile-data">
            <span class="role-badge" :class="userRoleClass">
              {{ userRoleDisplay }}
            </span>
          </span>
        </div>

        <!-- Información específica para profesionales -->
        <template v-if="isProfessional">
          <h3>Información Profesional</h3>
          <div class="form-group">
            <label>ID Profesional:</label>
            <span class="profile-data">{{ userProfile?.profile?.professional_id }}</span>
          </div>
          <div class="form-group">
            <label>Especialidad:</label>
            <span class="profile-data">{{ userProfile?.profile?.specialty }}</span>
          </div>
          <div class="form-group">
            <label>Institución:</label>
            <span class="profile-data">{{ userProfile?.profile?.institution }}</span>
          </div>
        </template>

        <!-- Información específica para administradores -->
        <template v-if="isAdmin || isSupervisor">
          <h3>Información de Gestión</h3>
          <p>{{ isAdmin ? 'Tienes acceso al panel de administración.' : 'Tienes acceso a supervisión de reportes.' }}</p>
        </template>

      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ProfilePage',
  setup() {
    const store = useStore()
    const userProfile = computed(() => store.state.userProfile)

    const isAdmin = computed(() => {
      return userProfile.value?.profile?.user_type === 'ADMIN'
    })

    const isSupervisor = computed(() => {
      return userProfile.value?.profile?.user_type === 'SUPERVISOR'
    })

    const isProfessional = computed(() => {
      return userProfile.value?.profile?.user_type === 'PROFESSIONAL'
    })

    const userRoleDisplay = computed(() => {
      if (isAdmin.value) return 'Administrador del sistema'
      if (isSupervisor.value) return 'Supervisor'
      if (isProfessional.value) return 'Profesional de la salud'
      return 'Paciente'
    })

    const userRoleClass = computed(() => {
      if (isAdmin.value) return 'admin'
      if (isSupervisor.value) return 'supervisor'
      if (isProfessional.value) return 'professional'
      return 'patient'
    })

    onMounted(() => {
      store.dispatch('fetchUserProfile')
    })

    return {
      userProfile,
      isAdmin,
      isSupervisor,
      isProfessional,
      userRoleDisplay,
      userRoleClass
    }
  }
}
</script>

<style scoped>
.profile {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-content {
  margin-top: 2rem;
}

.profile-card {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
}

.form-group label {
  width: 150px;
  text-align: right;
  margin-right: 1rem;
  color: #495057;
}

.profile-data {
  flex: 1;
  padding: 0.5rem;
  color: #2c3e50;
}

.role-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.role-badge.admin {
  background-color: #f8d7da;
  color: #721c24;
}

.role-badge.supervisor {
  background-color: #fff3cd;
  color: #856404;
}

.role-badge.professional {
  background-color: #d1e7dd;
  color: #0f5132;
}

.role-badge.patient {
  background-color: #cfe2ff;
  color: #084298;
}
</style>
