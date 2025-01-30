<template>
  <div class="medication-list">
    <h2>Lista de Medicamentos</h2>
    <table v-if="medications.length">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Dosis</th>
          <th>Frecuencia</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="medication in medications" :key="medication.id">
          <td>{{ medication.nombre }}</td>
          <td>{{ medication.dosis }}</td>
          <td>{{ medication.frecuencia }}</td>
          <td class="actions">
            <button @click="editMedication(medication)" class="btn-edit">Editar</button>
            <button @click="deleteMedication(medication.id)" class="btn-delete">Borrar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>No hay medicamentos registrados.</p>

    <!-- Modal de edición -->
    <div v-if="isEditing" class="modal">
      <div class="modal-content">
        <h2>Editar Medicamento</h2>
        <form @submit.prevent="handleEdit">
          <div class="form-group">
            <label for="edit-name">Nombre:</label>
            <input type="text" id="edit-name" v-model="editForm.nombre" required>
          </div>
          <div class="form-group">
            <label for="edit-dosis">Dosis:</label>
            <input type="text" id="edit-dosis" v-model="editForm.dosis" required>
          </div>
          <div class="form-group">
            <label for="edit-frecuencia">Frecuencia:</label>
            <input type="text" id="edit-frecuencia" v-model="editForm.frecuencia" required>
          </div>
          <div class="modal-buttons">
            <button type="submit" class="btn-edit">Guardar</button>
            <button type="button" @click="cancelEdit" class="btn-delete">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'MedicationList',
  setup() {
    const store = useStore()
    const medications = computed(() => store.state.medications)
    const isEditing = ref(false)
    const editForm = reactive({
      id: null,
      nombre: '',
      dosis: '',
      frecuencia: ''
    })

    onMounted(() => {
      store.dispatch('fetchMedications')
    })

    const editMedication = (medication) => {
      Object.assign(editForm, medication)
      isEditing.value = true
    }

    const handleEdit = async () => {
      const success = await store.dispatch('editMedication', { ...editForm })
      if (success) {
        isEditing.value = false
      }
    }

    const cancelEdit = () => {
      isEditing.value = false
    }

    const deleteMedication = async (id) => {
      if (confirm('¿Está seguro de que desea eliminar este medicamento?')) {
        await store.dispatch('deleteMedication', id)
      }
    }

    return {
      medications,
      isEditing,
      editForm,
      editMedication,
      handleEdit,
      cancelEdit,
      deleteMedication
    }
  }
}
</script>

<style scoped>
.medication-list {
  width: 100%;
  margin-top: 2rem;
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: left;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th {
  background-color: #f8f9fa;
  color: #2c3e50;
  font-weight: 600;
  padding: 0.75rem;
  text-align: left;
  border-bottom: 2px solid #dee2e6;
}

td {
  padding: 0.75rem;
  border-bottom: 1px solid #dee2e6;
}

.btn-edit, .btn-delete {
  padding: 0.25rem 0.75rem;
  margin: 0 0.25rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-edit {
  background-color: #28a745;
  color: white;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}

.btn-edit:hover {
  background-color: #218838;
}

.btn-delete:hover {
  background-color: #c82333;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-content h2 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.modal-content .form-group {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.modal-content label {
  width: 100px;
  text-align: right;
  margin-right: 1rem;
  color: #495057;
}

.modal-content input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn-edit, .btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.3s ease;
}

.btn-edit {
  background-color: #28a745;
  color: white;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}

.btn-edit:hover {
  background-color: #218838;
}

.btn-delete:hover {
  background-color: #c82333;
}
</style>
