// src/components/LoadingSpinner.vue
<template>
  <div class="loading-spinner">
    <div class="spinner"></div>
  </div>
</template>

<style scoped>
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
