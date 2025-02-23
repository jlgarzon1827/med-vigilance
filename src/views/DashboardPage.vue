<template>
  <div class="dashboard">
    <h1>Bienvenido al Dashboard</h1>
    <div class="dashboard-content">
      <MedicationList @showAddModal="showAddModal = true" />
      <AddMedication v-if="showAddModal" @close="showAddModal = false" />
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import MedicationList from '@/components/MedicationList.vue'
import AddMedication from '@/components/AddMedication.vue'

export default {
  name: 'DashboardPage',
  components: {
    MedicationList,
    AddMedication
  },
  setup() {
    const store = useStore()
    const username = computed(() => store.state.user || 'Usuario')
    const showAddModal = ref(false)

    return {
      username,
      showAddModal
    }
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.dashboard-content {
  margin-top: 2rem;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
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

