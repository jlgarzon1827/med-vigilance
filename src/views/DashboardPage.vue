<template>
  <div class="dashboard">
    <h1>Dashboard de Farmacovigilancia</h1>
    
    <div class="dashboard-tabs">
      <!-- Mostrar todas las pestañas para administradores -->
      <template v-if="isAdmin">
        <div 
          v-for="tab in adminTabs" 
          :key="tab.id" 
          :class="['tab', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          {{ tab.name }}
        </div>
      </template>
      
      <!-- Mostrar todas las pestañas para supervisores -->
      <template v-if="isSupervisor && !isAdmin">
        <div 
          v-for="tab in supervisorTabs" 
          :key="tab.id" 
          :class="['tab', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          {{ tab.name }}
        </div>
      </template>
      
      <!-- Mostrar todas las pestañas para profesionales -->
      <template v-if="isProfessional && !isAdmin && !isSupervisor">
        <div 
          v-for="tab in professionalTabs" 
          :key="tab.id" 
          :class="['tab', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          {{ tab.name }}
        </div>
      </template>
      
      <!-- Mostrar solo pestañas relevantes para pacientes -->
      <template v-if="isPatient">
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
      <!-- Estadísticas generales (solo supervisores) -->
      <div v-if="activeTab === 'statistics' && isSupervisor" class="tab-content">
        <StatisticsPanel />
      </div>
      
      <!-- Tendencias (solo supervisores) -->
      <div v-if="activeTab === 'trends' && isSupervisor" class="tab-content">
        <TrendsPanel />
      </div>

      <!-- Estadísticas por medicamento (solo supervisores) -->
      <div v-if="activeTab === 'medication-statistics' && isSupervisor" class="tab-content">
        <MedicationStatistics />
      </div>
      
      <!-- Reportes de efectos adversos (solo profesionales) -->
      <div v-if="activeTab === 'reports' && isProfessional" class="tab-content">
        <ReportsList />
      </div>
      
      <!-- Revisiones pendientes (solo profesionales) -->
      <div v-if="activeTab === 'pending' && isProfessional" class="tab-content">
        <PendingReviews />
      </div>
      
      <!-- Exportación de datos (solo administradores) -->
      <div v-if="activeTab === 'export' && isAdmin" class="tab-content">
        <ExportOptions />
      </div>
      
      <!-- Medicamentos (solo pacientes y profesionales) -->
      <div v-if="activeTab === 'medications' && (isPatient || isProfessional)" class="tab-content">
        <MedicationList @showAddModal="showAddModal = true" />
        <AddMedication v-if="showAddModal" @close="showAddModal = false" />
      </div>
      
      <!-- Reportar efectos adversos (solo pacientes) -->
      <div v-if="activeTab === 'report-adverse' && isPatient" class="tab-content">
        <ReportAdverseEffect />
      </div>
      
      <!-- Mis reportes (solo pacientes) -->
      <div v-if="activeTab === 'my-reports' && isPatient" class="tab-content">
        <MyAdverseEffects />
      </div>
      
      <!-- Vista general de reportes para supervisores -->
      <div v-if="activeTab === 'supervisor-view' && isSupervisor" class="tab-content">
        <SupervisorDashboard />
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
import TrendsPanel from '@/components/dashboard/TrendsPanel.vue'
import ReportsList from '@/components/dashboard/ReportsList.vue'
import PendingReviews from '@/components/dashboard/PendingReviews.vue'
import ExportOptions from '@/components/dashboard/ExportOptions.vue'
import ReportAdverseEffect from '@/components/ReportAdverseEffect.vue'
import MyAdverseEffects from '@/components/MyAdverseEffects.vue'
import SupervisorDashboard from '@/components/dashboard/SupervisorDashboard.vue'
import MedicationStatistics from '@/components/dashboard/MedicationStatistics.vue'

export default {
  name: 'DashboardPage',
  components: {
    MedicationList,
    AddMedication,
    StatisticsPanel,
    TrendsPanel,
    MedicationStatistics,
    ReportsList,
    PendingReviews,
    ExportOptions,
    ReportAdverseEffect,
    MyAdverseEffects,
    SupervisorDashboard
  },
  setup() {
    const store = useStore()
    const username = computed(() => store.state.user || 'Usuario')
    const showAddModal = ref(false)
    const activeTab = computed({
      get: () => store.state.activeTab,
      set: (value) => {
        store.commit('setActiveTab', value)
        localStorage.setItem('activeTab', value)
      }
    })
    
    const setValidActiveTab = () => {
      const currentTab = activeTab.value;
      const availableTabs = isAdmin.value ? adminTabs : isSupervisor.value ? supervisorTabs : isProfessional.value ? professionalTabs : patientTabs.value;

      if (!availableTabs.some(tab => tab.id === currentTab)) {
        activeTab.value = availableTabs[0].id;
      }
    }
    
    const userProfile = computed(() => store.state.userProfile)
    const isAdmin = computed(() => {
      return userProfile.value?.profile?.user_type === 'ADMIN'
    })
    const isSupervisor = computed(() => {
      return userProfile.value?.profile?.user_type === 'SUPERVISOR'
    })
    const isProfessional = computed(() => {
      return userProfile.value?.profile?.user_type === 'PROFESSIONAL'
    })
    const isPatient = computed(() => {
      return userProfile.value?.profile?.user_type === 'PATIENT'
    })
    
    const adminTabs = [
      { id: 'export', name: 'Exportar Datos' }
    ]
    
    const supervisorTabs = [
      { id: 'supervisor-view', name: 'Vista General de Reportes' },
      { id: 'statistics', name: 'Estadísticas Generales' },
      { id: 'trends', name: 'Tendencias' },
      { id: 'medication-statistics', name: 'Estadísticas por Medicamento' }
    ]
    
    const professionalTabs = [
      { id: 'reports', name: 'Reportes' },
      { id: 'pending', name: 'Revisiones Pendientes' }
    ]
    
    const patientTabs = computed(() => {
      return [
        { id: 'medications', name: 'Medicación' },
        { id: 'report-adverse', name: 'Reportar Efecto Adverso' },
        { id: 'my-reports', name: 'Mis Reportes' }
      ]
    })
    
    const showStatistics = computed(() => {
      return store.state.dashboardStatistics.length > 0
    })
    
    const showTrends = computed(() => {
      return store.state.trends.length > 0
    })
    
    onMounted(() => {
      const savedTab = localStorage.getItem('activeTab')
      if (savedTab) {
        store.commit('setActiveTab', savedTab)
      }
      if (!userProfile.value) {
        store.dispatch('fetchUserProfile')
      }
      else {
        setValidActiveTab();
      }
      if (isAdmin.value) {
        store.dispatch('fetchAdverseEffects')
        store.dispatch('fetchDashboardStatistics')
      } else if (isSupervisor.value) {
        store.dispatch('fetchSupervisorView')
        store.dispatch('fetchDashboardStatistics')
      } else if (isProfessional.value) {
        store.dispatch('fetchAdverseEffects')
        store.dispatch('fetchDashboardStatistics')
      }
      store.dispatch('fetchMedications')
    })
    
    watch(isAdmin, (newValue) => {
      if (newValue) {
        store.dispatch('fetchDashboardStatistics')
      }
      
      // Si el usuario no es administrador y está en una pestaña de administrador, redirigir a medicamentos
      if (!newValue && !adminTabs.some(tab => tab.id === activeTab.value)) {
        activeTab.value = 'medications'
      }

      setValidActiveTab()
    })

    watch(isSupervisor, (newValue) => {
      if (newValue) {
        store.dispatch('fetchSupervisorView')
        store.dispatch('fetchDashboardStatistics')
      }
      
      // Si el usuario no es supervisor y está en una pestaña de supervisor, redirigir a medicamentos
      if (!newValue && !supervisorTabs.some(tab => tab.id === activeTab.value)) {
        activeTab.value = 'medications'
      }

      setValidActiveTab()
    })

    watch(isProfessional, (newValue) => {
      if (newValue) {
        store.dispatch('fetchAdverseEffects')
        store.dispatch('fetchDashboardStatistics')
      }
      
      // Si el usuario no es profesional y está en una pestaña de profesional, redirigir a medicamentos
      if (!newValue && !professionalTabs.some(tab => tab.id === activeTab.value)) {
        activeTab.value = 'medications'
      }

      setValidActiveTab()
    })

    return {
      username,
      showAddModal,
      activeTab,
      adminTabs,
      supervisorTabs,
      professionalTabs,
      patientTabs,
      userProfile,
      isAdmin,
      isSupervisor,
      isProfessional,
      isPatient,
      setValidActiveTab,
      showStatistics,
      showTrends
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
