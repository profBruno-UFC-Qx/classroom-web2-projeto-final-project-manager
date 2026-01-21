<script setup>
import { UserService } from '@/services/user/user.service';
import { onMounted } from 'vue';
import { useAuthStore } from '@/store/auth';
import { storeToRefs } from 'pinia';

const props = defineProps({
  comment: {
    type: Object,
    required: true
  }
});

async function loadAuthor(){
  try{
    await UserService.getById(props.comment.authorId);
  }catch(error){
    console.error("Erro ao carregar o autor do comentario:", error);
  }
}

onMounted(() => {
  loadAuthor();
});

const auth = useAuthStore();
const { isAuthenticated } = storeToRefs(auth);

</script>

<template>
  <div
    class="bg-yellow-100 border border-yellow-200 rounded-2xl shadow-md p-4 flex flex-col justify-between w-full max-w-xs hover:shadow-lg transition-all duration-200 cursor-pointer"
  >
    <div class="flex justify-between items-start mb-2">
      <h3 class="text-lg font-semibold text-gray-800 leading-tight">
        Comentario #{{ props.comment.id }}
      </h3>
      <span class="text-xl text-gray-700">
        <i class="fa-solid fa-book"></i>
      </span>
    </div>

    <div class="flex-1">
      <p class="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
        {{ props.comment.content }}
      </p>
    </div>

    <div class="mt-3 pt-2 border-t border-yellow-200 text-xs text-gray-500 flex justify-between items-center">
      <span>Publicado por: {{ props.comment.authorId }}</span>
      <span>{{ props.comment.createdAt?.slice(0, 10) }}</span>
      <div class="flex gap-2">
        <router-link
          v-if="isAuthenticated"
          :to="{ name: 'Comentario-editar', params: { comentarioId: Number(props.comment.id) } }"
          class="px-2 py-1 bg-yellow-200 hover:bg-yellow-300 rounded-md text-gray-700 shadow-sm transition"
        >
          Editar
        </router-link>
      </div>
    </div>
  </div>
</template>
