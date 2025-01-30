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

    onMounted(() => {
      store.dispatch('fetchUserProfile')
    })

    return {
      userProfile
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
</style>
