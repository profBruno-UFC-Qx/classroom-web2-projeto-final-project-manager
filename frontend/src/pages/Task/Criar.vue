<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import TaskForm from "../../components/TaskForm.vue";
import Container from "../../components/Container.vue";
import { TaskService } from "../../services/task/task.service";
import { SprintService } from "../../services/sprint/sprint.service";
import { ProjectService } from "../../services/project/project.service";

const route = useRoute();
const router = useRouter();

const sprintId = route.params.sprintId;

const errors = ref({});
const users = ref([]);

function goBack() {
  router.push(`/tarefa/listar/${sprintId}`);
}

onMounted(async () => {
  try {
    const sprint = await SprintService.getById(sprintId);
    users.value = await ProjectService.listMembers(sprint.projectId);
  } catch (error) {
    console.error(error);
  }
});

async function handleSubmit(payload) {
  errors.value = {};

  try {
    await TaskService.create(payload);
    router.push(`/tarefa/listar/${sprintId}`);
  } catch (error) {
      const message = error?.response?.data?.message;
      if (message) {
        const normalized = String(message).toLowerCase();
        if (normalized.includes("title")) {
          errors.value = { title: [message] };
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
      <h1 class="text-4xl font-bold text-gray-800">Criar Tarefa</h1>
      <button
        @click="goBack"
        class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
      >
        ← Voltar
      </button>
    </div>

    <p v-if="formError" class="mb-3 text-sm text-red-600">{{ formError }}</p>
      <TaskForm
        @submit="handleSubmit"
        :errors="errors"
        :sprintId="Number(sprintId)"
        :users="users"
      />
  </Container>
</template>
