<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../../services/axios.js";
import SprintForm from "../../components/SprintForm.vue";
import Container from "../../components/Container.vue";

const props = defineProps({
  user: { type: Object, required: true },
  projectId: { type: [String, Number], required: true },
});

const router = useRouter();
const errors = ref({});

function goBack() {
  router.push(`/sprint/listar/${props.projectId}`);
}

async function handleSubmit(payload) {
  errors.value = {};

  try {
    // garante que o sprint vai associado ao projeto
    const body = {
      ...payload,
      projectId: Number(props.projectId),
      ownerId: 1, // se seu form já manda ownerId, pode remover daqui
    };

    await api.post("/sprints", body);
    router.push(`/sprint/listar/${props.projectId}`);
  } catch (error) {
    if (error.response && error.response.status === 422) {
      errors.value = error.response.data.errors;
    } else {
      console.error(error);
    }
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

    <SprintForm @submit="handleSubmit" :errors="errors" :ownerId="1" :projectId="Number(projectId)" />
  </Container>
</template>
