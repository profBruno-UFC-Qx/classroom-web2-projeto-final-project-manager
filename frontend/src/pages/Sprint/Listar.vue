<script setup>
import Container from '@/components/Container.vue';
import { onMounted, ref } from 'vue';
import { SprintService } from "../../services/sprint/sprint.service.js"
import SprintTable from '../../components/SprintTable.vue';


const props = defineProps({
    projectId: {
        type: Number
    }
})

const sprints = ref([]);

onMounted(async () => { 
    sprints.value = await SprintService.listByProject(props.projectId);
})

</script>

<template>
    <Container>
        <SprintTable :sprints="sprints" />
    </Container>
</template>