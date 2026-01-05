<script setup>
import { ref, onMounted } from 'vue';
import { ProjectService } from '../../services/project/project.service';
import Container from '../../components/Container.vue';
import ProjetoTable from '../../components/ProjetoTable.vue';

const projects = ref([]);

onMounted(async () => {
  projects.value = await ProjectService.list();
});

</script>

<template>
  <Container>
    <ProjetoTable :projects="projects" />
  </Container>
</template>
