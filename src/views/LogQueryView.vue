<template>
  <main class="main-content">
        <div class="content-wrapper">
          <!-- Header Section -->
          <div class="page-header">
            <div class="header-left">
              <h1 class="page-title">日志查询与分析终端</h1>
              <p class="page-subtitle">系统运行日志检索与多维数据统计</p>
            </div>
            <div class="header-right">
              <button class="btn-secondary">
                <ReportIcon class="btn-icon" />
                <span>生成报表</span>
              </button>
              <button class="btn-secondary">
                <PrintIcon class="btn-icon" />
                <span>打印输出</span>
              </button>
              <button class="btn-primary">
                <DownloadIcon class="btn-icon" />
                <span>导出数据</span>
              </button>
            </div>
          </div>

          <!-- Search Filters -->
          <section class="search-panel">
            <div class="search-grid">
              <div class="search-field">
                <label class="field-label">日志类型</label>
                <select v-model="filters.type" class="field-input">
                  <option value="">全部类型</option>
                  <option value="system">系统日志</option>
                  <option value="operation">操作日志</option>
                  <option value="device">设备状态</option>
                  <option value="command">控制命令</option>
                  <option value="alarm">故障告警</option>
                </select>
              </div>
              <div class="search-field">
                <label class="field-label">时间范围</label>
                <input v-model="filters.date" class="field-input" type="date" />
              </div>
              <div class="search-field">
                <label class="field-label">设备选择</label>
                <select v-model="filters.device" class="field-input">
                  <option value="">全部设备</option>
                  <option value="antenna">天线伺服 A1</option>
                  <option value="baseband">数传基带 B1</option>
                  <option value="rf">射频前端 C1</option>
                </select>
              </div>
              <div class="search-field">
                <label class="field-label">关键字检索</label>
                <input v-model="filters.keyword" class="field-input" placeholder="输入关键字..." type="text" />
              </div>
              <div class="search-field search-action">
                <button class="btn-query" @click="executeQuery">
                  执行检索 / QUERY
                </button>
              </div>
            </div>
          </section>

          <!-- Analytics Grid -->
          <div class="analytics-grid">
            <!-- Frequency Chart -->
            <div class="panel chart-panel">
              <div class="chart-header">
                <div>
                  <span class="panel-subtitle">REAL-TIME TELEMETRY</span>
                  <h3 class="panel-title">实时日志频率分布 (24H)</h3>
                </div>
                <div class="chart-legend">
                  <div class="legend-item">
                    <span class="legend-dot primary"></span>
                    <span class="legend-text">正常 (NORMAL)</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-dot error"></span>
                    <span class="legend-text">告警 (ALARM)</span>
                  </div>
                </div>
              </div>
              <div class="chart-body">
                <div class="chart-bars">
                  <div
                    v-for="(bar, index) in chartBars"
                    :key="index"
                    :class="['chart-bar', bar.type]"
                    :style="{ height: bar.height + '%' }"
                  ></div>
                </div>
              </div>
              <div class="chart-footer">
                <span class="chart-label">00:00</span>
                <span class="chart-label">06:00</span>
                <span class="chart-label">12:00</span>
                <span class="chart-label">18:00</span>
                <span class="chart-label">23:59</span>
              </div>
            </div>

            <!-- Distribution Statistics -->
            <div class="panel stats-panel">
              <div>
                <span class="panel-subtitle">STATUS BREAKDOWN</span>
                <h3 class="panel-title">日志类型占比统计</h3>
              </div>
              <div class="stats-list">
                <div v-for="(stat, index) in typeStats" :key="index" class="stat-item">
                  <div class="stat-header">
                    <span class="stat-name">{{ stat.name }}</span>
                    <span :class="['stat-value', stat.colorClass]">{{ stat.value }}%</span>
                  </div>
                  <div class="stat-bar">
                    <div :class="['stat-progress', stat.colorClass]" :style="{ width: stat.value + '%' }"></div>
                  </div>
                </div>
              </div>
              <div class="stats-footer">
                <CheckCircleIcon class="status-icon" />
                <span class="status-text">数据库同步: 正常 (DATABASE_SYNC: NOMINAL)</span>
              </div>
            </div>
          </div>

          <!-- Log Results Table -->
          <section class="panel result-panel">
            <div class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>时间戳 / TIMESTAMP</th>
                    <th>信息类型</th>
                    <th>来源分机</th>
                    <th>日志内容 / 数据负载</th>
                    <th class="text-right">状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(log, index) in logResults" :key="index">
                    <td class="time-cell">{{ log.time }}</td>
                    <td>
                      <span :class="['type-badge', log.typeClass]">{{ log.type }}</span>
                    </td>
                    <td class="device-cell">{{ log.source }}</td>
                    <td :class="['content-cell', log.contentClass]">{{ log.content }}</td>
                    <td class="text-right">
                      <span :class="['result-badge', log.statusClass]">
                        <span :class="['result-dot', log.statusClass]"></span>
                        {{ log.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div class="pagination-bar">
              <span class="page-info">第 {{ currentPage }} 页，共 {{ totalPages }} 页 / 显示 {{ pageSize }} 条记录</span>
              <div class="page-controls">
                <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">
                  <ChevronLeftIcon class="page-icon" />
                </button>
                <div class="page-numbers">
                  <button
                    v-for="p in visiblePages"
                    :key="p"
                    :class="['page-number', { active: p === currentPage }]"
                    @click="currentPage = p"
                  >
                    {{ p }}
                  </button>
                </div>
                <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">
                  <ChevronRightIcon class="page-icon" />
                </button>
              </div>
            </div>
          </section>
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

const DocIcon = {
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

const SearchIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '11', cy: '11', r: '8' }),
      h('line', { x1: '21', y1: '21', x2: '16.65', y2: '16.65' })
    ])
  }
}

const ReportIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
      h('polyline', { points: '14 2 14 8 20 8' }),
      h('line', { x1: '16', y1: '13', x2: '8', y2: '13' }),
      h('line', { x1: '16', y1: '17', x2: '8', y2: '17' }),
      h('line', { x1: '10', y1: '9', x2: '8', y2: '9' })
    ])
  }
}

const PrintIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('polyline', { points: '6 9 6 2 18 2 18 9' }),
      h('path', { d: 'M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2' }),
      h('rect', { x: '6', y: '14', width: '12', height: '8' })
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

const CheckCircleIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' }),
      h('polyline', { points: '22 4 12 14.01 9 11.01' })
    ])
  }
}

const ChevronLeftIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('polyline', { points: '15 18 9 12 15 6' })
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

// Filters
const filters = ref({
  type: '',
  date: '',
  device: '',
  keyword: ''
})

const executeQuery = () => {
  alert('执行检索: ' + JSON.stringify(filters.value))
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/')
}

// Chart bars data
const chartBars = ref([
  { height: 30, type: 'normal' },
  { height: 45, type: 'normal' },
  { height: 20, type: 'normal' },
  { height: 60, type: 'normal' },
  { height: 90, type: 'alarm' },
  { height: 40, type: 'normal' },
  { height: 35, type: 'normal' },
  { height: 50, type: 'normal' },
  { height: 25, type: 'normal' },
  { height: 65, type: 'normal' },
  { height: 40, type: 'normal' },
  { height: 30, type: 'normal' },
  { height: 75, type: 'alarm' },
  { height: 20, type: 'normal' }
])

// Type stats data
const typeStats = ref([
  { name: '系统日志', value: 42, colorClass: 'primary' },
  { name: '设备状态', value: 28, colorClass: 'tertiary' },
  { name: '控制命令', value: 15, colorClass: 'secondary' },
  { name: '故障告警', value: 15, colorClass: 'error' }
])

// Log results data
const logResults = ref([
  { time: '2023-11-26 14:22:01.402', type: '控制命令', typeClass: 'primary', source: 'ANTENNA_CONTROLLER_01', content: '天线驱动开启 [目标方位: 242.11°]', contentClass: '', status: '已执行', statusClass: 'tertiary' },
  { time: '2023-11-26 14:22:05.110', type: '故障告警', typeClass: 'error', source: 'BASEBAND_PROCESSOR_A', content: '信号捕获异常 [超出阈值: 0.45ns]', contentClass: 'error', status: '危急', statusClass: 'error-pulse' },
  { time: '2023-11-26 14:23:40.882', type: '操作日志', typeClass: 'secondary', source: 'OPERATOR_ALPHA_7', content: '人工干预启动 [4B扇区]', contentClass: '', status: '已记录', statusClass: 'neutral' },
  { time: '2023-11-26 14:25:55.339', type: '设备状态', typeClass: 'tertiary', source: 'RF_TRANSCEIVER_02', content: '信号捕获成功 [温度: 42.5°C]', contentClass: '', status: '标称', statusClass: 'tertiary' }
])

// Pagination
const currentPage = ref(1)
const totalPages = ref(124)
const pageSize = ref(50)

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 1)
  const end = Math.min(totalPages.value, start + 2)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})
</script>

<style scoped>
.log-query-page {
  min-height: 100vh;
  background-color: #EDEFF3;
  color: #4B4C57;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
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
  background: #EDEFF3;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
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
  color: #1C6AFF;
  text-transform: uppercase;
}

.main-nav {
  display: flex;
  gap: 32px;
}

.nav-link {
  font-size: 14px;
  color: #9C9DA6;
  text-decoration: none;
  transition: color 0.2s;
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
}

.nav-link:hover {
  color: #4B4C57;
}

.nav-link.active {
  color: #1C6AFF;
  border-bottom-color: #1C6AFF;
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
  color: #9C9DA6;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: #F7F8FB;
  color: #4B4C57;
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
  background: #ED3B3B;
}

/* Side Navigation */
.side-nav {
  width: 260px;
  background: #EDEFF3;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
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
  font-size: 12px;
  font-weight: 500;
  color: #9C9DA6;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
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
  color: #9C9DA6;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s;
  border-radius: 4px;
  border-left: 4px solid transparent;
}

.side-link:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #4B4C57;
}

.side-link.active {
  background: rgba(0, 0, 0, 0.05);
  border-left-color: #1C6AFF;
  color: #4B4C57;
}

.side-icon {
  width: 20px;
  height: 20px;
}

/* Main Content */
.main-content {
  flex: 1;
  overflow-y: auto;
  background: #EDEFF3;
  padding: 32px;
}

.content-wrapper {
  max-width: 1600px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #4B4C57;
  margin: 0;
  font-family: 'Microsoft YaHei', sans-serif;
}

.page-subtitle {
  font-size: 12px;
  color: #9C9DA6;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin: 0;
  font-family: 'Microsoft YaHei', sans-serif;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #F7F8FB;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 4px;
  color: #4B4C57;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #F7F8FB;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #1C6AFF;
  border: none;
  border-radius: 4px;
  color: #F7F8FB;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  box-shadow: 0 0 15px rgba(28, 106, 255, 0.4);
}

.btn-icon {
  width: 16px;
  height: 16px;
}

/* Search Panel */
.search-panel {
  background: #F7F8FB;
  border-left: 4px solid #1C6AFF;
  border-radius: 8px;
  padding: 24px;
  position: relative;
  overflow: hidden;
}

.search-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;
}

.search-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-action {
  justify-content: flex-end;
}

.field-label {
  font-size: 10px;
  font-weight: 600;
  color: #9C9DA6;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.field-input {
  width: 100%;
  padding: 10px 12px;
  background: #F2F4F7;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 4px;
  color: #4B4C57;
  font-size: 13px;
  outline: none;
  transition: all 0.2s;
}

.field-input:focus {
  border-color: #1C6AFF;
  box-shadow: 0 0 0 1px rgba(28, 106, 255, 0.3);
}

.btn-query {
  width: 100%;
  height: 40px;
  background: rgba(28, 106, 255, 0.1);
  border: 1px solid rgba(28, 106, 255, 0.4);
  border-radius: 4px;
  color: #1C6AFF;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-query:hover {
  background: rgba(28, 106, 255, 0.2);
}

/* Analytics Grid */
.analytics-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.panel {
  background: #F7F8FB;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

.chart-panel {
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.panel-subtitle {
  font-size: 10px;
  font-weight: 600;
  color: #9C9DA6;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.panel-title {
  font-size: 15px;
  font-weight: 600;
  color: #4B4C57;
  margin: 4px 0 0 0;
  font-family: 'Microsoft YaHei', sans-serif;
}

.chart-legend {
  display: flex;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-dot.primary {
  background: #1C6AFF;
}

.legend-dot.error {
  background: #ED3B3B;
}

.legend-text {
  font-size: 10px;
  font-family: 'Microsoft YaHei', monospace;
  color: #9C9DA6;
  text-transform: uppercase;
}

.chart-body {
  flex: 1;
  display: flex;
  align-items: flex-end;
  padding: 0 8px 8px 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  min-height: 160px;
}

.chart-bars {
  width: 100%;
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 100%;
}

.chart-bar {
  flex: 1;
  border-radius: 2px 2px 0 0;
  transition: all 0.2s;
  min-height: 4px;
}

.chart-bar.normal {
  background: rgba(28, 106, 255, 0.2);
}

.chart-bar.normal:hover {
  background: rgba(28, 106, 255, 0.4);
}

.chart-bar.alarm {
  background: rgba(237, 59, 59, 0.25);
}

.chart-bar.alarm:hover {
  background: rgba(237, 59, 59, 0.35);
}

.chart-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  padding: 0 4px;
}

.chart-label {
  font-size: 9px;
  font-family: 'Microsoft YaHei', monospace;
  color: #9C9DA6;
}

/* Stats Panel */
.stats-panel {
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  font-family: 'Microsoft YaHei', monospace;
  text-transform: uppercase;
}

.stat-name {
  color: #4B4C57;
}

.stat-value {
  font-weight: 600;
}

.stat-value.primary {
  color: #1C6AFF;
}

.stat-value.tertiary {
  color: #4ae176;
}

.stat-value.secondary {
  color: #1C6AFF;
}

.stat-value.error {
  color: #ED3B3B;
}

.stat-bar {
  height: 4px;
  background: #F2F4F7;
  border-radius: 2px;
  overflow: hidden;
}

.stat-progress {
  height: 100%;
  border-radius: 2px;
}

.stat-progress.primary {
  background: #1C6AFF;
}

.stat-progress.tertiary {
  background: #4ae176;
}

.stat-progress.secondary {
  background: #1C6AFF;
}

.stat-progress.error {
  background: #ED3B3B;
}

.stats-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.status-icon {
  width: 16px;
  height: 16px;
  color: #4ae176;
}

.status-text {
  font-size: 10px;
  font-family: 'Microsoft YaHei', monospace;
  color: #9C9DA6;
  text-transform: uppercase;
}

/* Result Panel */
.result-panel {
  background: #F2F4F7;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

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
  font-weight: 600;
  color: #9C9DA6;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 16px 24px;
  background: #F7F8FB;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  white-space: nowrap;
}

.data-table td {
  padding: 16px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.data-table tbody tr {
  transition: background 0.2s;
}

.data-table tbody tr:hover {
  background: rgba(0, 0, 0, 0.03);
}

.text-right {
  text-align: right;
}

.time-cell {
  font-family: 'Microsoft YaHei', monospace;
  font-size: 11px;
  color: #1C6AFF;
}

.type-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 4px;
  text-transform: uppercase;
}

.type-badge.primary {
  background: rgba(28, 106, 255, 0.1);
  color: #1C6AFF;
  border: 1px solid rgba(28, 106, 255, 0.2);
}

.type-badge.error {
  background: rgba(237, 59, 59, 0.08);
  color: #ED3B3B;
  border: 1px solid rgba(237, 59, 59, 0.15);
}

.type-badge.secondary {
  background: rgba(28, 106, 255, 0.1);
  color: #1C6AFF;
  border: 1px solid rgba(28, 106, 255, 0.2);
}

.type-badge.tertiary {
  background: rgba(0, 167, 75, 0.1);
  color: #4ae176;
  border: 1px solid rgba(0, 167, 75, 0.2);
}

.device-cell {
  font-family: 'Microsoft YaHei', monospace;
  font-size: 11px;
  color: #9C9DA6;
}

.content-cell {
  font-size: 12px;
}

.content-cell.error {
  color: #ED3B3B;
}

.result-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.result-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.result-badge.tertiary {
  color: #4ae176;
}

.result-badge.tertiary .result-dot {
  background: #4ae176;
  box-shadow: 0 0 8px rgba(0, 167, 75, 0.5);
}

.result-badge.error-pulse {
  color: #ED3B3B;
  animation: pulse-text 2s infinite;
}

.result-badge.error-pulse .result-dot {
  background: #ED3B3B;
  box-shadow: 0 0 8px rgba(237, 59, 59, 0.3);
}

.result-badge.neutral {
  color: #9C9DA6;
}

.result-badge.neutral .result-dot {
  background: #9C9DA6;
}

@keyframes pulse-text {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* Pagination */
.pagination-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #F7F8FB;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  margin-top: auto;
}

.page-info {
  font-size: 10px;
  font-family: 'Microsoft YaHei', monospace;
  color: #9C9DA6;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.page-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 4px;
  color: #9C9DA6;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.05);
  color: #4B4C57;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-icon {
  width: 16px;
  height: 16px;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-number {
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 4px;
  color: #9C9DA6;
  font-size: 10px;
  font-family: 'Microsoft YaHei', monospace;
  cursor: pointer;
  transition: all 0.2s;
}

.page-number:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #4B4C57;
}

.page-number.active {
  background: #1C6AFF;
  border-color: #1C6AFF;
  color: #F7F8FB;
  font-weight: 600;
}
</style>
