<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import SprintForm from "../../components/SprintForm.vue";
import Container from "../../components/Container.vue";
import { SprintService } from "../../services/sprint/sprint.service.js"

const props = defineProps({
  user: { 
    type: Object, 
    required: true 
  }
});

const route = useRoute();
const router = useRouter();
const errors = ref({});

const projectId = route.params.projectId;

function goBack() {
  router.push(`/sprint/listar/${projectId}`);
}

async function handleSubmit(payload) {
  errors.value = {};

  try {
    await SprintService.create(payload);
    router.push(`/sprint/listar/${projectId}`);
  } catch (error) {
    const message = error?.response?.data?.message;
    if (message) {
      const normalized = String(message).toLowerCase();
      if (normalized.includes("name")) {
        errors.value = { name: [message] };
      } else {
        errors.value = { general: [message] };
      }
      return;
    }

    if (error.response && error.response.status === 422) {
      errors.value = error.response.data.errors;
      return;
    }

    console.error(error);
  }
}
</script>

<template>
  <Container>
    <div class="w-full mb-6 flex justify-between">
      <h1 class="text-4xl font-bold text-gray-800">Criar Sprint</h1>
      <button
        @click="goBack"
        class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
      >
        ← Voltar
      </button>
    </div>

    <SprintForm @submit="handleSubmit" :errors="errors" :ownerId="1" :projectId="projectId" />
  </Container>
</template>
