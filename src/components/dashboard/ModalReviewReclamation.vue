<template>
  <div class="review-reclamation-modal">
    <div class="modal-content">
      <!-- Encabezado del modal -->
      <div class="modal-header">
        <h5 class="modal-title">Revisar Reclamación</h5>
        <button type="button" class="btn-close" @click="$emit('close')">&times;</button>
      </div>

      <!-- Cuerpo del modal -->
      <div class="modal-body">
        <!-- Mostrar motivo de la reclamación -->
        <div v-if="report" class="info-section">
          <label for="reclamationReason" class="form-label">Motivo de la Reclamación:</label>
          <p id="reclamationReason" class="form-value">{{ report.reclamation_reason || 'No especificado' }}</p>
        </div>
        <p v-else>No hay datos disponibles para este reporte.</p>

        <!-- Acciones -->
        <div class="modal-actions">
          <!-- Botón para aprobar la reclamación -->
          <button type="button" @click="approveReclamation" class="btn-review">Aprobar Reclamación</button>

          <!-- Botón para rechazar la reclamación -->
          <button type="button" @click="rejectReclamation" class="btn-danger">Rechazar Reclamación</button>

          <!-- Botón para cancelar -->
          <button type="button" @click="$emit('close')" class="btn-close-bottom">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { useStore } from 'vuex'

export default {
  name: 'ModalReviewReclamation',
  props: {
    report: {
      type: Object,
      required: true, // Asegúrate de que el reporte sea obligatorio
    },
  },
  setup(props, { emit }) {
    const store = useStore()

    const approveReclamation = async () => {
      try {
        await store.dispatch('approveReclamation', props.report.id)
        alert('Reclamación aprobada correctamente.')
        emit('close')
      } catch (error) {
        console.error('Error al aprobar la reclamación:', error)
        alert('Ocurrió un error al aprobar la reclamación.')
      }
    }

    const rejectReclamation = async () => {
      try {
        await store.dispatch('rejectReclamation', props.report.id)
        alert('Reclamación rechazada correctamente.')
        emit('close')
      } catch (error) {
        console.error('Error al rechazar la reclamación:', error)
        alert('Ocurrió un error al rechazar la reclamación.')
      }
    }

    return {
      approveReclamation,
      rejectReclamation,
    }
  },
}
</script>

<style scoped>
.review-reclamation-modal {
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
  max-width: 600px;
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

.modal-body textarea,
.modal-body input {
  width: calc(100% - 2rem);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-review {
  background-color: #d1e7dd; /* Verde claro */
}

.btn-review:hover {
  background-color: #0f5132; /* Verde oscuro */
}

.btn-danger {
  background-color: #f8d7da; /* Rojo claro */
}

.btn-danger:hover {
  background-color: #842029; /* Rojo oscuro */
}
</style>
