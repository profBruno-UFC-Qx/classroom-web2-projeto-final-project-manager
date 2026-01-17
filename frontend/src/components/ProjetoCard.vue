<script setup>
import { computed, onMounted, ref } from 'vue';
import { useAuthStore } from '@/store/auth';
import { ProjectMemberService } from '@/services/projectMember/project.member.service';

const props = defineProps({
    project: {
        type: Object,
        required: true
    }
});

const auth = useAuthStore();
const membershipRole = ref(null);

const canAddMembers = computed(() => {
    if (!auth.user) return false;
    if (props.project?.ownerId === auth.user.id) return true;
    return membershipRole.value === "admin";
});

onMounted(async () => {
    if (!auth.user?.id || !props.project?.id) {
        return;
    }

    try {
        const members = await ProjectMemberService.listByProject(props.project.id);
        const me = members.find((member) => member.userId === auth.user.id);
        membershipRole.value = me?.role ?? null;
    } catch (error) {
        console.error(error);
    }
});
</script>

<template>
    <div class="max-w-sm p-5 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ props.project.name }}</h5>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{{ props.project.description }}</p>
        <p v-if="props.project.owner" class="mb-3 text-xs text-gray-500 dark:text-gray-400">
            Criado por: {{ props.project.owner.name }}
        </p>
        <div class="flex gap-2">
            <router-link
                v-if="canAddMembers"
                :to="{ name: 'Members-listar', params: { projectId: props.project.id } }"
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
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
