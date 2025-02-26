<template>
  <div class="reports-list">
    <LoadingSpinner v-if="isLoading" />
    
    <div v-else>
      <h2>Reportes de Efectos Adversos</h2>
      
      <ReportFilters @filter-changed="applyFilters" />
      
      <div class="table-container">
        <table v-if="adverseEffects.length">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Medicamento</th>
              <th>Severidad</th>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="effect in adverseEffects" :key="effect.id">
              <td>{{ effect.patient_name || 'Usuario ' + effect.patient }}</td>
              <td>{{ effect.medication_name || 'Med ' + effect.medication }}</td>
              <td>
                <span :class="'severity-badge ' + effect.severity.toLowerCase()">
                  {{ effect.severity }}
                </span>
              </td>
              <td>{{ effect.type }}</td>
              <td>{{ formatDate(effect.reported_at) }}</td>
              <td>
                <span :class="'status-badge ' + effect.status.toLowerCase()">
                  {{ effect.status }}
                </span>
              </td>
              <td>
                <button @click="viewReport(effect)" class="btn-view">Ver</button>
                <button 
                  v-if="effect.status === 'PENDING'" 
                  @click="markAsReviewed(effect.id)" 
                  class="btn-review"
                >
                  Revisar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else class="no-data">No hay reportes que coincidan con los filtros.</p>
      </div>
    </div>
    
    <ReportDetail 
      v-if="selectedReport" 
      :report="selectedReport" 
      @close="selectedReport = null" 
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ReportFilters from '@/components/dashboard/ReportFilters.vue'
import ReportDetail from '@/components/dashboard/ReportDetail.vue'

export default {
  name: 'ReportsList',
  components: {
    LoadingSpinner,
    ReportFilters,
    ReportDetail
  },
  setup() {
    const store = useStore()
    const isLoading = computed(() => store.state.isLoading)
    const adverseEffects = computed(() => store.state.adverseEffects || [])
    const selectedReport = ref(null)
    const currentFilters = ref({})
    
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString()
    }
    
    const viewReport = (report) => {
      selectedReport.value = report
    }
    
    const markAsReviewed = async (id) => {
      const success = await store.dispatch('markAsReviewed', id)
      if (success) {
        // Opcionalmente, mostrar un mensaje de éxito
      }
    }
    
    const applyFilters = (filters) => {
      currentFilters.value = filters
      fetchFilteredReports()
    }
    
    const fetchFilteredReports = () => {
      store.dispatch('fetchAdverseEffects', currentFilters.value)
    }
    
    onMounted(() => {
      if (!adverseEffects.value.length) {
        fetchFilteredReports()
      }
    })
    
    return {
      isLoading,
      adverseEffects,
      selectedReport,
      formatDate,
      viewReport,
      markAsReviewed,
      applyFilters
    }
  }
}
</script>

<style scoped>
.reports-list {
  width: 100%;
}

.table-container {
  margin-top: 1.5rem;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
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

.severity-badge, .status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.severity-badge.leve {
  background-color: #d1e7dd;
  color: #0f5132;
}

.severity-badge.moderada {
  background-color: #fff3cd;
  color: #664d03;
}

.severity-badge.grave {
  background-color: #f8d7da;
  color: #842029;
}

.severity-badge.mortal {
  background-color: #842029;
  color: #fff;
}

.status-badge.pending {
  background-color: #fff3cd;
  color: #664d03;
}

.status-badge.reviewed {
  background-color: #d1e7dd;
  color: #0f5132;
}

.btn-view, .btn-review {
  padding: 0.25rem 0.5rem;
  margin-right: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-view {
  background-color: #e4fdff;
  color: #000;
}

.btn-review {
  background-color: #d1e7dd;
  color: #0f5132;
}

.btn-view:hover {
  background-color: #7da9bd;
}

.btn-review:hover {
  background-color: #0f5132;
  color: #fff;
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  font-style: italic;
}
</style>

