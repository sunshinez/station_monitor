import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import AppLayout from '../layouts/AppLayout.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue')
        },
        {
          path: 'topology',
          name: 'topology',
          meta: { module: 'monitor' },
          component: () => import('../views/TopologyView.vue')
        },
        {
          path: 'baseband',
          name: 'baseband',
          meta: { module: 'monitor' },
          component: () => import('../views/BasebandView.vue')
        },
        {
          path: 'matrix',
          name: 'matrix',
          meta: { module: 'monitor' },
          component: () => import('../views/MatrixView.vue')
        },
        {
          path: 'other-devices',
          name: 'other-devices',
          meta: { module: 'monitor' },
          component: () => import('../views/OtherDevicesView.vue')
        },
        {
          path: 'device-control',
          name: 'device-control',
          meta: { module: 'control' },
          component: () => import('../views/DeviceControlView.vue')
        },
        {
          path: 'remote-control',
          name: 'remote-control',
          meta: { module: 'control' },
          component: () => import('../views/RemoteControlView.vue')
        },
        {
          path: 'task-status',
          name: 'task-status',
          meta: { module: 'status' },
          component: () => import('../views/TaskStatusView.vue')
        },
        {
          path: 'data-transmission',
          name: 'data-transmission',
          meta: { module: 'status' },
          component: () => import('../views/DataTransmissionView.vue')
        },
        {
          path: 'task-execution',
          name: 'task-execution',
          meta: { module: 'status' },
          component: () => import('../views/TaskExecutionView.vue')
        },
        {
          path: 'task-macro',
          name: 'task-macro',
          meta: { module: 'task' },
          component: () => import('../views/TaskMacroView.vue')
        },
        {
          path: 'task-link-mapping',
          name: 'task-link-mapping',
          meta: { module: 'task' },
          component: () => import('../views/TaskLinkMappingView.vue')
        },
        {
          path: 'task-script-editor',
          name: 'task-script-editor',
          meta: { module: 'task' },
          component: () => import('../views/TaskScriptEditorView.vue')
        },
        {
          path: 'task-plan-template',
          name: 'task-plan-template',
          meta: { module: 'task' },
          component: () => import('../views/TaskPlanTemplateView.vue')
        },
        {
          path: 'task-mission-param',
          name: 'task-mission-param',
          meta: { module: 'task' },
          component: () => import('../views/TaskMissionParamView.vue')
        },
        {
          path: 'task-plan-reception',
          name: 'task-plan-reception',
          meta: { module: 'task' },
          component: () => import('../views/TaskPlanReceptionView.vue')
        },
        {
          path: 'task-plan-execution',
          name: 'task-plan-execution',
          meta: { module: 'task' },
          component: () => import('../views/TaskPlanExecutionView.vue')
        },
        {
          path: 'task-script-execution',
          name: 'task-script-execution',
          meta: { module: 'task' },
          component: () => import('../views/TaskScriptExecutionView.vue')
        },
        {
          path: 'task-carrier-wave-monitor',
          name: 'task-carrier-wave-monitor',
          meta: { module: 'task' },
          component: () => import('../views/TaskCarrierWaveMonitorView.vue')
        },
        {
          path: 'task-central-dispatch',
          name: 'task-central-dispatch',
          meta: { module: 'task' },
          component: () => import('../views/TaskCentralDispatchView.vue')
        },
        {
          path: 'task-local-dispatch',
          name: 'task-local-dispatch',
          meta: { module: 'task' },
          component: () => import('../views/TaskLocalDispatchView.vue')
        },
        {
          path: 'task-fault-diagnosis',
          name: 'task-fault-diagnosis',
          meta: { module: 'task' },
          component: () => import('../views/TaskFaultDiagnosisView.vue')
        },
        {
          path: 'log-record',
          name: 'log-record',
          meta: { module: 'log' },
          component: () => import('../views/LogRecordView.vue')
        },
        {
          path: 'log-query',
          name: 'log-query',
          meta: { module: 'log' },
          component: () => import('../views/LogQueryView.vue')
        },
        {
          path: 'file-transfer',
          name: 'file-transfer',
          meta: { module: 'file' },
          component: () => import('../views/FileTransferView.vue')
        }
      ]
    }
  ]
})

export default router
