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
  text-align: center;
}

.form-group {
  margin: 15px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-group label {
  width: 100px;
  text-align: right;
  margin-right: 10px;
}

.form-group input {
  width: 200px;
  padding: 5px;
}

.btn-submit {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
