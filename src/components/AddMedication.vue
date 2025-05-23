<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Nuevo Medicamento</h2>
        <button class="btn-close" @click="$emit('close')">&times;</button>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <div class="input-row">
            <label for="masterMedication">Medicamento:</label>
            <select 
              id="masterMedication" 
              v-model="selectedMedication"
              @change="updateFields"
            >
              <option value="">Seleccione un medicamento</option>
              <option v-for="medication in medications" :key="medication.id" :value="medication.id">
                {{ medication.nombre }}
              </option>
            </select>
          </div>
          <span v-if="errors.medicamento_maestro" class="error-message">{{ errors.medicamento_maestro }}</span>
        </div>
        <div class="form-group">
          <div class="input-row">
            <label for="dosage">Dosis:</label>
            <input 
              type="text" 
              id="dosage" 
              v-model="dosage" 
              placeholder="ej: 500mg"
            >
          </div>
          <span v-if="errors.dosis" class="error-message">{{ errors.dosis }}</span>
        </div>
        <div class="form-group">
          <div class="input-row">
            <label for="frequency">Frecuencia:</label>
            <select 
              id="frequency"
              v-model="frequency"
            >
              <option value="">Seleccione frecuencia</option>
              <option value="OD">OD (Una vez al día)</option>
              <option value="BID">BID (Dos veces al día)</option>
              <option value="TID">TID (Tres veces al día)</option>
              <option value="PRN">PRN (Según sea necesario)</option>
            </select>
          </div>
          <span v-if="errors.frecuencia" class="error-message">{{ errors.frecuencia }}</span>
          <p class="legend">OD: Una vez al día, BID: Dos veces al día, TID: Tres veces al día, PRN: Según sea necesario</p>
        </div>
        <div class="modal-buttons">
          <button type="submit" class="btn-edit">Añadir</button>
          <button type="button" class="btn-delete" @click="$emit('close')">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { validateMedication } from '@/utils/validations'
import axios from '@/utils/axios'

export default {
  name: 'AddMedication',
  emits: ['close'],
  setup(props, { emit }) {
    const store = useStore()
    const selectedMedication = ref('')
    const dosage = ref('')
    const frequency = ref('')
    const medications = ref([])
    const errors = reactive({
      medicamento_maestro: '',
      dosis: '',
      frecuencia: ''
    })

    // Cargar medicamentos maestros
    axios.get('/medicamentos-maestros/')
      .then(response => {
        medications.value = response.data
      })
      .catch(error => {
        console.error(error)
      })

    const updateFields = () => {
      if (selectedMedication.value) {
        const selected = medications.value.find(m => m.id === parseInt(selectedMedication.value))
        dosage.value = selected.dosis
        frequency.value = selected.frecuencia
      } else {
        dosage.value = ''
        frequency.value = ''
      }
    }

    const handleSubmit = async () => {
      // Reset errors
      Object.keys(errors).forEach(key => errors[key] = '')

      // Validate fields
      const medicamentoMaestroError = selectedMedication.value ? '' : 'Debe seleccionar un medicamento maestro'
      const dosisError = validateMedication('dosis', dosage.value)
      const frecuenciaError = validateMedication('frecuencia', frequency.value)

      if (medicamentoMaestroError || dosisError || frecuenciaError) {
        errors.medicamento_maestro = medicamentoMaestroError
        errors.dosis = dosisError
        errors.frecuencia = frecuenciaError
        return
      }

      await store.dispatch('addMedication', {
        medicamento_maestro_id: selectedMedication.value,
        dosis_personalizada: dosage.value,
        frecuencia_personalizada: frequency.value
      })
      selectedMedication.value = ''
      dosage.value = ''
      frequency.value = ''
      emit('close')
    }

    return {
      selectedMedication,
      dosage,
      frequency,
      medications,
      errors,
      handleSubmit,
      updateFields
    }
  }
}
</script>

<style scoped>
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

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.input-row {
  display: flex;
  align-items: center;
}

.input-row label {
  width: 100px;
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

.input-row input::placeholder {
  color: #adb5bd;
  font-style: italic;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  margin-left: calc(100px + 1rem);
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
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

.btn-edit, .btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.legend {
  color: #495057;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  margin-left: calc(100px + 1rem);
}
</style>