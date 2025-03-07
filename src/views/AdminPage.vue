<template>
  <div class="admin-container">
    <div class="admin-card">
      <h2>Gestión de Usuarios</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre de Usuario</th>
            <th>Rol Actual</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.username }}</td>
            <td>{{ user.user_type }}</td>
            <td>
              <select v-model="user.newRole" @change="updateRole(user)">
                <option value="ADMIN">Admin</option>
                <option value="SUPERVISOR">Supervisor</option>
                <option value="PROFESSIONAL">Profesional</option>
                <option value="PATIENT">Paciente</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'AdminPage',
  setup() {
    const store = useStore()
    const users = ref([])
    const error = ref(null)

    const fetchUsers = async () => {
      try {
        const response = await store.dispatch('fetchUsers')
        users.value = response.data.map(user => ({ ...user, newRole: user.user_type }))
      } catch (e) {
        error.value = 'Error al cargar usuarios'
      }
    }

    const updateRole = async (user) => {
      try {
        await store.dispatch('updateUserRole', {
          userId: user.id,
          newRole: user.newRole
        })
      } catch (e) {
        error.value = 'Error al actualizar rol'
      }
    }

    fetchUsers()

    return {
      users,
      error,
      updateRole
    }
  }
}
</script>

<style scoped>
.admin-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.admin-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 800px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 0.5rem;
}

th {
  background-color: #f0f0f0;
}
</style>