import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../pages/Dashboard.vue'
import ListarProjeto from '@/pages/Project/Listar.vue'
import CriarProjeto from '@/pages/Project/Criar.vue'
import EditarProjeto from '@/pages/Project/Editar.vue'
import ListarSprint from '@/pages/Sprint/Listar.vue'
import CriarSprint from '@/pages/Sprint/Criar.vue'
import EditarSprint from '@/pages/Sprint/Editar.vue'
import ListarMembrosProjeto from '@/pages/ProjectMember/Listar.vue'
import ListarTarefa from '@/pages/Task/Listar.vue'
import CriarTarefa from '@/pages/Task/Criar.vue'
import EditarTarefa from '@/pages/Task/Editar.vue'
import ListarComentario from '@/pages/Comment/Listar.vue'
import CriarComentario from '@/pages/Comment/Criar.vue'
import EditarComentario from '@/pages/Comment/Editar.vue'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/Dashboard',
      name: 'Dashboard',
      component: Dashboard,
    },
    {
      path: '/projects/listar',
      name: 'Projects-listar',
      component: ListarProjeto
    },
    {
      path: '/projects/criar',
      name: 'Projects-criar',
      component: CriarProjeto
    },
    {
      path: '/projects/editar/:id',
      name: 'Projects-editar',
      component: EditarProjeto,
      props: true
    },
    {
      path: '/sprint/listar/:projectId', 
      name: 'Sprint-listar',
      component: ListarSprint,
      props: true
    },
    {
      path: '/members/listar/:projectId',
      name: 'Members-listar',
      component: ListarMembrosProjeto,
      props: true
    },
    {
      path: '/sprint/criar/:projectId',
      name: 'Sprint-criar',
      component: CriarSprint,
      props: true
    },
    {
      path: '/sprint/editar/:sprintId',
      name: 'Sprint-editar',
      component: EditarSprint,
      props: true
    },
    {
      path: '/tarefa/listar/:sprintId',
      name: 'Tarefa-listar',
      component: ListarTarefa,
      props: true
    },
    {
      path: '/tarefa/criar/:sprintId',
      name: 'Tarefa-criar',
      component: CriarTarefa,
      props: true
    },
    {
      path: '/tarefa/editar/:tarefaId',
      name: 'Tarefa-editar',
      component: EditarTarefa,
      props: true
    },
    {
      path: '/comentario/listar/:tarefaId',
      name: 'Comentario-listar',
      component: ListarComentario,
      props: true
    },
    {
      path: '/comentario/criar/:tarefaId',
      name: 'Comentario-criar',
      component: CriarComentario,
      props: true
    },
    {
      path: '/comentario/editar/:comentarioId',
      name: 'Comentario-editar',
      component: EditarComentario,
      props: true
    },
  ],
})

export default router
