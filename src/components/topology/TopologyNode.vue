<template>
  <div class="topology-node">
    <Handle type="target" :position="Position.Left" class="topology-handle" />
    <div class="node-card" :class="{ error: data.status?.type === 'error' }">
      <div v-if="data.tags?.length" class="node-tags">
        <span
          v-for="(tag, i) in data.tags"
          :key="i"
          class="tag"
          :class="[tag.className]"
        >
          {{ tag.text }}
        </span>
      </div>
      <component
        :is="iconComponent"
        class="node-icon"
        :class="{ pulse: data.status?.type === 'error' }"
      />
      <div class="node-info">
        <p class="node-type">{{ data.label }}</p>
        <p class="node-name">{{ data.name }}</p>
      </div>
      <div class="node-status">
        <span class="status-dot" :class="data.status?.type"></span>
        <span class="status-text" :class="data.status?.type">{{ data.status?.text }}</span>
      </div>
    </div>
    <div v-if="data.metrics && Object.keys(data.metrics).length" class="node-metrics">
      <div v-for="(value, key) in data.metrics" :key="key" class="metric">
        <span>{{ key }}:</span>
        <span
          class="metric-value"
          :class="{ error: typeof value === 'string' && value.includes('error') }"
        >
          {{ value }}
        </span>
      </div>
    </div>

    <Handle type="source" :position="Position.Right" class="topology-handle" />
  </div>
</template>

<script setup lang="ts">
import { computed, h, type Component } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import SatelliteIcon from '@/components/icons/SatelliteIcon.vue'

const props = defineProps<{
  data: {
    label: string
    name: string
    iconType: string
    tags?: Array<{ text: string; className: string }>
    status?: { type: string; text: string }
    metrics?: Record<string, string | number>
  }
}>()

const AntennaIcon: Component = {
  render() {
    return h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', class: 'node-icon-svg' },
      [h('path', { d: 'M12 2v20M6 8a6 6 0 0 1 12 0c0 3-2 5-6 10-4-5-6-7-6-10z' })]
    )
  }
}

const ConverterIcon: Component = {
  render() {
    return h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', class: 'node-icon-svg' },
      [h('path', { d: 'M7 16V4M17 8v12M3 12h4m10 0h4' })]
    )
  }
}

const MatrixIcon: Component = {
  render() {
    return h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', class: 'node-icon-svg' },
      [
        h('rect', { x: '3', y: '3', width: '18', height: '18', rx: '2' }),
        h('path', { d: 'M3 9h18M3 15h18M9 3v18M15 3v18' })
      ]
    )
  }
}

const WavesIcon: Component = {
  render() {
    return h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', class: 'node-icon-svg' },
      [
        h('path', {
          d: 'M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1'
        })
      ]
    )
  }
}

const DatabaseIcon: Component = {
  render() {
    return h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', class: 'node-icon-svg' },
      [
        h('ellipse', { cx: '12', cy: '5', rx: '9', ry: '3' }),
        h('path', { d: 'M3 5V19A9 3 0 0 0 21 19V5' }),
        h('path', { d: 'M3 12A9 3 0 0 0 21 12' })
      ]
    )
  }
}

const iconMap: Record<string, Component> = {
  satellite: SatelliteIcon,
  antenna: AntennaIcon,
  converter: ConverterIcon,
  matrix: MatrixIcon,
  waves: WavesIcon,
  database: DatabaseIcon
}

const iconComponent = computed(() => iconMap[props.data.iconType] || SatelliteIcon)
</script>

<style scoped>
.topology-node {
  width: 130px;
}

.node-card {
  background: #2a292f;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(164, 201, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  position: relative;
}

.node-card:hover {
  border-color: rgba(164, 201, 255, 0.6);
  transform: translateY(-4px);
}

.node-card.error {
  border-color: rgba(255, 180, 171, 0.4);
}

.node-card.error:hover {
  border-color: rgba(255, 180, 171, 0.8);
}

.node-tags {
  position: absolute;
  top: -12px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 4px;
  padding: 0 8px;
}

.tag {
  padding: 2px 6px;
  font-size: 9px;
  font-weight: 700;
  border-radius: 4px;
  text-transform: uppercase;
}

.tag-control {
  background: rgba(59, 130, 246, 0.2);
  color: #e4e1e9;
  border: 1px solid rgba(59, 130, 246, 0.4);
}

.tag-local {
  background: rgba(100, 116, 139, 0.2);
  color: #94a3b8;
  border: 1px solid rgba(100, 116, 139, 0.4);
}

.tag-primary {
  background: rgba(164, 201, 255, 0.2);
  color: #a4c9ff;
  border: 1px solid rgba(164, 201, 255, 0.4);
}

.tag-standby {
  background: rgba(100, 116, 139, 0.2);
  color: #94a3b8;
  border: 1px solid rgba(100, 116, 139, 0.4);
}

.node-icon {
  width: 36px;
  height: 36px;
  color: #a4c9ff;
  margin-top: 4px;
}

.node-icon.pulse {
  color: #ffb4ab;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

.node-info {
  text-align: center;
}

.node-type {
  font-size: 10px;
  color: #c2c6d6;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 4px 0;
}

.node-name {
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.node-status {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-dot.success {
  background: #4ae176;
  box-shadow: 0 0 2px #4ae176, 0 0 12px rgba(74, 225, 118, 0.3);
}

.status-dot.error {
  background: #ffb4ab;
  box-shadow: 0 0 2px #ffb4ab, 0 0 12px rgba(255, 180, 171, 0.3);
}

.status-dot.maintenance {
  background: rgba(164, 201, 255, 0.4);
}

.status-text {
  font-family: 'Fira Code', monospace;
  font-size: 10px;
}

.status-text.success {
  color: #4ae176;
}

.status-text.error {
  color: #ffb4ab;
}

.node-metrics {
  margin-top: 8px;
  background: rgba(14, 14, 19, 0.8);
  padding: 5px;
  border-radius: 6px;
}

.metric {
  display: flex;
  justify-content: space-between;
  font-family: 'Fira Code', monospace;
  font-size: 10px;
  color: #64748b;
  margin-bottom: 2px;
}

.metric:last-child {
  margin-bottom: 0;
}

.metric-value {
  color: #e4e1e9;
}

.metric-value.error {
  color: #ffb4ab;
  font-weight: 700;
}

:deep(.node-icon-svg) {
  width: 36px;
  height: 36px;
}

.topology-handle {
  width: 8px;
  height: 8px;
  background: transparent;
  border: none;
  opacity: 0;
}
</style>
