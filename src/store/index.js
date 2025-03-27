import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    user: null,
    token: localStorage.getItem('token') || null,
    medications: [],
    reminders: [],
    userProfile: null,
    isLoading: false,
    adverseEffects: [],
    dashboardStatistics: {},
    medicationStatistics: {},
    trends: {},
    pendingReviews: [],
    activeTab: 'medications',
    professionals: [],
    analysisReport: null,
    correlationAnalysis: null
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setToken(state, token) {
      state.token = token
      if (token) {
        localStorage.setItem('token', token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      } else {
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
      }
    },
    setMedications(state, medications) {
      state.medications = medications
    },
    setReminders(state, reminders) {
      state.reminders = reminders
    },
    setUserProfile(state, profile) {
      state.userProfile = profile
      state.userRole = profile?.profile?.user_type || 'PATIENT'
    },
    setMasterMedications(state, medications) {
      state.masterMedications = medications
    },
    addMasterMedication(state, medication) {
      state.masterMedications.push(medication)
    },
    updateMasterMedication(state, medication) {
      const index = state.masterMedications.findIndex(m => m.id === medication.id)
      if (index !== -1) {
        state.masterMedications.splice(index, 1, medication)
      }
    },
    removeMasterMedication(state, id) {
      state.masterMedications = state.masterMedications.filter(m => m.id !== id)
    },
    updateMedication(state, updatedMedication) {
      const index = state.medications.findIndex(med => med.id === updatedMedication.id)
      if (index !== -1) {
        state.medications.splice(index, 1, updatedMedication)
      }
    },
    removeMedication(state, id) {
      state.medications = state.medications.filter(med => med.id !== id)
    },
    setLoading(state, value) {
      state.isLoading = value
    },
    setAdverseEffects(state, effects) {
      state.adverseEffects = effects
    },
    setDashboardStatistics(state, statistics) {
      state.dashboardStatistics = statistics
    },
    setMedicationStatistics(state, statistics) {
      state.medicationStatistics = statistics
    },
    setTrends(state, trends) {
      state.trends = trends
    },
    setPendingReviews(state, reviews) {
      state.pendingReviews = reviews
    },
    setActiveTab(state, tab) {
      state.activeTab = tab;
    },
    addMedication(state, medication) {
      state.medications.push(medication)
    },
    updateAdverseEffect(state, updatedEffect) {
      const index = state.adverseEffects.findIndex(effect => effect.id === updatedEffect.id)
      if (index !== -1) {
        state.adverseEffects.splice(index, 1, updatedEffect)
      }
    },
    setProfessionals(state, professionals) {
      state.professionals = professionals
    },
    setSupervisorView(state, reports) {
      state.supervisorView = reports;
    },
    updateSupervisorView(state, data) {
      state.supervisorView = data;
    },
    setAnalysisReport(state, report) {
      state.analysisReport = report
    },
    setCorrelationAnalysis(state, analysis) {
      state.correlationAnalysis = analysis
    },
    setSelectedReport(state, report) {
      state.selectedReport = report;
    },
  },
  actions: {
    async login({ commit }, { username, userPassword }) {
      try {
        const response = await axios.post('http://localhost:8000/login/', {
          username,
          password: userPassword
        })
        const token = response.data.access
        commit('setToken', token)
        commit('setUser', username)
        localStorage.setItem('token', token)
        return true
      } catch (error) {
        console.error('Login failed', error)
        return false
      }
    },
    async register({ commit }, { username, email, password, is_professional, professional_id, specialty, institution }) {
      try {
        const userData = {
          username: username,
          email: email,
          password: password
        }
        
        // Añadir campos para profesionales si es necesario
        if (is_professional) {
          userData.is_professional = true
          userData.professional_id = professional_id
          userData.specialty = specialty
          userData.institution = institution
        }
        
        await axios.post('http://localhost:8000/register/', userData)

        commit('setUser', username)
        return true
      } catch (error) {
        console.error('Registration failed', error)
        return false
      }
    },
    async logout({ commit }) {
      commit('setToken', null)
      commit('setUser', null)
      localStorage.removeItem('token')
    },
    async fetchUserProfile({ commit }) {
      commit('setLoading', true)
      try {
        const response = await axios.get('http://localhost:8000/profile/')
        commit('setUserProfile', response.data)
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        commit('setLoading', false)
      }
    },
    async fetchUsers() {
      try {
        const response = await axios.get('http://localhost:8000/users/')
        return response
      } catch (error) {
        console.error('Error fetching users:', error)
        throw error
      }
    },
    async updateUserRole(_, data) {
      try {
        await axios.post(`http://localhost:8000/users/${data.userId}/set_role/`, { role: data.newRole })
        return true
      } catch (error) {
        console.error('Error updating user role:', error)
        throw error
      }
    },
    async fetchMasterMedications({ commit }) {
      commit('setLoading', true)
      try {
        const response = await axios.get('http://localhost:8000/medicamentos-maestros/')
        commit('setMasterMedications', response.data)
      } catch (error) {
        console.error('Error fetching master medications:', error)
      } finally {
        commit('setLoading', false)
      }
    },
    async addMasterMedication({ commit }, medicationData) {
      commit('setLoading', true)
      try {
        const response = await axios.post('http://localhost:8000/medicamentos-maestros/', medicationData)
        commit('addMasterMedication', response.data)
      } catch (error) {
        console.error('Error adding master medication:', error)
      } finally {
        commit('setLoading', false)
      }
    },
    async editMasterMedication({ commit }, medication) {
      commit('setLoading', true)
      try {
        const response = await axios.put(`http://localhost:8000/medicamentos-maestros/${medication.id}/`, medication)
        commit('updateMasterMedication', response.data)
        return true
      } catch (error) {
        console.error('Error updating master medication:', error)
        return false
      } finally {
        commit('setLoading', false)
      }
    },
    async deleteMasterMedication({ commit }, id) {
      commit('setLoading', true)
      try {
        await axios.delete(`http://localhost:8000/medicamentos-maestros/${id}/`)
        commit('removeMasterMedication', id)
        return true
      } catch (error) {
        console.error('Error deleting master medication:', error)
        return false
      } finally {
        commit('setLoading', false)
      }
    },    
    async fetchMedications({ commit }) {
      commit('setLoading', true)
      try {
        const response = await axios.get('http://localhost:8000/medicamentos/')
        commit('setMedications', response.data)
      } catch (error) {
        console.error('Error fetching medications:', error)
      } finally {
        commit('setLoading', false)
      }
    },
    async addMedication({ commit }, medicationData) {
      commit('setLoading', true)
      try {
        const response = await axios.post('http://localhost:8000/medicamentos/', medicationData)
        commit('addMedication', response.data)
      } catch (error) {
        console.error('Error adding medication:', error)
      } finally {
        commit('setLoading', false)
      }
    },
    async editMedication({ commit }, medication) {
      commit('setLoading', true)
      try {
        const response = await axios.put(`http://localhost:8000/medicamentos/${medication.id}/`, medication)
        commit('updateMedication', response.data)
        return true
      } catch (error) {
        console.error('Error updating medication:', error)
        return false
      } finally {
        commit('setLoading', false)
      }
    },
    async deleteMedication({ commit }, id) {
      commit('setLoading', true)
      try {
        await axios.delete(`http://localhost:8000/medicamentos/${id}/`)
        commit('removeMedication', id)
        return true
      } catch (error) {
        console.error('Error deleting medication:', error)
        return false
      } finally {
        commit('setLoading', false)
      }
    },
    async fetchAdverseEffects({ commit }, filters = {}) {
      commit('setLoading', true);
      try {
        let url = `http://localhost:8000/adverse-effects/`
        if (Object.keys(filters).length > 0) {
          const queryParams = new URLSearchParams(filters).toString()
          url = `${url}filtered_reports/?${queryParams}`
        }
    
        const response = await axios.get(url);
        if (Object.keys(filters).length > 0) {
          commit('setAdverseEffects', response.data.results);
        }
        else{
          commit('setAdverseEffects', response.data);
        }
      } catch (error) {
        console.error('Error fetching adverse effects:', error);
      } finally {
        commit('setLoading', false);
      }
    },
    async fetchReportDetails({ commit }, id) {
      commit('setLoading', true);
      try {
        const response = await axios.get(`http://localhost:8000/adverse-effects/${id}/`);
        commit('setSelectedReport', response.data);
        return true;
      } catch (error) {
        console.error('Error obteniendo detalles del reporte:', error);
        return false;
      } finally {
        commit('setLoading', false);
      }
    },    
    async reportAdverseEffect({ commit, state }, adverseEffectData) {
      commit('setLoading', true)
      try {
        const response = await axios.post('http://localhost:8000/adverse-effects/', adverseEffectData)
        // Actualizar la lista de efectos adversos
        commit('setAdverseEffects', [...state.adverseEffects, response.data])
        return true
      } catch (error) {
        console.error('Error reporting adverse effect:', error)
        return false
      } finally {
        commit('setLoading', false)
      }
    },
    async updateReportStatus({ commit }, { reportId, status }) {
      try {
        const response = await axios.post(`http://localhost:8000/adverse-effects/${reportId}/update-status/`, { status });
        commit('updateAdverseEffect', response.data);
        alert(`Estado del reporte actualizado a ${status}.`);
      } catch (error) {
        console.error(`Error updating report status to ${status}:`, error);
      }
    },
    async revertReportStatus({ commit }, { reportId, reason }) {
      commit('setLoading', true)
      try {
        const response = await axios.post(`http://localhost:8000/adverse-effects/${reportId}/revert_status/`, { reason })
        commit('updateAdverseEffect', response.data)
        return true
      } catch (error) {
        console.error('Error al revertir estado:', error)
        return false
      } finally {
        commit('setLoading', false)
      }
    },    
    async fetchSupervisorView({ commit }, filters) {
      try {
        const response = await axios.get('http://localhost:8000/dashboard/supervisor_view/', {
          params: filters
        });
        commit('updateSupervisorView', response.data.results);
        return response.data;
      } catch (error) {
        console.error('Error fetching supervisor view:', error);
      }
    },
    async fetchDashboardStatistics({ commit }) {
      commit('setLoading', true)
      try {
        const response = await axios.get('http://localhost:8000/dashboard/statistics/')
        commit('setDashboardStatistics', response.data)
      } catch (error) {
        console.error('Error fetching dashboard statistics:', error)
      } finally {
        commit('setLoading', false)
      }
    },
    async fetchMedicationStatistics({ commit }) {
      commit('setLoading', true)
      try {
        const response = await axios.get('http://localhost:8000/dashboard/medication_statistics/')
        commit('setMedicationStatistics', response.data)
      } catch (error) {
        console.error('Error fetching medication statistics:', error)
      } finally {
        commit('setLoading', false)
      }
    },
    async fetchTrends({ commit }, days = 30) {
      commit('setLoading', true)
      try {
        const response = await axios.get(`http://localhost:8000/dashboard/trends/?days=${days}`)
        commit('setTrends', response.data)
      } catch (error) {
        console.error('Error fetching trends:', error)
      } finally {
        commit('setLoading', false)
      }
    },
    async fetchPendingReviews({ commit }) {
      commit('setLoading', true)
      try {
        const response = await axios.get('http://localhost:8000/dashboard/pending_reviews/');
        commit('setPendingReviews', response.data);
      } catch (error) {
        console.error('Error fetching pending reviews:', error);
      } finally {
        commit('setLoading', false);
      }
    },
    async approveReclamation({ commit }, id) {
      commit('setLoading', true)
      try {
        const response = await axios.post(`http://localhost:8000/adverse-effects/${id}/approve_reclamation/`)
        commit('updateAdverseEffect', response.data)
        return true
      } catch (error) {
        console.error('Error aprobando reclamación:', error)
        return false
      } finally {
        commit('setLoading', false)
      }
    },
    async rejectReclamation({ commit }, id) {
      commit('setLoading', true)
      try {
        const response = await axios.post(`http://localhost:8000/adverse-effects/${id}/reject_reclamation/`)
        commit('updateAdverseEffect', response.data)
        return true
      } catch (error) {
        console.error('Error rechazando reclamación:', error)
        return false
      } finally {
        commit('setLoading', false)
      }
    },
    async startReview({ commit }, id) {
      commit('setLoading', true)
      try {
        const response = await axios.post(`http://localhost:8000/adverse-effects/${id}/start_review/`)
        commit('updateAdverseEffect', response.data)
        return true
      } catch (error) {
        console.error('Error iniciando revisión:', error)
        return false
      } finally {
        commit('setLoading', false)
      }
    },
    async requestInfo({ commit }, id) {
      commit('setLoading', true);
      try {
        const response = await axios.post(`http://localhost:8000/adverse-effects/${id}/request_additional_info/`);
        commit('updateAdverseEffect', response.data);
        alert('Información adicional solicitada correctamente.');
        return true;
      } catch (error) {
        console.error('Error solicitando información adicional:', error);
        alert('Error solicitando información adicional.');
        return false;
      } finally {
        commit('setLoading', false);
      }
    },    
    async approveReport({ commit }, id) {
      commit('setLoading', true)
      try {
        const response = await axios.post(`http://localhost:8000/adverse-effects/${id}/approve_report/`)
        commit('updateAdverseEffect', response.data)
        return true
      } catch (error) {
        console.error('Error aprobando reporte:', error)
        return false
      } finally {
        commit('setLoading', false)
      }
    },
    async rejectReport({ commit }, id) {
      commit('setLoading', true)
      try {
        const response = await axios.post(`http://localhost:8000/adverse-effects/${id}/reject_report/`)
        commit('updateAdverseEffect', response.data)
        return true
      } catch (error) {
        console.error('Error rechazando reporte:', error)
        return false
      } finally {
        commit('setLoading', false)
      }
    },
    async startReclamation({ commit }, { id, reason }) {
      commit('setLoading', true);
      try {
        const response = await axios.post(`http://localhost:8000/adverse-effects/${id}/start_reclamation/`, {
          reclamation_reason: reason,
        });
        commit('updateAdverseEffect', response.data);
        alert('Reclamación iniciada correctamente.');
        return true;
      } catch (error) {
        console.error('Error iniciando reclamación:', error);
        alert('Error iniciando reclamación.');
        return false;
      } finally {
        commit('setLoading', false);
      }
    },    
    async provideAdditionalInfo({ commit }, { id, info }) {
      commit('setLoading', true);
      try {
        const response = await axios.post(`http://localhost:8000/adverse-effects/${id}/provide_additional_info/`, {
          additional_info: info,
        });
        commit('updateAdverseEffect', response.data);
        alert('Información adicional proporcionada correctamente.');
        return true;
      } catch (error) {
        console.error('Error proporcionando información adicional:', error);
        alert('Error proporcionando información adicional.');
        return false;
      } finally {
        commit('setLoading', false);
      }
    },    
    async fetchProfessionals({ commit }) {
      try {
        const response = await axios.get('http://localhost:8000/users/?user_type=PROFESSIONAL');
        commit('setProfessionals', response.data);
      } catch (error) {
        console.error('Error fetching professionals:', error);
      }
    },
    async assignReviewer(_, { reportId, reviewerId }) {
      try {
        await axios.post(`http://localhost:8000/adverse-effects/${reportId}/assign-reviewer/`, { reviewer_id: reviewerId });
        alert('Revisor asignado correctamente.');
        await this.dispatch('fetchSupervisorView');
      } catch (error) {
        console.error('Error assigning reviewer:', error);
      }
    },
    async exportData({ commit }, { format, filters }) {
      commit('setLoading', true)
      try {
        let url = `http://localhost:8000/dashboard/export_${format}/`
        if (filters) {
          const queryParams = new URLSearchParams(filters).toString()
          url = `${url}?${queryParams}`
        }
        
        const response = await axios.get(url, {
          responseType: 'blob'
        })
        
        const blob = new Blob([response.data])
        const downloadUrl = window.URL.createObjectURL(blob)
        
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = `adverse-effects-export.${format}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        return true
      } catch (error) {
        console.error(`Error exporting data as ${format}:`, error)
        return false
      } finally {
        commit('setLoading', false)
      }
    },
    async fetchAnalysisReport({ commit }) {
      commit('setLoading', true)
      try {
        const response = await axios.get('http://localhost:8000/dashboard/analysis_report/')
        commit('setAnalysisReport', response.data)
      } catch (error) {
        console.error('Error fetching analysis report:', error)
      } finally {
        commit('setLoading', false)
      }
    },
    async fetchCorrelationAnalysis({ commit }) {
      commit('setLoading', true)
      try {
        const response = await axios.get('http://localhost:8000/dashboard/correlation_analysis/')
        commit('setCorrelationAnalysis', response.data)
      } catch (error) {
        console.error('Error fetching correlation analysis:', error)
      } finally {
        commit('setLoading', false)
      }
    },
    async generatePdfReport({ commit }, filters) {
      commit('setLoading', true)
      try {
        const queryParams = new URLSearchParams(filters).toString()
        const response = await axios.get(`http://localhost:8000/dashboard/generate_pdf_report/?${queryParams}`, {
          responseType: 'blob'
        })
        
        const blob = new Blob([response.data], { type: 'application/pdf' })
        const downloadUrl = window.URL.createObjectURL(blob)
        
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = `adverse-effects-report-${new Date().toISOString().split('T')[0]}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        return true
      } catch (error) {
        console.error('Error generating PDF report:', error)
        return false
      } finally {
        commit('setLoading', false)
      }
    },
  },
  getters: {
    isLoggedIn: state => !!state.token,
    activeTab: state => state.activeTab,
    isAdmin: state => state.userProfile?.profile?.user_type === 'ADMIN',
    isSupervisor: state => state.userProfile?.profile?.user_type === 'SUPERVISOR',
    isProfessional: state => {
      return state.userProfile && 
             state.userProfile.profile && 
             state.userProfile.profile.user_type === 'PROFESSIONAL'
    }
  }
})
