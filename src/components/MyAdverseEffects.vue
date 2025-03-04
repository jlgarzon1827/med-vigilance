<template>
  <div class="my-adverse-effects">
    <h2>Mis Reportes de Efectos Adversos</h2>
    
    <LoadingSpinner v-if="isLoading" />
    
    <div v-else>
      <div v-if="adverseEffects.length" class="reports-list">
        <div v-for="effect in adverseEffects" :key="effect.id" class="report-card">
          <div class="report-header">
            <h3>{{ getMedicationName(effect.medication) }}</h3>
            <span :class="'severity-badge ' + effect.severity.toLowerCase()">
              {{ effect.severity }}
            </span>
          </div>
          
          <div class="report-dates">
            <div>
              <strong>Fecha de inicio:</strong> {{ formatDate(effect.start_date) }}
            </div>
            <div v-if="effect.end_date">
              <strong>Fecha de fin:</strong> {{ formatDate(effect.end_date) }}
            </div>
          </div>
          
          <div class="report-description">
            <strong>Descripción:</strong>
            <p>{{ effect.description }}</p>
          </div>
          
          <div class="report-details">
            <div>
              <strong>Tipo:</strong> {{ effect.type }}
            </div>
            <div>
              <strong>Vía de administración:</strong> {{ effect.administration_route }}
            </div>
            <div>
              <strong>Dosis:</strong> {{ effect.dosage }}
            </div>
            <div>
              <strong>Frecuencia:</strong> {{ effect.frequency }}
            </div>
          </div>
          
          <div class="report-status">
            <strong>Estado:</strong>
            <span :class="'status-badge ' + effect.status.toLowerCase()">
              {{ effect.status === 'PENDING' ? 'Pendiente de revisión' : 'Revisado' }}
            </span>
          </div>
          
          <div class="report-date">
            <strong>Reportado el:</strong> {{ formatDate(effect.reported_at) }}
          </div>
        </div>
      </div>
      
      <div v-else class="no-reports">
        <p>No has reportado ningún efecto adverso todavía.</p>
        <button @click="goToReportForm" class="btn-report">Reportar un efecto adverso</button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

export default {
  name: 'MyAdverseEffects',
  components: {
    LoadingSpinner
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const isLoading = computed(() => store.state.isLoading)
    const adverseEffects = computed(() => store.state.adverseEffects || [])
    const medications = computed(() => store.state.medications || [])
    
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString()
    }
    
    const getMedicationName = (medicationId) => {
      const medication = medications.value.find(med => med.id === medicationId)
      return medication ? medication.nombre : `Medicamento ${medicationId}`
    }
    
    const goToReportForm = () => {
      store.commit('setActiveTab', 'report-adverse');
      router.replace('/dashboard');
    }
    
    onMounted(() => {
      store.dispatch('fetchAdverseEffects')
      if (!medications.value.length) {
        store.dispatch('fetchMedications')
      }
    })
    
    return {
      isLoading,
      adverseEffects,
      formatDate,
      getMedicationName,
      goToReportForm
    }
  }
}
</script>

<style scoped>
.my-adverse-effects {
  width: 100%;
}

h2 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.reports-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.report-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 0.5rem;
}

.report-header h3 {
  margin: 0;
  color: #2c3e50;
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

.report-dates, .report-description, .report-details, .report-status, .report-date {
  margin-bottom: 1rem;
}

.report-description p {
  margin-top: 0.5rem;
  color: #495057;
}

.no-reports {
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.btn-report {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #e4fdff;
  color: #000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-report:hover {
  background-color: #7da9bd;
}
</style>
