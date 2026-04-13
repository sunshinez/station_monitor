<template>
  <div class="topology-page">
    <!-- TopNavBar -->
    <header class="top-nav">
      <div class="logo">XX地面站软件</div>
      <nav class="main-nav">
        <a href="#" class="nav-link active">图形化监视</a>
        <router-link to="/device-control" class="nav-link">控制功能</router-link>
        <router-link to="/task-status" class="nav-link">状态监视</router-link>
        <a href="#" class="nav-link">任务管理</a>
        <a href="#" class="nav-link">日志管理</a>
        <a href="#" class="nav-link">操作手册</a>
        <a href="#" class="nav-link">文件传输</a>
      </nav>
      <div class="user-actions">
        <button class="icon-btn" title="用户账户">
          <UserIcon class="icon" />
        </button>
      </div>
    </header>

    <!-- SideNavBar -->
    <aside class="side-nav">
      <div class="side-header">
        <h2 class="side-title">XX地面站软件</h2>
        <p class="side-subtitle">SUB-SYSTEM ALPHA</p>
      </div>
      <nav class="side-menu">
        <router-link to="/topology" class="side-link active">
          <TopologyIcon class="side-icon" />
          <span>系统拓扑图监视</span>
        </router-link>
        <router-link to="/baseband" class="side-link">
          <ComponentIcon class="side-icon" />
          <span>基带一体化监视</span>
        </router-link>
        <router-link to="/matrix" class="side-link">
          <GridIcon class="side-icon" />
          <span>矩阵设备监视</span>
        </router-link>
        <router-link to="/other-devices" class="side-link">
          <DevicesIcon class="side-icon" />
          <span>其它设备监视</span>
        </router-link>
      </nav>
      <div class="side-footer">
        <div class="health-card">
          <div class="health-header">
            <span class="health-label">上行链路健康度</span>
            <span class="status-dot success"></span>
          </div>
          <div class="health-bar">
            <div class="health-fill" style="width: 88%"></div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
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
          <svg class="connection-lines" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#a4c9ff" />
              </marker>
              <marker id="arrowhead-back" markerWidth="10" markerHeight="7" refX="1" refY="3.5" orient="auto">
                <polygon points="10 0, 0 3.5, 10 7" fill="#a4c9ff" />
              </marker>
            </defs>
            <!-- 天线到LNA -->
            <path d="M 180 300 L 320 300" fill="none" marker-end="url(#arrowhead)" marker-start="url(#arrowhead-back)"
                  stroke="#a4c9ff" stroke-dasharray="4 4" stroke-width="2" />
            <!-- LNA到变频 -->
            <path d="M 460 300 L 580 300" fill="none" marker-end="url(#arrowhead)" marker-start="url(#arrowhead-back)"
                  stroke="#a4c9ff" stroke-width="2" />
            <!-- 变频到矩阵 -->
            <path d="M 720 300 L 840 200" fill="none" marker-end="url(#arrowhead)" marker-start="url(#arrowhead-back)"
                  stroke="#a4c9ff" stroke-width="2" />
            <path d="M 720 300 L 840 400" fill="none" marker-end="url(#arrowhead)" marker-start="url(#arrowhead-back)"
                  stroke="#a4c9ff" stroke-width="2" />
            <!-- 矩阵到解调器/存储 -->
            <path d="M 980 200 L 1100 200" fill="none" marker-end="url(#arrowhead)" marker-start="url(#arrowhead-back)"
                  stroke="#a4c9ff" stroke-width="2" />
            <path d="M 980 400 L 1100 400" fill="none" marker-end="url(#arrowhead)" marker-start="url(#arrowhead-back)"
                  stroke="#a4c9ff" stroke-width="2" />
          </svg>
          <div class="grid-bg"></div>

          <!-- Node: Satellite Antenna -->
          <div class="node" style="top: 220px; left: 40px; width: 144px;">
            <div class="node-card">
              <div class="node-tags">
                <span class="tag tag-control">分控</span>
                <span class="tag tag-primary">主</span>
              </div>
              <SatelliteIcon class="node-icon" />
              <div class="node-info">
                <p class="node-type">天线</p>
                <p class="node-name">TX/RX-01</p>
              </div>
              <div class="node-status">
                <span class="status-dot success"></span>
                <span class="status-text success">正常</span>
              </div>
            </div>
            <div class="node-metrics">
              <div class="metric">
                <span>方位角:</span>
                <span class="metric-value">{{ antennaMetrics.azimuth }}°</span>
              </div>
              <div class="metric">
                <span>俯仰角:</span>
                <span class="metric-value">{{ antennaMetrics.elevation }}°</span>
              </div>
            </div>
          </div>

          <!-- Node: LNA -->
          <div class="node" style="top: 245px; left: 320px; width: 160px;">
            <div class="node-card">
              <div class="node-tags">
                <span class="tag tag-local">本控</span>
                <span class="tag tag-primary">主</span>
              </div>
              <AntennaIcon class="node-icon" />
              <div class="node-info">
                <p class="node-type">低噪放大模块</p>
                <p class="node-name">LNA-ALPHA</p>
              </div>
              <div class="node-status">
                <span class="status-dot success"></span>
                <span class="status-text success">GAIN: {{ lnaMetrics.gain }}dB</span>
              </div>
            </div>
            <div class="node-metrics">
              <div class="metric">
                <span>温度:</span>
                <span class="metric-value">{{ lnaMetrics.temperature }}°C</span>
              </div>
              <div class="metric">
                <span>输入功率:</span>
                <span class="metric-value">{{ lnaMetrics.inputPower }}dBm</span>
              </div>
            </div>
          </div>

          <!-- Node: Down-converter -->
          <div class="node" style="top: 245px; left: 580px; width: 160px;">
            <div class="node-card error">
              <div class="node-tags">
                <span class="tag tag-control">分控</span>
                <span class="tag tag-standby">备</span>
              </div>
              <ConverterIcon class="node-icon pulse" />
              <div class="node-info">
                <p class="node-type">变频单元</p>
                <p class="node-name">DNC-70</p>
              </div>
              <div class="node-status">
                <span class="status-dot error"></span>
                <span class="status-text error">危急</span>
              </div>
            </div>
            <div class="node-metrics">
              <div class="metric">
                <span>本振频率:</span>
                <span class="metric-value">{{ converterMetrics.loFreq }}GHz</span>
              </div>
              <div class="metric">
                <span>电压误差:</span>
                <span class="metric-value error">{{ converterMetrics.voltageError }}V</span>
              </div>
            </div>
          </div>

          <!-- Node: Matrix -->
          <div class="node" style="top: 230px; left: 840px; width: 160px;">
            <div class="node-card">
              <div class="node-tags">
                <span class="tag tag-control">分控</span>
                <span class="tag tag-primary">主</span>
              </div>
              <MatrixIcon class="node-icon" />
              <div class="node-info">
                <p class="node-type">切换矩阵</p>
                <p class="node-name">MX-V3</p>
              </div>
              <div class="node-status">
                <span class="status-dot success"></span>
                <span class="status-text success">已锁定</span>
              </div>
            </div>
          </div>

          <!-- Node: Demodulator -->
          <div class="node" style="top: 100px; left: 1100px; width: 144px;">
            <div class="node-card">
              <WavesIcon class="node-icon" />
              <div class="node-info">
                <p class="node-type">解调器</p>
                <p class="node-name">DEMOD-01</p>
              </div>
              <div class="node-status">
                <span class="status-dot success"></span>
                <span class="status-text success">同步成功</span>
              </div>
            </div>
          </div>

          <!-- Node: Storage -->
          <div class="node" style="top: 380px; left: 1100px; width: 144px;">
            <div class="node-card">
              <DatabaseIcon class="node-icon" />
              <div class="node-info">
                <p class="node-type">存储系统</p>
                <p class="node-name">SSD-ARRAY-B</p>
              </div>
              <div class="node-status">
                <span class="status-dot success"></span>
                <span class="status-text success">{{ storageMetrics.freeSpace }}% 空闲</span>
              </div>
            </div>
          </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import UserIcon from '@/components/icons/UserIcon.vue'
import SatelliteIcon from '@/components/icons/SatelliteIcon.vue'

// Icons for side menu
const TopologyIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '5', r: '2' }),
      h('circle', { cx: '5', cy: '19', r: '2' }),
      h('circle', { cx: '19', cy: '19', r: '2' }),
      h('path', { d: 'M12 7v8M7 17l5-2 5 2' })
    ])
  }
}

const ComponentIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('rect', { x: '4', y: '4', width: '16', height: '16', rx: '2' }),
      h('path', { d: 'M4 12h16M12 4v16' })
    ])
  }
}

const GridIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('rect', { x: '3', y: '3', width: '7', height: '7' }),
      h('rect', { x: '14', y: '3', width: '7', height: '7' }),
      h('rect', { x: '3', y: '14', width: '7', height: '7' }),
      h('rect', { x: '14', y: '14', width: '7', height: '7' })
    ])
  }
}

const DevicesIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('rect', { x: '4', y: '4', width: '6', height: '6', rx: '1' }),
      h('rect', { x: '14', y: '4', width: '6', height: '6', rx: '1' }),
      h('rect', { x: '4', y: '14', width: '6', height: '6', rx: '1' }),
      h('rect', { x: '14', y: '14', width: '6', height: '6', rx: '1' })
    ])
  }
}

// Icons for nodes
const AntennaIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', class: 'node-icon-svg' }, [
      h('path', { d: 'M12 2v20M6 8a6 6 0 0 1 12 0c0 3-2 5-6 10-4-5-6-7-6-10z' })
    ])
  }
}

const ConverterIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', class: 'node-icon-svg' }, [
      h('path', { d: 'M7 16V4M17 8v12M3 12h4m10 0h4' })
    ])
  }
}

const MatrixIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', class: 'node-icon-svg' }, [
      h('rect', { x: '3', y: '3', width: '18', height: '18', rx: '2' }),
      h('path', { d: 'M3 9h18M3 15h18M9 3v18M15 3v18' })
    ])
  }
}

const WavesIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', class: 'node-icon-svg' }, [
      h('path', { d: 'M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1' })
    ])
  }
}

const DatabaseIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', class: 'node-icon-svg' }, [
      h('ellipse', { cx: '12', cy: '5', rx: '9', ry: '3' }),
      h('path', { d: 'M3 5V19A9 3 0 0 0 21 19V5' }),
      h('path', { d: 'M3 12A9 3 0 0 0 21 12' })
    ])
  }
}

import { h } from 'vue'

// Time refs
const lstTime = ref('14:22:05')
const utcTime = ref('06:22:05')

// Metrics refs
const antennaMetrics = ref({
  azimuth: 192.4,
  elevation: 45.2
})

const lnaMetrics = ref({
  gain: 60,
  temperature: 24.5,
  inputPower: -90
})

const converterMetrics = ref({
  loFreq: 1.2,
  voltageError: 0.8
})

const storageMetrics = ref({
  freeSpace: 92
})

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
  // Simulate LST (Local Sidereal Time)
  const hours = now.getUTCHours()
  const minutes = now.getUTCMinutes()
  const seconds = now.getUTCSeconds()
  const lstHours = (hours + 8) % 24
  lstTime.value = `${String(lstHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

// Simulate real-time data updates
function updateData() {
  // Signal strength fluctuation
  telemetry.value.signalStrength = -64 + Math.random() * 2 - 1
  // Packet loss fluctuation
  telemetry.value.packetLoss = Number((0.001 + Math.random() * 0.002).toFixed(3))
  // Antenna position
  antennaMetrics.value.azimuth = 192 + Math.random() * 0.5
  antennaMetrics.value.elevation = 45 + Math.random() * 0.3
  // LNA temperature
  lnaMetrics.value.temperature = 24 + Math.random() * 1
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

.topology-page {
  min-height: 100vh;
  background-color: #131318;
  color: #e4e1e9;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* TopNavBar */
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: rgba(2, 6, 23, 0.6);
  backdrop-filter: blur(20px);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  z-index: 50;
}

.logo {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: #60a5fa;
  text-transform: uppercase;
}

.main-nav {
  display: flex;
  gap: 32px;
}

.nav-link {
  font-size: 14px;
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s;
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
}

.nav-link:hover,
.nav-link.active {
  color: #e4e1e9;
}

.nav-link.active {
  color: #60a5fa;
  border-bottom-color: #60a5fa;
  font-weight: 600;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-btn {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 8px;
  transition: color 0.2s;
}

.icon-btn:hover {
  color: #60a5fa;
}

.icon {
  width: 24px;
  height: 24px;
}

/* SideNavBar */
.side-nav {
  position: fixed;
  left: 0;
  top: 64px;
  bottom: 0;
  width: 256px;
  background: #020617;
  display: flex;
  flex-direction: column;
  z-index: 40;
}

.side-header {
  padding: 32px 24px 24px;
}

.side-title {
  font-size: 12px;
  color: #60a5fa;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 4px 0;
}

.side-subtitle {
  font-size: 10px;
  color: #64748b;
  letter-spacing: 0.2em;
  margin: 0;
}

.side-menu {
  display: flex;
  flex-direction: column;
}

.side-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  color: #64748b;
  text-decoration: none;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s;
  border-right: 2px solid transparent;
}

.side-link:hover {
  color: #93c5fd;
  background: rgba(255, 255, 255, 0.05);
}

.side-link.active {
  color: #60a5fa;
  background: rgba(59, 130, 246, 0.1);
  border-right-color: #60a5fa;
  font-weight: 600;
}

.side-icon {
  width: 20px;
  height: 20px;
}

.side-footer {
  margin-top: auto;
  padding: 24px;
}

.health-card {
  background: #1b1b20;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(66, 71, 84, 0.1);
}

.health-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.health-label {
  font-size: 10px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.health-bar {
  height: 4px;
  background: #1f2937;
  border-radius: 2px;
  overflow: hidden;
}

.health-fill {
  height: 100%;
  background: #60a5fa;
  border-radius: 2px;
  transition: width 0.3s;
}

/* Main Content */
.main-content {
  margin-left: 256px;
  padding-top: 64px;
  min-height: 100vh;
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
  height: 700px;
  background: rgba(14, 14, 19, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(66, 71, 84, 0.1);
  padding: 48px;
  overflow: hidden;
}

.connection-lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.6;
}

.grid-bg {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.05) 1px, transparent 0);
  background-size: 40px 40px;
  opacity: 0.3;
  pointer-events: none;
}

/* Node Styles */
.node {
  position: absolute;
}

.node-card {
  background: #2a292f;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(164, 201, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
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
  color: #60a5fa;
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
  width: 40px;
  height: 40px;
  color: #a4c9ff;
  margin-top: 8px;
}

.node-icon.pulse {
  color: #ffb4ab;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
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
  margin-top: 16px;
  background: rgba(14, 14, 19, 0.8);
  padding: 8px;
  border-radius: 6px;
}

.metric {
  display: flex;
  justify-content: space-between;
  font-family: 'Fira Code', monospace;
  font-size: 10px;
  color: #64748b;
  margin-bottom: 4px;
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
  color: #60a5fa;
  font-family: 'Fira Code', monospace;
  font-size: 10px;
  border-radius: 4px;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

/* Telemetry Grid */
.telemetry-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
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

/* Node Icon SVG */
:deep(.node-icon-svg) {
  width: 40px;
  height: 40px;
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
  .side-nav {
    transform: translateX(-100%);
  }

  .main-content {
    margin-left: 0;
  }

  .main-nav {
    display: none;
  }
}
</style>
