<template>
  <main class="main-content">
        <div class="content-wrapper">
          <!-- Header Section -->
          <div class="page-header">
            <div class="header-left">
              <div class="header-tag">
                <span class="pulse-dot"></span>
                <span class="tag-text">中继数传监视中心</span>
              </div>
              <h1 class="page-title">当前执行任务: 中继数传透传任务 - Alpha-7</h1>
            </div>
            <div class="header-right">
              <div class="resource-card">
                <span class="resource-label">使用资源</span>
                <span class="resource-value">Antenna-01, Baseband-03, HPA-02, Rec-01</span>
              </div>
            </div>
          </div>

          <!-- Links Grid -->
          <div class="links-grid">
            <!-- Forward Link Section -->
            <section class="link-section">
              <div class="section-header">
                <UploadIcon class="section-icon" />
                <h2 class="section-title">前向中继链路 (Forward Relay Link)</h2>
              </div>
              <div class="section-content">
                <div class="metric-card large">
                  <div class="metric-header">
                    <span class="metric-label">上行发射频率</span>
                    <AntennaIcon class="metric-icon" />
                  </div>
                  <div class="metric-value-row">
                    <span class="metric-value">2025.4500</span>
                    <span class="metric-unit">MHz</span>
                  </div>
                </div>
                <div class="metrics-row">
                  <div class="metric-card">
                    <div class="metric-label-small">通道增益</div>
                    <div class="metric-value-row">
                      <span class="metric-value">45.2</span>
                      <span class="metric-unit">dB</span>
                    </div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-label-small">功放输出功率</div>
                    <div class="metric-value-row">
                      <span class="metric-value">150.8</span>
                      <span class="metric-unit">W</span>
                    </div>
                  </div>
                </div>
                <div class="status-table">
                  <div class="status-row">
                    <span class="status-label">中继转发情况</span>
                    <div class="status-value">
                      <span class="status-text success">转发正常</span>
                      <span class="status-dot success"></span>
                    </div>
                  </div>
                  <div class="status-row">
                    <span class="status-label">透传调制锁定</span>
                    <div class="status-value">
                      <span class="status-text success">QPSK 锁定</span>
                      <span class="status-dot success"></span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Return Link Section -->
            <section class="link-section">
              <div class="section-header">
                <DownloadIcon class="section-icon secondary" />
                <h2 class="section-title">返向中继链路 (Return Relay Link)</h2>
              </div>
              <div class="section-content">
                <div class="metric-card large">
                  <div class="metric-header">
                    <span class="metric-label">下行接收频率</span>
                    <RadarIcon class="metric-icon secondary" />
                  </div>
                  <div class="metric-value-row">
                    <span class="metric-value">2245.1200</span>
                    <span class="metric-unit">MHz</span>
                  </div>
                </div>
                <div class="metrics-row three">
                  <div class="metric-card">
                    <div class="metric-label-small">接收增益</div>
                    <div class="metric-value-row">
                      <span class="metric-value">52.8</span>
                      <span class="metric-unit">dB</span>
                    </div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-label-small">接收电平</div>
                    <div class="metric-value-row">
                      <span class="metric-value">-102</span>
                      <span class="metric-unit">dBm</span>
                    </div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-label-small">Eb/N0</div>
                    <div class="metric-value-row">
                      <span class="metric-value">14.6</span>
                      <span class="metric-unit">dB</span>
                    </div>
                  </div>
                </div>
                <div class="status-table">
                  <div class="status-row">
                    <span class="status-label">透传基带锁定</span>
                    <div class="status-value">
                      <span class="status-text success">载波锁定</span>
                      <span class="status-dot success"></span>
                    </div>
                  </div>
                  <div class="status-row">
                    <span class="status-label">数传存储情况</span>
                    <div class="status-value">
                      <span class="status-text success">已存储 (85%)</span>
                      <span class="status-dot success"></span>
                    </div>
                  </div>
                  <div class="status-row">
                    <span class="status-label">数据落盘分发</span>
                    <div class="status-value">
                      <span class="status-text error">分发中断</span>
                      <span class="status-dot error"></span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- Task Info List Section -->
          <section class="task-list-section">
            <div class="section-header">
              <ListIcon class="section-icon" />
              <h2 class="section-title">实时任务信息列表</h2>
            </div>
            <div class="task-table-wrapper">
              <table class="task-table">
                <thead>
                  <tr>
                    <th>任务名称</th>
                    <th>执行时间</th>
                    <th>资源分配</th>
                    <th>参数宏</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(task, index) in tasks" :key="index" :class="{ active: task.active }">
                    <td class="task-name">{{ task.name }}</td>
                    <td class="task-time">{{ task.time }}</td>
                    <td class="task-resources">{{ task.resources }}</td>
                    <td class="task-macro">{{ task.macro }}</td>
                    <td class="task-status">
                      <div class="status-cell">
                        <span v-if="task.active" class="status-pulse"></span>
                        <span :class="['status-badge', task.statusClass]">{{ task.status }}</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- System Visual Footer -->
          <footer class="system-footer">
            <div class="footer-item">
              <div class="footer-bar primary"></div>
              <div class="footer-content">
                <div class="footer-label">总透传下行流量</div>
                <div class="footer-value">14.2 GB</div>
              </div>
            </div>
            <div class="footer-item">
              <div class="footer-bar tertiary"></div>
              <div class="footer-content">
                <div class="footer-label">存储剩余空间</div>
                <div class="footer-value">82%</div>
              </div>
            </div>
            <div class="footer-item">
              <div class="footer-bar secondary"></div>
              <div class="footer-content">
                <div class="footer-label">本地时间 (UTC+8)</div>
                <div class="footer-value">{{ currentTime }}</div>
              </div>
            </div>
          </footer>
        </div>
      </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
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

const UploadIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
      h('polyline', { points: '17 8 12 3 7 8' }),
      h('line', { x1: '12', y1: '3', x2: '12', y2: '15' })
    ])
  }
}

const DownloadIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
      h('polyline', { points: '7 10 12 15 17 10' }),
      h('line', { x1: '12', y1: '15', x2: '12', y2: '3' })
    ])
  }
}

const RadarIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('circle', { cx: '12', cy: '12', r: '6' }),
      h('circle', { cx: '12', cy: '12', r: '2' }),
      h('line', { x1: '12', y1: '2', x2: '12', y2: '4' })
    ])
  }
}

const ListIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('line', { x1: '8', y1: '6', x2: '21', y2: '6' }),
      h('line', { x1: '8', y1: '12', x2: '21', y2: '12' }),
      h('line', { x1: '8', y1: '18', x2: '21', y2: '18' }),
      h('line', { x1: '3', y1: '6', x2: '3.01', y2: '6' }),
      h('line', { x1: '3', y1: '12', x2: '3.01', y2: '12' }),
      h('line', { x1: '3', y1: '18', x2: '3.01', y2: '18' })
    ])
  }
}

import { h } from 'vue'

// Tasks data
const tasks = ref([
  { name: '中继数传透传任务 - Alpha-7', time: '2023-11-20 14:20:00', resources: 'ANT-01, BB-03, HPA-02', macro: 'MCR_7A_L_BAND', status: '执行中', statusClass: 'running', active: true },
  { name: '用户星下行透传 - Beta-12', time: '2023-11-20 15:45:00', resources: 'ANT-02, BB-01, HPA-01', macro: 'EMG_X_STD', status: '待执行', statusClass: 'pending', active: false },
  { name: '多波束数传并发 - Gamma-4', time: '2023-11-20 16:30:00', resources: 'ANT-01, BB-04, HPA-02', macro: 'TRK_S_BAND_V2', status: '待执行', statusClass: 'pending', active: false }
])

// Current time
const currentTime = ref('22:12:45')

// Update time
let timeInterval: number | null = null

onMounted(() => {
  timeInterval = window.setInterval(() => {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    currentTime.value = `${hours}:${minutes}:${seconds}`
  }, 1000)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
})
</script>

<style scoped>
.task-status-page {
  min-height: 100vh;
  background-color: var(--gs-bg-default);
  color: var(--gs-text-primary);
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
  background: var(--gs-bg-default);
  border-bottom: 1px solid var(--gs-overlay-light);
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
  color: var(--gs-primary-main);
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

.nav-link:hover {
  color: var(--gs-text-primary);
}

.nav-link.active {
  color: var(--gs-primary-main);
  border-bottom-color: var(--gs-primary-main);
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
  color: var(--gs-text-secondary);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: var(--gs-bg-paper);
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

/* Side Navigation */
.side-nav {
  width: 256px;
  background: var(--gs-bg-paper);
  border-right: 1px solid var(--gs-overlay-light);
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
  color: var(--gs-primary-main);
  margin: 0 0 4px 0;
}

.side-subtitle {
  font-size: 10px;
  color: var(--gs-text-disabled);
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
  color: var(--gs-text-disabled);
  text-decoration: none;
  font-size: 13px;
  transition: all 0.2s;
  border-right: 4px solid transparent;
}

.side-link:hover {
  background: var(--gs-overlay-light);
  color: var(--gs-text-primary);
}

.side-link.active {
  background: var(--gs-overlay-light);
  border-right-color: var(--gs-primary-main);
  color: var(--gs-primary-main);
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
  border: 1px solid var(--gs-overlay-light);
}

.health-label {
  font-size: 10px;
  color: var(--gs-text-disabled);
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
  background: var(--gs-success-main);
  box-shadow: 0 0 8px var(--gs-glow-success);
}

.health-text {
  font-size: 12px;
  font-family: 'Fira Code', monospace;
  color: var(--gs-text-primary);
}

/* Main Content */
.main-content {
  flex: 1;
  overflow-y: auto;
  background: var(--gs-bg-default);
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
  margin-bottom: 32px;
}

.header-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gs-primary-main);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.tag-text {
  font-size: 11px;
  font-weight: 700;
  color: var(--gs-primary-main);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--gs-text-primary);
  margin: 0;
}

.resource-card {
  background: var(--gs-bg-paper);
  border: 1px solid var(--gs-border-main);
  padding: 16px 24px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.resource-label {
  font-size: 10px;
  color: var(--gs-text-disabled);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.resource-value {
  font-size: 13px;
  font-family: 'Fira Code', monospace;
  color: var(--gs-primary-main);
}

/* Links Grid */
.links-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
}

.link-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--gs-border-main);
}

.section-icon {
  width: 20px;
  height: 20px;
  color: var(--gs-primary-main);
}

.section-icon.secondary {
  color: var(--gs-primary-main);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--gs-text-primary);
  margin: 0;
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Metric Cards */
.metric-card {
  background: var(--gs-bg-paper);
  border: 1px solid var(--gs-border-main);
  padding: 20px;
  border-radius: 12px;
  transition: all 0.3s;
}

.metric-card:hover {
  border-color: var(--gs-glow-primary);
}

.metric-card.large {
  padding: 24px;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.metric-label {
  font-size: 12px;
  color: var(--gs-text-disabled);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.metric-icon {
  width: 16px;
  height: 16px;
  color: var(--gs-primary-main);
}

.metric-icon.secondary {
  color: var(--gs-primary-main);
}

.metric-value-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.metric-value {
  font-size: 28px;
  font-family: 'Fira Code', monospace;
  color: var(--gs-text-primary);
}

.metric-unit {
  font-size: 12px;
  color: var(--gs-text-disabled);
}

.metric-label-small {
  font-size: 10px;
  color: var(--gs-text-disabled);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
}

.metrics-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.metrics-row.three {
  grid-template-columns: 1fr 1fr 1fr;
}

/* Status Table */
.status-table {
  background: var(--gs-bg-paper);
  border: 1px solid var(--gs-border-main);
  border-radius: 12px;
  overflow: hidden;
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid var(--gs-border-main);
}

.status-row:last-child {
  border-bottom: none;
}

.status-label {
  font-size: 13px;
  color: var(--gs-text-secondary);
}

.status-value {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-text {
  font-size: 11px;
  font-family: 'Fira Code', monospace;
}

.status-text.success {
  color: var(--gs-success-main);
}

.status-text.error {
  color: var(--gs-error-main);
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.status-dot.success {
  background: var(--gs-success-main);
  box-shadow: 0 0 8px var(--gs-glow-success);
}

.status-dot.error {
  background: var(--gs-error-main);
  box-shadow: 0 0 8px var(--gs-glow-error);
}

/* Task List Section */
.task-list-section {
  margin-bottom: 32px;
}

.task-table-wrapper {
  background: var(--gs-bg-paper);
  border: 1px solid var(--gs-border-main);
  border-radius: 12px;
  overflow: hidden;
}

.task-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.task-table th {
  font-size: 10px;
  font-weight: 700;
  color: var(--gs-text-disabled);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 16px 24px;
  background: var(--gs-bg-paper);
  border-bottom: 1px solid var(--gs-border-main);
}

.task-table td {
  padding: 20px 24px;
  border-bottom: 1px solid var(--gs-border-main);
  font-size: 13px;
}

.task-table tr {
  cursor: pointer;
  transition: background 0.2s;
}

.task-table tr:hover {
  background: var(--gs-overlay-light);
}

.task-table tr.active {
  background: var(--gs-overlay-light);
  border-left: 4px solid var(--gs-primary-main);
}

.task-name {
  font-weight: 600;
  color: var(--gs-text-primary);
}

.task-time {
  font-family: 'Fira Code', monospace;
  color: var(--gs-text-primary);
}

.task-resources {
  font-size: 11px;
  color: var(--gs-text-secondary);
}

.task-macro {
  font-family: 'Fira Code', monospace;
  font-size: 11px;
  color: var(--gs-primary-main);
}

.status-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gs-success-main);
  animation: pulse 2s infinite;
}

.status-badge {
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 4px;
}

.status-badge.running {
  color: var(--gs-success-main);
}

.status-badge.pending {
  color: var(--gs-text-secondary);
}

/* System Footer */
.system-footer {
  display: flex;
  gap: 48px;
  padding-top: 32px;
  border-top: 1px solid var(--gs-overlay-light);
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-bar {
  width: 4px;
  height: 32px;
  border-radius: 2px;
}

.footer-bar.primary {
  background: var(--gs-primary-main);
}

.footer-bar.tertiary {
  background: var(--gs-success-main);
}

.footer-bar.secondary {
  background: var(--gs-primary-main);
}

.footer-label {
  font-size: 10px;
  color: var(--gs-text-disabled);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 4px;
}

.footer-value {
  font-size: 18px;
  font-family: 'Fira Code', monospace;
  color: var(--gs-text-primary);
}

/* Responsive */
@media (max-width: 1200px) {
  .links-grid {
    grid-template-columns: 1fr;
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

  .metrics-row.three {
    grid-template-columns: 1fr;
  }
}
</style>