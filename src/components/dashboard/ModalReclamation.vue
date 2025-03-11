<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Iniciar Reclamación</h5>
        <button type="button" class="btn-close" @click="$emit('close')">&times;</button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="startReclamation">
          <div class="info-section">
            <label for="reclamationReason" class="form-label">Motivo de la reclamación:</label>
            <textarea
              class="form-control"
              id="reclamationReason"
              v-model="reclamationReason"
              placeholder="Explique brevemente el motivo de su reclamación"
              required
            ></textarea>
          </div>

          <div class="modal-actions">
            <button type="submit" class="btn-review">Enviar Reclamación</button>
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
  name: 'ModalReclamation',
  props: {
    reportId: Number,
  },
  setup(props, { emit }) {
    const store = useStore()
    const reclamationReason = ref('')

    const startReclamation = async () => {
      try {
        await store.dispatch('startReclamation', { id: props.reportId, reason: reclamationReason.value })
        alert('Reclamación iniciada correctamente.')
        emit('close')
      } catch (error) {
        console.error('Error iniciando reclamación:', error)
        alert('Ocurrió un error al iniciar la reclamación.')
      }
    }

    return {
      startReclamation,
      reclamationReason,
    }
  },
}
</script>

<style scoped>
.modal {
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
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h5 {
  font-size: 1.25rem;
  color: #2c3e50;
}

.btn-review {
  background-color: #d1e7dd;
  color: #0f5132;
}

.btn-review:hover {
  background-color: #0f5132;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-body .info-section {
  margin-bottom: 1.5rem;
}

.modal-body label {
  font-weight: bold;
}

.modal-body textarea {
  width: calc(100% - 2rem);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-close-bottom {
  background: none;
  border: none;
}
</style>