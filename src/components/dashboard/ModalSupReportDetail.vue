<template>
  <div class="super-report-detail-modal">
    <div class="modal-content">
      <!-- Encabezado del modal -->
      <div class="modal-header">
        <h5 class="modal-title">Detalle Completo del Reporte</h5>
        <button type="button" class="btn-close" @click="$emit('close')">&times;</button>
      </div>
      
      <!-- Cuerpo del modal -->
      <div class="modal-body">
        <!-- Información General -->
        <div v-if="report" class="info-section">
          <h3>Información General</h3>
          <p><strong>Paciente:</strong> {{ report.patient_name || `Usuario ${report.patient}` }}</p>
          <p><strong>Medicamento:</strong> {{ report.medicamento_nombre }}</p>
          <p><strong>Estado:</strong> 
            <span :class="'status-badge ' + report.status.toLowerCase()">
              {{ mapStatus(report.status) }}
            </span>
          </p>
          <p><strong>Severidad:</strong> 
            <span :class="'severity-badge ' + report.severity.toLowerCase()">
              {{ report.severity }}
            </span>
          </p>
        </div>

        <!-- Mensaje si no hay datos -->
        <div v-else>
          <p>No hay datos disponibles para este reporte.</p>
        </div>

        <!-- Acciones -->
        <div class="modal-actions">
          <button type="button" class="btn-close-bottom" @click="$emit('close')">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalReportDetail',
  props: {
    report: Object, // Objeto del reporte que contiene toda la información
  },
  setup() {
    // Formatea las fechas en un formato legible
    const formatDate = (dateString) => {
      if (!dateString) return 'No disponible'
      const date = new Date(dateString)
      return date.toLocaleDateString()
    }

    // Mapea el estado a un texto legible
    const mapStatus = (status) => {
      const statuses = {
        CREATED: 'Creado',
        ASSIGNED: 'Asignado',
        IN_REVISION: 'En Revisión',
        PENDING_INFORMATION: 'Pendiente de Información Adicional',
        REJECTED: 'Rechazado',
        RECLAIMED: 'Reclamado',
        APPROVED: 'Aprobado',
      }
      return statuses[status] || 'Estado desconocido'
    }

    return {
      formatDate,
      mapStatus,
    }
  },
}
</script>

<style scoped>
.super-report-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
}

.modal-header h5 {
  font-size: 1.25rem;
}

.btn-close {
  background: none;
  border: none;
}

.modal-body .info-section {
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
}

.status-badge,
.severity-badge {
  display: inline-block;
}
</style>
