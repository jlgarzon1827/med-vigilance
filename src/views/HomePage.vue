<template>
  <div class="home">
     <h1>Welcome to MedVigilance</h1>
     <p>A comprehensive pharmacovigilance system for monitoring and reporting adverse drug effects.</p>
  
     <div v-if="isLoggedIn">
       <p>You are logged in. Visit your <router-link to="/dashboard">Dashboard</router-link>.</p>
  
       <!-- Mostrar enlace solo si es admin -->
       <div v-if="isAdmin">
         <p>Access the <router-link to="/admin">Admin Panel</router-link>.</p>
       </div>
     </div>
  
     <div v-else>
       <p>Please <router-link to="/login">login</router-link> or 
       <router-link to="/register">register</router-link> to access the system.</p>
     </div>
   </div>
  </template>
  
  <script>
  import { computed } from 'vue'
  import { useStore } from 'vuex'
  
  export default {
   name: 'HomePage',
   setup() {
     const store = useStore()
     const isLoggedIn = computed(() => store.getters.isLoggedIn)
     const isAdmin = computed(() => store.state.userProfile?.profile?.user_type === 'ADMIN')
  
     return { isLoggedIn, isAdmin }
   }
  }
  </script>