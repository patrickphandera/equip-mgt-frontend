<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup>
// No changes needed here unless you’re injecting global logic
</script>

<style>
/* Optional: make router-view take full height */
html, body, #app {
  height: 100%;
  margin: 0;
}
</style>
