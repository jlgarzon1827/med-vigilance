<!-- components/dashboard/ReportFilters.vue -->
<template>
  <div class="report-filters">
    <h3>Filtros</h3>
    <form @submit.prevent="applyFilters">
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
            <option value="PENDING">Pendiente</option>
            <option value="REVIEWED">Revisado</option>
          </select>
        </div>
      </div>
      
      <div class="filter-actions">
        <button type="submit" class="btn-apply">Aplicar Filtros</button>
        <button type="button" @click="resetFilters" class="btn-reset">Restablecer</button>
      </div>
    </form>
  </div>
</template>

<script>
import { reactive } from 'vue'

export default {
  name: 'ReportFilters',
  emits: ['filter-changed'],
  setup(props, { emit }) {
    const filters = reactive({
      severity: '',
      type: '',
      from: '',
      to: '',
      medication: '',
      status: ''
    })
    
    const applyFilters = () => {
      emit('filter-changed', { ...filters })
    }
    
    const resetFilters = () => {
      Object.keys(filters).forEach(key => {
        filters[key] = ''
      })
      emit('filter-changed', { ...filters })
    }
    
    return {
      filters,
      applyFilters,
      resetFilters
    }
  }
}
</script>

<style scoped>
.report-filters {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 1rem;
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

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-apply, .btn-reset {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-apply {
  background-color: #e4fdff;
  color: #000;
}

.btn-reset {
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  color: #495057;
}

.btn-apply:hover {
  background-color: #7da9bd;
}

.btn-reset:hover {
  background-color: #e9ecef;
}
</style>
