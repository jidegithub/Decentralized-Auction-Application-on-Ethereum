<script setup>
import { ref } from 'vue'

const count = ref(0)
const apiUrl = import.meta.env.VITE_API_URL;
</script>

<template>
  <div>
    <h1>About view vue</h1>
    <p>API URL: {{ apiUrl }}</p>
    <div class="card">
      <button type="button" @click="count++">count is {{ count }}</button>
    </div>
  </div>
</template>

<style scoped>

</style>
