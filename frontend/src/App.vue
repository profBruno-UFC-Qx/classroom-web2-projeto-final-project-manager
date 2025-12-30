<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="flex flex-col min-h-screen bg-amber-100">
    <div class="w-full flex-1 px-4 md:px-8 py-4">
        <RouterView />
    </div>
  </div>
</template>

<style scoped></style>