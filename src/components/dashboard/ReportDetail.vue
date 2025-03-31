<template>
  <div class="report-detail-modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Detalle del Reporte</h2>
        <button @click="$emit('close')" class="btn-close">&times;</button>
      </div>
      
      <div class="report-info">
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
        </div>
        
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
              <span class="value">{{ report.start_date }}</span>
            </div>
            <div class="info-item">
              <span class="label">Fecha Fin:</span>
              <span class="value">{{ report.end_date || 'No especificada' }}</span>
            </div>
          </div>
        </div>
        
        <div class="info-section">
          <h3>Descripción</h3>
          <p class="description">{{ report.description }}</p>
        </div>
        
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
      </div>
      
      <div class="modal-actions">
        <button 
          v-if="report.status === 'PENDING'" 
          @click="markAsReviewed" 
          class="btn-review"
        >
          Marcar como Revisado
        </button>
        <button @click="$emit('close')" class="btn-close-bottom">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'

export default {
  name: 'ReportDetail',
  props: {
    report: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const store = useStore()
    
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString()
    }
    
    const markAsReviewed = async () => {
      const success = await store.dispatch('markAsReviewed', props.report.id)
      if (success) {
        emit('close')
      }
    }
    
    return {
      formatDate,
      markAsReviewed
    }
  }
}
</script>

<style scoped>
.report-detail-modal {
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
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
}

.info-section {
  margin-bottom: 2rem;
}

.info-section h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
  font-size: 1.1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.25rem;
}

.value {
  color: #2c3e50;
}

.description {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  color: #2c3e50;
  line-height: 1.5;
}

.severity-badge, .status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  align-self: flex-start;
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

.status-badge.creado {
  background-color: #d1e7dd;
  color: #0f5132;
}

.status-badge.asignado {
  background-color: #fff3cd;
  color: #664d03;
}

.status-badge.en_revision {
  background-color: #f8d7da;
  color: #842029;
}

.status-badge.pendiente_info {
  background-color: #fff3cd;
  color: #664d03;
}

.status-badge.rechazado {
  background-color: #f8d7da;
  color: #842029;
}

.status-badge.reclamado {
  background-color: #d1e7dd;
  color: #0f5132;
}

.status-badge.aprobado {
  background-color: #d1e7dd;
  color: #0f5132;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #dee2e6;
}

.btn-review, .btn-close-bottom {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-review {
  background-color: #d1e7dd;
  color: #0f5132;
}

.btn-close-bottom {
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  color: #495057;
}

.btn-review:hover {
  background-color: #0f5132;
  color: #fff;
}

.btn-close-bottom:hover {
  background-color: #e9ecef;
}
</style>
