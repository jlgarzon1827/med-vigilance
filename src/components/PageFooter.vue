<template>
  <footer>
    <p>&copy; {{ currentYear }} MedVigilance. All rights reserved.</p>
  </footer>
</template>

<script>
export default {
  name: 'PageFooter',
  computed: {
    currentYear() {
      return new Date().getFullYear()
    }
  }
}
</script>

<style scoped>
footer {
  margin-top: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  text-align: center;
}
</style>
