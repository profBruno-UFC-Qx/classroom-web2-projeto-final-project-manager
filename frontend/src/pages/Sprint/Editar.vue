<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { SprintService } from "../../services/sprint/sprint.service.js";
import { ProjectService } from "../../services/project/project.service.js";
import Container from "../../components/Container.vue";
import SprintEditForm from "../../components/SprintEditForm.vue";

const props = defineProps({
    user: {
        type: Object,
        required: true
    },
});

const router = useRouter();
const route = useRoute();

const sprint = ref({
    name: "",
    startDate: "",
    endDate: "",
    projectId: ""
});

onMounted(async () => {
    const id = route.params.sprintId;
    const data = await SprintService.getById(id);

    sprint.value = {
        id: data.id,
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        projectId: data.projectId
    };
});

 function goBack() {
    router.push(`/sprint/listar/${sprint.value.projectId}`);
}

const errors = ref({});

async function handleSubmit(payload) {
    errors.value = {};
    
    try {
        await SprintService.update(sprint.value.id, payload);
        const projectId = sprint.value.projectId;
        router.push(`/sprint/listar/${projectId}`);
    } catch (error) {
        const message = error?.response?.data?.message;
        if (message) {
            const normalized = String(message).toLowerCase();
            if (normalized.includes("name")) {
                errors.value = { name: [message] };
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
            <h1 class="text-4xl font-bold text-gray-800">Editar Sprint</h1>
            <button
                @click="goBack()"
                class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
            >
                ← Voltar
            </button>
        </div>

        <SprintEditForm @submit="handleSubmit" :errors="errors" :projectId="sprint.projectId" :sprint="sprint" />
    </Container>
</template>
