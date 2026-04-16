<template>
  <main class="main-content">
        <div class="content-wrapper">
          <!-- Header Stats -->
          <div class="stats-grid">
            <div class="stat-card">
              <div>
                <p class="stat-label">总文件数</p>
                <h3 class="stat-value primary">14,282</h3>
              </div>
              <DatabaseIcon class="stat-icon primary" />
            </div>
            <div class="stat-card">
              <div>
                <p class="stat-label">用户匹配数</p>
                <h3 class="stat-value tertiary">856</h3>
              </div>
              <GroupIcon class="stat-icon tertiary" />
            </div>
            <div class="stat-card">
              <div>
                <p class="stat-label">今日下载量</p>
                <h3 class="stat-value secondary">2.4 TB</h3>
              </div>
              <CloudDownloadIcon class="stat-icon secondary" />
            </div>
          </div>

          <!-- File List -->
          <div class="panel file-list-panel">
            <div class="panel-header">
              <div class="panel-title-group">
                <ListIcon class="panel-icon" />
                <h4 class="panel-title">可下载文件列表</h4>
              </div>
              <div class="panel-actions">
                <input v-model="searchKeyword" class="search-input" placeholder="搜索文件名..." type="text" />
                <button class="btn-primary" @click="refreshDirectory">
                  <span>刷新目录</span>
                </button>
              </div>
            </div>
            <div class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>文件名</th>
                    <th>大小</th>
                    <th>所属用户</th>
                    <th>更新时间</th>
                    <th>操作计划</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(file, index) in filteredFiles" :key="index">
                    <td>
                      <div class="file-name-cell">
                        <component :is="file.iconComponent" class="file-icon" :class="file.iconColor" />
                        <span class="file-name">{{ file.name }}</span>
                      </div>
                    </td>
                    <td class="mono-cell">{{ file.size }}</td>
                    <td>{{ file.owner }}</td>
                    <td class="mono-cell dim">{{ file.updatedAt }}</td>
                    <td class="mono-cell dim">{{ file.plan }}</td>
                    <td>
                      <button class="link-btn" @click="downloadFile(file)">下载</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Monitoring -->
          <div class="panel monitor-panel">
            <div class="panel-header">
              <div class="panel-title-group">
                <MonitoringIcon class="panel-icon tertiary" />
                <h4 class="panel-title">实时传输监控</h4>
              </div>
              <div class="panel-meta">
                <span class="meta-item">
                  <span class="meta-dot tertiary"></span>
                  活动中 (2)
                </span>
                <span class="meta-item">
                  <span class="meta-dot neutral"></span>
                  等待中 (0)
                </span>
              </div>
            </div>
            <div class="monitor-body">
              <div v-for="(transfer, index) in transfers" :key="index" class="transfer-item">
                <div class="transfer-info">
                  <div class="transfer-file">
                    <SyncIcon class="transfer-icon" />
                    <div>
                      <p class="transfer-name">{{ transfer.name }}</p>
                      <p class="transfer-target">目标地址: {{ transfer.target }}</p>
                    </div>
                  </div>
                  <div class="transfer-stats">
                    <span class="transfer-speed">{{ transfer.speed }}</span>
                    <p class="transfer-progress-text">{{ transfer.progressText }}</p>
                  </div>
                </div>
                <div class="progress-bar">
                  <div class="progress-track">
                    <div class="progress-fill" :style="{ width: transfer.percent + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { h } from 'vue'
import UserIcon from '@/components/icons/UserIcon.vue'

const router = useRouter()

// Icons
const SettingsIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '3' }),
      h('path', { d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09A1.65 1.65 0 0 0 21 12z' })
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

const FolderIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z' })
    ])
  }
}

const DatabaseIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('ellipse', { cx: '12', cy: '5', rx: '9', ry: '3' }),
      h('path', { d: 'M21 12c0 1.66-4 3-9 3s-9-1.34-9-3' }),
      h('path', { d: 'M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5' })
    ])
  }
}

const GroupIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' }),
      h('circle', { cx: '9', cy: '7', r: '4' }),
      h('path', { d: 'M23 21v-2a4 4 0 0 0-3-3.87' }),
      h('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' })
    ])
  }
}

const CloudDownloadIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M19 18a5 5 0 0 0 0-10A6 6 0 0 0 6 9a5 5 0 0 0 0 10' }),
      h('polyline', { points: '8 14 12 18 16 14' }),
      h('line', { x1: '12', y1: '18', x2: '12', y2: '9' })
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

const MonitoringIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M12 20v-6M6 20V10M18 20V4' })
    ])
  }
}

const SyncIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('polyline', { points: '23 4 23 10 17 10' }),
      h('polyline', { points: '1 20 1 14 7 14' }),
      h('path', { d: 'M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15' })
    ])
  }
}

const FileDescriptionIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
      h('polyline', { points: '14 2 14 8 20 8' }),
      h('line', { x1: '16', y1: '13', x2: '8', y2: '13' }),
      h('line', { x1: '16', y1: '17', x2: '8', y2: '17' }),
      h('polyline', { points: '10 9 9 9 8 9' })
    ])
  }
}

const FileAnalyticsIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
      h('polyline', { points: '14 2 14 8 20 8' }),
      h('path', { d: 'M16 13l-4 4-4-4' }),
      h('line', { x1: '12', y1: '17', x2: '12', y2: '9' })
    ])
  }
}

const FileArchiveIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('polyline', { points: '21 8 21 21 3 21 3 8' }),
      h('rect', { x: '1', y: '3', width: '22', height: '5' }),
      h('line', { x1: '10', y1: '12', x2: '14', y2: '12' })
    ])
  }
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/')
}

const searchKeyword = ref('')

const files = ref([
  { name: 'MISSION_PLAN_V24_08.dat', size: '1.2 MB', owner: 'Operator_Alpha', updatedAt: '2024-05-20 14:20:01', plan: 'LEO_TRACK_01', iconComponent: FileDescriptionIcon, iconColor: 'blue' },
  { name: 'TELEMETRY_RAW_DUMP_0520.dat', size: '450.8 MB', owner: 'Station_Master', updatedAt: '2024-05-20 13:45:12', plan: 'GEO_STATION_KEEP', iconComponent: FileAnalyticsIcon, iconColor: 'amber' },
  { name: 'RECOVERY_LOG_SYS_ADMIN.dat', size: '14.2 GB', owner: 'Admin_Root', updatedAt: '2024-05-19 23:10:59', plan: 'EMERGENCY_DUMP', iconComponent: FileArchiveIcon, iconColor: 'purple' },
  { name: 'ORBIT_CALC_MATRIX_REPT.dat', size: '4.2 MB', owner: 'Analyst_Beta', updatedAt: '2024-05-19 18:00:00', plan: 'LEO_TRACK_01', iconComponent: FileDescriptionIcon, iconColor: 'blue' }
])

const filteredFiles = computed(() => {
  if (!searchKeyword.value) return files.value
  return files.value.filter(f => f.name.toLowerCase().includes(searchKeyword.value.toLowerCase()))
})

const refreshDirectory = () => {
  alert('目录已刷新')
}

const downloadFile = (file: any) => {
  alert('开始下载: ' + file.name)
}

const transfers = ref([
  { name: 'ANTENNA_RX_BUFF_722.tmp', target: '/mnt/data/storage/node_01', speed: '78.4 MB/s', percent: 65, progressText: '65% / 1.2 GB' },
  { name: 'METEO_SAT_IMG_L2.raw', target: '/mnt/archive/vis_processor', speed: '142.0 MB/s', percent: 22, progressText: '22% / 8.4 GB' }
])
</script>

<style scoped>
.file-transfer-page {
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
  margin-top: 64px;
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
  width: 260px;
  background: var(--gs-bg-paper);
  border-right: 1px solid var(--gs-overlay-light);
  display: flex;
  flex-direction: column;
  z-index: 40;
  flex-shrink: 0;
  padding-top: 16px;
}

.side-header {
  padding: 8px 24px 24px;
}

.side-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--gs-text-primary);
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
}

.side-subtitle {
  font-size: 10px;
  color: var(--gs-primary-main);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin: 4px 0 0 0;
  opacity: 0.7;
}

.side-menu {
  display: flex;
  flex-direction: column;
  padding: 0 8px;
  gap: 2px;
}

.side-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: var(--gs-text-disabled);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s;
  border-radius: 4px;
  border-left: 4px solid transparent;
}

.side-link:hover {
  background: var(--gs-overlay-light);
  color: var(--gs-text-primary);
}

.side-link.active {
  background: var(--gs-overlay-light);
  border-left-color: var(--gs-primary-main);
  color: var(--gs-primary-main);
  font-weight: 600;
}

.side-icon {
  width: 20px;
  height: 20px;
}

.side-footer {
  margin-top: auto;
  padding: 16px 24px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: var(--gs-bg-paper);
  border-radius: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gs-success-main);
  animation: pulse 2s infinite;
  box-shadow: 0 0 8px var(--gs-glow-success);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-text {
  font-size: 10px;
  font-family: 'Fira Code', monospace;
  color: var(--gs-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Main Content */
.main-content {
  flex: 1;
  overflow-y: auto;
  background: var(--gs-bg-default);
  padding: 32px;
}

.content-wrapper {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.stat-card {
  background: var(--gs-bg-paper);
  border: 1px solid var(--gs-overlay-light);
  border-radius: 8px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;
}

.stat-card:hover {
  background: var(--gs-bg-paper);
}

.stat-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--gs-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 8px 0;
}

.stat-value {
  font-size: 28px;
  font-family: 'Fira Code', monospace;
  font-weight: 700;
  margin: 0;
}

.stat-value.primary {
  color: var(--gs-primary-main);
}

.stat-value.tertiary {
  color: var(--gs-success-main);
}

.stat-value.secondary {
  color: var(--gs-primary-main);
}

.stat-icon {
  width: 48px;
  height: 48px;
  transition: transform 0.2s;
}

.stat-card:hover .stat-icon {
  transform: scale(1.1);
}

.stat-icon.primary {
  color: var(--gs-overlay-medium);
}

.stat-icon.tertiary {
  color: var(--gs-overlay-medium);
}

.stat-icon.secondary {
  color: var(--gs-overlay-medium);
}

/* Panels */
.panel {
  background: var(--gs-bg-paper);
  border: 1px solid var(--gs-overlay-light);
  border-radius: 8px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: var(--gs-bg-paper);
  border-bottom: 1px solid var(--gs-overlay-light);
}

.panel-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.panel-icon {
  width: 18px;
  height: 18px;
  color: var(--gs-primary-main);
}

.panel-icon.tertiary {
  color: var(--gs-success-main);
}

.panel-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--gs-text-primary);
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
}

.panel-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-input {
  width: 240px;
  padding: 8px 14px;
  background: var(--gs-bg-paper);
  border: 1px solid var(--gs-overlay-light);
  border-radius: 4px;
  color: var(--gs-text-primary);
  font-size: 12px;
  outline: none;
  transition: all 0.2s;
}

.search-input:focus {
  border-color: var(--gs-primary-main);
  box-shadow: 0 0 0 1px var(--gs-overlay-medium);
}

.btn-primary {
  padding: 8px 16px;
  background: var(--gs-primary-main);
  border: none;
  border-radius: 4px;
  color: var(--gs-bg-paper);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  box-shadow: 0 0 15px var(--gs-glow-primary);
}

/* Table */
.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 13px;
}

.data-table th {
  font-size: 10px;
  font-weight: 500;
  color: var(--gs-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 14px 24px;
  background: color-mix(in srgb, var(--gs-bg-paper), transparent 50%);
  white-space: nowrap;
}

.data-table td {
  padding: 16px 24px;
  border-bottom: 1px solid var(--gs-overlay-light);
}

.data-table tbody tr {
  transition: background 0.2s;
}

.data-table tbody tr:hover {
  background: var(--gs-overlay-light);
}

.file-name-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-icon {
  width: 18px;
  height: 18px;
}

.file-icon.blue {
  color: var(--gs-primary-main);
}

.file-icon.amber {
  color: var(--gs-warning-main);
}

.file-icon.purple {
  color: var(--gs-primary-main);
}

.file-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--gs-text-primary);
}

.mono-cell {
  font-family: 'Fira Code', monospace;
  font-size: 11px;
}

.mono-cell.dim {
  color: var(--gs-text-secondary);
}

.link-btn {
  background: none;
  border: none;
  color: var(--gs-primary-main);
  font-size: 12px;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
}

.link-btn:hover {
  color: var(--gs-primary-main);
}

/* Monitor Panel */
.panel-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-family: 'Fira Code', monospace;
  color: var(--gs-text-secondary);
}

.meta-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.meta-dot.tertiary {
  background: var(--gs-success-main);
}

.meta-dot.neutral {
  background: var(--gs-text-disabled);
}

.monitor-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.transfer-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.transfer-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.transfer-file {
  display: flex;
  align-items: center;
  gap: 16px;
}

.transfer-icon {
  width: 20px;
  height: 20px;
  color: var(--gs-primary-main);
}

.transfer-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--gs-text-primary);
  margin: 0 0 2px 0;
}

.transfer-target {
  font-size: 10px;
  color: var(--gs-text-secondary);
  margin: 0;
  font-family: 'Fira Code', monospace;
}

.transfer-stats {
  text-align: right;
}

.transfer-speed {
  font-size: 12px;
  font-family: 'Fira Code', monospace;
  color: var(--gs-success-main);
}

.transfer-progress-text {
  font-size: 10px;
  color: var(--gs-text-secondary);
  margin: 2px 0 0 0;
  font-family: 'Fira Code', monospace;
}

.progress-bar {
  width: 100%;
}

.progress-track {
  height: 4px;
  background: var(--gs-bg-paper);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--gs-success-main);
  border-radius: 2px;
  box-shadow: 0 0 8px var(--gs-glow-success);
}
</style>
