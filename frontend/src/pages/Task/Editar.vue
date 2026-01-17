<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Container from "../../components/Container.vue";
import { TaskService } from "../../services/task/task.service";
import { SprintService } from "../../services/sprint/sprint.service";
import { ProjectService } from "../../services/project/project.service";
import TaskEditForm from "../../components/TaskEditForm.vue";
import { useAuthStore } from "../../store/auth";

const auth = useAuthStore();

const props = defineProps({
  tarefaId: {
    type: Number,
    required: true,
  },
});

const router = useRouter();

const task = ref({
  title: "",
  description: "",
  status: "",
  priority: "",
  dueDate: "",
  assigneeId: null,
  sprintId: null,
});

const users = ref([]);

onMounted(async () => {
    const id = props.tarefaId;
    const data = await TaskService.getById(id);

    task.value = {
        id: data.id,
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate,
        sprintId: data.sprintId,
        assigneeId: data.assigneeId,
    };

    const sprint = await SprintService.getById(task.value.sprintId);
    users.value = await ProjectService.listMembers(sprint.projectId);
    
    task.value.projectId = sprint.projectId;
});

const errors = ref({});

function goBack() {
  router.push(`/tarefa/listar/${task.value.sprintId}`);
}

async function handleSubmit(payload) {
  errors.value = {};

  try {
    await TaskService.update(task.value.id, payload);
    router.push(`/tarefa/listar/${task.value.sprintId}`);
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
      <h1 class="text-4xl font-bold text-gray-800">Editar Tarefa</h1>
      <button
        @click="goBack"
        class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
      >
        ← Voltar
      </button>
    </div>
    
      <TaskEditForm @submit="handleSubmit" :errors="errors" :users="users" :task="task" />
  </Container>
</template>
