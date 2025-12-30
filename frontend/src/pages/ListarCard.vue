<script setup>
import Container from '../components/Container.vue';
import ProjetoCard from '../components/ProjetoCard.vue';
</script>

<template>
    <Container>
        <div>
            <p class="text-4xl font-bold text-black">Projetos em andamento</p>
        </div>
        <div class="flex flex-wrap gap-5">
            <ProjetoCard />
        </div>
    </Container>
</template>