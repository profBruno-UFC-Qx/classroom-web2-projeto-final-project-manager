<script setup>
import Container from '@/components/Container.vue';
import TarefaNote from '@/components/TarefaNote.vue';
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
    tarefaId: {
        type: String,
    }
});

</script>

<template>
    <Container>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p class="text-4xl font-bold text-black">Comentários {{ tarefaId }}</p>
            <router-link
                :to="{ name: 'Tarefa-listar' , params: { sprintId: 1 } }"
                class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
            >
                ← Voltar
            </router-link>
        </div>
         <div class="flex flex-wrap gap-5">
            <TarefaNote />
        </div>
    </Container>
</template>