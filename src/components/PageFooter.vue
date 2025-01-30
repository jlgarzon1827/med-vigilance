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
  text-align: center;
  padding: 2rem 0;
  color: #6c757d;
  border-top: 1px solid #e0e0e0;
  margin-top: 3rem;
}
</style>
