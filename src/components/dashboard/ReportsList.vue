<template>
  <div class="reports-list">
    <LoadingSpinner v-if="!isDataReady" />
    
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

          <!-- Rows -->
          <tbody>
            <tr v-for="effect in adverseEffects" :key="effect.id">
              <!-- Existing columns -->
              <td>{{ effect.patient_name || 'Usuario ' + effect.patient }}</td>
              <td>{{ getMedicationName(effect.medication) || 'Med ' + effect.id }}</td>
              <td>
                <span :class="'severity-badge ' + effect.severity.toLowerCase().replace(' ', '_')">
                  {{ effect.severity }}
                </span>
              </td>
              <td>{{ effect.type }}</td>
              <td>{{ formatDate(effect.reported_at) }}</td>
              <td>
                <span :class="'status-badge ' + effect.status.toLowerCase()">
                  {{ 
                    effect.status === 'CREATED' ? 'Creado' : 
                    effect.status === 'ASSIGNED' ? 'Asignado' : 
                    effect.status === 'IN_REVISION' ? 'En Revisión' : 
                    effect.status === 'PENDING_INFORMATION' ? 'Pendiente de Información Adicional' : 
                    effect.status === 'REJECTED' ? 'Rechazado' : 
                    effect.status === 'RECLAIMED' ? 'Reclamado' : 
                    effect.status === 'APPROVED' ? 'Aprobado' : 
                    'Estado desconocido'
                  }}
                </span>
              </td>

              <!-- Acciones -->
              <td>
                <!-- Botón para iniciar revisión -->
                <button 
                  v-if="effect.status === 'ASSIGNED'" 
                  @click="startReview(effect)" 
                  class="btn btn-primary"
                >
                  Iniciar Revisión
                </button>

                <!-- Botón para aprobar reporte -->
                <button 
                  v-if="effect.status === 'IN_REVISION'" 
                  @click="approveReport(effect)" 
                  class="btn btn-success"
                >
                  Aprobar
                </button>

                <!-- Botón para rechazar reporte -->
                <button 
                  v-if="effect.status === 'IN_REVISION'" 
                  @click="rejectReport(effect)" 
                  class="btn btn-danger"
                >
                  Rechazar
                </button>

                <!-- Botón para solicitar información adicional -->
                <button 
                  v-if="effect.status === 'IN_REVISION'" 
                  @click="requestInfo(effect)" 
                  class="btn btn-warning"
                >
                  Solicitar Información
                </button>

                <!-- Botón para ver detalles -->
                <button @click="viewReport(effect)" class="btn btn-info">Ver</button>
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
    const medications = computed(() => store.state.medications || [])
    const masterMedications = computed(() => store.state.masterMedications || [])
    const isDataReady = ref(false)
    
    // Fetch data from Vuex store
    const isLoading = computed(() => store.state.isLoading)
    const adverseEffects = computed(() => store.state.adverseEffects || [])
    
    // Check if user has permission to assign reviewers
    const canAssignReviewers = computed(() => {
      return store.state.userProfile?.permissions?.includes('MediAlertServerApp.can_assign_reviewers')
    })

    // Fetch list of professionals
    const professionals = computed(() => store.state.professionals || [])
    
    // Selected report for modal
    const selectedReport = ref(null)

    // Selected reviewer for each report
    const selectedReviewer = ref({})

    // Assign Reviewer Action
    const assignReviewer = async (reportId) => {
      try {
        await store.dispatch('assignReviewer', { reportId, reviewerId: selectedReviewer.value[reportId] })
        alert('Revisor asignado correctamente.')
        fetchFilteredReports()
      } catch (error) {
        console.error('Error assigning reviewer:', error)
      }
    }

    // Actions for changing report states
    const startReview = async (effect) => {
      try {
        await store.dispatch('startReview', effect.id)
        alert('Revisión iniciada correctamente.')
        fetchFilteredReports()
      } catch (error) {
        console.error('Error iniciando revisión:', error)
      }
    }

    const approveReport = async (effect) => {
      try {
        await store.dispatch('approveReport', effect.id)
        alert('Reporte aprobado correctamente.')
        fetchFilteredReports()
      } catch (error) {
        console.error('Error aprobando reporte:', error)
      }
    }

    const rejectReport = async (effect) => {
      try {
        await store.dispatch('rejectReport', effect.id)
        alert('Reporte rechazado correctamente.')
        fetchFilteredReports()
      } catch (error) {
        console.error('Error rechazando reporte:', error)
      }
    }

    const requestInfo = async (effect) => {
      try {
        await store.dispatch('requestInfo', effect.id)
        alert('Información adicional solicitada correctamente.')
        fetchFilteredReports()
      } catch (error) {
        console.error('Error solicitando información:', error)
      }
    }

    // Format date utility function
    const formatDate = (dateString) => {
      if (!dateString) return 'Fecha no disponible'
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES')
    }

    const viewReport = (report) => {
      selectedReport.value = report
    }

    const applyFilters = (filters) => {
      currentFilters.value = filters
      fetchFilteredReports()
    }

    const fetchFilteredReports = async() => {
      await store.dispatch('fetchAdverseEffects', currentFilters.value)
    }

    const getMedicationName = (medicationId) => {
      if (!medications.value || medications.value.length === 0) {
        return 'Cargando...';
      }

      const medication = medications.value.find(med => med.id === medicationId)
      if (!medication) return `Medicamento ${medicationId}`

      const medicationMaster = masterMedications.value.find(m => m.id === medication.medicamento_maestro_id)
      return medicationMaster ? medicationMaster.nombre : `Medicamento ${medicationId}`
    }


    const currentFilters = ref({})

    onMounted(async () => {
      try {
        await fetchFilteredReports()
        await store.dispatch('fetchMedications')
        if (!masterMedications.value.length) {
          await store.dispatch('fetchMasterMedications')
        }
        if (canAssignReviewers.value) {
          await store.dispatch('fetchProfessionals')
        }
        isDataReady.value = true
      } catch (error) {
        console.error('Error al cargar datos:', error)
        isDataReady.value = false
      }
    })

    return {
      isDataReady,
      isLoading,
      adverseEffects,
      selectedReport,
      currentFilters,
      formatDate,
      viewReport,
      startReview,
      approveReport,
      rejectReport,
      requestInfo,
      applyFilters,
      canAssignReviewers,
      professionals,
      getMedicationName,
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
  background-color: #d1e7dd; /* Verde claro */
  color: #0f5132; /* Verde oscuro */
}

.severity-badge.moderada {
  background-color: #fff3cd; /* Amarillo claro */
  color: #664d03; /* Amarillo oscuro */
}

.severity-badge.grave {
  background-color: #f8d7da; /* Rojo claro */
  color: #842029; /* Rojo oscuro */
}

.severity-badge.muy_grave {
  background-color: #842029; /* Rojo oscuro */
  color: #fff; /* Blanco */
}

.status-badge.created {
  background-color: #e0e7ff;
  color: #1e40af;
}

.status-badge.assigned {
  background-color: #dbeafe;
  color: #2563eb;
}

.status-badge.in_revision {
  background-color: #fef08a;
  color: #b45309;
}

.status-badge.pending_information {
  background-color: #fef3c7;
  color: #92400e;
}

.status-badge.rejected {
  background-color: #fee2e2;
  color: #b91c1c;
}

.status-badge.reclaimed {
  background-color: #f3e8ff;
  color: #7c3aed;
}

.status-badge.approved {
  background-color: #dcfce7;
  color: #15803d;
}

button {
  padding: 0.5rem;
  border-radius: 4px;
  font-size: inherit;
}

/* Botón para iniciar revisión */
.btn-review {
  background-color: #d1e7dd; /* Verde claro */
}

/* Botón para aprobar reporte */
.btn-approve {
  background-color: #28a745; /* Verde más intenso */
}

/* Botón para rechazar reporte */
.btn-reject {
  background-color: #dc3545; /* Rojo intenso */
}

/* Botón para solicitar información adicional */
.btn-request-info {
  background-color: #ffc107; /* Amarillo intenso */
}

/* Botón para ver detalles */
.btn-view {
  background-color: #e4fdff; /* Azul muy claro */
  color: #000;
}

/* Hover effects para botones generales */
button:hover {
  opacity: .9;
}

/* Sin datos disponibles en la tabla */
.no-data {
  text-align: center;
  padding: 2rem;
}
</style>

