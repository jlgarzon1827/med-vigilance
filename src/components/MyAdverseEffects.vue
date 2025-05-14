<template>
  <div class="my-adverse-effects">
    <h2>Mis Reportes de Efectos Adversos</h2>
    
    <LoadingSpinner v-if="!isDataReady" />
    
    <div v-else>
      <div v-if="isDataReady && adverseEffects.length > 0" class="reports-list">
        <div v-for="effect in adverseEffects" :key="effect.id" class="report-card">
          <div class="report-header">
            <h3>{{ getMedicationName(effect.medication) }}</h3>
            <span :class="'severity-badge ' + effect.severity.toLowerCase().replace(' ', '_')">
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
          </div>
          
          <div class="report-date">
            <strong>Reportado el:</strong> {{ formatDate(effect.reported_at) }}
          </div>
          
          <!-- Acciones -->
          <div class="report-actions">
            <!-- Botón para iniciar reclamación -->
            <button
              v-if="effect.status === 'REJECTED'"
              @click="openReclamationModal(effect.id)"
              class="btn btn-primary"
            >
              Iniciar Reclamación
            </button>

            <!-- Botón para proporcionar información adicional -->
            <button
              v-if="effect.status === 'PENDING_INFORMATION'"
              @click="openAdditionalInfoModal(effect)"
              class="btn btn-primary"
            >
              Proporcionar Información Adicional
            </button>
          </div>
        </div>
      </div>

      <!-- Modal para reclamación -->
      <ModalReclamation
        v-if="showReclamationModal"
        @close="showReclamationModal = false"
        :reportId="reclamationReportId"
      />

      <!-- Modal para información adicional -->
      <ModalAdditionalInfo
        v-if="showAdditionalInfoModal"
        @close="showAdditionalInfoModal = false"
        :report="additionalInfoReport"
      />
      
      <div v-if="adverseEffects.length === 0" class="no-reports">
        <p>No has reportado ningún efecto adverso todavía.</p>
        <button @click="goToReportForm" class="btn-report">Reportar un efecto adverso</button>
      </div>
    </div>
    
    <!-- Modal para reclamación -->
    <ModalReclamation v-if="showReclamationModal" @close="showReclamationModal = false" :reportId="reclamationReportId" />
    
    <!-- Modal para información adicional -->
    <ModalAdditionalInfo v-if="showAdditionalInfoModal" @close="showAdditionalInfoModal = false" :report="additionalInfoReport" />
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ModalReclamation from '@/components/dashboard/ModalReclamation.vue'
import ModalAdditionalInfo from '@/components/dashboard/ModalAdditionalInfo.vue'

export default {
  name: 'MyAdverseEffects',
  components: {
    LoadingSpinner,
    ModalReclamation,
    ModalAdditionalInfo
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const isLoading = computed(() => store.state.isLoading)
    const adverseEffects = computed(() => store.state.adverseEffects || [])
    const medications = computed(() => store.state.medications || [])
    const masterMedications = computed(() => store.state.masterMedications || [])
    const isDataReady = ref(false)
    
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES')
    }
    
    const getMedicationName = (medicationId) => {
      if (!medications.value || medications.value.length === 0) {
        return 'Cargando...';
      }
      const medication = medications.value.find(med => med.id === medicationId)
      if (!medication || !medication.medicamento_maestro_id) {
        return 'No encontrado';
      }
      const medicationMaster = masterMedications.value.find(m => m.id === medication.medicamento_maestro_id)
      return medicationMaster ? medicationMaster.nombre : `Medicamento ${medicationId}`
    }
    
    const goToReportForm = () => {
      router.replace('/dashboard/reports');
    }
    
    const showReclamationModal = ref(false)
    const reclamationReportId = ref(null)
    
    const openReclamationModal = (id) => {
      showReclamationModal.value = true
      reclamationReportId.value = id
    }
    
    const showAdditionalInfoModal = ref(false)
    const additionalInfoReport = ref(null)
    
    const openAdditionalInfoModal = (report) => {
      showAdditionalInfoModal.value = true
      additionalInfoReport.value = report
    }
    
    onMounted(async () => {
      if (!medications.value.length) {
        await store.dispatch('fetchMedications')
      }
      if (!masterMedications.value.length) {
        await store.dispatch('fetchMasterMedications')
      }
      await store.dispatch('fetchAdverseEffects')
      isDataReady.value = true;
    })
    
    return {
      isLoading,
      isDataReady,
      adverseEffects,
      formatDate,
      getMedicationName,
      goToReportForm,
      openReclamationModal,
      showReclamationModal,
      reclamationReportId,
      openAdditionalInfoModal,
      showAdditionalInfoModal,
      additionalInfoReport
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

.severity-badge.muy_grave {
  background-color: #842029;
  color: #fff;
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
