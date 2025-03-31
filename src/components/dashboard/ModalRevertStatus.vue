<template>
  <div class="report-detail-modal">
    <div class="modal-content">
      <!-- Encabezado del modal -->
      <div class="modal-header">
        <h5 class="modal-title">Revertir Estado</h5>
        <button type="button" class="btn-close" @click="$emit('close')">&times;</button>
      </div>

      <!-- Cuerpo del modal -->
      <div class="modal-body">
        <form @submit.prevent="revertStatus">
          <!-- Campo para la causa del revert -->
          <div class="info-section">
            <label for="revertReason" class="form-label">Motivo del cambio de estado:</label>
            <textarea
              class="form-control"
              id="revertReason"
              v-model="revertReason"
              placeholder="Explique brevemente el motivo del cambio de estado"
              required
            ></textarea>
          </div>

          <!-- Acciones del modal -->
          <div class="modal-actions">
            <button type="submit" class="btn-review">Confirmar Reversión</button>
            <button type="button" class="btn-close-bottom" @click="$emit('close')">Cancelar</button>
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
  name: 'ModalRevertStatus',
  props: {
    reportId: Number,
  },
  setup(props, { emit }) {
    const store = useStore()
    const revertReason = ref('')

    const revertStatus = async () => {
      try {
        await store.dispatch('revertReportStatus', { reportId: props.reportId, reason: revertReason.value })
        alert('Estado revertido correctamente.')
        emit('close')
      } catch (error) {
        console.error('Error al revertir el estado:', error)
        alert('Ocurrió un error al intentar revertir el estado.')
      }
    }

    return {
      revertStatus,
      revertReason,
    }
  },
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

.modal-body textarea {
  width: calc(100% - 2rem);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-review {
  background-color: #d1e7dd;
}

.btn-review:hover {
  background-color: #0f5132;
}
</style>
