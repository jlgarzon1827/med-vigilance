<template>
  <div class="supervisor-dashboard">
    <LoadingSpinner v-if="isLoading" />
    
    <div v-else>
      <h2>Vista General de Reportes</h2>
      
      <!-- Filtros -->
      <ReportFiltersSup/>

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
              <td>
                <span :class="'status-badge ' + report.status.toLowerCase()">
                  {{ 
                    report.status === 'CREATED' ? 'Creado' : 
                    report.status === 'ASSIGNED' ? 'Asignado' : 
                    report.status === 'IN_REVISION' ? 'En Revisión' : 
                    report.status === 'PENDING_INFORMATION' ? 'Pendiente de Información Adicional' : 
                    report.status === 'REJECTED' ? 'Rechazado' : 
                    report.status === 'RECLAIMED' ? 'Reclamado' : 
                    report.status === 'APPROVED' ? 'Aprobado' : 
                    'Estado desconocido'
                  }}
                </span>
              </td>
              <!-- Acciones -->
              <td>
                <!-- Botón para revertir estado -->
                <button button v-if="report.status === 'APPROVED'" @click="openRevertModal(report)" class="btn btn-revert">Revertir Estado</button>

                <!-- Botón para revisar reclamación -->
                <button v-if="report.status === 'RECLAIMED'" @click="openReclamationModal(report.id)" class="btn btn-primary">Revisar Reclamación</button>

                <!-- Botón para ver detalles -->
                <button @click="openDetailModal(report.id)" class="btn btn-info">Ver</button>

                <!-- Dropdown para cambiar estado -->
                <select @change="changeStatus(report, $event)">
                  <option value="">Cambiar Estado</option>
                  <option value="CREATED">Creado</option>
                  <option value="ASSIGNED">Asignado</option>
                  <option value="IN_REVISION">En Revisión</option>
                  <option value="PENDING_INFORMATION">Pendiente de Información Adicional</option>
                  <option value="REJECTED">Rechazado</option>
                  <option value="RECLAIMED">Reclamado</option>
                  <option value="APPROVED">Aprobado</option>
                </select>

                <!-- Dropdown para asignar revisor -->
                <select v-if="professionals.length" @change="assignReviewer(report, $event)">
                  <option value="">Asignar Revisor</option>
                  <option v-for="professional in professionals" :key="professional.id" :value="professional.id">{{ professional.username }}</option>
                </select>

                <!-- Mensaje si no hay profesionales disponibles -->
                <p v-else>No hay profesionales disponibles.</p>
              </td>

              <!-- Revisor asignado -->
              <td>{{ getReviewerName(report.reviewer) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Mensaje cuando no hay datos -->
        <p v-else class="no-data">No hay reportes disponibles.</p>

        <!-- Modales -->
        <!-- Modal para revertir estado -->
        <ModalRevertStatus v-if="showRevertModal" @close="handleRevertModalClose" :reportId="selectedReportId" :key="RevertModalKey" />

        <!-- Modal para revisar reclamación -->
        <ModalReclamation v-if="showReclamationModal" @close="handleReclamationModalClose" :report="selectedReport" :key="ReclamationModalKey" />

        <!-- Modal para ver detalles -->
        <ModalSupReportDetail v-if="showDetailModal" @close="showDetailModal = false" :report="selectedReport"/>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ReportFiltersSup from '@/components/dashboard/ReportFiltersSup.vue';
import ModalRevertStatus from '@/components/dashboard/ModalRevertStatus.vue';
import ModalReclamation from '@/components/dashboard/ModalReviewReclamation.vue';
import ModalSupReportDetail from '@/components/dashboard/ModalSupReportDetail.vue';

export default {
  name: 'SupervisorDashboard',
  components: { LoadingSpinner, ReportFiltersSup, ModalRevertStatus, ModalReclamation, ModalSupReportDetail },
  setup() {
    const store = useStore();
    const isLoading = computed(() => store.state.isLoading);
    const reports = computed(() => store.state.supervisorView || []);
    const professionals = computed(() => store.state.professionals || []);
    const filters = ref({});
    const ReclamationModalKey = ref(0);
    const RevertModalKey = ref(0);
    
    const showRevertModal = ref(false);
    const showReclamationModal = ref(false);
    const showDetailModal = ref(false);
    const selectedReportId = ref(null);
    const selectedReport = ref(null);

    const filteredReports = computed(() => {
      if (!filters.value.status) return reports.value;
      return reports.value.filter(report => report.status === filters.value.status);
    });

    const getReportData = async (id) => {
      try {
        await store.dispatch('fetchReportDetails', id);
        selectedReport.value = store.state.selectedReport;
      } catch (error) {
        console.error('Error al obtener los detalles del reporte:', error);
        alert('No se pudieron cargar los detalles del reporte.');
      }
    };

    // Función para obtener el nombre del revisor
    const getReviewerName = (reviewerId) => {
      const reviewer = professionals.value.find(professional => professional.id === reviewerId);
      return reviewer ? reviewer.username : 'No asignado';
    };

    const openRevertModal = (report) => {
      console.log('ID del reporte seleccionado:', report.id);
      selectedReportId.value = report.id;
      showRevertModal.value = true;
    };

    const handleRevertModalClose = () => {
      showRevertModal.value = false;
      RevertModalKey.value += 1;
    };

    const openReclamationModal = async (id) => {
      getReportData(id)
      showReclamationModal.value = true;
    };

    const handleReclamationModalClose = () => {
      showReclamationModal.value = false;
      ReclamationModalKey.value += 1;
    };

    const openDetailModal = async (id) => {
      getReportData(id)
      showDetailModal.value = true; 
    };

    const assignReviewer = async (report, event) => {
      if (event.target.value) {
        await store.dispatch('assignReviewer', { reportId: report.id, reviewerId: event.target.value });
        alert('Revisor asignado correctamente.');
      }
    };

    const changeStatus = async (report, event) => {
      if (event.target.value) {
        await store.dispatch('updateReportStatus', { reportId: report.id, status: event.target.value });
        alert(`Estado del reporte actualizado a ${event.target.value}.`);
      }
    };

    onMounted(() => {
      store.dispatch('fetchSupervisorView');
      store.dispatch('fetchProfessionals');
    });

    return {
      isLoading,
      reports,
      filteredReports,
      openRevertModal,
      RevertModalKey,
      handleRevertModalClose,
      openReclamationModal,
      ReclamationModalKey,
      handleReclamationModalClose,
      openDetailModal,
      assignReviewer,
      changeStatus,
      professionals,
      showRevertModal,
      showReclamationModal,
      showDetailModal,
      selectedReportId,
      selectedReport,
      getReviewerName,
    };
  },
};
</script>

<style scoped>
.supervisor-dashboard {
  width: 100%;
  padding: 20px;
}

.table-container {
  margin-top: 1.5rem;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
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

.no-data {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  font-style: italic;
}

/* Botones generales */
button {
  padding: 0.5rem;
  border-radius: 4px;
  font-size: inherit;
}

/* Botón para revertir estado */
.btn-revert {
  background-color: #e4fdff;
  color: #000;
}

/* Botón para asignar revisor */
select {
  padding: 0.5rem;
  border-radius: 4px;
  font-size: inherit;
  border: none;
}

select:focus {
  outline: none;
}

/* Badge para contar pendientes */
.badge {
  display: inline-block;
  background-color: #dc3545;
  color: white;
  font-size: 0.75rem;
  padding: 0.1rem 0.4rem;
  border-radius: 10px;
  margin-left: 5px;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.status-badge.creado {
  background-color: #d1e7dd; /* Verde claro */
  color: #0f5132; /* Verde oscuro */
}

.status-badge.asignado {
  background-color: #fff3cd; /* Amarillo claro */
  color: #664d03; /* Amarillo oscuro */
}

.status-badge.en_revision {
  background-color: #f8d7da; /* Rojo claro */
  color: #842029; /* Rojo oscuro */
}

.status-badge.pendiente_info {
  background-color: #fff3cd; /* Amarillo claro */
  color: #664d03; /* Amarillo oscuro */
}

.status-badge.rechazado {
  background-color: #f8d7da; /* Rojo claro */
  color: #842029; /* Rojo oscuro */
}

.status-badge.reclamado {
  background-color: #d1e7dd; /* Verde claro */
  color: #0f5132; /* Verde oscuro */
}

.status-badge.aprobado {
  background-color: #d1e7dd; /* Verde claro */
  color: #0f5132; /* Verde oscuro */
}

</style>

