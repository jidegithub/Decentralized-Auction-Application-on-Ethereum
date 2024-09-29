<script>
  import { useMetamask } from '@/composables/useMetamask';

  export default {
    setup() {
      useMetamask();
    }
  }
</script>

<template>
  <div>
    <!-- <nav>
      <router-link to="/">Go to Home</router-link>
      <router-link to="/upload">Upload</router-link>
    </nav> -->
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>

</style>