<template>
  <div class="export-options">
    <h2>Exportar Datos</h2>
    
    <div class="export-container">
      <div class="filter-section">
        <h3>Filtros para exportación</h3>
        <form @submit.prevent="prepareExport">
          <div class="filters-grid">
            <div class="form-group">
              <label for="severity">Severidad:</label>
              <select id="severity" v-model="filters.severity">
                <option value="">Todas</option>
                <option value="LEVE">Leve</option>
                <option value="MODERADA">Moderada</option>
                <option value="GRAVE">Grave</option>
                <option value="MORTAL">Mortal</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="type">Tipo:</label>
              <select id="type" v-model="filters.type">
                <option value="">Todos</option>
                <option value="A">Tipo A - Aumentado/Predecible</option>
                <option value="B">Tipo B - Bizarro/No predecible</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="from-date">Desde:</label>
              <input type="date" id="from-date" v-model="filters.from">
            </div>
            
            <div class="form-group">
              <label for="to-date">Hasta:</label>
              <input type="date" id="to-date" v-model="filters.to">
            </div>
            
            <div class="form-group">
              <label for="medication">Medicamento:</label>
              <input type="text" id="medication" v-model="filters.medication" placeholder="Nombre del medicamento">
            </div>
            
            <div class="form-group">
              <label for="status">Estado:</label>
              <select id="status" v-model="filters.status">
                <option value="">Todos</option>
                <option value="CREATED">Creado</option>
                <option value="ASSIGNED">Asignado</option>
                <option value="IN_REVISION">En Revisión</option>
                <option value="PENDING_INFORMATION">Pendiente de Información Adicional</option>
                <option value="REJECTED">Rechazado</option>
                <option value="RECLAIMED">Reclamado</option>
                <option value="APPROVED">Aprobado</option>
              </select>
            </div>
          </div>
          
          <div class="export-actions">
            <button type="button" @click="exportData('csv')" class="btn-export">Exportar CSV</button>
            <button type="button" @click="exportData('json')" class="btn-export">Exportar JSON</button>
            <button type="button" @click="resetFilters" class="btn-reset">Restablecer Filtros</button>
          </div>
        </form>
      </div>
      
      <div class="info-section">
        <h3>Información de Exportación</h3>
        <p>La exportación incluirá los siguientes datos:</p>
        <ul>
          <li>Información del paciente (anonimizada)</li>
          <li>Detalles del medicamento</li>
          <li>Descripción del efecto adverso</li>
          <li>Fechas y severidad</li>
          <li>Información de administración</li>
          <li>Estado de revisión</li>
        </ul>
        <p class="note">Nota: Los datos exportados cumplen con la normativa de protección de datos.</p>
      </div>
    </div>
    
    <div v-if="isExporting" class="loading-overlay">
      <LoadingSpinner />
      <p>Preparando exportación...</p>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { useStore } from 'vuex'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

export default {
  name: 'ExportOptions',
  components: {
    LoadingSpinner
  },
  setup() {
    const store = useStore()
    const filters = reactive({
      severity: '',
      type: '',
      from: '',
      to: '',
      medication: '',
      status: ''
    })
    
    const isExporting = ref(false)

    const exportData = async (format) => {
      isExporting.value = true
      try {
        const validFilters = {}
        Object.entries(filters).forEach(([key, value]) => {
          if (value) validFilters[key] = value
        })
        
        await store.dispatch('exportData', {
          format,
          filters: validFilters
        })
      } catch (error) {
        console.error('Error al exportar datos:', error)
      } finally {
        isExporting.value = false
      }
    }
    
    const resetFilters = () => {
      Object.keys(filters).forEach(key => {
        filters[key] = ''
      })
    }
    
    return {
      filters,
      isExporting,
      exportData,
      resetFilters
    }
  }
}
</script>

<style scoped>
.export-options {
  width: 100%;
  position: relative;
}

.export-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  .export-container {
    grid-template-columns: 1fr;
  }
}

.filter-section, .info-section {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  color: #495057;
}

.form-group input, .form-group select {
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.export-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-export, .btn-reset {
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-export {
  background-color: #e4fdff;
  color: #000;
}

.btn-reset {
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  color: #495057;
}

.btn-export:hover {
  background-color: #7da9bd;
}

.btn-reset:hover {
  background-color: #e9ecef;
}

.info-section ul {
  margin-left: 1.5rem;
  margin-bottom: 1.5rem;
}

.info-section li {
  margin-bottom: 0.5rem;
}

.note {
  font-style: italic;
  color: #6c757d;
  font-size: 0.9rem;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-radius: 8px;
}
</style>
