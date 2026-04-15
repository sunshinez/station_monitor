<template>
  <ul class="menu-tree" :class="`level-${level}`">
    <li v-for="item in items" :key="itemKey(item)" class="menu-item">
      <!-- Leaf with router link -->
      <router-link
        v-if="item.path && !hasChildren(item)"
        :to="item.path"
        class="menu-link"
        :class="{ active: isRouteActive(item.path) }"
      >
        <component :is="getIcon(item.icon)" v-if="item.icon" class="menu-icon" />
        <span v-else-if="level > 0" class="leaf-dot"></span>
        <span>{{ item.label }}</span>
      </router-link>

      <!-- Group with children -->
      <div v-else-if="hasChildren(item)" class="menu-group">
        <button
          v-if="item.path"
          class="menu-group-toggle"
          :class="{ active: isRouteActive(item.path), expanded: isExpanded(item) }"
          @click="toggle(item); navigateIfPath(item)"
        >
          <span class="menu-group-label">
            <component :is="getIcon(item.icon)" v-if="item.icon" class="menu-icon" />
            <span>{{ item.label }}</span>
          </span>
          <span class="expand-icon" :class="{ expanded: isExpanded(item) }">▼</span>
        </button>
        <button
          v-else
          class="menu-group-toggle"
          :class="{ expanded: isExpanded(item) }"
          @click="toggle(item)"
        >
          <span class="menu-group-label">
            <span v-if="level > 0" class="level-dot" :class="{ active: isExpanded(item) }"></span>
            <span>{{ item.label }}</span>
          </span>
          <span class="expand-icon" :class="{ expanded: isExpanded(item) }">▼</span>
        </button>
        <div v-show="isExpanded(item)" class="menu-children">
          <MenuTree :items="item.children!" :level="level + 1" />
        </div>
      </div>

      <!-- Action leaf (no path, no children) -->
      <a
        v-else-if="item.action"
        href="#"
        class="menu-link action-link"
        :class="{ active: isActionActive(item.action) }"
        @click.prevent="handleAction(item.action)"
      >
        <span v-if="level > 0" class="leaf-dot"></span>
        <span>{{ item.label }}</span>
      </a>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, h, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { MenuItem } from '@/constants/moduleMenus'

const props = defineProps<{
  items: MenuItem[]
  level?: number
}>()

const level = props.level ?? 0
const route = useRoute()
const router = useRouter()
const expandedKeys = ref<Set<string>>(new Set())
const activeAction = ref<string | null>(null)

// Default expand groups on control module route
watch(() => route.path, (path) => {
  if (path === '/device-control') {
    // Find the "设备控制" group and "天线伺服设备" subgroup
    const deviceControl = props.items.find(i => i.path === '/device-control' && i.children)
    if (deviceControl) {
      expandedKeys.value.add(itemKey(deviceControl))
      const antenna = deviceControl.children?.find(i => i.label === '天线伺服设备')
      if (antenna) {
        expandedKeys.value.add(itemKey(antenna))
      }
      // Set default active action to antenna-01 to match original default selection
      activeAction.value = 'device:antenna-01'
    } else {
      // We may be in the inner MenuTree where props.items are the children of 设备控制
      const antenna = props.items.find(i => i.label === '天线伺服设备')
      if (antenna) {
        expandedKeys.value.add(itemKey(antenna))
      }
    }
  }
}, { immediate: true })

function itemKey(item: MenuItem) {
  return item.path || item.action || item.label
}

function hasChildren(item: MenuItem) {
  return !!(item.children && item.children.length > 0)
}

function isExpanded(item: MenuItem) {
  return expandedKeys.value.has(itemKey(item))
}

function toggle(item: MenuItem) {
  const key = itemKey(item)
  if (expandedKeys.value.has(key)) {
    expandedKeys.value.delete(key)
  } else {
    expandedKeys.value.add(key)
  }
}

function navigateIfPath(item: MenuItem) {
  if (item.path && item.path !== route.path) {
    router.push(item.path)
  }
}

function isRouteActive(path: string) {
  return route.path === path || route.path.startsWith(path + '/')
}

function isActionActive(action: string) {
  return activeAction.value === action
}

function handleAction(action: string) {
  activeAction.value = action
  document.dispatchEvent(new CustomEvent('sidebar-action', { detail: action }))
}

// Icons
const icons: Record<string, any> = {
  topology: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { d: 'M12 2L2 7l10 5 10-5-10-5z' }),
    h('path', { d: 'M2 17l10 5 10-5' }),
    h('path', { d: 'M2 12l10 5 10-5' })
  ]),
  baseband: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('rect', { x: '4', y: '4', width: '16', height: '16', rx: '2' }),
    h('path', { d: 'M9 9h6v6H9z' })
  ]),
  matrix: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('rect', { x: '3', y: '3', width: '7', height: '7' }),
    h('rect', { x: '14', y: '3', width: '7', height: '7' }),
    h('rect', { x: '14', y: '14', width: '7', height: '7' }),
    h('rect', { x: '3', y: '14', width: '7', height: '7' })
  ]),
  devices: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('rect', { x: '4', y: '4', width: '16', height: '16', rx: '2' }),
    h('rect', { x: '9', y: '9', width: '6', height: '6' }),
    h('path', { d: 'M15 2v2M15 20v2M2 15h2M20 15h2' })
  ]),
  control: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { d: 'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83' })
  ]),
  remote: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { d: 'M4 17l6-6-6-6' }),
    h('path', { d: 'M12 19h8' })
  ]),
  monitor: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('rect', { x: '2', y: '3', width: '20', height: '14', rx: '2' }),
    h('path', { d: 'M8 21h8M12 17v4' })
  ]),
  telemetry: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { d: 'M12 2a10 10 0 0 1 10 10M12 2v4M12 22a10 10 0 0 1-10-10M12 22v-4' })
  ]),
  transfer: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { d: 'M7 16V4M7 4L3 8M7 4l4 4' }),
    h('path', { d: 'M17 8v12m0 0l4-4m-4 4l-4-4' })
  ]),
  execution: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('circle', { cx: '12', cy: '12', r: '10' }),
    h('path', { d: 'M10 8l6 4-6 4V8z' })
  ]),
  settings: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('circle', { cx: '12', cy: '12', r: '3' }),
    h('path', { d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' })
  ]),
  link: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' }),
    h('path', { d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' })
  ]),
  terminal: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { d: 'M4 17l6-6-6-6' }),
    h('path', { d: 'M12 19h8' })
  ]),
  template: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
    h('polyline', { points: '14 2 14 8 20 8' }),
    h('line', { x1: '16', y1: '13', x2: '8', y2: '13' }),
    h('line', { x1: '16', y1: '17', x2: '8', y2: '17' })
  ]),
  download: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
    h('polyline', { points: '7 10 12 15 17 10' }),
    h('line', { x1: '12', y1: '15', x2: '12', y2: '3' })
  ]),
  inbox: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('polyline', { points: '22 12 16 12 14 15 10 15 8 12 2 12' }),
    h('path', { d: 'M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z' })
  ]),
  calendar: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('rect', { x: '3', y: '4', width: '18', height: '18', rx: '2' }),
    h('line', { x1: '16', y1: '2', x2: '16', y2: '6' }),
    h('line', { x1: '8', y1: '2', x2: '8', y2: '6' }),
    h('line', { x1: '3', y1: '10', x2: '21', y2: '10' })
  ]),
  play: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('circle', { cx: '12', cy: '12', r: '10' }),
    h('polygon', { points: '10 8 16 12 10 16 10 8', fill: 'currentColor' })
  ]),
  send: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('line', { x1: '22', y1: '2', x2: '11', y2: '13' }),
    h('polygon', { points: '22 2 15 22 11 13 2 9 22 2', fill: 'currentColor' })
  ]),
  dispatch: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('polyline', { points: '4 7 4 4 20 4 20 7' }),
    h('line', { x1: '9', y1: '20', x2: '15', y2: '20' }),
    h('line', { x1: '12', y1: '4', x2: '12', y2: '20' })
  ]),
  lan: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('rect', { x: '4', y: '3', width: '6', height: '6', rx: '1' }),
    h('rect', { x: '14', y: '3', width: '6', height: '6', rx: '1' }),
    h('rect', { x: '4', y: '15', width: '6', height: '6', rx: '1' }),
    h('rect', { x: '14', y: '15', width: '6', height: '6', rx: '1' }),
    h('path', { d: 'M10 6h4M7 15v-3a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v3' })
  ]),
  diagnosis: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { d: 'M9 11l3 3L22 4' }),
    h('path', { d: 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' })
  ]),
  doc: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
    h('polyline', { points: '14 2 14 8 20 8' }),
    h('line', { x1: '16', y1: '13', x2: '8', y2: '13' }),
    h('line', { x1: '16', y1: '17', x2: '8', y2: '17' })
  ]),
  search: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('circle', { cx: '11', cy: '11', r: '8' }),
    h('line', { x1: '21', y1: '21', x2: '16.65', y2: '16.65' })
  ]),
  folder: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { d: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z' })
  ])
}

function getIcon(name?: string) {
  return icons[name || 'doc'] || icons.doc
}
</script>

<style scoped>
.menu-tree {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu-tree.level-1,
.menu-tree.level-2 {
  padding-left: 8px;
}

.menu-item {
  margin-bottom: 4px;
}

.menu-link,
.menu-group-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 14px;
  color: #9C9DA6;
  text-decoration: none;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.menu-link:hover,
.menu-group-toggle:hover {
  background: rgba(0, 0, 0, 0.03);
  color: #4B4C57;
}

.menu-link.active,
.menu-group-toggle.active {
  color: #1C6AFF;
  font-weight: 500;
}

.menu-group-label {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.menu-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.expand-icon {
  font-size: 10px;
  color: #9C9DA6;
  transition: transform 0.2s;
  flex-shrink: 0;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.leaf-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #9C9DA6;
  flex-shrink: 0;
  margin-left: 4px;
}

.menu-link.active .leaf-dot {
  background: #1C6AFF;
}

.level-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #9C9DA6;
  flex-shrink: 0;
  margin-left: 4px;
  transition: background 0.2s;
}

.level-dot.active {
  background: #1C6AFF;
}

.menu-children {
  margin-top: 4px;
}

.action-link {
  padding-left: 14px;
}
</style>
