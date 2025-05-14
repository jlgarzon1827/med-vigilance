<template>
  <div class="data-protection-container">
    <h2>Protección de Datos de Salud</h2>
    
    <div class="legal-text-container">
      <div class="legal-text-content">
        <h3>Información sobre el tratamiento de datos médicos</h3>
        
        <p>
          En cumplimiento del Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales, le informamos sobre el tratamiento de los datos de salud que pueda facilitar a través de esta plataforma.
        </p>

        <h4>Responsable del tratamiento</h4>
        <p>
          El responsable del tratamiento de los datos es el equipo académico encargado del desarrollo y gestión de este Trabajo de Fin de Grado (TFG). Esta plataforma tiene fines exclusivamente académicos y de investigación.
        </p>

        <h4>Finalidades del tratamiento</h4>
        <ul>
          <li>Gestión y seguimiento de historiales médicos y tratamientos simulados.</li>
          <li>Facilitar la comunicación entre usuarios y profesionales sanitarios en un entorno de prueba.</li>
          <li>Realización de análisis y estudios con datos anonimizados, exclusivamente para fines académicos.</li>
        </ul>

        <h4>Derechos de la persona usuaria</h4>
        <p>
          Puede ejercer sus derechos de acceso, rectificación, supresión, limitación del tratamiento, portabilidad y oposición enviando una solicitud al correo electrónico proporcionado por el tutor académico del TFG o a través de los canales oficiales de la universidad.
        </p>

        <h4>Conservación de los datos</h4>
        <p>
          Los datos personales y de salud serán conservados únicamente durante el periodo necesario para la realización del TFG y serán eliminados una vez finalizado el proyecto académico.
        </p>

        <h4>Medidas de seguridad</h4>
        <p>
          Se han adoptado las medidas técnicas y organizativas necesarias para garantizar la confidencialidad, integridad y seguridad de los datos personales tratados en esta plataforma.
        </p>

        <p class="effective-date">
          Versión vigente desde: 1 de enero de 2024
        </p>
      </div>
    </div>

    <div class="actions">
      <button 
        class="accept-button"
        @click="acceptPolicy"
        :disabled="isLoading"
      >
        <span v-if="!isLoading">Aceptar y continuar</span>
        <span v-else>Procesando...</span>
      </button>
      
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

export default {
  name: 'DataProtectionPage',
  setup() {
    const store = useStore()
    const router = useRouter()
    const isLoading = ref(false)
    const error = ref(null)

    const acceptPolicy = async () => {
      isLoading.value = true
      error.value = null
      
      try {
        await store.dispatch('acceptDataProtectionPolicy')
        await store.dispatch('fetchUserProfile') // Actualiza el perfil en el store
        router.push('/dashboard')
      } catch (err) {
        error.value = 'Error al aceptar la política. Por favor, inténtelo de nuevo.'
        console.error(err)
      } finally {
        isLoading.value = false
      }
    }

    return { 
      acceptPolicy,
      isLoading,
      error
    }
  }
}
</script>

<style scoped>
.data-protection-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.legal-text-container {
  max-height: 60vh;
  overflow-y: auto;
  border: 1px solid #eee;
  padding: 1rem;
  margin: 1.5rem 0;
  background: #f9f9f9;
}

.legal-text-content h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.legal-text-content h4 {
  color: #34495e;
  margin: 1.5rem 0 0.5rem;
}

.legal-text-content ul {
  padding-left: 1.5rem;
}

.effective-date {
  margin-top: 2rem;
  font-style: italic;
  color: #7f8c8d;
}

.actions {
  text-align: center;
}

.accept-button {
  background-color: #42b983;
  color: white;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.accept-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  margin-top: 1rem;
}
</style>
