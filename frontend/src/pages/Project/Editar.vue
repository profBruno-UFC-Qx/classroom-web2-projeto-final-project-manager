<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ProjectService } from "../../services/project/project.service.js";
import { ProjectMemberService } from "../../services/projectMember/project.member.service.js";
import ProjetoEditForm from "../../components/ProjetoEditForm.vue";
import Container from "../../components/Container.vue";
import { useAuthStore } from "../../store/auth";

const props = defineProps({
    user: {
        type: Object,
        required: true
    },
});

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

function goBack() {
    router.push("/projects/listar")
}

const project = ref({
    id: null,
    name: "",
    description: "",
    isPublic: false,
    owner: null,
    ownerId: null,
});

const members = ref([]);
const loadingMembers = ref(false);
const memberError = ref("");
const updatingMemberId = ref(null);
const currentMembershipRole = ref(null);

const filteredMembers = computed(() => {
    const currentUserId = auth.user?.id;
    if (!currentUserId) {
        return members.value;
    }
    return members.value.filter((membership) => membership.userId !== currentUserId);
});

async function loadMembers(projectId) {
    memberError.value = "";
    loadingMembers.value = true;
    try {
        members.value = await ProjectMemberService.listByProject(projectId);
        if (auth.user?.id) {
            const mine = members.value.find((member) => member.userId === auth.user.id);
            currentMembershipRole.value = mine?.role ?? null;
        }
    } catch (error) {
        console.error(error);
        memberError.value = "Nao foi possivel carregar os membros do projeto.";
    } finally {
        loadingMembers.value = false;
    }
}

const canEditProject = computed(() => {
    if (!auth.user?.id) return false;
    if (project.value.ownerId === auth.user.id) return true;
    return currentMembershipRole.value === "manager" || currentMembershipRole.value === "admin";
});

const canManageMembers = computed(() => {
    if (!auth.user?.id) return false;
    if (project.value.ownerId === auth.user.id) return true;
    return currentMembershipRole.value === "admin";
});

async function handleRoleUpdate(membership) {
    if (!canManageMembers.value) {
        memberError.value = "Somente admins podem alterar membros do projeto.";
        return;
    }
    memberError.value = "";
    updatingMemberId.value = membership.id;
    try {
        await ProjectMemberService.update(project.value.id, membership.userId, {
            role: membership.role,
        });
    } catch (error) {
        console.error(error);
        memberError.value = "Nao foi possivel atualizar o papel do usuario.";
    } finally {
        updatingMemberId.value = null;
    }
}

onMounted(async () => {
    const id = Number(route.params.id);
    const data = await ProjectService.getById(id);

    project.value = {
        id: data.id,
        name: data.name,
        description: data.description,
        isPublic: data.isPublic,
        owner: data.owner ?? null,
        ownerId: data.ownerId ?? data.owner?.id ?? null,
    };

    if (!auth.user) {
        await auth.fetchUser();
    }
    await loadMembers(id);
});

const errors = ref({});

async function handleSubmit(payload) {
    errors.value = {};
    
    try {
        await ProjectService.update(project.value.id, payload);
        router.push("/projects/listar");
    } catch (error) {
        const message = error?.response?.data?.message;
        if (message) {
            const normalized = String(message).toLowerCase();
            if (normalized.includes("name")) {
                errors.value = { name: [message] };
            } else if (normalized.includes("description")) {
                errors.value = { description: [message] };
            } else {
                errors.value = { general: [message] };
            }
            return;
        }

        if (error.response && error.response.status === 422) {
            errors.value = error.response.data.errors;
            return;
        }

        console.error(error);
    }
}
</script>

<template>
    <Container>
        <div class="w-full mb-6 flex justify-between">
            <h1 class="text-4xl font-bold text-black">Editar Projeto</h1>
            <button @click="goBack" class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
                ← Voltar
            </button>
        </div>
        <p v-if="project.owner" class="mb-3 text-sm text-gray-600">
            Criado por: {{ project.owner.name }}
        </p>
        <p v-if="!canEditProject" class="mb-3 text-sm text-red-600">
            Somente managers ou admins podem editar os dados do projeto.
        </p>
        <ProjetoEditForm @submit="handleSubmit" :errors="errors" :project="project" :disabled="!canEditProject" />

        <div class="mt-8 w-full bg-white p-6 rounded-2xl shadow-md">
            <div class="flex flex-col gap-2">
                <h2 class="text-2xl font-bold text-black">Usuarios do projeto</h2>
                <p class="text-sm text-gray-500">Edite o papel de cada usuario.</p>
            </div>

            <p v-if="memberError" class="mt-3 text-sm text-red-600">{{ memberError }}</p>

            <div class="mt-4 overflow-x-auto">
                <table class="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead class="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
                        <tr>
                            <th class="px-4 py-2 border">Usuario</th>
                            <th class="px-4 py-2 border">Email</th>
                            <th class="px-4 py-2 border">Papel</th>
                            <th v-if="canManageMembers" class="px-4 py-2 border">Acao</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loadingMembers">
                            <td class="px-4 py-3 border text-gray-500" :colspan="canManageMembers ? 4 : 3">Carregando...</td>
                        </tr>
                        <tr v-else-if="!filteredMembers.length">
                            <td class="px-4 py-3 border text-gray-500" :colspan="canManageMembers ? 4 : 3">Nenhum membro encontrado.</td>
                        </tr>
                        <tr v-for="membership in filteredMembers" :key="membership.id" class="hover:bg-gray-50 transition">
                            <td class="px-4 py-2 border">{{ membership.user?.name || "Sem nome" }}</td>
                            <td class="px-4 py-2 border">{{ membership.user?.email || "-" }}</td>
                            <td class="px-4 py-2 border">
                                <select
                                    v-model="membership.role"
                                    class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                                    :disabled="!canManageMembers"
                                >
                                    <option value="member">Member</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </td>
                            <td v-if="canManageMembers" class="px-4 py-2 border">
                                <button
                                    type="button"
                                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
                                    :disabled="updatingMemberId === membership.id"
                                    @click="handleRoleUpdate(membership)"
                                >
                                    Salvar
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </Container>
</template>
