<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const mobileOpen = ref(false)
const dropdownOpen = ref(false)

function toggleMobile() {
  mobileOpen.value = !mobileOpen.value
}
function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')

  router.push({ name: 'Login' })

}
</script>

<template>
  <header class="px-4 md:px-8 py-4">
    <nav
      class="bg-blue-500 text-white rounded-xl shadow-lg px-4 md:px-6 py-3 flex items-center gap-4 md:gap-8"
      role="navigation"
      aria-label="Main Navigation"
    >
      <div class="shrink-0 flex items-center gap-3">
        <div class="text-white font-bold text-xl md:text-2xl tracking-tight select-none">
          Kanworker
        </div>
      </div>

      <ul class="hidden md:flex gap-6 flex-1 justify-start items-center ml-6">
        <li>
          <router-link to="/Dashboard" class="text-white/95 font-medium hover:underline">
            Dashboard
          </router-link>
        </li>

        <li class="relative" @mouseenter="dropdownOpen = true" @mouseleave="dropdownOpen = false">
          <button
            class="text-white/95 font-medium hover:underline flex items-center gap-1"
          >
            Projetos
          </button>

          <transition name="fade">
            <ul
              v-if="dropdownOpen"
              class="absolute top-full left-0 mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-lg py-2"
            >
              <div>
                <li>
                  <router-link
                    to="/projects/listar"
                    class="block px-4 py-2 hover:bg-blue-100 rounded-md"
                  >
                    Listar
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="/projects/criar"
                    class="block px-4 py-2 hover:bg-blue-100 rounded-md"
                  >
                    Criar
                  </router-link>
                </li>
              </div>
            </ul>
          </transition>
        </li>
      </ul>

      <div class="flex items-center gap-3 ml-auto">
        <button
          @click="logout"
          class="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg
                 bg-red-500 hover:bg-red-600 transition font-medium text-white"
        >
          Logout
        </button>

        <button
          @click="toggleMobile"
          aria-label="Abrir menu"
          class="md:hidden inline-flex items-center justify-center px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition font-medium"
        >
          <span v-if="!mobileOpen">Menu</span>
          <span v-else>Fechar</span>
        </button>
      </div>
    </nav>

    <transition name="slide">
      <aside
        v-if="mobileOpen"
        class="fixed left-4 top-24 z-50 w-64 max-w-[85%] bg-slate-900 text-white rounded-xl shadow-2xl p-6"
        role="dialog"
        aria-modal="true"
      >
        <div class="flex items-center justify-between mb-6">
          <div class="text-lg font-semibold">Kanworker</div>
          <button @click="toggleMobile" aria-label="Fechar menu" class="p-1 font-medium">
            X
          </button>
        </div>

        <nav>
          <ul class="flex flex-col gap-6">
            <li>
              <router-link to="/" class="block text-lg font-medium" @click="toggleMobile">
                Home
              </router-link>
            </li>

            <li>
              <button
                @click="toggleDropdown"
                class="w-full flex justify-between items-center text-lg font-medium"
              >
                Projetos
              </button>

              <div class="pt-4 border-t mt-1.5 border-white/20">
                <button
                  @click="logout"
                  class="w-full text-left text-lg font-medium
                    text-red-400 hover:text-red-300"
                >
                  Logout
                </button>
              </div>

              <transition name="slide">
                <ul
                  v-if="dropdownOpen"
                  class="mt-2 ml-4 flex flex-col gap-2 text-base"
                >
                  <li>
                    <router-link
                      to="/products/listar"
                      @click="toggleMobile"
                      class="block hover:underline"
                    >
                      Listar
                    </router-link>
                  </li>
                  <li>
                    <router-link
                      to="/products/criar"
                      @click="toggleMobile"
                      class="block hover:underline"
                    >
                      Criar
                    </router-link>
                  </li>
                </ul>
              </transition>
            </li>
          </ul>
        </nav>
      </aside>
    </transition>

    <transition name="fade">
      <div
        v-if="mobileOpen"
        @click="mobileOpen = false"
        class="fixed inset-0 bg-black/30 z-40"
      />
    </transition>
  </header>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 220ms ease, opacity 220ms ease;
}
.slide-enter-from {
  transform: translateX(-12px);
  opacity: 0;
}
.slide-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-leave-to {
  transform: translateX(-12px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
