<script setup>
import Container from '../components/Container.vue';
import ProjetoCard from '../components/ProjetoCard.vue';

const props = defineProps({
    projects: {
        type: Array,
        required: true
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
                    <ProjetoCard v-for="project in props.projects" :key="project.id" :project="project" />
                </div>
            </div>
            <div>
                <div class="flex mb-2.5">
                    <p class="text-4xl font-bold text-black">Projetos Vínculados:</p>
                </div>
                <div class="flex flex-wrap gap-5">
                    <ProjetoCard v-for="project in props.projects" :key="project.id" :project="project" />
                </div>
            </div>
        </div>
    </Container>
</template>