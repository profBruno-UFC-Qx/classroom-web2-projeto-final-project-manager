<script setup>
import { RouterView, useRouter } from 'vue-router';
import SiteNavegation from './components/SiteNavegation.vue';
import { useAuthStore } from './store/auth';
import { computed, onMounted } from 'vue';

const auth = useAuthStore();
const router = useRouter();

onMounted(async () => {
  await auth.fetchUser();
});

const showNavegation = computed(() => {
  const publicRoutes = ['Login', 'Register'];
  return !publicRoutes.includes(router.currentRoute.value.name);
});
</script>

<template>
  <div class="flex flex-col min-h-screen bg-amber-100">
    <SiteNavegation v-if="showNavegation" />
    <div class="w-full flex-1 px-4 md:px-8 py-4">
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>