<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ProjectService } from "../../services/project/project.service.js";
import ProjetoEditForm from "../../components/ProjetoEditForm.vue";
import Container from "../../components/Container.vue";

const props = defineProps({
    user: {
        type: Object,
        required: true
    },
});

const router = useRouter();
const route = useRoute();

function goBack() {
    router.push("/projects/listar")
}

const project = ref({
    id: null,
    name: "",
    description: "",
    isPublic: false,
});

onMounted(async () => {
    const id = route.params.id;
    const data = await ProjectService.getById(id);

    project.value = {
        id: data.id,
        name: data.name,
        description: data.description,
        isPublic: data.isPublic,
    };
});

const errors = ref({});

async function handleSubmit(payload) {
    errors.value = {};
    
    try {
        await ProjectService.update(project.value.id, payload);
        router.push("/projects/listar");
    } catch (error) {
        if (error.response && error.response.status === 422) {
            errors.value = error.response.data.errors;
        } else {
            console.error(error);
        }
    }
}
</script>

<template>
    <Container>
        <div class="w-full mb-6 flex justify-between">
            <h1 class="text-4xl font-bold text-black">Editar Projeto</h1>
            <button @click="goBack" class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
                ← Voltar
            </button>
        </div>
        <ProjetoEditForm @submit="handleSubmit" :errors="errors" :project="project" />
    </Container>
</template>