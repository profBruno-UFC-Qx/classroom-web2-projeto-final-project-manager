<script setup>

const props = defineProps({
    project: {
        type: Object,
        required: true
    }
});

</script>

<template>
    <div class="max-w-sm p-5 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ props.project.name }}</h5>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{{ props.project.description }}</p>
        <div class="flex gap-2">
            <router-link :to="{ name: 'Sprint-listar', params: { projectId: props.project.id } }" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                <div class="flex items-center justify-center gap-1.5">
                    <i class="fa-solid fa-user-plus"></i> 
                        Adicionar Membro  
                </div>
            </router-link>

            <router-link :to="{ name: 'Sprint-listar', params: { projectId: props.project.id } }" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <div class="flex items-center justify-center gap-1.5">    
                    <i class="fa-solid fa-arrow-right"></i>
                        Ver Sprints
                </div>
            </router-link>
        </div>
    </div>
</template>