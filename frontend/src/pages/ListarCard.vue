<script setup>
import { computed, onMounted, ref } from 'vue';
import Container from '../components/Container.vue';
import ProjetoCard from '../components/ProjetoCard.vue';
import { ProjectMemberService } from '../services/projectMember/project.member.service';
import { useAuthStore } from '@/store/auth';
import { storeToRefs } from 'pinia';

const props = defineProps({
    projects: {
        type: Array,
        required: true
    }
});

const linkedProjects = ref([]);
const auth = useAuthStore();
const { isAuthenticated } = storeToRefs(auth);

const publicProjects = computed(() => {
  const linkedIds = new Set(linkedProjects.value.map((project) => Number(project.id)));
  return props.projects.filter(
    (project) => project.isPublic === true && !linkedIds.has(Number(project.id))
  );
});

onMounted(async () => {
  if (!isAuthenticated.value) return;

  try {
    linkedProjects.value = await ProjectMemberService.listMyProjects();
  } catch (error) {
    console.error('Erro ao carregar projetos vinculados:', error);
  }
});

</script>

<template>
    <Container>
        <div class="flex flex-col gap-5">
            <div>
                <div class="flex mb-2.5">
                    <p class="text-4xl font-bold text-black">Projetos Públicos:</p>
                </div>
                <div class="flex flex-wrap gap-5">
                    <ProjetoCard v-for="project in publicProjects" :key="project.id" :project="project" />
                </div>
            </div>
            <div v-if="isAuthenticated">
                <div class="flex mb-2.5">
                    <p class="text-4xl font-bold text-black">Projetos Vínculados:</p>
                </div>
                <div class="flex flex-wrap gap-5">
                    <ProjetoCard v-for="project in linkedProjects" :key="project.id" :project="project" />
                </div>
            </div>
        </div>
    </Container>
</template>
