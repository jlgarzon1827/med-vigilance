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
        <!-- Formulario editable -->
        <form @submit.prevent="submitReview">
          <!-- Campos editables -->
          <div class="info-section">
            <!-- Descripción -->
            <label for="description" class="form-label">Descripción:</label>
            <textarea
              id="description"
              v-model="editableReport.description"
              placeholder="Actualice la descripción"
              required
            ></textarea>

            <!-- Dosis -->
            <label for="dosage" class="form-label">Dosis:</label>
            <input
              id="dosage"
              v-model="editableReport.dosage"
              placeholder="Actualice la dosis"
              required
            />

            <!-- Frecuencia -->
            <label for="frequency" class="form-label">Frecuencia:</label>
            <input
              id="frequency"
              v-model="editableReport.frequency"
              placeholder="Actualice la frecuencia"
              required
            />

            <!-- Motivo de la reclamación -->
            <label for="reclamationReason" class="form-label">Motivo de la Reclamación:</label>
            <textarea
              id="reclamationReason"
              v-model="editableReport.reclamation_reason"
              placeholder="Actualice el motivo de la reclamación"
            ></textarea>
          </div>

          <!-- Acciones -->
          <div class="modal-actions">
            <!-- Botón para aprobar la reclamación -->
            <button type="button" @click="approveReclamation" class="btn-review">Aprobar Reclamación</button>

            <!-- Botón para rechazar la reclamación -->
            <button type="button" @click="rejectReclamation" class="btn-danger">Rechazar Reclamación</button>

            <!-- Botón para cancelar -->
            <button type="button" @click="$emit('close')" class="btn-close-bottom">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ModalReviewReclamation',
  props: {
    report: Object,
  },
  setup(props, { emit }) {
    const store = useStore()
    const editableReport = ref({ ...props.report })

    const submitReview = async () => {
      try {
        await store.dispatch('updateReport', editableReport.value)
        alert('Reporte actualizado correctamente.')
        emit('close') // Cierra el modal después de actualizar el reporte
      } catch (error) {
        console.error('Error al enviar los cambios:', error)
        alert('Ocurrió un error al actualizar el reporte.')
      }
    }

    const approveReclamation = async () => {
      try {
        await store.dispatch('approveReclamation', props.report.id)
        alert('Reclamación aprobada correctamente.')
        emit('close') // Cierra el modal después de aprobar la reclamación
      } catch (error) {
        console.error('Error al aprobar la reclamación:', error)
        alert('Ocurrió un error al aprobar la reclamación.')
      }
    }

    const rejectReclamation = async () => {
      try {
        await store.dispatch('rejectReclamation', props.report.id)
        alert('Reclamación rechazada correctamente.')
        emit('close') // Cierra el modal después de rechazar la reclamación
      } catch (error) {
        console.error('Error al rechazar la reclamación:', error)
        alert('Ocurrió un error al rechazar la reclamación.')
      }
    }

    return {
      editableReport,
      submitReview,
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
  background-color: #0f5132;
}

</style>
