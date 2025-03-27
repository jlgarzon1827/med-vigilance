<template>
  <div class="medication-list">
    <LoadingSpinner v-if="isLoading"/>
    <table v-else-if="isDataReady && medications.length">
      <thead>
        <tr>
          <th>Nombre del Medicamento Maestro</th>
          <th>Dosis Personalizada</th>
          <th>Frecuencia Personalizada</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="medication in medications" :key="medication.id">
          <td>{{ getMasterMedicationName(medication.medicamento_maestro_id) }}</td>
          <td>{{ medication.dosis_personalizada }}</td>
          <td>{{ medication.frecuencia_personalizada }}</td>
          <td>
            <button @click="editMedication(medication)" class="btn-edit">Editar</button>
            <button @click="confirmDelete(medication)" class="btn-delete">Borrar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else-if="!isDataReady">Cargando...</p>
    <p v-else>No hay medicamentos registrados.</p>
    <div class="add-button-container">
      <button @click="$emit('showAddModal')" class="btn-add">Añadir Medicamento</button>
    </div>

    <!-- Modal de edición -->
    <div v-if="isEditing" class="modal">
      <div class="modal-content">
        <h2>Editar Medicamento</h2>
        <form @submit.prevent="handleEdit">
          <div class="form-group">
            <label for="edit-name">Nombre del Medicamento Maestro:</label>
            <input 
              type="text" 
              id="edit-name" 
              v-model="editForm.medicamento_maestro_nombre" 
              disabled
            >
          </div>
          <div class="form-group">
            <label for="edit-dosis">Dosis Personalizada:</label>
            <input 
              type="text" 
              id="edit-dosis" 
              v-model="editForm.dosis_personalizada" 
              placeholder="ej: 500mg"
            >
            <span v-if="errors.dosis" class="error-message">{{ errors.dosis }}</span>
          </div>
          <div class="form-group">
            <label for="edit-frecuencia">Frecuencia Personalizada:</label>
            <input 
              type="text" 
              id="edit-frecuencia" 
              v-model="editForm.frecuencia_personalizada" 
              placeholder="ej: 8 horas"
            >
            <span v-if="errors.frecuencia" class="error-message">{{ errors.frecuencia }}</span>
          </div>
          <div class="modal-buttons">
            <button type="submit" class="btn-edit">Guardar</button>
            <button type="button" @click="cancelEdit" class="btn-delete">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

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
import { validateMedication } from '@/utils/validations'

export default {
  name: 'MedicationList',
  setup() {
    const store = useStore()
    const medications = computed(() => store.state.medications || [])
    const masterMedications = computed(() => store.state.masterMedications || [])
    const isEditing = ref(false)
    const showDeleteConfirm = ref(false)
    const selectedMedicationId = ref(null)
    const isDataReady = ref(false)
    const editForm = reactive({
      id: null,
      medicamento_maestro_id: null,
      medicamento_maestro_nombre: '',
      dosis_personalizada: '',
      frecuencia_personalizada: ''
    })
    const errors = reactive({
      nombre: '',
      dosis: '',
      frecuencia: ''
    })

    onMounted(async () => {
      try {
        if (!medications.value.length) {
          await store.dispatch('fetchMedications')
        }
        if (!masterMedications.value.length) {
          await store.dispatch('fetchMasterMedications')
        }
        isDataReady.value = true
      } catch (error) {
        console.error('Error cargando datos:', error)
      }
    })

    const getMasterMedicationName = (id) => {
      const medication = masterMedications.value.find(m => m.id === id)
      return medication ? medication.nombre : 'No encontrado'
    }

    const editMedication = (medication) => {
      Object.assign(editForm, {
        id: medication.id,
        medicamento_maestro_id: medication.medicamento_maestro_id,
        dosis_personalizada: medication.dosis_personalizada,
        frecuencia_personalizada: medication.frecuencia_personalizada
      })
      
      // Obtén el nombre del medicamento maestro y asignalo a la propiedad reactiva
      const masterMedication = masterMedications.value.find(m => m.id === editForm.medicamento_maestro_id)
      if (masterMedication) {
        editForm.medicamento_maestro_nombre = masterMedication.nombre
      }
      
      isEditing.value = true
    }

    const handleEdit = async () => {
      // Reset errors
      Object.keys(errors).forEach(key => errors[key] = '')

      // Validate fields
      const dosisError = validateMedication('dosis', editForm.dosis_personalizada)
      const frecuenciaError = validateMedication('frecuencia', editForm.frecuencia_personalizada)

      if (dosisError || frecuenciaError) {
        errors.dosis = dosisError
        errors.frecuencia = frecuenciaError
        return
      }

      const success = await store.dispatch('editMedication', { ...editForm })
      if (success) {
        isEditing.value = false
      }
    }

    const cancelEdit = () => {
      isEditing.value = false
      Object.keys(errors).forEach(key => errors[key] = '')
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
      isDataReady,
      medications,
      masterMedications,
      getMasterMedicationName,
      isEditing,
      showDeleteConfirm,
      editForm,
      errors,
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
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  color: #495057;
}

.form-group input {
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.form-group input::placeholder {
  color: #adb5bd;
  font-style: italic;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-edit, .btn-delete, .btn-cancel {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-edit {
  background-color: #e4fdff;
  color: #000;
}

.btn-delete {
  background-color: #fadadd;
  color: #000;
}

.btn-cancel {
  background-color: #f8f9fa;
  color: #000;
}

.btn-edit:hover {
  background-color: #7da9bd;
}

.btn-delete:hover {
  background-color: #e7bbbf;
}

.btn-cancel:hover {
  background-color: #e9ecef;
}

.add-button-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.btn-add {
  background-color: #e4fdff;
  color: #000;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-add:hover {
  background-color: #7da9bd;
}
</style>
