<template>
  <main class="main-content">
        <div class="content-wrapper">
          <!-- Page Header -->
          <div class="page-header">
            <div class="header-left">
              <h1 class="page-title">任务执行状态监视</h1>
              <p class="page-subtitle">Mission Execution Real-time Telemetry Dashboard</p>
            </div>
            <div class="header-right">
              <div class="utc-label">当前协调世界时 (UTC)</div>
              <div class="utc-time">{{ currentUTC }}</div>
            </div>
          </div>

          <!-- Content Grid -->
          <div class="content-grid">
            <!-- Executing Plan Section -->
            <section class="executing-section">
              <div class="executing-card">
                <div class="executing-header">
                  <div class="executing-title-group">
                    <span class="executing-badge">正在执行</span>
                    <h3 class="executing-title">中继数传任务 - Alpha-7</h3>
                    <p class="executing-uuid">UUID: SAT-XC90-ALPHA-07</p>
                  </div>
                  <div class="executing-timers">
                    <div class="timer-item">
                      <p class="timer-label">已用时长</p>
                      <p class="timer-value">{{ elapsedTime }}</p>
                    </div>
                    <div class="timer-divider"></div>
                    <div class="timer-item">
                      <p class="timer-label">剩余时长</p>
                      <p class="timer-value remaining">{{ remainingTime }}</p>
                    </div>
                  </div>
                </div>

                <div class="progress-section">
                  <div class="progress-labels">
                    <span>13:50:00 (START)</span>
                    <span>{{ progressPercent }}% 完成</span>
                    <span>14:50:00 (END)</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
                    <div class="progress-shimmer"></div>
                  </div>
                </div>

                <div class="metrics-grid">
                  <div class="metric-item">
                    <span class="metric-label-small">链路强度</span>
                    <span class="metric-value-green">-64.2 dBm</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-label-small">传输速率</span>
                    <span class="metric-value-blue">1.2 Gbps</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-label-small">纠错率 (BER)</span>
                    <span class="metric-value-green">10^-9</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-label-small">子系统状态</span>
                    <div class="subsystem-dots">
                      <span class="status-dot-green"></span>
                      <span class="status-dot-green"></span>
                      <span class="status-dot-green"></span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Resource Metrics -->
            <section class="resource-section">
              <div class="resource-card">
                <h4 class="resource-title">关键资源占用</h4>
                <div class="resource-list">
                  <div class="resource-item">
                    <div class="resource-header">
                      <span>天线 A1 (S-BAND)</span>
                      <span class="resource-percent text-blue">85%</span>
                    </div>
                    <div class="resource-bar">
                      <div class="resource-fill blue" style="width: 85%"></div>
                    </div>
                  </div>
                  <div class="resource-item">
                    <div class="resource-header">
                      <span>本地处理器 (HPC-1)</span>
                      <span class="resource-percent text-green">32%</span>
                    </div>
                    <div class="resource-bar">
                      <div class="resource-fill green" style="width: 32%"></div>
                    </div>
                  </div>
                  <div class="resource-item">
                    <div class="resource-header">
                      <span>下行通道 (RF-LINK-03)</span>
                      <span class="resource-percent text-red">92%</span>
                    </div>
                    <div class="resource-bar">
                      <div class="resource-fill red" style="width: 92%"></div>
                    </div>
                  </div>
                </div>
                <div class="bandwidth-section">
                  <div class="bandwidth-row">
                    <span class="bandwidth-label">总带宽负载</span>
                    <span class="bandwidth-value">2.4 TB/S</span>
                  </div>
                </div>
              </div>
            </section>

            <!-- Upcoming Plans -->
            <section class="upcoming-section">
              <div class="plans-card">
                <div class="plans-header">
                  <h4 class="plans-title">待执行计划 ({{ upcomingPlans.length }})</h4>
                  <button class="view-all-btn">查看全部</button>
                </div>
                <div class="plans-table-wrapper">
                  <table class="plans-table">
                    <thead>
                      <tr>
                        <th>任务名称</th>
                        <th>预计开始</th>
                        <th>分配资源</th>
                        <th class="text-right">优先级</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(plan, index) in upcomingPlans" :key="index">
                        <td class="plan-name">{{ plan.name }}</td>
                        <td class="plan-time">{{ plan.time }}</td>
                        <td class="plan-resources">
                          <span class="resource-tag">{{ plan.resources }}</span>
                        </td>
                        <td class="plan-priority text-right">
                          <span :class="['priority-badge', plan.priorityClass]">{{ plan.priority }}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <!-- Completed Plans -->
            <section class="completed-section">
              <div class="completed-card">
                <div class="completed-header">
                  <h4 class="completed-title">已执行计划 (历史日志)</h4>
                  <HistoryIcon class="history-icon" />
                </div>
                <div class="completed-list">
                  <div v-for="(task, index) in completedTasks" :key="index" class="completed-item">
                    <div :class="['status-bar', task.status === '成功' ? 'success' : 'error']"></div>
                    <div class="completed-content">
                      <div class="completed-row">
                        <p class="completed-name">{{ task.name }}</p>
                        <span :class="['completed-status', task.status === '成功' ? 'success' : 'error']">{{ task.status }}</span>
                      </div>
                      <div class="completed-row">
                        <span class="completed-time">{{ task.time }}</span>
                        <span :class="['completed-duration', task.error ? 'error-text' : '']">{{ task.duration }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
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

const HistoryIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('polyline', { points: '12 6 12 12 16 14' })
    ])
  }
}

import { h } from 'vue'

// Data
const currentUTC = ref('2024-10-24 14:32:05')
const elapsedTime = ref('00:42:15')
const remainingTime = ref('00:17:45')
const progressPercent = ref(70)

const upcomingPlans = ref([
  { name: '低轨载荷指令上行 - Beta-2', time: '15:10:00', resources: 'ANT-02, PROC-04', priority: 'HIGH', priorityClass: 'high' },
  { name: '轨道数据修正 - Gamma-11', time: '16:45:30', resources: 'ANT-01, SYNC-B', priority: 'NORMAL', priorityClass: 'normal' },
  { name: '全球成像任务下传 - Zeta-9', time: '18:20:00', resources: 'ANT-04, X-BAND', priority: 'NORMAL', priorityClass: 'normal' }
])

const completedTasks = ref([
  { name: '气象云图数据接收', status: '成功', time: '2024-10-24 12:40', duration: 'DURATION: 15M' },
  { name: '遥测参数例行巡检', status: '失败', time: '2024-10-24 11:15', duration: 'ERROR: L-BAND-SYNC-LOST', error: true },
  { name: '卫星姿态调整指令', status: '成功', time: '2024-10-24 09:30', duration: 'DURATION: 04M' },
  { name: '数传转发加密测试', status: '成功', time: '2024-10-24 08:22', duration: 'DURATION: 20M' }
])

// Update time
let timeInterval: number | null = null

onMounted(() => {
  timeInterval = window.setInterval(() => {
    const now = new Date()
    currentUTC.value = now.toISOString().replace('T', ' ').slice(0, 19)

    // Simulate progress increase
    if (progressPercent.value < 100) {
      progressPercent.value += 0.1
    }
  }, 1000)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
})
</script>

<style scoped>
.task-execution-page {
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
  margin-bottom: 40px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--gs-text-primary);
  margin: 0 0 4px 0;
}

.page-subtitle {
  font-size: 12px;
  color: var(--gs-text-secondary);
  font-family: 'Fira Code', monospace;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.utc-label {
  font-size: 10px;
  color: var(--gs-text-disabled);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 4px;
}

.utc-time {
  font-size: 20px;
  font-family: 'Fira Code', monospace;
  color: var(--gs-primary-main);
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 8fr 4fr;
  grid-template-rows: auto auto;
  gap: 24px;
}

.executing-section {
  grid-column: 1;
  grid-row: 1;
}

.resource-section {
  grid-column: 2;
  grid-row: 1;
}

.upcoming-section {
  grid-column: 1;
  grid-row: 2;
}

.completed-section {
  grid-column: 2;
  grid-row: 2;
}

/* Executing Card */
.executing-card {
  background: var(--gs-bg-paper);
  border-radius: 8px;
  padding: 24px;
  border-left: 4px solid var(--gs-primary-main);
}

.executing-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.executing-title-group {
  flex: 1;
}

.executing-badge {
  display: inline-block;
  background: var(--gs-overlay-medium);
  color: var(--gs-primary-main);
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

.executing-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--gs-text-primary);
  margin: 0 0 4px 0;
}

.executing-uuid {
  font-size: 12px;
  color: var(--gs-text-disabled);
  font-family: 'Fira Code', monospace;
  margin: 0;
}

.executing-timers {
  display: flex;
  align-items: center;
  gap: 16px;
}

.timer-item {
  text-align: right;
}

.timer-label {
  font-size: 10px;
  color: var(--gs-text-disabled);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 4px 0;
}

.timer-value {
  font-size: 18px;
  font-family: 'Fira Code', monospace;
  color: var(--gs-text-primary);
  margin: 0;
}

.timer-value.remaining {
  color: var(--gs-primary-main);
}

.timer-divider {
  width: 1px;
  height: 32px;
  background: var(--gs-overlay-medium);
}

/* Progress Section */
.progress-section {
  margin-bottom: 24px;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  font-family: 'Fira Code', monospace;
  color: var(--gs-text-disabled);
  margin-bottom: 8px;
}

.progress-bar {
  height: 12px;
  background: var(--gs-bg-paper);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: var(--gs-primary-main);
  border-radius: 6px;
  transition: width 1s linear;
}

.progress-shimmer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, var(--gs-overlay-medium), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.metric-item {
  background: var(--gs-bg-paper);
  padding: 16px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.metric-label-small {
  font-size: 10px;
  color: var(--gs-text-disabled);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.metric-value-green {
  font-size: 14px;
  font-family: 'Fira Code', monospace;
  font-weight: 700;
  color: var(--gs-success-main);
}

.metric-value-blue {
  font-size: 14px;
  font-family: 'Fira Code', monospace;
  font-weight: 700;
  color: var(--gs-primary-main);
}

.subsystem-dots {
  display: flex;
  gap: 4px;
}

.status-dot-green {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gs-success-main);
  box-shadow: 0 0 6px var(--gs-glow-success);
}

/* Resource Card */
.resource-card {
  background: var(--gs-bg-paper);
  border-radius: 8px;
  padding: 24px;
  border: 1px solid var(--gs-overlay-light);
  height: 100%;
}

.resource-title {
  font-size: 11px;
  color: var(--gs-text-disabled);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 24px 0;
}

.resource-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

.resource-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.resource-header {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
}

.resource-header span:first-child {
  color: var(--gs-text-primary);
}

.resource-percent {
  font-family: 'Fira Code', monospace;
  font-weight: 700;
}

.text-blue {
  color: var(--gs-primary-main);
}

.text-green {
  color: var(--gs-success-main);
}

.text-red {
  color: var(--gs-error-main);
}

.resource-bar {
  height: 6px;
  background: var(--gs-bg-paper);
  border-radius: 3px;
  overflow: hidden;
}

.resource-fill {
  height: 100%;
  border-radius: 3px;
}

.resource-fill.blue {
  background: var(--gs-primary-main);
}

.resource-fill.green {
  background: var(--gs-success-main);
}

.resource-fill.red {
  background: var(--gs-error-main);
}

.bandwidth-section {
  padding-top: 16px;
  border-top: 1px solid var(--gs-overlay-light);
}

.bandwidth-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bandwidth-label {
  font-size: 11px;
  color: var(--gs-text-secondary);
}

.bandwidth-value {
  font-size: 11px;
  font-family: 'Fira Code', monospace;
  background: var(--gs-bg-paper);
  padding: 4px 8px;
  border-radius: 4px;
  color: var(--gs-text-primary);
}

/* Plans Card */
.plans-card {
  background: var(--gs-bg-paper);
  border-radius: 8px;
  padding: 24px;
  border: 1px solid var(--gs-overlay-light);
}

.plans-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.plans-title {
  font-size: 11px;
  color: var(--gs-text-disabled);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
}

.view-all-btn {
  background: none;
  border: none;
  color: var(--gs-primary-main);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  padding: 0;
}

.view-all-btn:hover {
  text-decoration: underline;
}

.plans-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.plans-table th {
  font-size: 10px;
  color: var(--gs-text-disabled);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 500;
  padding: 12px 0;
  border-bottom: 1px solid var(--gs-overlay-light);
}

.plans-table td {
  padding: 16px 0;
  font-size: 13px;
  border-bottom: 1px solid var(--gs-overlay-light);
}

.plans-table tr:last-child td {
  border-bottom: none;
}

.plan-name {
  color: var(--gs-text-primary);
  font-weight: 600;
}

.plan-time {
  color: var(--gs-text-disabled);
  font-family: 'Fira Code', monospace;
  font-size: 12px;
}

.resource-tag {
  background: var(--gs-bg-paper);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-family: 'Fira Code', monospace;
  color: var(--gs-text-secondary);
}

.priority-badge {
  font-size: 11px;
  font-weight: 700;
}

.priority-badge.high {
  color: var(--gs-warning-main);
}

.priority-badge.normal {
  color: var(--gs-text-disabled);
}

.text-right {
  text-align: right;
}

/* Completed Card */
.completed-card {
  background: var(--gs-bg-paper);
  border-radius: 8px;
  padding: 24px;
  border: 1px solid var(--gs-overlay-light);
}

.completed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.completed-title {
  font-size: 11px;
  color: var(--gs-text-disabled);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
}

.history-icon {
  width: 16px;
  height: 16px;
  color: var(--gs-text-disabled);
  cursor: pointer;
}

.history-icon:hover {
  color: var(--gs-text-primary);
}

.completed-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.completed-item {
  display: flex;
  gap: 12px;
  background: var(--gs-bg-paper);
  padding: 12px;
  border-radius: 6px;
  transition: background 0.2s;
}

.completed-item:hover {
  background: var(--gs-bg-paper);
}

.status-bar {
  width: 4px;
  border-radius: 2px;
  flex-shrink: 0;
}

.status-bar.success {
  background: var(--gs-success-main);
  box-shadow: 0 0 6px var(--gs-glow-success);
}

.status-bar.error {
  background: var(--gs-error-main);
  box-shadow: 0 0 6px var(--gs-glow-error);
}

.completed-content {
  flex: 1;
}

.completed-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.completed-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--gs-text-primary);
  margin: 0;
}

.completed-status {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.completed-status.success {
  color: var(--gs-success-main);
}

.completed-status.error {
  color: var(--gs-error-main);
}

.completed-time {
  font-size: 10px;
  color: var(--gs-text-disabled);
  font-family: 'Fira Code', monospace;
}

.completed-duration {
  font-size: 10px;
  color: var(--gs-text-disabled);
  font-family: 'Fira Code', monospace;
}

.completed-duration.error-text {
  color: color-mix(in srgb, var(--gs-error-main), transparent 30%);
}

/* Responsive */
@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .executing-section,
  .resource-section,
  .upcoming-section,
  .completed-section {
    grid-column: 1;
    grid-row: auto;
  }

  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1024px) {
  .side-nav {
    display: none;
  }

  .main-nav {
    display: none;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .executing-header {
    flex-direction: column;
    gap: 16px;
  }

  .executing-timers {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
