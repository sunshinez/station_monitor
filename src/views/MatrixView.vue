<template>
  <div class="matrix-page">
    <!-- TopNavBar -->
    <header class="top-nav">
      <div class="logo">XX地面站软件</div>
      <nav class="main-nav">
        <a href="#" class="nav-link active">图形化监视</a>
        <router-link to="/device-control" class="nav-link">控制功能</router-link>
        <a href="#" class="nav-link">状态监视</a>
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
        <h2 class="side-title">ORBITAL COMMAND</h2>
        <p class="side-subtitle">SUB-SYSTEM ALPHA</p>
      </div>
      <nav class="side-menu">
        <router-link to="/topology" class="side-link">
          <TopologyIcon class="side-icon" />
          <span>系统拓扑图监视</span>        </router-link>        <router-link to="/baseband" class="side-link">
          <ComponentIcon class="side-icon" />
          <span>基带一体化监视</span>        </router-link>        <router-link to="/matrix" class="side-link active">
          <GridIcon class="side-icon" />
          <span>矩阵设备监视</span>        </router-link>        <router-link to="/other-devices" class="side-link">
          <DevicesIcon class="side-icon" />
          <span>其它设备监视</span>        </router-link>      </nav>
      <div class="side-footer">
        <div class="health-card">
          <div class="health-header">
            <span class="health-label">上行链路健康度</span>            <span class="status-dot success"></span>          </div>
          <div class="health-bar">
            <div class="health-fill" style="width: 78%"></div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-wrapper">
        <!-- Header Section -->
        <div class="page-header">
          <div>
            <h1 class="page-title">系统开关矩阵</h1>
            <p class="page-subtitle">Switching Matrix Controller v4.0.2 // Alpha Sector</p>
          </div>
          <div class="header-status">
            <div class="status-item">
              <span class="status-dot success"></span>              <span class="status-label">已连接 (CONNECTED)</span>            </div>
            <div class="status-item">
              <span class="status-dot disconnected"></span>              <span class="status-label">未连接 (DISCONNECTED)</span>            </div>
            <div class="status-divider"></div>
            <button class="refresh-btn" @click="refreshMatrix">
              <RefreshIcon class="refresh-icon" />
              <span>更新矩阵 (REFRESH)</span>            </button>
          </div>
        </div>

        <!-- Matrix Visualization -->
        <section class="matrix-section">
          <div class="matrix-container">
            <div class="matrix-content">
              <!-- X-Axis Label -->
              <div class="axis-label-top">
                <span>输入设备 (基带) — INPUT (BASEBAND)</span>              </div>

              <div class="matrix-body">
                <!-- Y-Axis Labels -->
                <div class="axis-labels-left">
                  <div v-for="i in 8" :key="`uc-${i}`" class="axis-label">
                    {{ outputLabels[i-1] }}
                  </div>
                </div>

                <!-- Main Matrix -->
                <div class="matrix-area">
                  <!-- Column Headers -->
                  <div class="col-headers">
                    <div v-for="i in 8" :key="`bb-${i}`" class="col-header">
                      {{ inputLabels[i-1] }}
                    </div>
                  </div>

                  <!-- Matrix Grid -->
                  <div class="matrix-grid">
                    <div
                      v-for="(cell, index) in matrixCells"
                      :key="index"
                      class="matrix-cell"
                      :class="{ active: cell.active }"
                      @click="toggleCell(index)"
                    >
                      <span class="cell-dot" :class="cell.active ? 'active' : 'inactive'"></span>                    </div>
                  </div>
                </div>

                <!-- Y-Axis Label (Rotated) -->
                <div class="axis-label-right">
                  <span>输出设备 (变频单元) — OUTPUT (FREQUENCY CONVERTER)</span>                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Lower Dashboard -->
        <div class="dashboard-grid">
          <!-- System Health -->
          <div class="panel health-panel">
            <div class="panel-header">
              <ShieldIcon class="panel-icon success" />
              <h3 class="panel-title">系统健康度 (SYSTEM HEALTH)</h3>
            </div>
            <div class="health-metrics">
              <div class="health-row">
                <span class="health-name">核心温度 (CORE TEMP)</span>                <span class="health-value">{{ systemHealth.temp }}°C</span>              </div>
              <div class="health-row">
                <span class="health-name">负载均衡 (LOAD BALANCER)</span>                <span class="health-value">{{ systemHealth.loadBalancer }}</span>              </div>
              <div class="health-row">
                <span class="health-name">实时延迟 (LATENCY RT)</span>                <span class="health-value highlight">{{ systemHealth.latency }}ms</span>              </div>
            </div>
          </div>

          <!-- Switching Log -->
          <div class="panel log-panel">
            <div class="panel-header">
              <div class="panel-header-left">
                <ListIcon class="panel-icon primary" />
                <h3 class="panel-title">实时切换日志 (SWITCHING LOG)</h3>
              </div>
              <span class="auto-update">自动更新: 开启 (AUTO-UPDATE: ENABLED)</span>            </div>
            <div class="log-list scrollbar-thin">
              <div v-for="(log, index) in switchLogs" :key="index" class="log-item" :class="{ dimmed: index > 2 }">
                <span class="log-time">{{ log.time }}</span>                <span class="log-type" :class="log.type">[{{ log.typeText }}]</span>                <span class="log-message">{{ log.message }}</span>                <span class="log-status" :class="log.status">{{ log.statusText }}</span>              </div>
            </div>
          </div>
        </div>

        <!-- Footer Decoration -->
        <div class="page-footer">
          <div class="footer-bars">
            <div class="footer-bar"></div>
            <div class="footer-bar"></div>
            <div class="footer-bar"></div>
            <div class="footer-bar active"></div>
            <div class="footer-bar active"></div>
            <div class="footer-bar active"></div>
          </div>
          <span class="footer-text">ASTRA GROUND STATION PROTOCOL • SECURE LINK • ALPHA 7-2</span>        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { h } from 'vue'
import UserIcon from '@/components/icons/UserIcon.vue'

// Icons
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

const RefreshIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', class: 'refresh-icon-svg' }, [
      h('path', { d: 'M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' }),
      h('path', { d: 'M3 3v5h5' }),
      h('path', { d: 'M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16' }),
      h('path', { d: 'M16 16h5v5' })
    ])
  }
}

const ShieldIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', class: 'panel-icon-svg' }, [
      h('path', { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' })
    ])
  }
}

const ListIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', class: 'panel-icon-svg' }, [
      h('path', { d: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01' })
    ])
  }
}

// Labels
const inputLabels = ['BB-01', 'BB-02', 'BB-03', 'BB-04', 'BB-05', 'BB-06', 'BB-07', 'BB-08']
const outputLabels = ['UC-01', 'UC-02', 'UC-03', 'UC-04', 'UC-05', 'UC-06', 'UC-07', 'UC-08']

// Matrix cells (8x8 = 64 cells)
const matrixCells = ref(Array(64).fill(null).map((_, i) => ({
  active: [1, 13, 24, 27, 36, 52].includes(i) // Pre-defined active connections
})))

// System health
const systemHealth = ref({
  temp: 42.8,
  loadBalancer: 'NOMINAL',
  latency: 1.2
})

// Switch logs
const switchLogs = ref([
  { time: '14:20:01', type: 'cmd', typeText: '指令', message: '切换连接: BB-02 -> UC-01', status: 'success', statusText: '成功' },
  { time: '14:18:55', type: 'sys', typeText: '系统', message: '心跳检查: 所有 16 个节点响应正常', status: 'success', statusText: '正常' },
  { time: '14:15:22', type: 'cmd', typeText: '指令', message: '断开连接: BB-03 -> UC-02', status: 'success', statusText: '成功' },
  { time: '14:12:08', type: 'cmd', typeText: '指令', message: '切换连接: BB-05 -> UC-04', status: 'success', statusText: '成功' },
  { time: '14:08:33', type: 'sys', typeText: '系统', message: '矩阵自检完成', status: 'success', statusText: '正常' }
])

// Toggle matrix cell
function toggleCell(index: number) {
  matrixCells.value[index].active = !matrixCells.value[index].active

  // Add log entry
  const row = Math.floor(index / 8)
  const col = index % 8
  const isActive = matrixCells.value[index].active

  const newLog = {
    time: new Date().toTimeString().slice(0, 8),
    type: 'cmd',
    typeText: '指令',
    message: `${isActive ? '切换连接' : '断开连接'}: ${inputLabels[col]} -> ${outputLabels[row]}`,
    status: 'success',
    statusText: '成功'
  }

  switchLogs.value.unshift(newLog)
  if (switchLogs.value.length > 10) {
    switchLogs.value.pop()
  }
}

// Refresh matrix
function refreshMatrix() {
  // Simulate refresh by updating health metrics
  systemHealth.value.temp = Number((42 + Math.random() * 2).toFixed(1))
  systemHealth.value.latency = Number((1 + Math.random() * 0.5).toFixed(1))
}

// Auto update
let updateInterval: number | null = null

onMounted(() => {
  updateInterval = window.setInterval(() => {
    // Randomly update latency
    systemHealth.value.latency = Number((1 + Math.random() * 0.5).toFixed(1))
  }, 3000)
})

onUnmounted(() => {
  if (updateInterval) clearInterval(updateInterval)
})
</script>

<style scoped>
.matrix-page {
  min-height: 100vh;
  background-color: #0b0c10;
  background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.02) 1px, transparent 0);
  background-size: 40px 40px;
  color: #e4e1e9;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  user-select: none;
}

/* TopNavBar */
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: rgba(11, 12, 16, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
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
  padding: 20px 0;
  border-bottom: 2px solid transparent;
}

.nav-link:hover,
.nav-link.active {
  color: #60a5fa;
  border-bottom-color: #60a5fa;
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
  background: #0b0c10;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
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
  background: rgba(27, 27, 32, 0.5);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
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
}

.content-wrapper {
  padding: 32px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 24px;
  margin-bottom: 32px;
}

.page-title {
  font-size: 36px;
  font-weight: 700;
  color: #e4e1e9;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-family: 'Fira Code', monospace;
  font-size: 11px;
  color: #8c909f;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin: 0;
}

.header-status {
  display: flex;
  align-items: center;
  gap: 24px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.status-dot.success {
  background: #4ae176;
  box-shadow: 0 0 12px rgba(74, 225, 118, 0.4);
}

.status-dot.disconnected {
  background: #35343a;
}

.status-label {
  font-size: 11px;
  color: #8c909f;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.status-divider {
  width: 1px;
  height: 32px;
  background: rgba(255, 255, 255, 0.05);
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #2a292f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e4e1e9;
  font-family: 'Fira Code', monospace;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover {
  background: #35343a;
}

.refresh-icon {
  width: 16px;
  height: 16px;
}

:deep(.refresh-icon-svg) {
  width: 16px;
  height: 16px;
}

/* Matrix Section */
.matrix-section {
  background: rgba(27, 27, 32, 0.3);
  padding: 40px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 32px;
}

.matrix-container {
  position: relative;
}

.axis-label-top {
  text-align: center;
  margin-bottom: 32px;
}

.axis-label-top span {
  font-size: 10px;
  font-weight: 700;
  color: rgba(164, 201, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.4em;
}

.matrix-body {
  display: flex;
  gap: 24px;
}

.axis-labels-left {
  width: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 36px;
  padding: 48px 0;
}

.axis-label {
  font-family: 'Fira Code', monospace;
  font-size: 10px;
  color: #8c909f;
  text-transform: uppercase;
  text-align: right;
}

.matrix-area {
  flex: 1;
}

.col-headers {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
  margin-bottom: 24px;
  text-align: center;
}

.col-header {
  font-family: 'Fira Code', monospace;
  font-size: 10px;
  color: #8c909f;
  text-transform: uppercase;
}

.matrix-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  gap: 12px;
  background: rgba(0, 0, 0, 0.2);
  padding: 32px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.matrix-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  cursor: pointer;
  transition: all 0.2s;
}

.matrix-cell:hover {
  background: rgba(255, 255, 255, 0.02);
}

.cell-dot {
  border-radius: 50%;
  transition: all 0.2s;
}

.cell-dot.inactive {
  width: 6px;
  height: 6px;
  background: rgba(255, 255, 255, 0.05);
}

.cell-dot.active {
  width: 10px;
  height: 10px;
  background: #4ae176;
  box-shadow: 0 0 12px rgba(74, 225, 118, 0.4);
}

.axis-label-right {
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.axis-label-right span {
  font-size: 10px;
  font-weight: 700;
  color: rgba(164, 201, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.4em;
  white-space: nowrap;
  transform: rotate(90deg);
  transform-origin: center;
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 32px;
  margin-bottom: 24px;
}

.panel {
  background: rgba(27, 27, 32, 0.3);
  padding: 24px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.panel-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.log-panel .panel-header {
  justify-content: space-between;
}

:deep(.panel-icon-svg) {
  width: 20px;
  height: 20px;
}

.panel-icon {
  width: 20px;
  height: 20px;
}

.panel-icon.success {
  color: #4ae176;
}

.panel-icon.primary {
  color: #a4c9ff;
}

.panel-title {
  font-size: 12px;
  font-weight: 600;
  color: #e4e1e9;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
}

.auto-update {
  font-family: 'Fira Code', monospace;
  font-size: 10px;
  color: #8c909f;
}

/* Health Panel */
.health-metrics {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.health-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.health-name {
  font-family: 'Fira Code', monospace;
  font-size: 11px;
  color: #8c909f;
  text-transform: uppercase;
}

.health-value {
  font-family: 'Fira Code', monospace;
  font-size: 11px;
  color: #e4e1e9;
}

.health-value.highlight {
  color: #4ae176;
}

/* Log Panel */
.log-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 120px;
  overflow-y: auto;
  padding-right: 8px;
}

.log-item {
  display: flex;
  gap: 16px;
  font-family: 'Fira Code', monospace;
  font-size: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.log-item.dimmed {
  opacity: 0.5;
}

.log-time {
  color: #8c909f;
  min-width: 60px;
}

.log-type {
  color: #a4c9ff;
  min-width: 40px;
}

.log-message {
  color: #e4e1e9;
  flex: 1;
}

.log-status {
  margin-left: auto;
}

.log-status.success {
  color: #4ae176;
}

/* Scrollbar */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

/* Page Footer */
.page-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 0.4;
  padding-top: 16px;
}

.footer-bars {
  display: flex;
  gap: 4px;
}

.footer-bar {
  width: 4px;
  height: 16px;
  background: rgba(164, 201, 255, 0.4);
}

.footer-bar.active {
  background: #a4c9ff;
}

.footer-text {
  font-family: 'Fira Code', monospace;
  font-size: 10px;
  letter-spacing: 0.5em;
  text-transform: uppercase;
}

/* Responsive */
@media (max-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
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