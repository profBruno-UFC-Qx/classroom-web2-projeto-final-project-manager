<script setup>
import Container from '@/components/Container.vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { TaskService } from '../../services/task/task.service';
import { SprintService } from '../../services/sprint/sprint.service';
import { useAuthStore } from '@/store/auth';
import { storeToRefs } from 'pinia';

const props = defineProps({
    sprintId: {
        type: String,
    }
});

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const { isAuthenticated } = storeToRefs(auth);

const sprintId = Number(route.params.sprintId);

const sprint = ref({
    name: "",
    startDate: "",
    endDate: "",
    projectId: ""
});

const tasks = ref([]);

async function handleDelete(id) {
  if (!isAuthenticated.value) return;

  const confirmed = confirm('Deseja realmente excluir está tarefa?')
  if (!confirmed) return

  try {
    const res = await TaskService.delete(id)
    console.log('Resposta da API:', res)

    //router.replace({ name: 'Projects-listar' }) todo: mudar para futuramente emitir um estado e atualizar
    router.go(0)

  } catch (error) {
    console.error('Erro no delete:', error)
  }
}

onMounted(async () => {
    const id = route.params.sprintId;
    const data = await SprintService.getById(props.sprintId);

    sprint.value = {
        id: data.id,
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        projectId: data.projectId
    };

    tasks.value = await TaskService.listBySprint(props.sprintId);
});

</script>

<template>
    <Container>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <p class="text-4xl font-bold text-black">Tarefas da Sprint {{ sprintId }}</p>
                <button v-if="isAuthenticated">
                    <router-link
                        :to="{ name: 'Tarefa-criar', params: { sprintId: sprintId } }"
                        class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 my-4 rounded-full text-sm shadow-sm transition"
                    >
                        <i class="fa-solid fa-plus"></i>
                        <span>Criar Nova Tarefa</span>
                    </router-link>
                </button>
            </div>
            <div>
                <router-link
                    :to="{ name: 'Sprint-listar' , params: { projectId: Number(sprint.projectId) } }"
                    class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
                >
                    ← Voltar
                </router-link>
            </div>
        </div>
         <div class="mt-6 overflow-x-auto shadow-md rounded-lg">
            <table class="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead class="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
                    <tr>
                        <th class="px-4 py-2 border">Nome da Tarefa</th>
                        <th class="px-4 py-2 border">Status</th>
                        <th class="px-4 py-2 border">Responsável</th>
                        <th class="px-4 py-2 border">Opções</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="task in tasks" :key="task.id" class="hover:bg-gray-50 transition">
                        <td class="px-4 py-2 border">{{ task.title }}</td>
                        <td class="px-4 py-2 border">{{ task.status }}</td>
                        <td class="px-4 py-2 border">{{ task.assignee.name }}</td>
                        <td class="px-4 py-2 border">
                            <div class="flex flex-wrap justify-center gap-3">
                                <router-link
                                    :to="{ name: 'Comentario-listar', params: { tarefaId: Number(task.id) } }"
                                    class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-full text-sm shadow-sm transition"
                                >
                                    <i class="fa-solid fa-eye"></i>
                                    <span>Ver Comentarios</span>
                                </router-link>

                                <router-link
                                    v-if="isAuthenticated"
                                    :to="{ name: 'Tarefa-editar', params: { tarefaId: Number(task.id) } }"
                                    class="flex items-center justify-center w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-sm transition"
                                    title="Editar"
                                >
                                    <i class="fa-solid fa-pencil"></i>
                                </router-link>

                                <button
                                    v-if="isAuthenticated"
                                    @click="handleDelete(task.id)"
                                    class="flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-sm transition"
                                    title="Excluir"
                                >
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </Container>
</template>
