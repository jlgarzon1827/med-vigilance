<template>
  <div class="report-filters">
    <h3>Filtros</h3>
    <form @submit.prevent="applyFilters">
      <div class="filters-grid">
        <!-- Filtro por severidad -->
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

        <!-- Filtro por tipo -->
        <div class="form-group">
          <label for="type">Tipo:</label>
          <select id="type" v-model="filters.type">
            <option value="">Todos</option>
            <option value="A">Tipo A - Aumentado/Predecible</option>
            <option value="B">Tipo B - Bizarro/No predecible</option>
          </select>
        </div>

        <!-- Filtro por rango de fechas -->
        <div class="form-group">
          <label for="from-date">Desde:</label>
          <input type="date" id="from-date" v-model="filters.fromDate">
        </div>

        <div class="form-group">
          <label for="to-date">Hasta:</label>
          <input type="date" id="to-date" v-model="filters.toDate">
        </div>

        <!-- Filtro por estado -->
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

        <!-- Filtro por revisor -->
        <div class="form-group">
          <label for="reviewer">Revisor:</label>
          <select id="reviewer" v-model="filters.reviewer">
            <option value="">Todos los revisores</option>
            <option v-for="professional in professionals" :key="professional.id" :value="professional.id">
              {{ professional.username }}
            </option>
          </select>
        </div>

      </div>

      <!-- Botones de acción -->
      <div class="filter-actions">
        <button type="submit" @click.prevent="applyFilters" class="btn-apply">Aplicar Filtros</button>
        <button type="button" @click.prevent="resetFilters" class="btn-reset">Restablecer</button>
      </div>
    </form>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ReportFiltersSup',
  setup() {
    const store = useStore();

    const filters = reactive({
      severity: '',
      type: '',
      fromDate: '',
      toDate: '',
      status: '',
      reviewer: ''
    });

    const professionals = store.state.professionals || [];

    const applyFilters = () => {
      const nonEmptyFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== '')
      );
      store.dispatch('fetchSupervisorView', nonEmptyFilters);
    };

    const resetFilters = () => {
      Object.keys(filters).forEach(key => {
        filters[key] = '';
      });
      store.dispatch('fetchSupervisorView', {});
    };

    return {
      filters,
      professionals,
      applyFilters,
      resetFilters
    };
  }
};
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

.form-group input,
.form-group select {
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

.btn-apply,
.btn-reset {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
}

.btn-apply {
  background-color: #e4fdff;
}

.btn-reset {
  background-color: #f8f9fa;
}
</style>
