<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import TaskForm from "../../components/TaskForm.vue";
import Container from "../../components/Container.vue";
import { TaskService } from "../../services/task/task.service";
import { SprintService } from "../../services/sprint/sprint.service";

const route = useRoute();
const router = useRouter();

const sprintId = route.params.sprintId;
const sprint = ref(null);
const errors = ref({});
const formError = ref("");

onMounted(async () => {
  try {
    sprint.value = await SprintService.getById(sprintId);
  } catch (error) {
    formError.value = "Nao foi possivel carregar a sprint.";
  }
});

function goBack() {
  router.push(`/tarefa/listar/${sprintId}`);
}

async function handleSubmit(payload) {
  errors.value = {};
  formError.value = "";

  const data = {
    title: payload.title,
    description: payload.description || null,
    status: payload.status,
    priority: payload.priority,
    dueDate: payload.dueDate || null,
    projectId: sprint.value?.projectId,
    sprintId: sprint.value?.id,
    assigneeId: payload.assigneeId ? Number(payload.assigneeId) : null,
  };

  try {
    await TaskService.create(data);
    router.push(`/tarefa/listar/${sprintId}`);
  } catch (error) {
    formError.value = "Nao foi possivel criar a tarefa.";
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
        Voltar
      </button>
    </div>

    <p v-if="formError" class="mb-3 text-sm text-red-600">{{ formError }}</p>
    <TaskForm
      v-if="sprint?.projectId"
      @submit="handleSubmit"
      :errors="errors"
      :projectId="sprint.projectId"
      :sprintId="Number(sprintId)"
    />
  </Container>
</template>
