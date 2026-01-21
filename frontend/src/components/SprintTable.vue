<script setup>
import { ref } from "vue";
import Container from '@/components/Container.vue';
import { SprintService } from "../services/sprint/sprint.service";
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { storeToRefs } from 'pinia';

const router = useRouter()
const route = useRoute()
const auth = useAuthStore();
const { isAuthenticated } = storeToRefs(auth);

const errors = ref({});

const props = defineProps({
    sprints: {
        type: Array,
        required: true
    }
});

async function handleDelete(id) {
  if (!isAuthenticated.value) return;

  const confirmed = confirm('Deseja realmente excluir este projeto?')
  if (!confirmed) return

  try {
    const res = await SprintService.delete(id)
    console.log('Resposta da API:', res)

    router.replace({ name: 'Projects-listar' }) 

  } catch (error) {
    console.error('Erro no delete:', error)
  }
}

const projectId = route.params.projectId

function goBack() {
    router.push("/")
}

</script>

<template>
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <p class="text-4xl font-bold text-black">Sprints do Projeto {{ projectId }}</p>
                <button v-if="isAuthenticated">
                    <router-link
                        :to="{ name: 'Sprint-criar', params: { projectId: projectId } }"
                        class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 my-4 rounded-full text-sm shadow-sm transition"
                    >
                        <i class="fa-solid fa-plus"></i>
                        <span>Criar Nova Sprint</span>
                    </router-link>
                </button>
            </div>
            <div>
                <button @click="goBack" class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
                    ← Voltar
                </button>
            </div>
        </div>
        <div class="mt-6 overflow-x-auto shadow-md rounded-lg">
            <table class="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead class="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
                    <tr>
                        <th class="px-4 py-2 border">Nome da Sprint</th>
                        <th class="px-4 py-2 border">Data de Início</th>
                        <th class="px-4 py-2 border">Data de Término</th>
                        <th class="px-4 py-2 border">Opções</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="sprint in sprints" :key="sprint.id" class="hover:bg-gray-50 transition">
                        <td class="px-4 py-2 border">{{ sprint.name }}</td>
                        <td class="px-4 py-2 border">{{ sprint.startDate }}</td>
                        <td class="px-4 py-2 border">{{ sprint.endDate }}</td>
                        <td class="px-4 py-2 border">
                            <div class="flex flex-wrap justify-center gap-3">
                                <router-link
                                    :to="{ name: 'Tarefa-listar', params: { sprintId: sprint.id } }"
                                    class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-full text-sm shadow-sm transition"
                                >
                                    <i class="fa-solid fa-eye"></i>
                                    <span>Ver Tarefas</span>
                                </router-link>

                                <router-link
                                        v-if="isAuthenticated"
                                        :to="{ name: 'Sprint-editar', params: { sprintId: sprint.id } }"
                                        class="flex items-center justify-center w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-sm transition"
                                        title="Editar"
                                    >
                                        <i class="fa-solid fa-pencil"></i>
                                </router-link>

                                <button
                                    v-if="isAuthenticated"
                                    @click="handleDelete(sprint.id)" 
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
</template>

