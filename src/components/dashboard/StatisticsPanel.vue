<!-- components/dashboard/StatisticsPanel.vue -->
<template>
  <div class="statistics-panel">
    <LoadingSpinner v-if="isLoading" />
    
    <div v-else>
      <h2>Estadísticas Generales</h2>
      
      <div class="stats-cards">
        <div class="stat-card">
          <h3>Total de Reportes</h3>
          <div class="stat-value">{{ statistics.total_reports || 0 }}</div>
        </div>
        
        <div class="stat-card">
          <h3>Reportes Pendientes</h3>
          <div class="stat-value">{{ statistics.pending_reports || 0 }}</div>
        </div>
        
        <div class="stat-card">
          <h3>Reportes Graves</h3>
          <div class="stat-value">{{ statistics.severe_reports || 0 }}</div>
        </div>
      </div>
      
      <div class="charts-container">
        <div class="chart-wrapper">
          <h3>Distribución por Severidad</h3>
          <PieChart 
            v-if="statistics.by_severity && statistics.by_severity.length" 
            :chart-data="severityChartData" 
          />
          <p v-else class="no-data">No hay datos disponibles</p>
        </div>
        
        <div class="chart-wrapper">
          <h3>Distribución por Tipo</h3>
          <PieChart 
            v-if="statistics.by_type && statistics.by_type.length" 
            :chart-data="typeChartData" 
          />
          <p v-else class="no-data">No hay datos disponibles</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import PieChart from '@/components/dashboard/charts/PieChart.vue'

export default {
  name: 'StatisticsPanel',
  components: {
    LoadingSpinner,
    PieChart
  },
  setup() {
    const store = useStore()
    const isLoading = computed(() => store.state.isLoading)
    const statistics = computed(() => store.state.dashboardStatistics || {})
    
    const severityChartData = computed(() => {
      if (!statistics.value.by_severity) return null
      
      return {
        labels: statistics.value.by_severity.map(item => item.severity),
        datasets: [{
          data: statistics.value.by_severity.map(item => item.count),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
        }]
      }
    })
    
    const typeChartData = computed(() => {
      if (!statistics.value.by_type) return null
      
      return {
        labels: statistics.value.by_type.map(item => item.type),
        datasets: [{
          data: statistics.value.by_type.map(item => item.count),
          backgroundColor: ['#FF6384', '#36A2EB']
        }]
      }
    })
    
    onMounted(() => {
      if (!statistics.value.total_reports) {
        store.dispatch('fetchDashboardStatistics')
      }
    })
    
    return {
      isLoading,
      statistics,
      severityChartData,
      typeChartData
    }
  }
}
</script>

<style scoped>
.statistics-panel {
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

.stat-value {
  font-size: 2.5rem;
  font-weight: 600;
  color: #7da9bd;
  margin-top: 0.5rem;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.chart-wrapper {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  font-style: italic;
}
</style>
