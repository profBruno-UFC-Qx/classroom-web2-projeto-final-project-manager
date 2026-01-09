<script setup>
import Container from '@/components/Container.vue';
import TarefaNote from '@/components/TarefaNote.vue';
import { onMounted, ref } from 'vue';
import { CommentService } from '../../services/comment/comment.service';
import { TaskService } from '../../services/task/task.service';

const props = defineProps({
    tarefaId: {
        type: String,
    }
});

const comments = ref([]);
const task = ref(null);
const error = ref("");

onMounted(async () => {
    try {
        task.value = await TaskService.getById(props.tarefaId);
        comments.value = await CommentService.listByTask(props.tarefaId);
    } catch (err) {
        error.value = "Nao foi possivel carregar os comentarios.";
    }
});

</script>

<template>
    <Container>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <p class="text-4xl font-bold text-black">Comentarios da Tarefa {{ tarefaId }}</p>
                <button>
                    <router-link
                        :to="{ name: 'Comentario-criar', params: { tarefaId: tarefaId } }"
                        class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 my-4 rounded-full text-sm shadow-sm transition"
                    >
                        <i class="fa-solid fa-plus"></i>
                        <span>Criar Novo Comentario</span>
                    </router-link>
                </button>
            </div>
            <div>
                <router-link
                    v-if="task?.sprintId"
                    :to="{ name: 'Tarefa-listar' , params: { sprintId: task.sprintId } }"
                    class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
                >
                    Voltar
                </router-link>
                <span
                    v-else
                    class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                >
                    Voltar
                </span>
            </div>
        </div>
        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
        <p v-else-if="comments.length === 0" class="text-sm text-gray-700">
            Nenhum comentario encontrado.
        </p>
         <div class="flex flex-wrap gap-5">
            <TarefaNote v-for="comment in comments" :key="comment.id" :comment="comment" />
        </div>
    </Container>
</template>
