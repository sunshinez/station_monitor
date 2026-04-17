<template>
  <main class="main-content">
    <div class="bg-glow top-right"></div>
    <div class="bg-glow bottom-right"></div>

    <div class="content-wrapper">
      <!-- Header Section -->
      <div class="page-header">
        <div>
          <h1 class="page-title">系统拓扑图</h1>
          <p class="page-subtitle">
            站点编号: ALPHA-09 | 地方恒星时: {{ lstTime }} | 协调世界时: {{ utcTime }}
          </p>
        </div>
      </div>

      <!-- Topology Canvas -->
      <div class="topology-canvas">
        <VueFlow
          v-model:nodes="nodes"
          v-model:edges="edges"
          :default-viewport="{ zoom: 1 }"
          :min-zoom="0.5"
          :max-zoom="2"
          fit-view-on-init
          class="topology-flow"
        >
          <Background pattern-color="#1b1b20" :gap="40" />
          <Controls />
          <template #node-topology="nodeProps">
            <TopologyNode :data="nodeProps.data" />
          </template>
        </VueFlow>
      </div>

      <!-- Status Legends -->
      <div class="legends">
        <div class="legend-item">
          <span class="status-dot success"></span>
          <span class="legend-label">正常运行</span>
        </div>
        <div class="legend-item">
          <span class="status-dot error"></span>
          <span class="legend-label">系统告警</span>
        </div>
        <div class="legend-item">
          <span class="status-dot maintenance"></span>
          <span class="legend-label">维护中</span>
        </div>
        <div class="legend-divider"></div>
        <div class="legend-item">
          <span class="tag-mini tag-primary">主</span>
          <span class="legend-label">主用角色</span>
        </div>
        <div class="legend-item">
          <span class="tag-mini tag-standby">备</span>
          <span class="legend-label">备用角色</span>
        </div>
      </div>

      <!-- Bottom Data Panel -->
      <div class="data-panel">
        <!-- Real-time Telemetry -->
        <div class="panel telemetry-panel">
          <div class="panel-header">
            <h3 class="panel-title">实时遥测数据流</h3>
            <span class="live-badge">直播源</span>
          </div>
          <div class="telemetry-grid">
            <div class="telemetry-item">
              <p class="telemetry-label">信号强度</p>
              <p class="telemetry-value">{{ telemetry.signalStrength }} dBm</p>
            </div>
            <div class="telemetry-item">
              <p class="telemetry-label">丢包率</p>
              <p class="telemetry-value success">{{ telemetry.packetLoss }}%</p>
            </div>
            <div class="telemetry-item">
              <p class="telemetry-label">误码率 (Pre-Viterbi)</p>
              <p class="telemetry-value">{{ telemetry.ber }}</p>
            </div>
            <div class="telemetry-item">
              <p class="telemetry-label">核心温度</p>
              <p class="telemetry-value">{{ telemetry.temperature }}°C</p>
            </div>
          </div>
        </div>

        <!-- Event Log -->
        <div class="panel log-panel">
          <div class="panel-header">
            <h3 class="panel-title">事件日志</h3>
          </div>
          <div class="log-list">
            <div v-for="(log, index) in eventLogs" :key="index" class="log-item" :class="log.level">
              <span class="log-time">{{ log.time }}</span>
              <span class="log-message">{{ log.message }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted, onUnmounted } from 'vue'
import { VueFlow, type Node, type Edge, MarkerType } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import TopologyNode from '@/components/topology/TopologyNode.vue'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'

// Time refs
const lstTime = ref('14:22:05')
const utcTime = ref('06:22:05')

// Layout constants
const CANVAS_HEIGHT = 1900
const STEP_Y = 200
const START_Y = 60
const CENTER_Y = (CANVAS_HEIGHT - 200) / 2

function createParallelNodes(
  prefix: string,
  label: string,
  iconType: string,
  x: number,
  metricsFn: (index: number, isBackup: boolean) => Record<string, string | number>
): Node[] {
  const nodes: Node[] = []
  for (let i = 1; i <= 8; i++) {
    nodes.push({
      id: `${prefix}-${i}`,
      type: 'topology',
      position: { x, y: START_Y + (i - 1) * STEP_Y },
      data: {
        label,
        name: `${prefix.toUpperCase()}-${String(i).padStart(2, '0')}`,
        iconType,
        tags: [
          { text: '分控', className: 'tag-control' },
          { text: '主', className: 'tag-primary' }
        ],
        status: { type: 'success', text: '正常' },
        metrics: metricsFn(i, false)
      }
    })
  }
  nodes.push({
    id: `${prefix}-bak`,
    type: 'topology',
    position: { x, y: START_Y + 8 * STEP_Y },
    data: {
      label,
      name: `${prefix.toUpperCase()}-备用`,
      iconType,
      tags: [
        { text: '分控', className: 'tag-control' },
        { text: '主', className: 'tag-primary' }
      ],
      status: { type: 'success', text: '待机' },
      metrics: metricsFn(9, true)
    }
  })
  return nodes
}

const lnaNodes = createParallelNodes('lna', '低噪放大', 'antenna', 200, () => ({
  '温度': '24.5°C',
  '输入功率': '-90dBm',
  '增益': '60dB'
}))

const converterNodes = createParallelNodes('dnc', '变频单元', 'converter', 360, () => ({
  '本振频率': '1.2GHz',
  '电压误差': '0.8V'
}))

const demodNodes = createParallelNodes('demod', '解调器', 'waves', 680, () => ({
  '误码率': '1.2e-7',
  '信噪比': '12.5dB'
}))

const staticNodes: Node[] = [
  {
    id: 'antenna',
    type: 'topology',
    position: { x: 40, y: CENTER_Y },
    data: {
      label: '天线',
      name: 'TX/RX-01',
      iconType: 'satellite',
      tags: [
        { text: '分控', className: 'tag-control' },
        { text: '主', className: 'tag-primary' }
      ],
      status: { type: 'success', text: '正常' },
      metrics: {
        '方位角': '192.4°',
        '俯仰角': '45.2°'
      }
    }
  },
  {
    id: 'matrix',
    type: 'topology',
    position: { x: 520, y: CENTER_Y },
    data: {
      label: '切换矩阵',
      name: 'MX-V3',
      iconType: 'matrix',
      tags: [
        { text: '分控', className: 'tag-control' },
        { text: '主', className: 'tag-primary' }
      ],
      status: { type: 'success', text: '已锁定' },
      metrics: {}
    }
  },
  {
    id: 'storage',
    type: 'topology',
    position: { x: 840, y: CENTER_Y },
    data: {
      label: '存储系统',
      name: 'SSD-ARRAY-B',
      iconType: 'database',
      status: { type: 'success', text: '92% 空闲' },
      metrics: {}
    }
  }
]

const nodes = shallowRef<Node[]>([
  ...staticNodes,
  ...lnaNodes,
  ...converterNodes,
  ...demodNodes
])

function buildEdges(): Edge[] {
  const edges: Edge[] = []
  const ids = ['1', '2', '3', '4', '5', '6', '7', '8', 'bak']

  // antenna -> all LNAs
  ids.forEach((id) => {
    edges.push({
      id: `e-antenna-lna-${id}`,
      source: 'antenna',
      target: `lna-${id}`,
      type: 'smoothstep',
      markerEnd: { type: MarkerType.Arrow, color: '#a4c9ff' },
      style: { stroke: '#a4c9ff', strokeWidth: 2 }
    })
  })

  // LNA -> Converter (one-to-one)
  ids.forEach((id) => {
    edges.push({
      id: `e-lna-dnc-${id}`,
      source: `lna-${id}`,
      target: `dnc-${id}`,
      type: 'smoothstep',
      markerEnd: { type: MarkerType.Arrow, color: '#a4c9ff' },
      style: { stroke: '#a4c9ff', strokeWidth: 2 }
    })
  })

  // Converter -> Matrix (converge)
  ids.forEach((id) => {
    edges.push({
      id: `e-dnc-matrix-${id}`,
      source: `dnc-${id}`,
      target: 'matrix',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.Arrow, color: '#a4c9ff' },
      style: { stroke: '#a4c9ff', strokeWidth: 2 }
    })
  })

  // Matrix -> Demod (distribute)
  ids.forEach((id) => {
    edges.push({
      id: `e-matrix-demod-${id}`,
      source: 'matrix',
      target: `demod-${id}`,
      type: 'smoothstep',
      markerEnd: { type: MarkerType.Arrow, color: '#a4c9ff' },
      style: { stroke: '#a4c9ff', strokeWidth: 2 }
    })
  })

  // Demod -> Storage (converge)
  ids.forEach((id) => {
    edges.push({
      id: `e-demod-storage-${id}`,
      source: `demod-${id}`,
      target: 'storage',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.Arrow, color: '#a4c9ff' },
      style: { stroke: '#a4c9ff', strokeWidth: 2 }
    })
  })

  return edges
}

const edges = shallowRef<Edge[]>(buildEdges())

// Telemetry refs
const telemetry = ref({
  signalStrength: -64.22,
  packetLoss: 0.002,
  ber: '1.2e-7',
  temperature: 42.5
})

// Event logs
const eventLogs = ref([
  { time: '14:21:44', message: 'DNC-70 电压下降预警', level: 'error' },
  { time: '14:19:02', message: '切换至 DEMOD-01 完成', level: 'success' },
  { time: '14:05:11', message: '天线自动跟踪已开启', level: 'info' },
  { time: '13:58:30', message: '系统自检完成', level: 'info' },
  { time: '13:45:22', message: 'LNA-ALPHA 增益调整', level: 'info' }
])

// Update time
let timeInterval: number | null = null
let dataInterval: number | null = null

function updateTime() {
  const now = new Date()
  utcTime.value = now.toISOString().split('T')[1].split('.')[0]
  const hours = now.getUTCHours()
  const minutes = now.getUTCMinutes()
  const seconds = now.getUTCSeconds()
  const lstHours = (hours + 8) % 24
  lstTime.value = `${String(lstHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

// Simulate real-time data updates
function updateData() {
  telemetry.value.signalStrength = -64 + Math.random() * 2 - 1
  telemetry.value.packetLoss = Number((0.001 + Math.random() * 0.002).toFixed(3))

  const antenna = nodes.value.find((n) => n.id === 'antenna')!
  antenna.data.metrics['方位角'] = `${(192 + Math.random() * 0.5).toFixed(1)}°`
  antenna.data.metrics['俯仰角'] = `${(45 + Math.random() * 0.3).toFixed(1)}°`

  // Update a few random LNAs
  for (let i = 1; i <= 8; i++) {
    const lna = nodes.value.find((n) => n.id === `lna-${i}`)!
    lna.data.metrics['温度'] = `${(24 + Math.random() * 2).toFixed(1)}°C`
    lna.data.metrics['输入功率'] = `${(-90 + Math.random() * 2).toFixed(1)}dBm`
  }
  const lnaBak = nodes.value.find((n) => n.id === 'lna-bak')!
  lnaBak.data.metrics['温度'] = `${(24 + Math.random() * 2).toFixed(1)}°C`

  // Update a few random converters
  for (let i = 1; i <= 8; i++) {
    const dnc = nodes.value.find((n) => n.id === `dnc-${i}`)!
    dnc.data.metrics['电压误差'] = `${(0.5 + Math.random() * 0.5).toFixed(1)}V`
  }
  const dncBak = nodes.value.find((n) => n.id === 'dnc-bak')!
  dncBak.data.metrics['电压误差'] = `${(0.5 + Math.random() * 0.5).toFixed(1)}V`

  // Update demods
  for (let i = 1; i <= 8; i++) {
    const demod = nodes.value.find((n) => n.id === `demod-${i}`)!
    demod.data.metrics['误码率'] = `${(1 + Math.random()).toFixed(1)}e-7`
    demod.data.metrics['信噪比'] = `${(12 + Math.random() * 2).toFixed(1)}dB`
  }
  const demodBak = nodes.value.find((n) => n.id === 'demod-bak')!
  demodBak.data.metrics['误码率'] = `${(1 + Math.random()).toFixed(1)}e-7`
  demodBak.data.metrics['信噪比'] = `${(12 + Math.random() * 2).toFixed(1)}dB`
}

onMounted(() => {
  updateTime()
  timeInterval = window.setInterval(updateTime, 1000)
  dataInterval = window.setInterval(updateData, 2000)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
  if (dataInterval) clearInterval(dataInterval)
})
</script>

<style scoped>
/* CSS Variables */
:root {
  --primary: #a4c9ff;
  --error: #ffb4ab;
  --success: #4ae176;
  --surface: #131318;
  --surface-container: #1f1f24;
  --surface-container-low: #1b1b20;
  --surface-container-high: #2a292f;
  --surface-container-highest: #35343a;
  --on-surface: #e4e1e9;
  --on-surface-variant: #c2c6d6;
  --outline: #8c909f;
  --outline-variant: #424754;
}

.main-content {
  position: relative;
  overflow: hidden;
}

.content-wrapper {
  padding: 32px;
  position: relative;
  z-index: 10;
  padding-bottom: 128px;
}

.bg-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  pointer-events: none;
}

.bg-glow.top-right {
  right: -256px;
  top: -256px;
  width: 800px;
  height: 800px;
  background: rgba(164, 201, 255, 0.05);
}

.bg-glow.bottom-right {
  right: 0;
  bottom: 0;
  width: 400px;
  height: 400px;
  background: rgba(74, 225, 118, 0.05);
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 48px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.page-subtitle {
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  color: rgba(164, 201, 255, 0.8);
  margin: 0;
}

/* Topology Canvas */
.topology-canvas {
  position: relative;
  height: 1900px;
  background: rgba(14, 14, 19, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(66, 71, 84, 0.1);
  overflow: hidden;
}

.topology-flow {
  width: 100%;
  height: 100%;
}

/* Legends */
.legends {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding: 12px 16px;
  background: rgba(14, 14, 19, 0.3);
  border-radius: 8px;
  border: 1px solid rgba(66, 71, 84, 0.1);
  width: fit-content;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-label {
  font-size: 10px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.legend-divider {
  width: 1px;
  height: 12px;
  background: rgba(66, 71, 84, 0.3);
}

.tag-mini {
  padding: 2px 6px;
  font-size: 8px;
  font-weight: 700;
  border-radius: 4px;
}

/* Data Panel */
.data-panel {
  margin-top: 32px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.panel {
  background: rgba(27, 27, 32, 0.8);
  backdrop-filter: blur(12px);
  padding: 24px;
  border-radius: 8px;
  border: 1px solid rgba(66, 71, 84, 0.1);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.panel-title {
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.live-badge {
  padding: 2px 8px;
  background: rgba(59, 130, 246, 0.1);
  color: #e4e1e9;
  font-family: 'Fira Code', monospace;
  font-size: 10px;
  border-radius: 4px;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

/* Telemetry Grid */
.telemetry-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.telemetry-item {
  padding: 12px;
  background: #0e0e13;
  border-radius: 6px;
}

.telemetry-label {
  font-size: 10px;
  color: #64748b;
  text-transform: uppercase;
  margin: 0 0 4px 0;
}

.telemetry-value {
  font-family: 'Fira Code', monospace;
  font-size: 20px;
  color: #a4c9ff;
  margin: 0;
}

.telemetry-value.success {
  color: #4ae176;
}

/* Log Panel */
.log-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.log-item {
  display: flex;
  gap: 12px;
  font-size: 11px;
  align-items: flex-start;
  padding-left: 12px;
  border-left: 2px solid transparent;
}

.log-item.error {
  border-left-color: #ffb4ab;
}

.log-item.success {
  border-left-color: #4ae176;
}

.log-item.info {
  border-left-color: #a4c9ff;
}

.log-time {
  font-family: 'Fira Code', monospace;
  color: #64748b;
  min-width: 60px;
}

.log-message {
  color: #cbd5e1;
}

.log-item.error .log-message {
  color: #ffb4ab;
  font-weight: 500;
  text-transform: uppercase;
}

/* Tag mini styles */
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

/* Status dots */
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

/* Responsive */
@media (max-width: 1400px) {
  .topology-canvas {
    overflow-x: auto;
  }

  .data-panel {
    grid-template-columns: 1fr;
  }

  .telemetry-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1024px) {
  .main-nav {
    display: none;
  }
}
</style>
