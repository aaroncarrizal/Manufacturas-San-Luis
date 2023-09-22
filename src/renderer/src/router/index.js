import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import ('../components/Index.vue')
    },
    {
      path: '/parts',
      name: 'partList',
      component: () => import ('../components/partComponents/PartList.vue')
    },
    {
      path: '/parts/new',
      name: 'partForm',
      component: () => import ('../components/partComponents/PartForm.vue')
    },
    {
      path: '/parts/print/:id',
      name: 'printPart',
      component: () => import ('../components/partComponents/PrintPart.vue')
    },
    {
      path: '/tokens',
      name: 'tokenList',
      component: () => import ('../components/tokenComponents/TokenList.vue')
    },
    {
      path: '/tokens/new',
      name: 'tokenForm',
      component: () => import ('../components/tokenComponents/TokenForm.vue')
    }
  ]
})

export default router
