<script setup>
import Container from '@/components/Container.vue';
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
    sprintId: {
        type: String,
    }
});

</script>

<template>
    <Container>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p class="text-4xl font-bold text-black">Tarefas da Sprint {{ sprintId }}</p> <!-- Na verdade seria sprintd.project_id -->
            <router-link
                :to="{ name: 'Sprint-listar' , params: { projectId: 1 } }"
                class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
            >
                ← Voltar
            </router-link>
        </div>
         <div class="mt-6 overflow-x-auto shadow-md rounded-lg">
            <table class="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead class="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
                    <tr>
                        <th class="px-4 py-2 border">Nome da Tarefa</th>
                        <th class="px-4 py-2 border">Status</th>
                        <th class="px-4 py-2 border">Opções</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="hover:bg-gray-50 transition">
                        <td class="px-4 py-2 border">Criação de SPA</td>
                        <td class="px-4 py-2 border">Amarelo</td>
                        <td class="px-4 py-2 border">
                            <div class="flex flex-wrap justify-center gap-3">
                                <router-link
                                    :to="{ name: 'Comentario-listar', params: { tarefaId: 1 } }"
                                    class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-full text-sm shadow-sm transition"
                                >
                                    <i class="fa-solid fa-eye"></i>
                                    <span>Ver Comentários</span>
                                </router-link>

                                <button 
                                    class="flex items-center justify-center w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-sm transition"
                                    title="Editar"
                                >
                                    <i class="fa-solid fa-pencil"></i>
                                </button>

                                <button 
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