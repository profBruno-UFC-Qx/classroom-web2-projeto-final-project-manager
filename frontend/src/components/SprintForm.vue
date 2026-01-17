<script setup>
import { reactive } from "vue";

const props = defineProps({
    errors: {
        type: Object,
        default: () => ({})
    },
    projectId: {
        type: Number,
        required: true
    }
});

const emit = defineEmits(["submit"]);

const form = reactive({
    name: "",
    startDate: "",
    endDate: "",
    projectId: props.projectId
});
</script>

<template>
     <form @submit.prevent="$emit('submit', form)" class="w-full bg-white p-6 rounded-2xl shadow-md space-y-5">
        <div class="mb-3">
            <label for="name" class="block text-sm font-medium text-gray-700">Nome da Sprint</label>
            <input type="text" name="name" class="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
            :class="errors.name
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'" id="name" v-model="form.name" 
            />

            <p v-if="errors.name" class="mt-1 text-sm text-red-500">{{ errors.name[0] }}</p>
        </div>

        <div class="mb-3">
            <label for="startDate" class="block text-sm font-medium text-gray-700">Data de Início</label>
            <input type="date" name="startDate" class="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
            :class="errors.startDate
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'" id="startDate" v-model="form.startDate" 
            />

            <p v-if="errors.startDate" class="mt-1 text-sm text-red-500">{{ errors.startDate[0] }}</p>
        </div>

        <div class="mb-3">
            <label for="endDate" class="block text-sm font-medium text-gray-700">Data de Término</label>
            <input type="date" name="endDate" class="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
            :class="errors.endDate
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'" id="endDate" v-model="form.endDate" 
            />

            <p v-if="errors.endDate" class="mt-1 text-sm text-red-500">{{ errors.endDate[0] }}</p>
        </div>

        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition">
            Criar Sprint
        </button>
     </form>
</template>