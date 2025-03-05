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
              <!-- Conditionally show Reviewer column -->
              <th v-if="canAssignReviewers">Asignar Revisor</th>
            </tr>
          </thead>

          <!-- Rows -->
          <tbody>
            <tr v-for="effect in adverseEffects" :key="effect.id">
              <!-- Existing columns -->
              <td>{{ effect.patient_name || 'Usuario ' + effect.patient }}</td>
              <td>{{ effect.medicamento_nombre || 'Med ' + effect.id }}</td>
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
                  @click="markAsReviewed(effect)" 
                  class="btn-review"
                >
                  Revisar
                </button>
              </td>

              <!-- Assign Reviewer Dropdown -->
              <!-- Visible only if user has the canAssignReviewers permission -->
              <td v-if="canAssignReviewers">
                <select v-model="selectedReviewer[effect.id]" @change="assignReviewer(effect.id)">
                  <!-- List of professionals -->
                  <option v-for="user in professionals" :value="user.id" :key="user.id">
                    {{ user.username }}
                  </option>
                </select>
              </td>

            </tr>
          </tbody>

        </table>

        <!-- No Data Message -->
        <p v-else class="no-data">No hay reportes que coincidan con los filtros.</p>
        
      </div>

    </div>

    <!-- Report Detail Modal -->
    <ReportDetail 
      v-if="selectedReport" 
      :report="selectedReport" 
      @close="selectedReport = null" 
    />
  </div>
</template>

<script>
// Import necessary components and Vuex
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
    
    // Fetch data from Vuex store
    const isLoading = computed(() => store.state.isLoading)
    const adverseEffects = computed(() => store.state.adverseEffects || [])
    
    // Check if user has permission to assign reviewers
    const canAssignReviewers = computed(() => {
      return store.state.userProfile?.permissions?.includes('MediAlertServerApp.can_assign_reviewers')
    })

    // Fetch list of professionals
    const professionals = computed(() => store.state.professionals || [])
    
    // Selected reviewer for each report
    const selectedReviewer = ref({})

    // Assign Reviewer Action
    const assignReviewer = async (reportId) => {
      try {
        await store.dispatch('assignReviewer', { reportId, reviewerId: selectedReviewer.value[reportId] })
        alert('Revisor asignado correctamente.')
        // Optionally refresh data
        fetchFilteredReports()
      } catch (error) {
        console.error('Error assigning reviewer:', error)
      }
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString()
    }
    
    const viewReport = (report) => {
      selectedReport.value = report
    }
    
    const markAsReviewed = async (effect) => {
      const success = await store.dispatch('markAsReviewed', effect.id)
      if (success) {
        // Update the status locally
        effect.status = 'REVIEWED'
      }
    }
    
    const applyFilters = (filters) => {
      currentFilters.value = filters
      fetchFilteredReports()
    }
    
    const fetchFilteredReports = () => {
      // Filtrar solo las propiedades que no están vacías
      const nonEmptyFilters = Object.fromEntries(
        Object.entries(currentFilters.value).filter(([, value]) => value !== '')
      )
      store.dispatch('fetchAdverseEffects', nonEmptyFilters)
    }

    // Initialize filters and selected report
    const currentFilters = ref({})
    const selectedReport = ref(null)

    onMounted(() => {
      if (!adverseEffects.value.length) {
        fetchFilteredReports()
      }
      if (canAssignReviewers.value) {
        store.dispatch('fetchProfessionals')
      }
      
      fetchFilteredReports()
    })
    
    return {
      isLoading,
      adverseEffects,
      selectedReport,
      currentFilters,
      formatDate,
      viewReport,
      markAsReviewed,
      applyFilters,
      canAssignReviewers,
      professionals,
      selectedReviewer,
      assignReviewer
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

