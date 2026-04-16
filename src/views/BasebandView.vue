<template>
  <main class="main-content">
      <div class="content-wrapper">
        <!-- Page Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">基带一体化监视</h1>
            <p class="page-subtitle">Integrated Baseband Monitoring Matrix</p>
          </div>
          <div class="header-stats">
            <div class="stat-box">
              <span class="stat-label">Uplink Status</span>              <span class="stat-value success">NOMINAL</span>            </div>
            <div class="stat-box">
              <span class="stat-label">Downlink Bitrate</span>              <span class="stat-value primary">1.2 Gbps</span>            </div>
          </div>
        </div>

        <!-- Topology Layout -->
        <div class="matrix-grid">
          <!-- Background decorative circles -->
          <div class="bg-circles">
            <div class="circle circle-outer"></div>
            <div class="circle circle-inner"></div>
          </div>

          <!-- Column 1: Control & Tracking -->
          <div class="column col-tracking">
            <div class="column-title">
              <span class="title-line"></span>              <span>控制与跟踪单元</span>            </div>

            <!-- Tracking Basebands -->
            <div class="card">
              <div class="card-header">
                <span class="card-id">TRK-BB-01</span>                <span class="status-dot success"></span>              </div>
              <h3 class="card-name">跟踪基带 A</h3>
              <p class="card-metrics">AZ: {{ trackingMetrics.az }}° | EL: {{ trackingMetrics.el }}°</p>
            </div>

            <div class="card">
              <div class="card-header">
                <span class="card-id">TRK-BB-02</span>                <span class="status-dot success"></span>              </div>
              <h3 class="card-name">跟踪基带 B</h3>
              <p class="card-metrics">STANDBY / READY</p>
            </div>

            <!-- Control Basebands -->
            <div class="card card-control">
              <div class="card-header">
                <span class="card-id">CMD-BB-01</span>                <span class="status-dot success"></span>              </div>
              <h3 class="card-name">测控基带 01</h3>
              <div class="progress-bar">
                <div class="progress-fill" style="width: 75%"></div>
              </div>
            </div>

            <div class="card card-control">
              <div class="card-header">
                <span class="card-id">CMD-BB-02</span>                <span class="status-dot success"></span>              </div>
              <h3 class="card-name">测控基带 02</h3>
              <div class="progress-bar">
                <div class="progress-fill" style="width: 25%"></div>
              </div>
            </div>
          </div>

          <!-- Column 2: Uplink Basebands -->
          <div class="column col-uplink">
            <div class="column-title">
              <span class="title-line secondary"></span>              <span>上行基带矩阵 (测控/前向)</span>            </div>

            <div class="uplink-grid">
              <div class="uplink-card">
                <div class="uplink-header">
                  <UploadIcon class="uplink-icon" />
                  <span class="status-dot success"></span>                </div>
                <div class="uplink-name">上行基带 #01</div>
                <div class="uplink-band">S-BAND / 2.4GHz</div>
              </div>

              <div class="uplink-card">
                <div class="uplink-header">
                  <UploadIcon class="uplink-icon" />
                  <span class="status-dot success"></span>                </div>
                <div class="uplink-name">上行基带 #02</div>
                <div class="uplink-band">S-BAND / 2.4GHz</div>
              </div>

              <div class="uplink-card error">
                <div class="uplink-header">
                  <UploadIcon class="uplink-icon error" />
                  <span class="status-dot error pulse"></span>                </div>
                <div class="uplink-name error">上行基带 #03</div>
                <div class="uplink-band error">X-BAND / ALARM</div>
              </div>

              <div class="uplink-card">
                <div class="uplink-header">
                  <UploadIcon class="uplink-icon" />
                  <span class="status-dot success"></span>                </div>
                <div class="uplink-name">上行基带 #04</div>
                <div class="uplink-band">X-BAND / 8.2GHz</div>
              </div>
            </div>

            <!-- Real-time Telemetry Stream -->
            <div class="telemetry-stream">
              <div class="stream-header">
                <span class="stream-title">REAL-TIME TELEMETRY STREAM</span>                <span class="stream-time">UTC {{ utcTime }}</span>              </div>
              <div class="stream-list">
                <div v-for="(packet, index) in telemetryPackets" :key="index" class="stream-item">
                  <span>{{ packet.id }}</span>                  <span :class="['stream-status', packet.status]">{{ packet.statusText }}</span>                </div>
              </div>
            </div>
          </div>

          <!-- Column 3: Downlink Basebands -->
          <div class="column col-downlink">
            <div class="column-title">
              <span class="title-line accent"></span>              <span>下行基带矩阵 (数传返向)</span>            </div>

            <div class="downlink-grid">
              <div v-for="n in 8" :key="n" class="downlink-cell" :class="{ warning: n === 4 }">
                <span class="status-dot" :class="n === 4 ? 'warning' : 'success'"></span>                <span class="downlink-id">RX-{{ String(n).padStart(2, '0') }}</span>              </div>
            </div>

            <!-- Downlink Visual Map -->
            <div class="signal-map">
              <div class="map-bg">
                <div class="earth-visual"></div>
              </div>
              <div class="map-overlay">
                <div class="map-header">
                  <span class="map-title">信号流向视图</span>                  <SatelliteIcon class="map-icon" />
                </div>
                <div class="map-sync">
                  <div class="sync-line"></div>
                  <span class="sync-text">SYNCING</span>                  <div class="sync-line"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Global Stats Bar -->
        <div class="stats-bar">
          <div class="stat-card">
            <div class="stat-card-label">系统负载</div>
            <div class="stat-card-value">{{ systemStats.load }}%</div>
          </div>
          <div class="stat-card success">
            <div class="stat-card-label">链路误码率</div>
            <div class="stat-card-value">{{ systemStats.ber }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-label">活跃连接</div>
            <div class="stat-card-value">{{ systemStats.connections }}</div>
          </div>
          <div class="stat-card error">
            <div class="stat-card-label">异常告警</div>
            <div class="stat-card-value error">{{ systemStats.alarms }}</div>
          </div>
        </div>
      </div>
    </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, h } from 'vue'
import UserIcon from '@/components/icons/UserIcon.vue'
import SatelliteIcon from '@/components/icons/SatelliteIcon.vue'

// Icons for top nav
const SettingsIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '3' }),
      h('path', { d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' })
    ])
  }
}

const NotificationIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9' }),
      h('path', { d: 'M13.73 21a2 2 0 0 1-3.46 0' })
    ])
  }
}

// Side menu icons
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

const UploadIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', class: 'uplink-icon-svg' }, [
      h('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
      h('polyline', { points: '17 8 12 3 7 8' }),
      h('line', { x1: '12', y1: '3', x2: '12', y2: '15' })
    ])
  }
}

// Reactive data
const utcTime = ref('08:24:12')
const trackingMetrics = ref({ az: 182.4, el: 42.1 })

const telemetryPackets = ref([
  { id: 'PACKET_ID_092', status: 'success', statusText: 'ACK_SUCCESS' },
  { id: 'PACKET_ID_093', status: 'success', statusText: 'ACK_SUCCESS' },
  { id: 'PACKET_ID_094', status: 'error', statusText: 'TIMEOUT_RETRY' },
  { id: 'PACKET_ID_095', status: 'success', statusText: 'ACK_SUCCESS' }
])

const systemStats = ref({
  load: 42.8,
  ber: '1.2e-7',
  connections: '16/16',
  alarms: '01'
})

// Time update
let timeInterval: number | null = null
let dataInterval: number | null = null

function updateTime() {
  const now = new Date()
  const hours = String(now.getUTCHours()).padStart(2, '0')
  const minutes = String(now.getUTCMinutes()).padStart(2, '0')
  const seconds = String(now.getUTCSeconds()).padStart(2, '0')
  utcTime.value = `${hours}:${minutes}:${seconds}`
}

function updateData() {
  // Update tracking metrics
  trackingMetrics.value.az = 182 + Math.random() * 0.5
  trackingMetrics.value.el = 42 + Math.random() * 0.3

  // Update system load
  systemStats.value.load = Number((40 + Math.random() * 5).toFixed(1))

  // Rotate telemetry packets
  const lastId = parseInt(telemetryPackets.value[telemetryPackets.value.length - 1].id.split('_')[2])
  const newPacket = {
    id: `PACKET_ID_${String(lastId + 1).padStart(3, '0')}`,
    status: Math.random() > 0.9 ? 'error' : 'success',
    statusText: Math.random() > 0.9 ? 'TIMEOUT_RETRY' : 'ACK_SUCCESS'
  }
  telemetryPackets.value.shift()
  telemetryPackets.value.push(newPacket)
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
.baseband-page {
  min-height: 100vh;
  background-color: var(--gs-bg-default);
  color: var(--gs-text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* TopNavBar */
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: var(--gs-bg-default);
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
  color: var(--gs-text-primary);
  text-transform: uppercase;
}

.main-nav {
  display: flex;
  gap: 32px;
}

.nav-link {
  font-size: 14px;
  color: var(--gs-text-secondary);
  text-decoration: none;
  transition: color 0.2s;
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
}

.nav-link:hover,
.nav-link.active {
  color: var(--gs-text-primary);
}

.nav-link.active {
  color: var(--gs-text-primary);
  border-bottom-color: var(--gs-text-primary);
  font-weight: 600;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-btn {
  position: relative;
  border-radius: 50%;
  background: none;
  border: none;
  color: var(--gs-text-secondary);
  cursor: pointer;
  padding: 8px;
  transition: color 0.2s;
}

.icon-btn:hover {
  color: var(--gs-text-primary);
}

.icon {
  width: 20px;
  height: 20px;
}

.notification-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gs-error-main);
}


/* SideNavBar */
.side-nav {
  position: fixed;
  left: 0;
  top: 64px;
  bottom: 0;
  width: 256px;
  background: var(--gs-bg-default);
  display: flex;
  flex-direction: column;
  z-index: 40;
}

.side-header {
  padding: 32px 24px 24px;
}

.side-title {
  font-size: 12px;
  color: var(--gs-text-primary);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 4px 0;
}

.side-subtitle {
  font-size: 10px;
  color: var(--gs-text-disabled);
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
  color: var(--gs-text-disabled);
  text-decoration: none;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s;
  border-right: 2px solid transparent;
}

.side-link:hover {
  color: var(--gs-primary-main);
  background: var(--gs-overlay-light);
}

.side-link.active {
  color: var(--gs-text-primary);
  background: var(--gs-overlay-light);
  border-right-color: var(--gs-text-primary);
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
  background: var(--gs-bg-paper);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--gs-border-main), transparent 90%);
}

.health-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.health-label {
  font-size: 10px;
  color: var(--gs-text-disabled);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.health-bar {
  height: 4px;
  background: var(--gs-bg-elevated);
  border-radius: 2px;
  overflow: hidden;
}

.health-fill {
  height: 100%;
  background: var(--gs-primary-main);
  border-radius: 2px;
  transition: width 0.3s;
}

/* Main Content */
.main-content {
  background-image:
    linear-gradient(to right, var(--gs-overlay-light) 1px, transparent 1px),
    linear-gradient(to bottom, var(--gs-overlay-light) 1px, transparent 1px);
  background-size: 40px 40px;
}

.content-wrapper {
  padding: 32px;
  max-width: 1600px;
  margin: 0 auto;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 48px;
}

.page-title {
  font-size: 36px;
  font-weight: 700;
  color: var(--gs-text-primary);
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
}

.page-subtitle {
  color: var(--gs-text-secondary);
  margin: 0;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.header-stats {
  display: flex;
  gap: 8px;
}

.stat-box {
  background: var(--gs-bg-paper);
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-label {
  font-size: 11px;
  color: var(--gs-text-secondary);
  text-transform: uppercase;
}

.stat-value {
  font-family: 'Fira Code', monospace;
  font-size: 13px;
  font-weight: 500;
}

.stat-value.success {
  color: var(--gs-success-main);
}

.stat-value.primary {
  color: var(--gs-primary-main);
}

/* Matrix Grid */
.matrix-grid {
  display: grid;
  grid-template-columns: 3fr 4fr 5fr;
  gap: 32px;
  position: relative;
}

.bg-circles {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  opacity: 0.2;
  z-index: 0;
}

.circle {
  position: absolute;
  border: 1px solid var(--gs-overlay-medium);
  border-radius: 50%;
}

.circle-outer {
  width: 600px;
  height: 600px;
  animation: pulse 8s infinite;
}

.circle-inner {
  width: 400px;
  height: 400px;
  border-color: var(--gs-glow-primary);
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.02); }
}

/* Columns */
.column {
  position: relative;
  z-index: 1;
}

.column-title {
  font-size: 11px;
  color: var(--gs-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-line {
  width: 2px;
  height: 16px;
  background: var(--gs-primary-main);
}

.title-line.secondary {
  background: var(--gs-primary-main);
}

.title-line.accent {
  background: var(--gs-primary-main);
}

/* Status Dot */
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.success {
  background: var(--gs-success-main);
  box-shadow: 0 0 2px var(--gs-success-main), 0 0 12px var(--gs-glow-success);
}

.status-dot.error {
  background: var(--gs-error-main);
  box-shadow: 0 0 2px var(--gs-error-main), 0 0 12px var(--gs-glow-error);
}

.status-dot.warning {
  background: var(--gs-warning-main);
  box-shadow: 0 0 12px var(--gs-glow-warning);
}

.status-dot.pulse {
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* Cards */
.card {
  background: var(--gs-bg-paper);
  padding: 24px;
  border-radius: 8px;
  border-left: 4px solid var(--gs-glow-primary);
  transition: all 0.3s;
  margin-bottom: 16px;
}

.card:hover {
  border-left-color: var(--gs-primary-main);
}

.card-control {
  border-left-color: var(--gs-glow-success);
}

.card-control:hover {
  border-left-color: var(--gs-success-main);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-id {
  font-size: 11px;
  color: var(--gs-text-secondary);
  font-family: 'Fira Code', monospace;
}

.card-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--gs-text-primary);
  margin: 0 0 4px 0;
}

.card-metrics {
  font-size: 11px;
  color: var(--gs-text-secondary);
  font-family: 'Fira Code', monospace;
  margin: 0;
}

.progress-bar {
  height: 4px;
  background: var(--gs-bg-paper);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 12px;
}

.progress-fill {
  height: 100%;
  background: var(--gs-success-main);
  border-radius: 2px;
  transition: width 0.3s;
}

/* Uplink Grid */
.uplink-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.uplink-card {
  background: var(--gs-bg-elevated);
  padding: 20px;
  border-radius: 4px;
  border: 1px solid color-mix(in srgb, var(--gs-border-main), transparent 90%);
  transition: all 0.2s;
}

.uplink-card:hover {
  background: var(--gs-bg-elevated);
}

.uplink-card.error {
  border-color: var(--gs-glow-error);
}

.uplink-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.uplink-icon {
  width: 16px;
  height: 16px;
  color: var(--gs-primary-main);
}

.uplink-icon.error {
  color: var(--gs-error-main);
}

.uplink-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--gs-text-primary);
  margin-bottom: 4px;
}

.uplink-name.error {
  color: var(--gs-error-main);
}

.uplink-band {
  font-size: 10px;
  color: var(--gs-text-secondary);
  font-family: 'Fira Code', monospace;
}

.uplink-band.error {
  color: color-mix(in srgb, var(--gs-error-main), transparent 30%);
}

:deep(.uplink-icon-svg) {
  width: 16px;
  height: 16px;
}

/* Telemetry Stream */
.telemetry-stream {
  margin-top: 32px;
  background: var(--gs-bg-paper);
  padding: 24px;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--gs-border-main), transparent 95%);
}

.stream-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.stream-title {
  font-family: 'Fira Code', monospace;
  font-size: 11px;
  color: var(--gs-primary-main);
}

.stream-time {
  font-size: 10px;
  color: var(--gs-text-secondary);
}

.stream-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stream-item {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  font-family: 'Fira Code', monospace;
}

.stream-item span:first-child {
  color: var(--gs-text-secondary);
}

.stream-status.success {
  color: var(--gs-success-main);
}

.stream-status.error {
  color: var(--gs-error-main);
}

/* Downlink Grid */
.downlink-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.downlink-cell {
  background: var(--gs-bg-paper);
  padding: 16px 8px;
  border-radius: 2px;
  border: 1px solid color-mix(in srgb, var(--gs-border-main), transparent 95%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.2s;
  cursor: crosshair;
}

.downlink-cell:hover {
  background: color-mix(in srgb, var(--gs-primary-main), transparent 80%);
}

.downlink-cell.warning .downlink-id {
  color: var(--gs-warning-main);
}

.downlink-id {
  font-size: 10px;
  font-weight: 700;
  color: var(--gs-text-primary);
}

/* Signal Map */
.signal-map {
  position: relative;
  height: 256px;
  background: var(--gs-bg-paper);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--gs-border-main), transparent 90%);
  margin-top: 24px;
}

.map-bg {
  position: absolute;
  inset: 0;
  opacity: 0.4;
}

.earth-visual {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 50%, var(--gs-glow-primary), transparent 60%),
              radial-gradient(circle at 70% 50%, var(--gs-glow-success), transparent 50%);
  filter: blur(20px);
}

.map-overlay {
  position: absolute;
  inset: 0;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.map-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--gs-text-primary);
}

.map-icon {
  width: 20px;
  height: 20px;
  color: var(--gs-primary-main);
}

.map-sync {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sync-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(to right, transparent, var(--gs-primary-main), transparent);
}

.sync-text {
  font-size: 11px;
  color: var(--gs-primary-main);
  font-family: 'Fira Code', monospace;
}

/* Stats Bar */
.stats-bar {
  margin-top: 48px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.stat-card {
  background: var(--gs-bg-paper);
  padding: 20px;
  border-radius: 4px;
  border-top: 2px solid var(--gs-primary-main);
}

.stat-card.success {
  border-top-color: var(--gs-success-main);
}

.stat-card.error {
  border-top-color: var(--gs-error-main);
}

.stat-card-label {
  font-size: 10px;
  color: var(--gs-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 4px;
}

.stat-card-value {
  font-size: 24px;
  font-family: 'Fira Code', monospace;
  color: var(--gs-text-primary);
}

.stat-card-value.error {
  color: var(--gs-error-main);
}

/* Background Glow */
.bg-glow {
  position: fixed;
  border-radius: 50%;
  filter: blur(120px);
  pointer-events: none;
  z-index: -1;
}

.bg-glow.top-right {
  top: -200px;
  right: -200px;
  width: 800px;
  height: 800px;
  background: var(--gs-overlay-light);
}

.bg-glow.bottom-left {
  bottom: -100px;
  left: -100px;
  width: 600px;
  height: 600px;
  background: var(--gs-overlay-light);
}

/* Responsive */
@media (max-width: 1400px) {
  .matrix-grid {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  .col-downlink {
    grid-column: span 2;
  }

  .stats-bar {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1024px) {
  .side-nav {
    transform: translateX(-100%);
  }
  .matrix-grid {
    grid-template-columns: 1fr;
  }

  .col-downlink {
    grid-column: span 1;
  }

  .main-nav {
    display: none;
  }
}
</style>
