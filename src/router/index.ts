import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue')
    },
    {
      path: '/topology',
      name: 'topology',
      component: () => import('../views/TopologyView.vue')
    },
    {
      path: '/baseband',
      name: 'baseband',
      component: () => import('../views/BasebandView.vue')
    },
    {
      path: '/matrix',
      name: 'matrix',
      component: () => import('../views/MatrixView.vue')
    },
    {
      path: '/other-devices',
      name: 'other-devices',
      component: () => import('../views/OtherDevicesView.vue')
    },
    {
      path: '/device-control',
      name: 'device-control',
      component: () => import('../views/DeviceControlView.vue')
    }
  ]
})

export default router
