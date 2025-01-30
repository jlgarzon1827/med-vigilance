<template>
  <div class="dashboard">
    <h1>Bienvenido al Dashboard</h1>
    <p>Hola, {{ username }}!</p>
    <div class="dashboard-content">
      <AddMedication />
      <div class="medication-list">
          <MedicationList />
        </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import AddMedication from '@/components/AddMedication.vue'
import MedicationList from '@/components/MedicationList.vue'

export default {
  name: 'DashboardPage',
  components: {
    AddMedication,
    MedicationList
  },
  setup() {
    const store = useStore()
    const username = computed(() => store.state.user || 'Usuario')

    return {
      username
    }
  }
}

</script>

<style scoped>
.dashboard {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
}

.dashboard-content {
  margin-top: 20px;
}

.medication-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
}

.medication-list {
  margin-top: 30px;
  text-align: center;
}
</style>
