<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Container from "../../components/Container.vue";
import { CommentService } from "../../services/comment/comment.service";
import ComentarioEditForm from "../../components/ComentarioEditForm.vue";

const route = useRoute();
const router = useRouter();
const errors = ref({});

const comentarioId = route.params.comentarioId;

const comment = ref({
    content: "",
    taskId: null
});

onMounted(async () => {
    const id = comentarioId;
    const data = await CommentService.getById(id);
    
    comment.value = {
        id: data.id,
        content: data.content,
        taskId: data.taskId
    };
});

function goBack() {
  router.push(`/comentario/listar/${comment.value.taskId}`);
}

async function handleSubmit(payload) {
  errors.value = {};

  try {
    await CommentService.update(comment.value.id, payload);
    const tarefaId = comment.value.taskId;
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
      <h1 class="text-4xl font-bold text-gray-800">Editar Comentário</h1>
      <button
        @click="goBack"
        class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
      >
        ← Voltar
      </button>
    </div>

    <ComentarioEditForm @submit="handleSubmit" :errors="errors" :taskId="Number(comment.taskId)" :comment="comment"
    />
  </Container>
</template>
