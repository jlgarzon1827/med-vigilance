<template>
  <div id="app">
    <NavBar />
    <router-view/>
    <PageFooter />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import PageFooter from '@/components/PageFooter.vue'

export default {
  name: 'App',
  components: {
    NavBar,
    PageFooter
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
