<template>
    <div class="adverse-effect-form">
      <h2>Reportar Efecto Adverso</h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="medication">Medicamento:</label>
          <select 
            id="medication" 
            v-model="formData.medication"
            required
            v-if="isDataReady"
          >
            <option value="" disabled>Seleccione un medicamento</option>
            <option v-for="med in medications" :key="med.id" :value="med.id">
              {{ getMasterMedicationName(med.medicamento_maestro_id) }}
            </option>
          </select>
          <p v-else>Cargando medicamentos maestros...</p>
          <span v-if="errors.medication" class="error-message">{{ errors.medication }}</span>
        </div>
        
        <div class="form-group">
          <label for="description">Descripción:</label>
          <textarea 
            id="description" 
            v-model="formData.description" 
            placeholder="Describa el efecto adverso experimentado"
            rows="4"
            required
          ></textarea>
          <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
        </div>
        
        <div class="form-row">
          <div class="form-group half">
            <label for="start_date">Fecha de inicio:</label>
            <input 
              type="date" 
              id="start_date" 
              v-model="formData.start_date"
              required
            >
            <span v-if="errors.start_date" class="error-message">{{ errors.start_date }}</span>
          </div>
          
          <div class="form-group half">
            <label for="end_date">Fecha de fin:</label>
            <input 
              type="date" 
              id="end_date" 
              v-model="formData.end_date"
            >
            <span v-if="errors.end_date" class="error-message">{{ errors.end_date }}</span>
          </div>
        </div>
        
        <div class="form-group">
          <label for="severity">Severidad:</label>
          <select 
            id="severity" 
            v-model="formData.severity"
            required
          >
            <option value="" disabled>Seleccione la severidad</option>
            <option value="LEVE">Leve</option>
            <option value="MODERADA">Moderada</option>
            <option value="GRAVE">Grave</option>
            <option value="MUY_GRAVE">Muy grave</option>
          </select>
          <span v-if="errors.severity" class="error-message">{{ errors.severity }}</span>
        </div>
        
        <div class="form-group">
          <label for="type">Tipo:</label>
          <select 
            id="type" 
            v-model="formData.type"
            required
          >
            <option value="" disabled>Seleccione el tipo</option>
            <option value="A">Tipo A - Aumentado/Predecible</option>
            <option value="B">Tipo B - Bizarro/No predecible</option>
          </select>
          <span v-if="errors.type" class="error-message">{{ errors.type }}</span>
        </div>
        
        <div class="form-group">
          <label for="administration_route">Vía de administración:</label>
          <input 
            type="text" 
            id="administration_route" 
            v-model="formData.administration_route" 
            placeholder="Ej: Oral, Intravenosa, etc."
            required
          >
          <span v-if="errors.administration_route" class="error-message">{{ errors.administration_route }}</span>
        </div>
        
        <div class="form-row">
          <div class="form-group half">
            <label for="dosage">Dosis:</label>
            <input 
              type="text" 
              id="dosage" 
              v-model="formData.dosage" 
              placeholder="Ej: 500mg"
              required
            >
            <span v-if="errors.dosage" class="error-message">{{ errors.dosage }}</span>
          </div>
          
          <div class="form-group half">
            <label for="frequency">Frecuencia:</label>
            <input 
              type="text" 
              id="frequency" 
              v-model="formData.frequency" 
              placeholder="Ej: 8 horas"
              required
            >
            <span v-if="errors.frequency" class="error-message">{{ errors.frequency }}</span>
          </div>
        </div>

        <div class="form-buttons">
          <button type="submit" class="btn-submit">Enviar Reporte</button>
          <button type="button" @click="resetForm" class="btn-reset">Limpiar</button>
        </div>
      </form>
      
      <div v-if="isLoading" class="loading-overlay">
        <LoadingSpinner />
        <p>Enviando reporte...</p>
      </div>
      
      <div v-if="successMessage" class="success-message">
        <p>{{ successMessage }}</p>
        <button @click="resetForm" class="btn-new-report">Crear Nuevo Reporte</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, reactive, computed, onMounted, watch } from 'vue'
  import { useStore } from 'vuex'
  import LoadingSpinner from '@/components/LoadingSpinner.vue'
  
  export default {
    name: 'ReportAdverseEffect',
    components: {
      LoadingSpinner
    },
    setup() {
      const store = useStore()
      const medications = computed(() => store.state.medications || [])
      const masterMedications = computed(() => store.state.masterMedications || [])
      const isLoading = computed(() => store.state.isLoading)
      const successMessage = ref('')
      const isDataReady = ref(false)
      const userProfile = computed(() => store.state.userProfile);

      const formData = reactive({
        medication: '',
        description: '',
        start_date: '',
        end_date: '',
        severity: '',
        type: '',
        administration_route: '',
        dosage: '',
        frequency: ''      
      })
      
      const errors = reactive({
        medication: '',
        description: '',
        start_date: '',
        end_date: '',
        severity: '',
        type: '',
      })

      const getMasterMedicationName = (id) => {
        const medication = masterMedications.value.find(m => m.id === id)
        return medication ? medication.nombre : 'No encontrado'
      }

      watch(() => formData.medication, (newValue) => {
        if (newValue) {
          const selectedMedication = medications.value.find(m => m.id === newValue)
          if (selectedMedication) {
            formData.dosage = selectedMedication.dosis_personalizada
            formData.frequency = selectedMedication.frecuencia_personalizada
          }
          const masterMedication = masterMedications.value.find(m => m.id === selectedMedication.medicamento_maestro_id)
          if (masterMedication) {
            formData.administration_route = masterMedication.via_administracion
          }
        }
      })
      
      const validateForm = () => {
        let isValid = true
        
        // Limpiar errores previos
        Object.keys(errors).forEach(key => {
          errors[key] = ''
        })
        
        if (!formData.medication) {
          errors.medication = 'Debe seleccionar un medicamento'
          isValid = false
        }
        
        if (!formData.description) {
          errors.description = 'La descripción es requerida'
          isValid = false
        } else if (formData.description.length < 10) {
          errors.description = 'La descripción debe tener al menos 10 caracteres'
          isValid = false
        }
        
        if (!formData.start_date) {
          errors.start_date = 'La fecha de inicio es requerida'
          isValid = false
        }
        
        if (formData.end_date && new Date(formData.end_date) < new Date(formData.start_date)) {
          errors.end_date = 'La fecha de fin no puede ser anterior a la fecha de inicio'
          isValid = false
        }
        
        if (!formData.severity) {
          errors.severity = 'Debe seleccionar la severidad'
          isValid = false
        }
        
        if (!formData.type) {
          errors.type = 'Debe seleccionar el tipo'
          isValid = false
        }
        
        if (!formData.administration_route) {
          errors.administration_route = 'La vía de administración es requerida'
          isValid = false
        }
        
        if (!formData.dosage) {
          errors.dosage = 'La dosis es requerida'
          isValid = false
        }
        
        if (!formData.frequency) {
          errors.frequency = 'La frecuencia es requerida'
          isValid = false
        }

        return isValid
      }
      
      const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }
        
        // Añadir el ID del paciente a los datos del formulario
        const reportData = { 
            ...formData,
            patient: userProfile.value?.id,
            institution: userProfile.value?.profile?.institution
        };
        
        const success = await store.dispatch('reportAdverseEffect', reportData);
        
        if (success) {
            successMessage.value = 'Su reporte de efecto adverso ha sido enviado correctamente. Gracias por contribuir a la seguridad de los medicamentos.';
        }
    }

      
    const resetForm = () => {
        Object.keys(formData).forEach(key => {
          formData[key] = ''
        })
        
        Object.keys(errors).forEach(key => {
          errors[key] = ''
        })
        
        successMessage.value = ''
    }
      
    onMounted(async () => {
      await store.dispatch('fetchUserProfile')
      if (!medications.value.length) {
        await store.dispatch('fetchMedications')
      }
      if (!masterMedications.value.length) {
        await store.dispatch('fetchMasterMedications')
      }
      isDataReady.value = true;
    })
      
    return {
        isDataReady,
        medications,
        masterMedications,
        getMasterMedicationName,
        formData,
        errors,
        isLoading,
        successMessage,
        handleSubmit,
        resetForm
      }
    }
  }
  </script>
  
  <style scoped>
  .adverse-effect-form {
    position: relative;
    width: 100%;
  }
  
  h2 {
    margin-bottom: 1.5rem;
    color: #2c3e50;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .half {
    flex: 1;
    margin-bottom: 0;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #495057;
    font-weight: 500;
  }
  
  input, select, textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  textarea {
    resize: vertical;
  }
  
  .error-message {
    display: block;
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
  
  .form-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .btn-submit, .btn-reset, .btn-new-report {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
  }
  
  .btn-submit {
    background-color: #e4fdff;
    color: #000;
    flex: 2;
  }
  
  .btn-reset {
    background-color: #f8f9fa;
    border: 1px solid #ced4da;
    color: #495057;
    flex: 1;
  }
  
  .btn-new-report {
    background-color: #e4fdff;
    color: #000;
    margin-top: 1rem;
  }
  
  .btn-submit:hover {
    background-color: #7da9bd;
  }
  
  .btn-reset:hover {
    background-color: #e9ecef;
  }
  
  .btn-new-report:hover {
    background-color: #7da9bd;
  }
  
  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10;
    border-radius: 8px;
  }
  
  .success-message {
    margin-top: 2rem;
    padding: 1.5rem;
    background-color: #d1e7dd;
    color: #0f5132;
    border-radius: 4px;
    text-align: center;
  }
  </style>
  