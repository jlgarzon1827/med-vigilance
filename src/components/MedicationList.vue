<template>
  <div class="medication-list">
    <table v-if="medications.length">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Dosis</th>
          <th>Frecuencia</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="medication in medications" :key="medication.id">
          <td>{{ medication.nombre }}</td>
          <td>{{ medication.dosis }}</td>
          <td>{{ medication.frecuencia }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>No hay medicamentos registrados.</p>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'MedicationList',
  setup() {
    const store = useStore()
    const medications = computed(() => store.state.medications)

    onMounted(() => {
      store.dispatch('fetchMedications')
    })

    return {
      medications
    }
  }
}
</script>

<style scoped>
.medication-list {
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th, td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f5f5f5;
  font-weight: bold;
}

tr:hover {
  background-color: #f9f9f9;
}
</style>
