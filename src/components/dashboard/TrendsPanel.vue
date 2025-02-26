<template>
  <div class="trends-panel">
    <LoadingSpinner v-if="isLoading" />
    
    <div v-else>
      <div class="header-actions">
        <h2>Análisis de Tendencias</h2>
        <div class="time-range-selector">
          <label for="time-range">Rango de tiempo:</label>
          <select id="time-range" v-model="selectedRange" @change="updateTrends">
            <option value="7">Últimos 7 días</option>
            <option value="30">Últimos 30 días</option>
            <option value="90">Últimos 90 días</option>
            <option value="365">Último año</option>
          </select>
        </div>
      </div>
      
      <div class="chart-container">
        <h3>Reportes Diarios</h3>
        <LineChart 
          v-if="trends.daily_reports && trends.daily_reports.length" 
          :chart-data="dailyReportsChartData" 
        />
        <p v-else class="no-data">No hay datos disponibles</p>
      </div>
      
      <div class="chart-container">
        <h3>Tendencia por Severidad</h3>
        <BarChart 
          v-if="trends.severity_trend && trends.severity_trend.length" 
          :chart-data="severityTrendChartData" 
        />
        <p v-else class="no-data">No hay datos disponibles</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import LineChart from '@/components/dashboard/charts/LineChart.vue'
import BarChart from '@/components/dashboard/charts/BarChart.vue'

export default {
  name: 'TrendsPanel',
  components: {
    LoadingSpinner,
    LineChart,
    BarChart
  },
  setup() {
    const store = useStore()
    const isLoading = computed(() => store.state.isLoading)
    const trends = computed(() => store.state.trends || {})
    const selectedRange = ref('30')
    
    const dailyReportsChartData = computed(() => {
      if (!trends.value.daily_reports) return null
      
      return {
        labels: trends.value.daily_reports.map(item => item.date),
        datasets: [{
          label: 'Número de reportes',
          data: trends.value.daily_reports.map(item => item.count),
          borderColor: '#7da9bd',
          backgroundColor: 'rgba(125, 169, 189, 0.2)',
          tension: 0.4
        }]
      }
    })
    
    const severityTrendChartData = computed(() => {
      if (!trends.value.severity_trend) return null
      
      return {
        labels: trends.value.severity_trend.map(item => item.severity),
        datasets: [{
          label: 'Número de reportes',
          data: trends.value.severity_trend.map(item => item.count),
          backgroundColor: [
            '#d1e7dd',
            '#fff3cd',
            '#f8d7da',
            '#842029'
          ]
        }]
      }
    })
    
    const updateTrends = () => {
      store.dispatch('fetchTrends', selectedRange.value)
    }
    
    onMounted(() => {
      if (!trends.value.daily_reports) {
        updateTrends()
      }
    })
    
    return {
      isLoading,
      trends,
      selectedRange,
      dailyReportsChartData,
      severityTrendChartData,
      updateTrends
    }
  }
}
</script>

<style scoped>
.trends-panel {
  width: 100%;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.time-range-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.time-range-selector select {
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: #fff;
}

.chart-container {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin-bottom: 2rem;
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  font-style: italic;
}
</style>
