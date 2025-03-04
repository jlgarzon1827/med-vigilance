<template>
  <div class="pending-reviews">
    <LoadingSpinner v-if="isLoading" />
    
    <div v-else>
      <h2>Revisiones Pendientes</h2>
      
      <div class="stats-cards">
        <div class="stat-card">
          <h3>Pendientes</h3>
          <div class="stat-value">{{ pendingReviews.pending || 0 }}</div>
        </div>
        
        <div class="stat-card urgent">
          <h3>Urgentes</h3>
          <div class="stat-value">{{ pendingReviews.urgent_pending || 0 }}</div>
        </div>
      </div>
      
      <div class="table-container">
        <h3>Reportes Recientes Pendientes</h3>
          <table v-if="pendingReviews.recent_pending && pendingReviews.recent_pending.length">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Medicamento</th>
              <th>Severidad</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="report in pendingReviews.recent_pending" :key="report.id">
              <td>{{ report.patient_name || 'Usuario ' + report.patient }}</td>
              <td>{{ report.medication_name || 'Med ' + report.medication }}</td>
              <td>
                <span :class="'severity-badge ' + report.severity.toLowerCase()">
                  {{ report.severity }}
                </span>
              </td>
              <td>{{ formatDate(report.reported_at) }}</td>
              <td>
                <button @click="viewReport(report)" class="btn-view">Ver</button>
                <button @click="markAsReviewed(report.id)" class="btn-review">Revisar</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else class="no-data">No hay reportes pendientes.</p>
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
import ReportDetail from '@/components/dashboard/ReportDetail.vue'

export default {
  name: 'PendingReviews',
  components: {
    LoadingSpinner,
    ReportDetail
  },
  setup() {
    const store = useStore()
    const isLoading = computed(() => store.state.isLoading)
    const pendingReviews = computed(() => store.state.pendingReviews || {})
    const selectedReport = ref(null)
    
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
        store.dispatch('fetchPendingReviews')
      }
    }
    
    onMounted(() => {
      if (!pendingReviews.value.pending) {
        store.dispatch('fetchPendingReviews')
      }
    })
    
    return {
      isLoading,
      pendingReviews,
      selectedReport,
      formatDate,
      viewReport,
      markAsReviewed
    }
  }
}
</script>

<style scoped>
.pending-reviews {
  width: 100%;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  text-align: center;
}

.stat-card.urgent {
  background: #fff3cd;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 600;
  color: #7da9bd;
  margin-top: 0.5rem;
}

.stat-card.urgent .stat-value {
  color: #664d03;
}

.table-container {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin-top: 2rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
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

.severity-badge {
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
