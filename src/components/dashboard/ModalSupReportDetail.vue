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
          <!-- Información General -->
          <div class="info-section">
              <h3>Información General</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">Paciente:</span>
                  <span class="value">{{ report.patient_name || 'Usuario ' + report.patient }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Medicamento:</span>
                  <span class="value">{{ report.medicamento_nombre || 'Med ' + report.medication }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Fecha Reporte:</span>
                  <span class="value">{{ formatDate(report.reported_at) }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Estado:</span>
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
                </div>
              </div>

              <!-- Detalles del Efecto Adverso -->
              <div class="info-section">
                <h3>Detalles del Efecto Adverso</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="label">Severidad:</span>
                    <span :class="'severity-badge ' + report.severity.toLowerCase()">{{ report.severity }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Tipo:</span>
                    <span class="value">{{ report.type }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Fecha Inicio:</span>
                    <span class="value">{{ formatDate(report.start_date) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Fecha Fin:</span>
                    <span class="value">{{ formatDate(report.end_date) || 'No especificada' }}</span>
                  </div>
                </div>
              </div>

              <!-- Descripción -->
              <div class="info-section">
                <h3>Descripción</h3>
                <p class="description">{{ report.description }}</p>
              </div>

              <!-- Información de Administración -->
              <div class="info-section">
                <h3>Administración</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="label">Vía:</span>
                    <span class="value">{{ report.administration_route }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Dosis:</span>
                    <span class="value">{{ report.dosage }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Frecuencia:</span>
                    <span class="value">{{ report.frequency }}</span>
                  </div>
                </div>
              </div>

              <!-- Información Adicional -->
              <div v-if="report.additional_info" class="info-section">
                <h3>Información Adicional</h3>
                <p>{{ report.additional_info }}</p>
              </div>

            <!-- Acciones -->
            <div class="modal-actions">
              <button type="button" class="btn-close-bottom" @click="$emit('close')">Cerrar</button>
            </div>
          </div>
      </div>
      <div v-else>
        <p>No hay datos disponibles para este reporte.</p>
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
      return date.toLocaleDateString('es-ES')
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

.info-section h3 {
  color: #2c3e50;
}

.info-grid {
  display: grid; 
}

/* Botón inferior */
.btn-close-bottom {
 background-color:#f8f9fa;}
</style>
