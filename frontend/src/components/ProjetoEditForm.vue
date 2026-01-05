<script setup>
import { reactive, watch } from "vue";
import { ProjectService } from "../services/project/project.service";
ProjectService

const props = defineProps({
    errors: {
        type: Object,
        default: () => ({})
    },
    project: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(["submit"]);

const form = reactive({
    name: props.project.name,
    description: props.project.description,
    isPublic: props.project.isPublic,
});

watch(
    () => props.project,
    (newProject) => {
        if (!newProject) return;

        form.name = newProject.name ?? "";
        form.description = newProject.description ?? "";
        form.isPublic = newProject.isPublic ?? false;
    },
    { immediate: true }
);

</script>

<template>
    <form @submit.prevent="$emit('submit', form)" class="w-full bg-white p-6 rounded-2xl shadow-md space-y-5">

        <div class="mb-3">
            <label for="name" class="block text-sm font-medium text-gray-700">Título</label>
            <input type="text" name="name" class="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
            :class="errors.name
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'" id="name" v-model="form.name" 
            />

            <p v-if="errors.name" class="mt-1 text-sm text-red-500">{{ errors.name }}</p>
        </div>

        <div class="mb-3">
            <label for="description" class="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea rows="4" v-model="form.description" class="mt-1 w-full resize-none rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
            :class="errors.description
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'"
            >
            </textarea>

            <p v-if="errors.description" class="mt-1 text-sm text-red-500">{{ errors.description }}</p>
        </div>

        <div class="mb-3">
            <label for="isPublic" class="form-label">Visibilidade</label>
                <select name="isPublic" class="form-select" :class="{ 'is-invalid': errors.status }" id="isPublic" v-model="form.isPublic">
                    <option :value="true">Publico</option>
                    <option :value="false">Privado</option>
                </select>
            
            <div class="invalid-feedback" v-if="errors.status">{{ errors.status }}</div>
        </div>

        <button type="submit" class="w-full rounded-xl bg-blue-600 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Atualizar
        </button>
    </form>
</template>