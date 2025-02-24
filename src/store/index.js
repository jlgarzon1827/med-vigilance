import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    user: null,
    token: localStorage.getItem('token') || null,
    medications: [],
    reminders: [],
    userProfile: null,
    isLoading: false
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
    }
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
    async register(_, { username, email, userPassword }) {
      try {
        await axios.post('http://localhost:8000/register/', {
          username,
          email, 
          password: userPassword
        })
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
    }
  },
  getters: {
    isLoggedIn: state => !!state.token
  }
})
