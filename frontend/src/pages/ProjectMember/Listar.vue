<script setup>
import Container from '@/components/Container.vue';
import { onMounted, ref } from 'vue';
import { ProjectMemberService } from '@/services/projectMember/project.member.service';

const props = defineProps({
  projectId: {
    type: Number,
    required: true,
  },
});

const members = ref([]);
const availableUsers = ref([]);
const loading = ref(false);
const errorMessage = ref("");
const form = ref({
  userId: "",
  role: "member",
});

async function loadMembers() {
  try {
    loading.value = true;
    members.value = await ProjectMemberService.listByProject(props.projectId);
  } catch (error) {
    console.error(error);
    errorMessage.value = "Nao foi possivel carregar os membros.";
  } finally {
    loading.value = false;
  }
}

async function loadAvailableUsers() {
  try {
    availableUsers.value = await ProjectMemberService.listAvailable(props.projectId);
  } catch (error) {
    console.error(error);
    errorMessage.value = "Nao foi possivel carregar usuarios disponiveis.";
  }
}

async function handleAddMember() {
  errorMessage.value = "";
  const userId = Number(form.value.userId);
  if (!Number.isFinite(userId)) {
    errorMessage.value = "Selecione um usuario valido.";
    return;
  }

  try {
    await ProjectMemberService.add(props.projectId, {
      userId,
      role: form.value.role,
    });
    form.value.userId = "";
    await loadMembers();
    await loadAvailableUsers();
  } catch (error) {
    console.error(error);
    errorMessage.value = "Nao foi possivel adicionar o membro.";
  }
}

onMounted(async () => {
  await loadMembers();
  await loadAvailableUsers();
});
</script>

<template>
  <Container>
    <div class="flex flex-col gap-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Membros do projeto</h2>
        <p class="text-sm text-gray-500">Projeto ID: {{ projectId }}</p>
      </div>

      <div class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">Adicionar membro</h3>
        <form class="flex flex-col gap-3 md:flex-row md:items-end" @submit.prevent="handleAddMember">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700">Usuario</label>
            <select
              v-model="form.userId"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            >
              <option value="">Selecione um usuario</option>
              <option v-for="user in availableUsers" :key="user.id" :value="user.id">
                {{ user.name }} ({{ user.email }})
              </option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700">Papel</label>
            <select
              v-model="form.role"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            >
              <option value="member">Member</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            class="h-10 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            :disabled="!availableUsers.length"
          >
            Adicionar
          </button>
        </form>
        <p v-if="!availableUsers.length" class="mt-3 text-sm text-gray-500">
          Nenhum usuario disponivel para adicionar.
        </p>
        <p v-if="errorMessage" class="mt-3 text-sm text-red-600">{{ errorMessage }}</p>
      </div>

      <div class="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
        <table class="min-w-full">
          <thead class="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
            <tr>
              <th class="px-4 py-2 border">Usuario</th>
              <th class="px-4 py-2 border">Email</th>
              <th class="px-4 py-2 border">Papel</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td class="px-4 py-3 border text-gray-500" colspan="3">Carregando...</td>
            </tr>
            <tr v-else-if="!members.length">
              <td class="px-4 py-3 border text-gray-500" colspan="3">Nenhum membro encontrado.</td>
            </tr>
            <tr v-for="membership in members" :key="membership.id" class="hover:bg-gray-50 transition">
              <td class="px-4 py-2 border">{{ membership.user?.name || "Sem nome" }}</td>
              <td class="px-4 py-2 border">{{ membership.user?.email || "-" }}</td>
              <td class="px-4 py-2 border">{{ membership.role }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Container>
</template>
