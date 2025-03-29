<template>
  <div class="medication-statistics">
    <LoadingSpinner v-if="isLoading" />
    
    <div v-else>
      <h2>Estadísticas por Medicamento</h2>
      
      <div class="chart-container">
      <h3>Medicamentos más reportados</h3>
      <BarChart 
        v-if="medicationStats.most_reported && medicationStats.most_reported.length" 
        :chart-data="mostReportedChartData" 
      />
      <p v-else class="no-data">No hay datos disponibles</p>
    </div>

    <div class="table-container">
      <h3>Distribución por severidad y medicamento</h3>
      <table v-if="medicationStats.by_severity && medicationStats.by_severity.length">
        <thead>
          <tr>
            <th>Medicamento</th>
            <th>Severidad</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in medicationStats.by_severity" :key="index">
            <td>{{ item.medication__medicamento_maestro__nombre }}</td> <!-- Cambia a medicamento_maestro__nombre -->
            <td>
              <span :class="'severity-badge ' + item.severity.toLowerCase()">
                {{ item.severity }}
              </span>
            </td>
            <td>{{ item.count }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else class="no-data">No hay datos disponibles</p>
    </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import BarChart from '@/components/dashboard/charts/BarChart.vue'

export default {
  name: 'MedicationStatistics',
  components: {
    LoadingSpinner,
    BarChart
  },
  setup() {
    const store = useStore()
    const isLoading = computed(() => store.state.isLoading)
    const medicationStats = computed(() => store.state.medicationStatistics || {})
    
    const mostReportedChartData = computed(() => {
      if (!medicationStats.value.most_reported) return null
      
      return {
        labels: medicationStats.value.most_reported.map(item => item.medication__medicamento_maestro__nombre), // Cambia a medicamento_maestro__nombre
        datasets: [{
          label: 'Número de reportes',
          data: medicationStats.value.most_reported.map(item => item.count),
          backgroundColor: '#36A2EB'
        }]
      }
    })

    onMounted(async () => {
      if (!medicationStats.value.most_reported) {
        try {
          await store.dispatch('fetchMedicationStatistics')
        } catch (error) {
          console.error('Error al cargar estadísticas:', error)
        }
      }
    })

    
    return {
      isLoading,
      medicationStats,
      mostReportedChartData
    }
  }
}
</script>

<style scoped>
.medication-statistics {
  width: 100%;
}

.chart-container, .table-container {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin-bottom: 2rem;
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

.no-data {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  font-style: italic;
}
</style>
