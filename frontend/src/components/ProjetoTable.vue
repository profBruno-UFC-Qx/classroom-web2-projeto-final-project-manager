<script setup>
import { ref } from "vue";
import Container from '@/components/Container.vue';
import { ProjectService } from "../services/project/project.service";
import { useRouter } from 'vue-router';

const router = useRouter()

const errors = ref({});

const props = defineProps({
    projects: {
        type: Array,
        required: true
    }
});

async function handleDelete(id) {

  const confirmed = confirm('Deseja realmente excluir este projeto?')
  if (!confirmed) return

  try {
    const res = await ProjectService.delete(id)
    console.log('Resposta da API:', res)

    router.replace({ name: 'Projects-listar' })
  } catch (error) {
    console.error('Erro no delete:', error)
  }
}

</script>

<template>
    <Container>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <p class="text-4xl font-bold text-black">Gerenciamento de Projetos</p>
            </div>
            <div>
                <button>
                    <router-link
                        :to="{ name: 'Projects-criar' }"
                        class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 my-4 rounded-full text-sm shadow-sm transition"
                    >
                        <i class="fa-solid fa-plus"></i>
                        <span>Criar Novo Projeto</span>
                    </router-link>
                </button>
            </div>
        </div>
        <div class="mt-6 overflow-x-auto shadow-md rounded-lg">
            <table class="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead class="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
                    <tr>
                        <th class="px-4 py-2 border">Nome do Projeto</th>
                        <th class="px-4 py-2 border">Descrição</th>
                        <th class="px-4 py-2 border">Visibilidade</th>
                        <th class="px-4 py-2 border">Data de Criação</th>
                        <th class="px-4 py-2 border">Opções</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="project in projects" :key="project.id" class="hover:bg-gray-50 transition">
                        <td class="px-4 py-2 border">{{ project.name }}</td>
                        <td class="px-4 py-2 border">{{ project.description }}</td>
                        <td class="px-4 py-2 border" v-if="project.isPublic === true">
                            Público
                        </td>
                        <td class="px-4 py-2 border" v-else>
                            Privado
                        </td>
                        <td class="px-4 py-2 border">{{ project.createdAt.slice(0, 10) }}</td>
                        <td class="px-4 py-2 border">
                            <div class="flex flex-wrap justify-center gap-3">
                                <router-link
                                        :to="{ name: 'Projects-editar', params: { id: project.id } }"
                                        class="flex items-center justify-center w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-sm transition"
                                    >
                                        <i class="fa-solid fa-pencil"></i>
                                </router-link>
                                <button 
                                    @click="handleDelete(project.id)"
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