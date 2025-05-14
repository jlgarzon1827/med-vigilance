import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from '@/utils/axios'

const app = createApp(App)

app.use(router)
app.use(store)

const token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  store.dispatch('fetchUserProfile')
}

app.mount('#app')
