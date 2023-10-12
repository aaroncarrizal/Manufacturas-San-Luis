import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import ('../components/partComponents/PartList.vue')
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
      path: '/parts/edit/:id',
      name: 'partEdit',
      component: () => import ('../components/partComponents/PartEdit.vue')
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
    },
    {
      path: '/models',
      name: 'modelList',
      component: () => import ('../components/modelComponents/modelList.vue')
    },
    {
      path: '/models/new',
      name: 'modelForm',
      component: () => import ('../components/modelComponents/ModelForm.vue')
    },
    {
      path: '/models/edit/:id',
      name: 'modelEdit',
      component: () => import ('../components/modelComponents/ModelEdit.vue')
    }

  ]
})

export default router
