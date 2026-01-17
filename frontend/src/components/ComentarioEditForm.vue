<script setup>
import { reactive, watch } from "vue";

const props = defineProps({
  errors: {
    type: Object,
    default: () => ({}),
  },
  taskId: {
    type: Number,
    required: true,
  },
  comment: {
    type: Object,
    required: false
  },
});

const emit = defineEmits(["submit"]);

const form = reactive({
  content: props.comment.content,
  taskId: props.comment.taskId,
});

watch(
  () => props.comment,
  (newComment) => {
    if (!newComment) return;

    form.content = newComment.content ?? "";
    form.taskId = newComment.taskId ?? props.taskId;
  },
  { immediate: true }
);
</script>

<template>
  <form @submit.prevent="$emit('submit', form)" class="w-full bg-white p-6 rounded-2xl shadow-md space-y-5">
    <div class="mb-3">
      <label for="content" class="block text-sm font-medium text-gray-700">Comentário</label>
      <textarea
        id="content"
        v-model="form.content"
        rows="4"
        class="mt-1 w-full resize-none rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
        :class="errors.content ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'"
      ></textarea>
      <p v-if="errors.content" class="mt-1 text-sm text-red-500">{{ errors.content[0] }}</p>
    </div>

    <button type="submit" class="w-full rounded-xl bg-blue-600 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
      Atualizar Comentário
    </button>
  </form>
</template>
