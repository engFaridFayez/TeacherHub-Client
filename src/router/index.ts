import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import ListStagesView from '@/views/stages/ListStagesView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      name:"Home",
      component:HomeView
    },
    {
      path:'/login',
      name:"login",
      component:LoginView
    },
    {
      path:'/stages',
      name:'stages',
      component:ListStagesView
    }
  ],
})

export default router
