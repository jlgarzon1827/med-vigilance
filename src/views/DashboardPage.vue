<template>
  <div class="dashboard">
    <h1>Dashboard de Farmacovigilancia</h1>
    
    <div class="dashboard-tabs">
      <!-- Mostrar todas las pestañas para profesionales -->
      <template v-if="isProfessional">
        <div 
          v-for="tab in tabs" 
          :key="tab.id" 
          :class="['tab', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          {{ tab.name }}
        </div>
      </template>
      
      <!-- Mostrar solo pestañas relevantes para pacientes -->
      <template v-else>
        <div 
          v-for="tab in patientTabs" 
          :key="tab.id" 
          :class="['tab', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          {{ tab.name }}
        </div>
      </template>
    </div>
    
    <div class="dashboard-content">
      <!-- Estadísticas generales (solo profesionales) -->
      <div v-if="activeTab === 'statistics' && isProfessional" class="tab-content">
        <StatisticsPanel />
      </div>
      
      <!-- Estadísticas por medicamento (solo profesionales) -->
      <div v-if="activeTab === 'medication-stats' && isProfessional" class="tab-content">
        <MedicationStatistics />
      </div>
      
      <!-- Tendencias (solo profesionales) -->
      <div v-if="activeTab === 'trends' && isProfessional" class="tab-content">
        <TrendsPanel />
      </div>
      
      <!-- Reportes de efectos adversos (solo profesionales) -->
      <div v-if="activeTab === 'reports' && isProfessional" class="tab-content">
        <ReportsList />
      </div>
      
      <!-- Revisiones pendientes (solo profesionales) -->
      <div v-if="activeTab === 'pending' && isProfessional" class="tab-content">
        <PendingReviews />
      </div>
      
      <!-- Exportación de datos (solo profesionales) -->
      <div v-if="activeTab === 'export' && isProfessional" class="tab-content">
        <ExportOptions />
      </div>
      
      <!-- Medicamentos (ambos roles) -->
      <div v-if="activeTab === 'medications'" class="tab-content">
        <MedicationList @showAddModal="showAddModal = true" />
        <AddMedication v-if="showAddModal" @close="showAddModal = false" />
      </div>
      
      <!-- Reportar efectos adversos (solo pacientes) -->
      <div v-if="activeTab === 'report-adverse' && !isProfessional" class="tab-content">
        <ReportAdverseEffect />
      </div>
      
      <!-- Mis reportes (solo pacientes) -->
      <div v-if="activeTab === 'my-reports' && !isProfessional" class="tab-content">
        <MyAdverseEffects />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import MedicationList from '@/components/MedicationList.vue'
import AddMedication from '@/components/AddMedication.vue'
import StatisticsPanel from '@/components/dashboard/StatisticsPanel.vue'
import MedicationStatistics from '@/components/dashboard/MedicationStatistics.vue'
import TrendsPanel from '@/components/dashboard/TrendsPanel.vue'
import ReportsList from '@/components/dashboard/ReportsList.vue'
import PendingReviews from '@/components/dashboard/PendingReviews.vue'
import ExportOptions from '@/components/dashboard/ExportOptions.vue'
import ReportAdverseEffect from '@/components/ReportAdverseEffect.vue'
import MyAdverseEffects from '@/components/MyAdverseEffects.vue'

export default {
  name: 'DashboardPage',
  components: {
    MedicationList,
    AddMedication,
    StatisticsPanel,
    MedicationStatistics,
    TrendsPanel,
    ReportsList,
    PendingReviews,
    ExportOptions,
    ReportAdverseEffect,
    MyAdverseEffects
  },
  setup() {
    const store = useStore()
    const username = computed(() => store.state.user || 'Usuario')
    const showAddModal = ref(false)
    const activeTab = ref('medications')
    const userProfile = computed(() => store.state.userProfile)
    const isProfessional = computed(() => {
      return userProfile.value?.profile?.user_type === 'PROFESSIONAL'
    })
    
    const tabs = [
      { id: 'statistics', name: 'Estadísticas Generales' },
      { id: 'medication-stats', name: 'Estadísticas por Medicamento' },
      { id: 'trends', name: 'Tendencias' },
      { id: 'reports', name: 'Reportes' },
      { id: 'pending', name: 'Revisiones Pendientes' },
      { id: 'export', name: 'Exportar Datos' },
      { id: 'medications', name: 'Mis Medicamentos' }
    ]
    
    const patientTabs = computed(() => {
      return [
        { id: 'medications', name: 'Mis Medicamentos' },
        { id: 'report-adverse', name: 'Reportar Efecto Adverso' },
        { id: 'my-reports', name: 'Mis Reportes' }
      ]
    })
    
    onMounted(() => {
      // Cargar datos del perfil de usuario si no están cargados
      if (!userProfile.value) {
        store.dispatch('fetchUserProfile')
      }
      
      // Cargar datos necesarios para el dashboard
      if (isProfessional.value) {
        store.dispatch('fetchAdverseEffects')
        store.dispatch('fetchDashboardStatistics')
      }
      
      // Cargar medicamentos para todos los usuarios
      store.dispatch('fetchMedications')
    })
    
    // Vigilar cambios en el perfil para cargar datos cuando sea necesario
    watch(isProfessional, (newValue) => {
      if (newValue) {
        store.dispatch('fetchAdverseEffects')
        store.dispatch('fetchDashboardStatistics')
      }
      
      // Si el usuario no es profesional y está en una pestaña de profesional, redirigir a medicamentos
      if (!newValue && !patientTabs.value.some(tab => tab.id === activeTab.value)) {
        activeTab.value = 'medications'
      }
    })

    return {
      username,
      showAddModal,
      activeTab,
      tabs,
      patientTabs,
      userProfile,
      isProfessional
    }
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.dashboard-tabs {
  display: flex;
  overflow-x: auto;
  margin-bottom: 2rem;
  border-bottom: 1px solid #dee2e6;
}

.tab {
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab:hover {
  background-color: #f8f9fa;
}

.tab.active {
  border-bottom: 3px solid #7da9bd;
  font-weight: 600;
}

.dashboard-content {
  margin-top: 2rem;
}

.tab-content {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  padding: 1.5rem;
}
</style>
