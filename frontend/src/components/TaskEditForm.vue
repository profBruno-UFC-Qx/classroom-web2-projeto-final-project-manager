<script setup>
import { reactive, watch, ref, computed, onMounted } from "vue";
import { ProjectMemberService } from "../services/projectMember/project.member.service";
import { useAuthStore } from "../store/auth";

const props = defineProps({
  errors: {
    type: Object,
    default: () => ({})
  },
  task: {
    type: Object,
    required: true
  },
  users: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(["submit"]);

const auth = useAuthStore();
const currentUser = computed(() => auth.user);

const role = ref("member");

const projectId = computed(() => props.task?.projectId);

console.log("TaskEditForm projectId:", projectId.value);

const form = reactive({
  title: "",
  description: "",
  status: "",
  priority: "",
  dueDate: "",
  assigneeId: null
});

async function loadRole() {
  console.log("loadRole chamado", { projectId: projectId.value, currentUser: currentUser.value });

  if (!projectId.value || !currentUser.value) {
    console.warn("Sem projectId ou currentUser, saindo...");
    return;
  }

  try {
    const members = await ProjectMemberService.listByProject(projectId.value);
    console.log("members retornados:", members);

    const me = members.find(
      m => m.userId === currentUser.value.id || m.user?.id === currentUser.value.id
    );

    console.log("me encontrado:", me);

    role.value = me?.role ?? "member";
  } catch (err) {
    console.error("Erro ao carregar role:", err);
    role.value = "member";
  }
}

watch(projectId, () => {
  loadRole();
}, { immediate: true });

watch(
  () => props.task,
  (newTask) => {
    if (!newTask) return;

    form.title = newTask.title ?? "";
    form.description = newTask.description ?? "";
    form.status = newTask.status ?? "";
    form.priority = newTask.priority ?? "";
    form.dueDate = newTask.dueDate ?? "";
    form.assigneeId = newTask.assigneeId ?? null;

    if (newTask.sprint?.projectId) {
      loadRole();
    }
  },
  { immediate: true }
);


onMounted(() => {
  loadRole();
});

const isAdmin = computed(() => role.value === "admin");
const isMember = computed(() => role.value === "member");

</script>

<template>
  <form @submit.prevent="$emit('submit', form)" class="w-full bg-white p-6 rounded-2xl shadow-md space-y-5">
    <div v-if="isAdmin"> 
        <div class="mb-3">
          <label for="title" class="block text-sm font-medium text-gray-700">Titulo</label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            name="title"
            class="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
            :class="errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'"
          />
          <p v-if="errors.title" class="mt-1 text-sm text-red-500">{{ errors.title[0] }}</p>
        </div>

        <div class="mb-3">
          <label for="description" class="block text-sm font-medium text-gray-700">Descrição</label>
          <textarea
            id="description"
            v-model="form.description"
            rows="4"
            class="mt-1 w-full resize-none rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
            :class="errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'"
          ></textarea>
          <p v-if="errors.description" class="mt-1 text-sm text-red-500">{{ errors.description[0] }}</p>
        </div>

        <div class="mb-3">
        <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            v-model="form.status"
            class="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
            :class="errors.status ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'"
          >
            <option value="a fazer">A fazer</option>
            <option value="em progresso">Em progresso</option>
            <option value="concluído">Concluído</option>
          </select>
          <p v-if="errors.status" class="mt-1 text-sm text-red-500">{{  errors.status[0] }}</p>
        </div>

        <div class="mb-3">
          <label for="priority" class="block text-sm font-medium text-gray-700">Prioridade</label>
          <select
            id="priority"
            v-model="form.priority"
            class="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
            :class="errors.priority ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'"
          >
            <option value="baixa">Baixa</option>
            <option value="média">Média</option>
            <option value="alta">Alta</option>
          </select>
          <p v-if="errors.priority" class="mt-1 text-sm text-red-500">{{ errors.priority[0] }}</p>
        </div>

        <div class="mb-3">
          <label for="dueDate" class="block text-sm font-medium text-gray-700">Data de entrega</label>
          <input
            id="dueDate"
            v-model="form.dueDate"
            type="date"
            name="dueDate"
            class="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
            :class="errors.dueDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'"
          />
          <p v-if="errors.dueDate" class="mt-1 text-sm text-red-500">{{ errors.dueDate[0]}}</p>
        </div>

        <div class="mb-3">
          <label for="assigneeId" class="block text-sm font-medium text-gray-700">
            Responsável
          </label>

          <select
            id="assigneeId"
            v-model="form.assigneeId"
            class="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
            :class="errors.assigneeId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'"
          >
            <option disabled value="">Selecione um responsável</option>

            <option
              v-for="user in users"
              :key="user.id"
              :value="user.id"
            >
              {{ user.name }}
            </option>
          </select>

          <p v-if="errors.assigneeId" class="mt-1 text-sm text-red-500">
            {{ errors.assigneeId[0] }}
          </p>
        </div>
    </div>
    <div v-else>
      <div class="mb-3">
        <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            v-model="form.status"
            class="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
            :class="errors.status ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'"
          >
            <option value="a fazer">A fazer</option>
            <option value="em progresso">Em progresso</option>
            <option value="concluído">Concluído</option>
          </select>
          <p v-if="errors.status" class="mt-1 text-sm text-red-500">{{ errors.status[0] }}</p>
      </div>
    </div>

    <button type="submit" class="w-full rounded-xl bg-blue-600 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
      Atualizar
    </button>
  </form>
</template>
