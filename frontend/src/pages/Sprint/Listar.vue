<script setup>
import Container from '@/components/Container.vue';
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
    projectId: {
        type: String,
    }
})

function goBack() {
    router.push("/")
}

// function goTasks(id) {
//     router.push(`/sprint/tarefas/${id}`)
// }

function goEdit(id) {
    router.push(`/tarefa/listar/${id}`)
}

</script>

<template>
    <Container>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p class="text-4xl font-bold text-black">Sprints do Projeto {{ projectId }}</p>
            <button @click="goBack" class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
                ← Voltar
            </button>
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
                    <tr class="hover:bg-gray-50 transition">
                        <td class="px-4 py-2 border">Sprint 1</td>
                        <td class="px-4 py-2 border">2024-01-01</td>
                        <td class="px-4 py-2 border">2024-01-15</td>
                        <td class="px-4 py-2 border">
                            <div class="flex flex-wrap justify-center gap-3">
                                <router-link
                                    :to="{ name: 'Tarefa-listar', params: { sprintId: 1 } }"
                                    class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-full text-sm shadow-sm transition"
                                >
                                    <i class="fa-solid fa-eye"></i>
                                    <span>Ver Tarefas</span>
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