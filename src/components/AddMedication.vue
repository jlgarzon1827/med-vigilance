<template>
  <div class="add-medication">
    <h2>Añadir Nuevo Medicamento</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Nombre:</label>
        <input type="text" id="name" v-model="name" required>
      </div>
      <div class="form-group">
        <label for="dosage">Dosis:</label>
        <input type="text" id="dosage" v-model="dosage" required>
      </div>
      <div class="form-group">
        <label for="frequency">Frecuencia:</label>
        <input type="text" id="frequency" v-model="frequency" required>
      </div>
      <button type="submit" class="btn-submit">Añadir Medicamento</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'AddMedication',
  setup() {
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
.add-medication {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #3aa876;
}

</style>
