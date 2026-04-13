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
    },
    {
      path: '/remote-control',
      name: 'remote-control',
      component: () => import('../views/RemoteControlView.vue')
    },
    {
      path: '/task-status',
      name: 'task-status',
      component: () => import('../views/TaskStatusView.vue')
    },
    {
      path: '/data-transmission',
      name: 'data-transmission',
      component: () => import('../views/DataTransmissionView.vue')
    },
    {
      path: '/task-execution',
      name: 'task-execution',
      component: () => import('../views/TaskExecutionView.vue')
    },
    {
      path: '/task-macro',
      name: 'task-macro',
      component: () => import('../views/TaskMacroView.vue')
    },
    {
      path: '/task-link-mapping',
      name: 'task-link-mapping',
      component: () => import('../views/TaskLinkMappingView.vue')
    }
  ]
})

export default router
