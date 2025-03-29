<template>
  <div class="admin-container">
    <div class="admin-card">
      <h2>Panel de Administración</h2>
      <div class="tabs">
        <button @click="activeTab = 'users'" :class="{ active: activeTab === 'users' }">Usuarios</button>
        <button @click="activeTab = 'institutions'" :class="{ active: activeTab === 'institutions' }">Instituciones</button>
      </div>

      <div v-if="activeTab === 'users'">
        <h3>Gestión de Usuarios</h3>
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

      <div v-if="activeTab === 'institutions'">
        <h3>Gestión de Instituciones</h3>
        <table>
          <thead>
            <tr>
              <th>Nombre de la Institución</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="institution in institutions" :key="institution.id">
              <td>{{ institution.name }}</td>
              <td>{{ institution.address }}</td>
              <td>
                <button @click="editInstitution(institution)">Editar</button>
                <button @click="deleteInstitution(institution)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>

        <button @click="createInstitution">Crear Institución</button>
      </div>
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
    const institutions = ref([])
    const activeTab = ref('users')
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

    const fetchInstitutions = async () => {
      try {
        const response = await store.dispatch('fetchInstitutions')
        institutions.value = response.data
      } catch (e) {
        error.value = 'Error al cargar instituciones'
      }
    }

    const createInstitution = async () => {
      const formData = {
        name: prompt('Ingrese el nombre de la institución'),
        address: prompt('Ingrese la dirección de la institución')
      }
      try {
        await store.dispatch('createInstitution', formData)
        await fetchInstitutions()
      } catch (e) {
        error.value = 'Error al crear institución'
      }
    }

    const editInstitution = async (institution) => {
      const formData = {
        name: prompt('Ingrese el nuevo nombre de la institución', institution.name),
        address: prompt('Ingrese la nueva dirección de la institución', institution.address)
      }
      try {
        await store.dispatch('updateInstitution', { id: institution.id, ...formData })
        await fetchInstitutions()
      } catch (e) {
        error.value = 'Error al editar institución'
      }
    }

    const deleteInstitution = async (institution) => {
      try {
        await store.dispatch('deleteInstitution', institution.id)
        await fetchInstitutions()
      } catch (e) {
        error.value = 'Error al eliminar institución'
      }
    }

    fetchUsers()
    fetchInstitutions()

    return {
      users,
      institutions,
      activeTab,
      error,
      updateRole,
      createInstitution,
      editInstitution,
      deleteInstitution
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

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tabs button {
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #f0f0f0;
  cursor: pointer;
}

.tabs button.active {
  background-color: #ddd;
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
