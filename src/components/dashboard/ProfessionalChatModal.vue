<!-- ProfessionalChatModal.vue -->
<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Chat con Paciente</h5>
        <button type="button" class="btn-close" @click="$emit('close')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="chat-history">
          <div
            v-for="(msg, idx) in localReport.chat_messages"
            :key="idx"
            :class="['chat-message', msg.sender === 'patient' ? 'from-patient' : 'from-professional']"
          >
            <div class="message-meta">
              <span class="sender">{{ msg.sender === 'patient' ? 'Paciente' : 'Profesional' }}</span>
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
        <button
          v-if="localReport.status === 'PENDING_INFORMATION'"
          @click="closeChat"
          class="btn-close-chat"
        >
          Cerrar Chat
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ProfessionalChatModal',
  props: {
    report: Object,
  },
  emits: ['close'],
  setup(props, { emit }) {
    const store = useStore()
    const localReport = ref({ ...props.report })
    const newMessage = ref('')

    watch(
      () => props.report,
      (newReport) => {
        localReport.value = { ...newReport }
      },
      { immediate: true }
    )

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
          sender: 'professional'
        })
        localReport.value.chat_messages.push({
          sender: 'professional',
          message: newMessage.value.trim(),
          timestamp: new Date().toISOString(),
        })
        newMessage.value = ''
      } catch (error) {
        alert('No se pudo enviar el mensaje.')
        console.error(error)
      }
    }

    const closeChat = async () => {
      try {
        await store.dispatch('closeChat', localReport.value.id)
        alert('Chat cerrado correctamente.')
        emit('close')
      } catch (error) {
        alert('No se pudo cerrar el chat.')
        console.error(error)
      }
    }

    return {
      localReport,
      newMessage,
      sendMessage,
      formatTimestamp,
      closeChat
    }
  },
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 4px 24px rgba(0,0,0,0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
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

.from-professional {
  background: #cfe2ff;
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
  margin-bottom: 1rem;
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

.btn-close-chat {
  background: #b91c1c;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 0.5rem;
}
.btn-close-chat:hover {
  background: #7f1d1d;
}
</style>
