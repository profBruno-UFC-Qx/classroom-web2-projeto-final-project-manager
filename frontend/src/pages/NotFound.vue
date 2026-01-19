<template>
  <div class="min-h-[70vh] flex items-center justify-center">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 md:p-8 text-center">
      <h1 class="text-2xl font-bold text-slate-800">Pagina não encontrada</h1>
      <p class="text-slate-500 mt-2">
        O endereço que voce tentou acessar não existe.
      </p>
      <router-link
        to="/"
        class="mt-6 inline-block rounded-lg bg-blue-600 text-white font-semibold px-4 py-2 hover:bg-blue-700 transition"
      >
        Voltar para o dashboard
      </router-link>
    </div>
  </div>
</template>
