<template>
  <div>
    <a-config-provider :locale="locale">
      <RouterView />
      <!-- :key="$route.fullPath" -->
    </a-config-provider>
  </div>
</template>

<script setup>
import { reactive, ref, watch, h, onMounted, onUnmounted } from "vue";
</script>

<style scoped></style>
