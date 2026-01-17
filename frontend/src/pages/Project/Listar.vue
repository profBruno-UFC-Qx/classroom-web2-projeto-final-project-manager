<script setup>
import { ref, onMounted } from 'vue';
import { ProjectService } from '../../services/project/project.service';
import Container from '../../components/Container.vue';
import ProjetoTable from '../../components/ProjetoTable.vue';

const projects = ref([]);

function handleDeleted(projectId) {
  projects.value = projects.value.filter((project) => project.id !== projectId);
}

onMounted(async () => {
  projects.value = await ProjectService.list();
});

</script>

<template>
  <Container>
    <ProjetoTable :projects="projects" @deleted="handleDeleted" />
  </Container>
</template>
