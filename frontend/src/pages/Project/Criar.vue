<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ProjectService } from "../../services/project/project.service.js";
import ProjetoForm from "../../components/ProjetoForm.vue";
import Container from "../../components/Container.vue";

const props = defineProps({
    user: {
        type: Object,
        required: true
    }
});

const router = useRouter(); 

const errors = ref({});

function goBack() {
    router.push("/")
}

async function handleSubmit(payload) {
    errors.value = {};
    
    try {
        await ProjectService.create(payload);
        router.push("/projects/listar");
    } catch (error) {
        const message = error?.response?.data?.message;
        if (message) {
            const normalized = String(message).toLowerCase();
            if (normalized.includes("name")) {
                errors.value = { name: [message] };
            } else if (normalized.includes("description")) {
                errors.value = { description: [message] };
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
            <h1 class="text-4xl font-bold text-gray-800">Criar Projeto</h1>
            <button @click="goBack" class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
                ← Voltar
            </button>
        </div>
        <ProjetoForm @submit="handleSubmit" :errors="errors" />
    </Container>
</template>
