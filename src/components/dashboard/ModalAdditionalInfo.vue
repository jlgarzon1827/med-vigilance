<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Mensajes del Reporte</h5>
        <button type="button" class="btn-close" @click="$emit('close')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="chat-history">
          <div
            v-for="(msg, idx) in localReport.chat_messages"
            :key="idx"
            :class="['chat-message', msg.sender === 'patient' ? 'from-patient' : 'from-reviewer']"
          >
            <div class="message-meta">
              <span class="sender">{{ msg.sender === 'patient' ? 'Paciente' : 'Revisor' }}</span>
              <span class="timestamp">{{ formatTimestamp(msg.timestamp) }}</span>
            </div>
            <div class="message-content">{{ msg.message }}</div>
          </div>
          <div v-if="!localReport.chat_messages.length" class="no-messages">
            No hay mensajes aún.
          </div>
        </div>
        <form class="chat-input" @submit.prevent="sendMessage">
          <textarea
            v-model="newMessage"
            placeholder="Escribe tu mensaje..."
            class="form-control"
            rows="2"
          ></textarea>
          <button type="submit" class="btn-send" :disabled="!newMessage.trim()">Enviar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ModalAdditionalInfo',
  props: {
    report: Object,
  },
  setup(props) {
    const store = useStore()
    const localReport = ref({ ...props.report })
    const newMessage = ref('')

    // Formatea la fecha y hora del mensaje
    const formatTimestamp = (timestamp) => {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      return date.toLocaleString()
    }

    const sendMessage = async () => {
      if (!newMessage.value.trim()) return
      try {
        await store.dispatch('sendMessage', {
          effectId: localReport.value.id,
          message: newMessage.value.trim(),
        })
        // Opcional: Recargar mensajes desde la store si es necesario
        // Aquí simplemente lo agregamos localmente:
        localReport.value.chat_messages.push({
          sender: 'patient',
          message: newMessage.value.trim(),
          timestamp: new Date().toISOString(),
        })
        newMessage.value = ''
      } catch (error) {
        alert('No se pudo enviar el mensaje.')
        console.error(error)
      }
    }

    watch(
      () => props.report,
      (newReport) => {
        if (newReport && newReport.id) {
          localReport.value = { ...newReport }
        } else {
          localReport.value = {}
        }
      },
      { immediate: true }
    )

    return {
      localReport,
      newMessage,
      sendMessage,
      formatTimestamp,
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

.chat-history {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1.5rem;
  background: #f7f7f9;
  padding: 1rem;
  border-radius: 6px;
}

.chat-message {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 6px;
}

.from-patient {
  background: #d1e7dd;
  align-self: flex-end;
}

.from-reviewer {
  background: #f8d7da;
  align-self: flex-start;
}

.message-meta {
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 0.25rem;
  display: flex;
  justify-content: space-between;
}

.message-content {
  font-size: 1rem;
}

.chat-input {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
}

.chat-input textarea {
  flex: 1;
  resize: none;
}

.btn-send {
  background: #0f5132;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}

.btn-send:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.no-messages {
  color: #888;
  text-align: center;
  padding: 1rem 0;
}
</style>