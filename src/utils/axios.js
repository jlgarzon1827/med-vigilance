import axios from 'axios'
import store from '@/store'
import router from '@/router'

axios.interceptors.request.use(
  (config) => {
    const token = store.state.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      await store.dispatch('logout')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default axios
