<script setup>
import { ref, onMounted } from 'vue';
import { ProjectService } from '../../services/project/project.service';
import { ProjectMemberService } from '../../services/projectMember/project.member.service';
import Container from '../../components/Container.vue';
import ProjetoTable from '../../components/ProjetoTable.vue';
import { useAuthStore } from '@/store/auth';
import { storeToRefs } from 'pinia';

const publicProjects = ref([]);
const myProjects = ref([]);
const auth = useAuthStore();
const { isAuthenticated } = storeToRefs(auth);

function handleDeleted(projectId) {
  publicProjects.value = publicProjects.value.filter((project) => project.id !== projectId);
  myProjects.value = myProjects.value.filter((project) => project.id !== projectId);
}

onMounted(async () => {
  const projects = await ProjectService.list();
  let mine = [];

  if (isAuthenticated.value) {
    try {
      mine = await ProjectMemberService.listMyProjects();
    } catch (error) {
      console.error('Erro ao carregar meus projetos:', error);
    }
  }

  const myProjectIds = new Set(mine.map((project) => project.id));
  publicProjects.value = projects.filter(
    (project) => project.isPublic === true && !myProjectIds.has(project.id)
  );
  myProjects.value = mine;
});

</script>

<template>
  <Container>
    <div class="space-y-10">
      <ProjetoTable
        title="Projetos publicos"
        :showCreate="false"
        :projects="publicProjects"
        @deleted="handleDeleted"
      />
      <ProjetoTable
        v-if="isAuthenticated"
        title="Meus projetos"
        :projects="myProjects"
        @deleted="handleDeleted"
      />
    </div>
  </Container>
</template>
