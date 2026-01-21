<script setup>
import { ref, onMounted } from 'vue';
import ListarCard from '../pages/ListarCard.vue';
import { ProjectService } from '../services/project/project.service';

const projects = ref([]);

onMounted(async () => {
  projects.value = await ProjectService.list();
});

</script>

<template>
  <div>
    <ListarCard :projects="projects" />
  </div>
</template>
