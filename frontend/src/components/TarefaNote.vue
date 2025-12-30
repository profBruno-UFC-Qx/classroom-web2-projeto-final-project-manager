<script setup>

</script>

<template>
  <div
    class="bg-yellow-100 border border-yellow-200 rounded-2xl shadow-md p-4 flex flex-col justify-between w-full max-w-xs hover:shadow-lg transition-all duration-200 cursor-pointer"
  >
    <div class="flex justify-between items-start mb-2">
      <h3 class="text-lg font-semibold text-gray-800 leading-tight">
        Título da Nota
      </h3>
      <span class="text-xl text-gray-700">
        <i class="fa-solid fa-book"></i>
      </span>
    </div>

    <div class="flex-1">
      <p class="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
        Exemplo de conteúdo da nota.  
        Pode conter várias linhas e detalhes, simulando o corpo de uma anotação comum.
      </p>
    </div>

    <div class="mt-3 pt-2 border-t border-yellow-200 text-xs text-gray-500 flex justify-between items-center">
      <span>28/10/2025</span>
      <div class="flex gap-2">
      <button
        class="px-2 py-1 bg-yellow-200 hover:bg-yellow-300 rounded-md text-gray-700 shadow-sm transition"
      >
        Editar
      </button>
      <button
          class="px-2 py-1 bg-green-200 hover:bg-green-300 rounded-md text-gray-700 shadow-sm transition"
        >
          Concluído
        </button>
      </div>
    </div>
  </div>
</template>
