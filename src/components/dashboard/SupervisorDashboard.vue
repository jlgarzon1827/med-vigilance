<template>
  <div class="supervisor-dashboard">
    <LoadingSpinner v-if="isLoading" />
    
    <div v-else>
      <h2>Vista General de Reportes</h2>
      
      <!-- Filtros -->
      <ReportFilters @filter-changed="applyFilters" />

      <!-- Tabla de Reportes -->
      <div class="table-container">
        <table v-if="reports.length">
          <thead>
            <tr>
              <th>ID</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
              <th>Revisor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="report in filteredReports" :key="report.id">
              <td>{{ report.id }}</td>
              <td>{{ report.description }}</td>
              <td>{{ report.status }}</td>
              <td>
                <button @click="revertStatus(report)" class="btn-revert">Revertir Estado</button>
                <select v-if="professionals.length" @change="assignReviewer(report, $event)">
                  <option value="">Asignar Revisor</option>
                  <option v-for="professional in professionals" :key="professional.id" :value="professional.id">{{ professional.username }}</option>
                </select>
                <p v-else>No hay profesionales disponibles.</p>
              </td>
              <td>{{ report.reviewer ? report.reviewer.username : 'No asignado' }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Mensaje cuando no hay datos -->
        <p v-else class="no-data">No hay reportes disponibles.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ReportFilters from '@/components/dashboard/ReportFilters.vue';

export default {
  name: 'SupervisorDashboard',
  components: { LoadingSpinner, ReportFilters },
  setup() {
    const store = useStore();
    const isLoading = computed(() => store.state.isLoading);
    const reports = computed(() => store.state.supervisorView || []);
    const filters = ref({});
    const professionals = computed(() => store.state.professionals || []);

    const filteredReports = computed(() => {
      if (!filters.value.status) return reports.value;
      return reports.value.filter(report => report.status === filters.value.status);
    });

    const applyFilters = async (newFilters) => {
      filters.value = newFilters;
      const response = await store.dispatch('fetchSupervisorView', newFilters);
      // Actualiza el estado local con los datos filtrados
      store.commit('updateSupervisorView', response);
    };

    const revertStatus = async (report) => {
      await store.dispatch('revertReportStatus', report.id);
      alert('Estado revertido correctamente.');
    };

    const assignReviewer = async (report, event) => {
      if (event.target.value) {
        await store.dispatch('assignReviewer', { reportId: report.id, reviewerId: event.target.value });
        alert('Revisor asignado correctamente.');
      }
    };

    onMounted(() => {
      store.dispatch('fetchSupervisorView');
      store.dispatch('fetchProfessionals');
    });

    return { isLoading, reports, filteredReports, applyFilters, revertStatus, assignReviewer, professionals };
  },
};
</script>

<style scoped>
.supervisor-dashboard {
  padding: 20px;
}

.table-container {
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.no-data {
  text-align: center;
  color: #888;
}
</style>
