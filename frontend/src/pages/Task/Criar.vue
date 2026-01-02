<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../../services/axios.js";
import TaskForm from "../../components/TaskForm.vue";
import Container from "../../components/Container.vue";

const props = defineProps({
  user: { type: Object, required: true },
  sprintId: { type: [String, Number], required: true },
});

const router = useRouter();
const errors = ref({});

function goBack() {
  router.push(`/tarefa/listar/${props.sprintId}`);
}

async function handleSubmit(payload) {
  errors.value = {};

  try {
    const body = {
      ...payload,
      sprintId: Number(props.sprintId),
      ownerId: 1,
    };

    await api.post("/tasks", body);
    router.push(`/tarefa/listar/${props.sprintId}`);
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
      <h1 class="text-4xl font-bold text-gray-800">Criar Tarefa</h1>
      <button
        @click="goBack"
        class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
      >
        ← Voltar
      </button>
    </div>

    <TaskForm @submit="handleSubmit" :errors="errors" :ownerId="1" :sprintId="Number(sprintId)" />
  </Container>
</template>
