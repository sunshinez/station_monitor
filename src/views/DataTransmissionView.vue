<template>
  <main class="main-content">
        <div class="content-wrapper">
          <!-- Page Header -->
          <div class="page-header">
            <div class="header-left">
              <div class="header-tag">
                <HubIcon class="tag-icon" />
                <span class="tag-text">Ground Station / Telemetry</span>
              </div>
              <h1 class="page-title">
                数据传输监视 - <span class="highlight">中继数据透传</span>
              </h1>
            </div>
            <div class="header-right">
              <div class="status-card">
                <div class="status-label">MISSION TIME (UTC)</div>
                <div class="status-value">{{ missionTime }}</div>
              </div>
              <div class="status-card">
                <div class="status-label">NODE STATUS</div>
                <div class="status-indicator">
                  <span class="status-dot-green"></span>
                  <span class="status-text-green">NOMINAL</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Content Grid -->
          <div class="content-grid">
            <!-- Left Column -->
            <div class="left-column">
              <!-- Metric Cards Row -->
              <div class="metrics-row">
                <!-- Transmission Paths Card -->
                <div class="metric-card">
                  <div class="metric-header">
                    <span class="metric-label">传输路数 / PATHS</span>
                    <LanIcon class="metric-icon-bg" />
                  </div>
                  <div class="metric-value-row">
                    <span class="metric-value">{{ transmissionPaths }}</span>
                    <span class="metric-unit">CHANNELS</span>
                  </div>
                  <div class="channel-indicators">
                    <div v-for="n in 6" :key="n" class="channel-bar" :class="{ active: n <= 4, error: n === 5 }"></div>
                  </div>
                </div>

                <!-- Aggregate Rate Card -->
                <div class="metric-card">
                  <div class="metric-header">
                    <span class="metric-label">总传输速率 / AGGREGATE</span>
                    <SpeedIcon class="metric-icon-bg" />
                  </div>
                  <div class="metric-value-row">
                    <span class="metric-value">{{ aggregateRate }}</span>
                    <span class="metric-unit">Mbps</span>
                  </div>
                  <div class="trend-indicator">
                    <TrendUpIcon class="trend-icon" />
                    <span class="trend-text">+12.4% FROM LAST FRAME</span>
                  </div>
                </div>

                <!-- Bit Error Rate Card -->
                <div class="metric-card">
                  <div class="metric-header">
                    <span class="metric-label">传输误码率 / BIT ERROR</span>
                    <ErrorOutlineIcon class="metric-icon-bg" />
                  </div>
                  <div class="metric-value-row">
                    <span class="metric-value">{{ bitErrorRate }}</span>
                  </div>
                  <div class="status-text">STATUS: EXCELLENT</div>
                </div>
              </div>

              <!-- Storage Status Section -->
              <div class="storage-section">
                <div class="section-header-bar">
                  <div class="header-bar"></div>
                  <h2 class="section-title">中继数据落盘状态 / Storage Status</h2>
                  <div class="drive-id">DRIVE_ID: ST-A882</div>
                </div>

                <div class="storage-content">
                  <!-- Circular Progress -->
                  <div class="storage-circle">
                    <div class="circle-container">
                      <svg class="circle-svg" viewBox="0 0 160 160">
                        <circle class="circle-bg" cx="80" cy="80" r="70" />
                        <circle class="circle-progress" cx="80" cy="80" r="70" :style="circleStyle" />
                      </svg>
                      <div class="circle-text">
                        <span class="percentage">{{ storagePercent }}%</span>
                        <span class="label">Used</span>
                      </div>
                    </div>
                  </div>

                  <!-- Storage Stats -->
                  <div class="storage-stats">
                    <div class="stat-item">
                      <div class="stat-label">TOTAL CAPACITY</div>
                      <div class="stat-value">256.00 <span class="unit">TB</span></div>
                    </div>
                    <div class="stat-item highlight-green">
                      <div class="stat-label">WRITE SPEED</div>
                      <div class="stat-value text-green">1,240 <span class="unit">Mbps</span></div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-label">USED SPACE</div>
                      <div class="stat-value">192.45 <span class="unit">TB</span></div>
                    </div>
                    <div class="stat-item highlight-red">
                      <div class="stat-label">REMAINING TIME</div>
                      <div class="stat-value text-red">12:44:02</div>
                    </div>
                  </div>
                </div>

                <!-- Lane IO Distribution -->
                <div class="lane-distribution">
                  <div class="lane-header">
                    <span>Lane IO Distribution</span>
                    <span>Active Peaks: 4</span>
                  </div>
                  <div class="lane-bars">
                    <div v-for="(height, index) in laneHeights" :key="index" class="lane-bar" :style="{ height: height + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column: Command Stream -->
            <div class="right-column">
              <div class="command-panel">
                <div class="panel-header">
                  <TerminalIcon class="panel-icon" />
                  <h2 class="panel-title">传输中心命令流水 / CMD STREAM</h2>
                </div>
                <div class="command-list">
                  <div v-for="(cmd, index) in commands" :key="index" class="command-item" :class="cmd.status.toLowerCase()">
                    <div class="command-header">
                      <span class="command-time">{{ cmd.time }}</span>
                      <span class="command-status" :class="cmd.status.toLowerCase()">{{ cmd.status }}</span>
                    </div>
                    <div class="command-name">{{ cmd.name }}</div>
                    <div v-if="cmd.params" class="command-params">{{ cmd.params }}</div>
                    <div v-if="cmd.progress !== undefined" class="command-progress">
                      <div class="progress-bar">
                        <div class="progress-fill" :style="{ width: cmd.progress + '%' }"></div>
                      </div>
                    </div>
                    <div v-if="cmd.error" class="command-error">{{ cmd.error }}</div>
                  </div>
                </div>
                <div class="panel-footer">
                  <ChevronRightIcon class="footer-icon" />
                  <span class="footer-text">AWAITING MISSION CONTROL INPUT...</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Visual: Network Flow -->
          <div class="network-flow-section">
            <div class="flow-bg">
              <div class="flow-line line-1"></div>
              <div class="flow-line line-2"></div>
              <div class="flow-line line-3"></div>
            </div>
            <div class="flow-content">
              <div class="flow-header">
                <div>
                  <h3 class="flow-title">实时链路载荷可视化 / Link Payload Visualizer</h3>
                  <p class="flow-subtitle">NODE: GS-CN-BJ-01 | ENCRYPTION: ACTIVE</p>
                </div>
                <div class="flow-stats">
                  <div class="flow-stat">
                    <div class="stat-label">Uplink</div>
                    <div class="stat-value">42.5G</div>
                  </div>
                  <div class="flow-stat">
                    <div class="stat-label">Downlink</div>
                    <div class="stat-value green">128.9G</div>
                  </div>
                </div>
              </div>
              <div class="flow-visual">
                <PublicIcon class="flow-icon" />
                <div class="flow-track">
                  <div class="flow-dot dot-1"></div>
                  <div class="flow-dot dot-2 green"></div>
                  <div class="flow-dot dot-3"></div>
                </div>
                <SatelliteIcon class="flow-icon" />
              </div>
            </div>
          </div>
        </div>
      </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import UserIcon from '@/components/icons/UserIcon.vue'

// Icons
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

const MonitorIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('rect', { x: '2', y: '3', width: '20', height: '14', rx: '2', ry: '2' }),
      h('line', { x1: '8', y1: '21', x2: '16', y2: '21' }),
      h('line', { x1: '12', y1: '17', x2: '12', y2: '21' })
    ])
  }
}

const RemoteIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('rect', { x: '2', y: '6', width: '20', height: '12', rx: '2' }),
      h('path', { d: 'M6 10h.01M6 14h.01' })
    ])
  }
}

const AntennaIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M12 2v20M6 8a6 6 0 0 1 12 0c0 3-2 5-6 10-4-5-6-7-6-10z' })
    ])
  }
}

const AssignmentIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M9 11l3 3L22 4' }),
      h('path', { d: 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' })
    ])
  }
}

const HubIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '3' }),
      h('path', { d: 'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83' })
    ])
  }
}

const LanIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('rect', { x: '4', y: '3', width: '16', height: '2', rx: '1' }),
      h('rect', { x: '4', y: '19', width: '16', height: '2', rx: '1' }),
      h('rect', { x: '11', y: '5', width: '2', height: '14' }),
      h('rect', { x: '6', y: '8', width: '2', height: '8', rx: '1' }),
      h('rect', { x: '16', y: '8', width: '2', height: '8', rx: '1' })
    ])
  }
}

const SpeedIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('path', { d: 'M12 6v6l4 2' })
    ])
  }
}

const ErrorOutlineIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('line', { x1: '12', y1: '8', x2: '12', y2: '12' }),
      h('line', { x1: '12', y1: '16', x2: '12.01', y2: '16' })
    ])
  }
}

const TrendUpIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('polyline', { points: '23 6 13.5 15.5 8.5 10.5 1 18' }),
      h('polyline', { points: '17 6 23 6 23 12' })
    ])
  }
}

const TerminalIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('polyline', { points: '4 17 10 11 4 5' }),
      h('line', { x1: '12', y1: '19', x2: '20', y2: '19' })
    ])
  }
}

const ChevronRightIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('polyline', { points: '9 18 15 12 9 6' })
    ])
  }
}

const PublicIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('line', { x1: '2', y1: '12', x2: '22', y2: '12' }),
      h('path', { d: 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' })
    ])
  }
}

const SatelliteIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M4 10l8-8 8 8' }),
      h('rect', { x: '9', y: '10', width: '6', height: '10' }),
      h('line', { x1: '2', y1: '22', x2: '22', y2: '22' })
    ])
  }
}

import { h } from 'vue'

// Data
const transmissionPaths = ref(12)
const aggregateRate = ref(842.5)
const bitErrorRate = ref('1.2e-9')
const storagePercent = ref(75)
const laneHeights = [40, 60, 85, 30, 95, 20, 55, 70, 45, 80, 35, 50, 100, 25, 65, 40]

const missionTime = ref('2023-10-27 08:44:12')
const systemUptime = ref('124:12:05:44')

const commands = ref([
  { time: '14:22:05.124', name: 'CMD_UPLINK_SYNC_002 [RELAY_A]', status: 'SUCCESS', params: 'PARAMS: {BAUD: 1200, ENCRYPT: AES-256}' },
  { time: '14:21:44.908', name: 'DATA_DIST_PATH_REALLOC [CH_04 -> CH_11]', status: 'EXECUTING', progress: 65 },
  { time: '14:18:22.001', name: 'SYS_HEALTH_POLL_BROADCAST', status: 'SUCCESS' },
  { time: '14:15:10.552', name: 'STORAGE_FLUSH_FORCE_09', status: 'REJECTED', error: 'ERR_CODE: 0xFD22 (AUTH_FAIL)' },
  { time: '14:12:33.119', name: 'ANTENNA_SLEW_TO_COORD [AZ: 14.5, EL: 88.2]', status: 'SUCCESS' },
  { time: '14:10:01.002', name: 'PWR_MODULE_SWITCH_AUX', status: 'SUCCESS' }
])

// Computed
const circleStyle = computed(() => {
  const circumference = 2 * Math.PI * 70
  const offset = circumference - (storagePercent.value / 100) * circumference
  return {
    strokeDasharray: circumference,
    strokeDashoffset: offset
  }
})

// Update timers
let timeInterval: number | null = null

onMounted(() => {
  timeInterval = window.setInterval(() => {
    const now = new Date()
    missionTime.value = now.toISOString().replace('T', ' ').slice(0, 19)

    // Simulate slight variations in aggregate rate
    aggregateRate.value = 840 + Math.random() * 10

    // Update lane heights
    laneHeights.forEach((_, i) => {
      laneHeights[i] = 20 + Math.random() * 80
    })
  }, 1000)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
})
</script>

<style scoped>
.data-transmission-page {
  min-height: 100vh;
  background-color: #131318;
  color: #e4e1e9;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  display: flex;
  flex-direction: column;
}

.main-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
  height: calc(100vh - 64px);
}

/* TopNavBar */
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: #131318;
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
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
}

.nav-link:hover {
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
  gap: 8px;
}

.icon-btn {
  position: relative;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: #1b1b20;
  color: #e4e1e9;
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
  background: #ffb4ab;
}

/* Side Navigation */
.side-nav {
  width: 256px;
  background: #1b1b20;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  z-index: 40;
  flex-shrink: 0;
  padding-top: 16px;
}

.side-header {
  padding: 0 24px 24px;
}

.side-title {
  font-size: 18px;
  font-weight: 700;
  color: #60a5fa;
  margin: 0 0 4px 0;
}

.side-subtitle {
  font-size: 10px;
  color: #64748b;
  text-transform: uppercase;
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
  padding: 16px 24px;
  color: #64748b;
  text-decoration: none;
  font-size: 13px;
  transition: all 0.2s;
  border-right: 4px solid transparent;
}

.side-link:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #e4e1e9;
}

.side-link.active {
  background: rgba(59, 130, 246, 0.1);
  border-right-color: #60a5fa;
  color: #60a5fa;
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
  background: #0e0e13;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.health-label {
  font-size: 10px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

.health-value {
  display: flex;
  align-items: center;
  gap: 8px;
}

.health-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ae176;
  box-shadow: 0 0 8px rgba(74, 225, 118, 0.5);
}

.health-text {
  font-size: 12px;
  font-family: 'Fira Code', monospace;
  color: #e4e1e9;
}

/* Main Content */
.main-content {
  flex: 1;
  overflow-y: auto;
  background: #131318;
  padding: 32px;
}

.content-wrapper {
  max-width: 1400px;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
}

.header-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #60a5fa;
  font-size: 10px;
  font-family: 'Fira Code', monospace;
  letter-spacing: 0.05em;
}

.tag-icon {
  width: 14px;
  height: 14px;
}

.tag-text {
  text-transform: uppercase;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.page-title .highlight {
  color: #a4c9ff;
}

.header-right {
  display: flex;
  gap: 16px;
}

.status-card {
  background: #1b1b20;
  padding: 16px 20px;
  border-radius: 4px;
  border-left: 2px solid #4ae176;
}

.status-card:last-child {
  border-left-color: #60a5fa;
}

.status-label {
  font-size: 10px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 4px;
}

.status-value {
  font-size: 18px;
  font-family: 'Fira Code', monospace;
  color: #ffffff;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot-green {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ae176;
  box-shadow: 0 0 8px rgba(74, 225, 118, 0.5);
}

.status-text-green {
  font-size: 18px;
  font-family: 'Fira Code', monospace;
  color: #ffffff;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.right-column {
  min-height: 600px;
}

/* Metric Cards Row */
.metrics-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.metric-card {
  background: #1b1b20;
  padding: 24px;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.metric-label {
  font-size: 10px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.metric-icon-bg {
  width: 40px;
  height: 40px;
  color: rgba(255, 255, 255, 0.1);
  position: absolute;
  top: 8px;
  right: 8px;
}

.metric-value-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 16px;
}

.metric-value {
  font-size: 32px;
  font-family: 'Fira Code', monospace;
  color: #ffffff;
}

.metric-unit {
  font-size: 11px;
  color: #64748b;
}

.channel-indicators {
  display: flex;
  gap: 4px;
}

.channel-bar {
  height: 4px;
  flex: 1;
  background: #2a292f;
  border-radius: 2px;
}

.channel-bar.active {
  background: #4ae176;
}

.channel-bar.error {
  background: #ffb4ab;
}

.trend-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: #4ae176;
  font-family: 'Fira Code', monospace;
}

.trend-icon {
  width: 12px;
  height: 12px;
}

.status-text {
  font-size: 10px;
  color: #64748b;
  font-family: 'Fira Code', monospace;
}

/* Storage Section */
.storage-section {
  background: #1b1b20;
  padding: 24px;
  border-radius: 8px;
}

.section-header-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
}

.header-bar {
  width: 4px;
  height: 24px;
  background: #60a5fa;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  flex: 1;
}

.drive-id {
  font-size: 10px;
  color: #64748b;
  font-family: 'Fira Code', monospace;
  padding: 4px 8px;
  background: #2a292f;
  border-radius: 4px;
}

.storage-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 32px;
}

.storage-circle {
  display: flex;
  justify-content: center;
  align-items: center;
}

.circle-container {
  position: relative;
  width: 160px;
  height: 160px;
}

.circle-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.circle-bg {
  fill: none;
  stroke: #2a292f;
  stroke-width: 8;
}

.circle-progress {
  fill: none;
  stroke: #60a5fa;
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.3s;
}

.circle-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.percentage {
  display: block;
  font-size: 28px;
  font-family: 'Fira Code', monospace;
  color: #ffffff;
}

.label {
  font-size: 10px;
  color: #64748b;
  text-transform: uppercase;
}

.storage-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-item {
  background: #131318;
  padding: 16px;
  border-radius: 4px;
  border-bottom: 2px solid #60a5fa;
}

.stat-item.highlight-green {
  border-bottom-color: #4ae176;
}

.stat-item.highlight-red {
  border-bottom-color: #ffb4ab;
}

.stat-label {
  font-size: 10px;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-family: 'Fira Code', monospace;
  color: #ffffff;
}

.stat-value .unit {
  font-size: 14px;
  color: #64748b;
}

.text-green {
  color: #4ae176;
}

.text-red {
  color: #ffb4ab;
}

/* Lane Distribution */
.lane-distribution {
  margin-top: 24px;
}

.lane-header {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #64748b;
  font-family: 'Fira Code', monospace;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.lane-bars {
  display: flex;
  gap: 2px;
  height: 48px;
  align-items: flex-end;
  background: #0e0e13;
  padding: 4px;
  border-radius: 4px;
}

.lane-bar {
  flex: 1;
  background: rgba(164, 201, 255, 0.4);
  border-radius: 1px;
  transition: height 0.3s;
}

/* Command Panel */
.command-panel {
  background: #1b1b20;
  border-radius: 8px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  gap: 12px;
}

.panel-icon {
  width: 20px;
  height: 20px;
  color: #60a5fa;
}

.panel-title {
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.command-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.command-item {
  background: #131318;
  padding: 12px;
  border-radius: 4px;
  border-left: 2px solid #60a5fa;
  font-family: 'Fira Code', monospace;
  font-size: 11px;
}

.command-item.success {
  border-left-color: #4ae176;
}

.command-item.executing {
  border-left-color: #60a5fa;
}

.command-item.rejected {
  border-left-color: #ffb4ab;
  opacity: 0.8;
}

.command-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.command-time {
  color: #64748b;
}

.command-status {
  font-size: 9px;
  padding: 2px 6px;
  border: 1px solid;
}

.command-status.success {
  color: #4ae176;
  border-color: rgba(74, 225, 118, 0.3);
}

.command-status.executing {
  color: #60a5fa;
  border-color: rgba(96, 165, 250, 0.3);
}

.command-status.rejected {
  color: #ffb4ab;
  border-color: rgba(255, 180, 171, 0.3);
  animation: pulse 2s infinite;
}

.command-name {
  color: #ffffff;
  margin-bottom: 4px;
}

.command-params {
  color: #64748b;
  font-size: 9px;
}

.command-progress {
  margin-top: 8px;
}

.progress-bar {
  height: 4px;
  background: #2a292f;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #60a5fa;
  border-radius: 2px;
  transition: width 0.3s;
}

.command-error {
  color: rgba(255, 180, 171, 0.7);
  font-size: 9px;
  margin-top: 4px;
}

.panel-footer {
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-icon {
  width: 14px;
  height: 14px;
  color: #60a5fa;
}

.footer-text {
  font-size: 10px;
  color: #60a5fa;
  font-family: 'Fira Code', monospace;
  animation: pulse 2s infinite;
}

/* Network Flow Section */
.network-flow-section {
  background: #1b1b20;
  border-radius: 8px;
  padding: 24px;
  height: 200px;
  position: relative;
  overflow: hidden;
}

.flow-bg {
  position: absolute;
  inset: 0;
  opacity: 0.2;
}

.flow-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
}

.line-1 {
  top: 50%;
  background: linear-gradient(90deg, transparent, #60a5fa, transparent);
}

.line-2 {
  top: 25%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(74, 225, 118, 0.4), transparent);
}

.line-3 {
  top: 75%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent);
}

.flow-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.flow-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: auto;
}

.flow-title {
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 4px 0;
  text-transform: uppercase;
}

.flow-subtitle {
  font-size: 10px;
  color: #64748b;
  font-family: 'Fira Code', monospace;
  margin: 0;
}

.flow-stats {
  display: flex;
  gap: 24px;
}

.flow-stat {
  text-align: center;
}

.flow-stat .stat-label {
  font-size: 9px;
  color: #64748b;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.flow-stat .stat-value {
  font-size: 20px;
  font-family: 'Fira Code', monospace;
  color: #60a5fa;
}

.flow-stat .stat-value.green {
  color: #4ae176;
}

.flow-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px 0;
}

.flow-icon {
  width: 32px;
  height: 32px;
  color: #60a5fa;
}

.flow-track {
  flex: 1;
  max-width: 400px;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
}

.flow-dot {
  position: absolute;
  top: -4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #60a5fa;
  box-shadow: 0 0 8px rgba(96, 165, 250, 0.5);
}

.flow-dot.dot-1 {
  left: 20%;
}

.flow-dot.dot-2 {
  left: 50%;
  background: #4ae176;
  box-shadow: 0 0 8px rgba(74, 225, 118, 0.5);
}

.flow-dot.dot-3 {
  left: 80%;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Responsive */
@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .right-column {
    min-height: 400px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}

@media (max-width: 1024px) {
  .side-nav {
    display: none;
  }

  .main-nav {
    display: none;
  }

  .metrics-row {
    grid-template-columns: 1fr;
  }

  .storage-content {
    grid-template-columns: 1fr;
  }

  .storage-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
