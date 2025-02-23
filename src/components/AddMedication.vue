<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Nuevo Medicamento</h2>
        <button class="btn-close" @click="$emit('close')">&times;</button>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Nombre:</label>
          <input 
            type="text" 
            id="name" 
            v-model="name" 
            placeholder="ej: Paracetamol"
            required
          >
        </div>
        <div class="form-group">
          <label for="dosage">Dosis:</label>
          <input 
            type="text" 
            id="dosage" 
            v-model="dosage" 
            placeholder="ej: 500mg"
            required
          >
        </div>
        <div class="form-group">
          <label for="frequency">Frecuencia:</label>
          <input 
            type="text" 
            id="frequency" 
            v-model="frequency" 
            placeholder="ej: Cada 8 horas"
            required
          >
        </div>
        <div class="modal-buttons">
          <button type="submit" class="btn-edit">Añadir Medicamento</button>
          <button type="button" class="btn-delete" @click="$emit('close')">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'AddMedication',
  emits: ['close'],
  setup(props, { emit }) {
    const store = useStore()
    const name = ref('')
    const dosage = ref('')
    const frequency = ref('')

    const handleSubmit = async () => {
      await store.dispatch('addMedication', {
        nombre: name.value,
        dosis: dosage.value,
        frecuencia: frequency.value
      })
      name.value = ''
      dosage.value = ''
      frequency.value = ''
      emit('close')
    }

    return {
      name,
      dosage,
      frequency,
      handleSubmit
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
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.form-group label {
  width: 100px;
  text-align: right;
  margin-right: 1rem;
  color: #495057;
}

.form-group input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.form-group input::placeholder {
  color: #adb5bd;
  font-style: italic;
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
</style>
