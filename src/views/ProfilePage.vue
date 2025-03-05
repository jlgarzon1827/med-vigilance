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
    
    const isProfessional = computed(() => {
      return userProfile.value?.profile?.user_type === 'PROFESSIONAL'
    })
    
    const userRoleDisplay = computed(() => {
      return isProfessional.value ? 'Profesional de la salud' : 'Paciente'
    })
    
    const userRoleClass = computed(() => {
      return isProfessional.value ? 'professional' : 'patient'
    })

    onMounted(() => {
      store.dispatch('fetchUserProfile')
    })

    return {
      userProfile,
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
  font-size: 1rem;
}

h3 {
  margin-top: 2rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 0.5rem;
}

.role-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
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
