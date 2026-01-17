<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Container from "../../components/Container.vue";
import ComentarioForm from "../../components/ComentarioForm.vue";
import { CommentService } from "../../services/comment/comment.service";
import { TaskService } from "../../services/task/task.service";

const route = useRoute();
const router = useRouter();
const errors = ref({});

const tarefaId = route.params.tarefaId;

const task = ref(null);

onMounted(async () => {
  try {
    task.value = await TaskService.getById(tarefaId);
  } catch (error) {
    formError.value = "Nao foi possivel carregar a tarefa.";
  }
});

function goBack() {
  router.push(`/comentario/listar/${tarefaId}`);
}

async function handleSubmit(payload) {
  errors.value = {};

  const data = { content: payload.content, taskId: Number(tarefaId)};

  try {
    await CommentService.create(data);
    router.push(`/comentario/listar/${tarefaId}`);
  } catch (error) {
    const message = error?.response?.data?.message;
    if (message) {
      const normalized = String(message).toLowerCase();
      if (normalized.includes("content")) {
        errors.value = { content: [message] };
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
      <h1 class="text-4xl font-bold text-gray-800">Criar Comentário</h1>
      <button
        @click="goBack"
        class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
      >
        ← Voltar
      </button>
    </div>

    <ComentarioForm @submit="handleSubmit" :errors="errors" :taskId="Number(tarefaId)"
    />
  </Container>
</template>
