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
          <td>
            <button @click="editMedication(medication)" class="btn-edit">Editar</button>
            <button @click="confirmDelete(medication)" class="btn-delete">Borrar</button>
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

    <!-- Modal de confirmación para borrar -->
    <div v-if="showDeleteConfirm" class="modal">
      <div class="modal-content confirm-dialog">
        <h3>Confirmar eliminación</h3>
        <p>¿Está seguro de que desea eliminar este medicamento?</p>
        <div class="modal-buttons">
          <button @click="handleDelete" class="btn-delete">Eliminar</button>
          <button @click="cancelDelete" class="btn-cancel">Cancelar</button>
        </div>
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
    const showDeleteConfirm = ref(false)
    const selectedMedicationId = ref(null)
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

    const confirmDelete = (medication) => {
      selectedMedicationId.value = medication.id
      showDeleteConfirm.value = true
    }

    const handleDelete = async () => {
      await store.dispatch('deleteMedication', selectedMedicationId.value)
      showDeleteConfirm.value = false
      selectedMedicationId.value = null
    }

    const cancelDelete = () => {
      showDeleteConfirm.value = false
      selectedMedicationId.value = null
    }

    return {
      medications,
      isEditing,
      showDeleteConfirm,
      editForm,
      editMedication,
      handleEdit,
      cancelEdit,
      confirmDelete,
      handleDelete,
      cancelDelete
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

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

th {
  background-color: #f8f9fa;
  color: #2c3e50;
  font-weight: 600;
}

td:last-child {
  text-align: right;
  padding-right: 2rem;
}

th:last-child {
  text-align: right;
  padding-right: 2rem;
}

.btn-edit, .btn-delete {
  padding: 0.25rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  margin-left: 0.5rem;
}

.btn-edit {
  background-color: #e4fdff;
  color: #000;
}

.btn-delete {
  background-color: #fadadd;
  color: #000;
}

.btn-edit:hover {
  background-color: #7da9bd;
}

.btn-delete:hover {
  background-color: #e7bbbf;
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

.confirm-dialog {
  max-width: 400px;
  text-align: center;
}

.confirm-dialog h3 {
  margin-bottom: 1rem;
}

.confirm-dialog p {
  margin-bottom: 2rem;
}

.form-group {
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
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}
</style>
