<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/axios'
import { useAuthStore } from '@/store/auth'

const email = ref('')
const password = ref('')
const error = ref('')

const router = useRouter()
const auth = useAuthStore()

async function handleSubmit() {
  error.value = ''

  try {
    const response = await api.post('/auth/login', {
      email: email.value,
      password: password.value,
    })

    auth.setAuth(response.data.token, response.data.user)
    router.push('/')
  } catch (err) {
    error.value = 'Email ou senha invalidos.'
  }

}
</script>

<template>
  <div class="min-h-[70vh] flex items-center justify-center">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <h1 class="text-2xl font-bold text-slate-800">Entrar</h1>
      <p class="text-slate-500 mt-1">Acesse sua conta para continuar</p>

      <form class="mt-6 space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="block text-sm font-medium text-slate-700">Email</label>
          <input
            v-model="email"
            type="email"
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="email@email.com"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700">Senha</label>
          <input
            v-model="password"
            type="password"
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

        <div class="space-y-2">
          <button
              type="submit"
              class="w-full rounded-lg bg-blue-600 text-white font-semibold py-2 hover:bg-blue-700 transition disabled:opacity-60"
          >
            Entrar
          </button>
          <router-link
              to="/register"
              class="block w-full text-center rounded-lg border border-blue-600 bg-white text-blue-600 font-semibold py-2 hover:bg-blue-50 transition"
          >
            Registrar
          </router-link>
          <router-link
              to="/"
              class="block w-full text-center rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold py-2 hover:bg-slate-50 transition"
          >
            Ver projetos publicos
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>
