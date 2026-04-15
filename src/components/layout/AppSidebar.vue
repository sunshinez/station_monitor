<template>
  <aside class="app-sidebar">
    <div class="side-header">
      <h2 class="side-title">{{ menu.title }}</h2>
      <p v-if="subtitle" class="side-subtitle">{{ subtitle }}</p>
    </div>
    <nav class="side-menu">
      <MenuTree :items="menu.items" />
    </nav>
    <div class="side-footer">
      <slot name="footer" />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { moduleMenus, type ModuleKey } from '@/constants/moduleMenus'
import MenuTree from './MenuTree.vue'

const route = useRoute()

const moduleKey = computed<ModuleKey>(() => {
  const m = route.meta.module as ModuleKey
  if (m && moduleMenus[m]) return m
  const path = route.path
  if (path.startsWith('/topology') || path.startsWith('/baseband') || path.startsWith('/matrix') || path.startsWith('/other-devices')) return 'monitor'
  if (path.startsWith('/device-control') || path.startsWith('/remote-control')) return 'control'
  if (path.startsWith('/task-status') || path.startsWith('/data-transmission') || path.startsWith('/task-execution') || path.startsWith('/telemetry-status')) return 'status'
  if (path.startsWith('/task-')) return 'task'
  if (path.startsWith('/log-')) return 'log'
  if (path.startsWith('/file-transfer')) return 'file'
  return 'monitor'
})

const menu = computed(() => moduleMenus[moduleKey.value])

const subtitle = computed(() => {
  if (moduleKey.value === 'status') return '轨道状态'
  return ''
})
</script>

<style scoped>
.app-sidebar {
  position: fixed;
  left: 0;
  top: 64px;
  bottom: 0;
  width: 256px;
  background: #EDEFF3;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  z-index: 40;
}

.side-header {
  padding: 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.side-title {
  font-size: 18px;
  font-weight: 600;
  color: #4B4C57;
  margin: 0;
}

.side-subtitle {
  font-size: 11px;
  color: #9C9DA6;
  letter-spacing: 0.1em;
  margin-top: 4px;
  text-transform: uppercase;
}

.side-menu {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.side-footer {
  padding: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

@media (max-width: 1024px) {
  .app-sidebar {
    transform: translateX(-100%);
  }
}
</style>
