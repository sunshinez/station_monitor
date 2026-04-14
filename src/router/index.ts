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
    },
    {
      path: '/task-script-editor',
      name: 'task-script-editor',
      component: () => import('../views/TaskScriptEditorView.vue')
    },
    {
      path: '/task-plan-template',
      name: 'task-plan-template',
      component: () => import('../views/TaskPlanTemplateView.vue')
    },
    {
      path: '/task-mission-param',
      name: 'task-mission-param',
      component: () => import('../views/TaskMissionParamView.vue')
    },
    {
      path: '/task-plan-reception',
      name: 'task-plan-reception',
      component: () => import('../views/TaskPlanReceptionView.vue')
    },
    {
      path: '/task-plan-execution',
      name: 'task-plan-execution',
      component: () => import('../views/TaskPlanExecutionView.vue')
    },
    {
      path: '/task-script-execution',
      name: 'task-script-execution',
      component: () => import('../views/TaskScriptExecutionView.vue')
    },
    {
      path: '/task-carrier-wave-monitor',
      name: 'task-carrier-wave-monitor',
      component: () => import('../views/TaskCarrierWaveMonitorView.vue')
    },
    {
      path: '/task-central-dispatch',
      name: 'task-central-dispatch',
      component: () => import('../views/TaskCentralDispatchView.vue')
    },
    {
      path: '/task-local-dispatch',
      name: 'task-local-dispatch',
      component: () => import('../views/TaskLocalDispatchView.vue')
    },
    {
      path: '/task-fault-diagnosis',
      name: 'task-fault-diagnosis',
      component: () => import('../views/TaskFaultDiagnosisView.vue')
    },
    {
      path: '/log-record',
      name: 'log-record',
      component: () => import('../views/LogRecordView.vue')
    },
    {
      path: '/log-query',
      name: 'log-query',
      component: () => import('../views/LogQueryView.vue')
    },
    {
      path: '/file-transfer',
      name: 'file-transfer',
      component: () => import('../views/FileTransferView.vue')
    }
  ]
})

export default router
