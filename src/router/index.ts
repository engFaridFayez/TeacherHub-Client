import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path:'/',
      name:"home",
      component: () => import("@/views/HomeView.vue"),
      meta:{
        requireAuth:false
      }
    },
    {
      path:'/register',
      name:'register',
      component: () => import("@/views/RegisterView.vue"),
      meta:{
        guestOnly: true
      }
    },
    {
      path:'/login',
      name:"login",
      component:() => import("@/views/LoginView.vue"),
      meta: {
        guestOnly: true
      }
    },
    {
      path:'/stages',
      name:'stages',
      component:() => import("@/views/stages/ListStagesView.vue"),
      meta:{
        requireAuth:false
      },
    },
  ],
})

router.beforeEach((to) => {
    const token = localStorage.getItem("access");

    if (to.meta.requireAuth && !token) {
        return {
            name: "login",
            query: {
                redirect: to.fullPath
            }
        };
    }

    if (to.meta.guestOnly && token) {
        return { name: "home" };
    }

    return true;
});

export default router
