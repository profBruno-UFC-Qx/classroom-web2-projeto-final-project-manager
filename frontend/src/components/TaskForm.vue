<script setup>
import { reactive } from "vue";

const props = defineProps({
  errors: {
    type: Object,
    default: () => ({}),
  },
  projectId: {
    type: Number,
    required: true,
  },
  sprintId: {
    type: Number,
    default: null,
  },
});

const emit = defineEmits(["submit"]);

const form = reactive({
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
  assigneeId: "",
  projectId: props.projectId,
  sprintId: props.sprintId,
});
</script>

<template>
  <form @submit.prevent="$emit('submit', form)" class="w-full bg-white p-6 rounded-2xl shadow-md space-y-5">
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
      <p v-if="errors.title" class="mt-1 text-sm text-red-500">{{ errors.title }}</p>
    </div>

    <div class="mb-3">
      <label for="description" class="block text-sm font-medium text-gray-700">Descricao</label>
      <textarea
        id="description"
        v-model="form.description"
        rows="4"
        class="mt-1 w-full resize-none rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
        :class="errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'"
      ></textarea>
      <p v-if="errors.description" class="mt-1 text-sm text-red-500">{{ errors.description }}</p>
    </div>

    <div class="mb-3">
      <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
      <select
        id="status"
        v-model="form.status"
        class="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
        :class="errors.status ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'"
      >
        <option value="todo">Todo</option>
        <option value="in_progress">In progress</option>
        <option value="done">Done</option>
      </select>
      <p v-if="errors.status" class="mt-1 text-sm text-red-500">{{ errors.status }}</p>
    </div>

    <div class="mb-3">
      <label for="priority" class="block text-sm font-medium text-gray-700">Prioridade</label>
      <select
        id="priority"
        v-model="form.priority"
        class="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
        :class="errors.priority ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'"
      >
        <option value="low">Baixa</option>
        <option value="medium">Media</option>
        <option value="high">Alta</option>
      </select>
      <p v-if="errors.priority" class="mt-1 text-sm text-red-500">{{ errors.priority }}</p>
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
      <p v-if="errors.dueDate" class="mt-1 text-sm text-red-500">{{ errors.dueDate }}</p>
    </div>

    <div class="mb-3">
      <label for="assigneeId" class="block text-sm font-medium text-gray-700">Responsavel (ID)</label>
      <input
        id="assigneeId"
        v-model="form.assigneeId"
        type="number"
        min="1"
        name="assigneeId"
        class="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
        :class="errors.assigneeId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'"
      />
      <p v-if="errors.assigneeId" class="mt-1 text-sm text-red-500">{{ errors.assigneeId }}</p>
    </div>

    <button type="submit" class="w-full rounded-xl bg-blue-600 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
      Salvar
    </button>
  </form>
</template>
