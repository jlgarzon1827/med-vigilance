<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

export default {
  name: 'PieChart',
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const chartCanvas = ref(null)
    let chart = null
    
    const createChart = () => {
      if (chart) {
        chart.destroy()
      }
      
      const ctx = chartCanvas.value.getContext('2d')
      chart = new Chart(ctx, {
        type: 'pie',
        data: props.chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      })
    }
    
    onMounted(() => {
      if (props.chartData) {
        createChart()
      }
    })
    
    watch(() => props.chartData, () => {
      if (props.chartData) {
        createChart()
      }
    }, { deep: true })
    
    return {
      chartCanvas
    }
  }
}
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>
