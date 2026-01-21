import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '../services/axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const jwt = ref(localStorage.getItem('jwt'))

  const isAuthenticated = computed(() => !!jwt.value)

  async function fetchUser() {
    if (!jwt.value) {
      user.value = null
      return
    }

    try {
      const { data } = await api.get('/me')
      user.value = data
      localStorage.setItem('user', JSON.stringify(data))
    } catch (err) {
      logout()
    }
  }

  function setAuth(token, userData) {
    jwt.value = token
    user.value = userData
    localStorage.setItem('jwt', token)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function logout() {
    jwt.value = null
    user.value = null
    localStorage.removeItem('jwt')
    localStorage.removeItem('user')
  }

  return { user, jwt, isAuthenticated, setAuth, fetchUser, logout }
})
