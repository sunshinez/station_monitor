<template>
  <main class="main-content">
        <div class="content-wrapper">
          <!-- Header Section -->
          <div class="page-header">
            <div>
              <div class="header-tags">
                <span class="tag-system">系统激活</span>
                <span class="tag-id">设备ID: {{ deviceInfo.id }}</span>
              </div>
              <h1 class="page-title">
                {{ deviceInfo.name }} <span class="title-divider">//</span> 实时监控控制
              </h1>
            </div>
            <div class="header-time">
              <p class="time-label">当前任务时间 (UTC)</p>
              <p class="time-value">{{ utcTime }}</p>
            </div>
          </div>

          <!-- Top Part: Status Cards Bento Grid -->
          <div class="status-grid">
            <div class="status-card" v-for="(card, index) in statusCards" :key="index" :class="{ 'status-locked': card.locked }">
              <span class="status-label">{{ card.label }}</span>
              <div class="status-value-wrapper">
                <span class="status-value" :class="{ 'text-primary': card.highlight }">{{ card.value }}</span>
                <span class="status-unit">{{ card.unit }}</span>
              </div>
            </div>
          </div>

          <!-- Bottom Part: Control Parameter Settings -->
          <div class="control-panel">
            <div class="panel-header">
              <div class="panel-header-left">
                <TuneIcon class="panel-icon" />
                <h3 class="panel-title">控制参数设置</h3>
              </div>
              <span class="panel-status">就绪 // 加密连接</span>
            </div>
            <div class="panel-content">
              <div class="control-rows">
                <!-- Parameter Row -->
                <div
                  v-for="(param, index) in controlParams"
                  :key="index"
                  class="control-row"
                  :class="{ active: param.unlocked }"
                >
                  <div class="param-info">
                    <label class="param-name">{{ param.name }}</label>
                    <p class="param-range">{{ param.range }}</p>
                  </div>
                  <div class="param-input-wrapper">
                    <input
                      v-if="param.type === 'input'"
                      type="text"
                      class="param-input"
                      :class="{ unlocked: param.unlocked }"
                      :readonly="!param.unlocked"
                      v-model="param.value"
                    />
                    <select
                      v-else-if="param.type === 'select'"
                      class="param-input"
                      :class="{ unlocked: param.unlocked }"
                      :disabled="!param.unlocked"
                      v-model="param.value"
                    >
                      <option v-for="opt in param.options" :key="opt" :value="opt">{{ opt }}</option>
                    </select>
                  </div>
                  <div class="param-actions">
                    <button
                      class="btn-unlock"
                      :class="{ locked: param.unlocked }"
                      @click="toggleUnlock(index)"
                    >
                      {{ param.unlocked ? '锁定' : '解锁' }}
                    </button>
                    <button
                      class="btn-apply"
                      :class="{ disabled: !param.unlocked }"
                      :disabled="!param.unlocked"
                      @click="applyParam(index)"
                    >
                      应用
                    </button>
                  </div>
                </div>
              </div>

              <!-- Emergency Controls -->
              <div class="emergency-section">
                <div class="emergency-info">
                  <h4 class="emergency-title">紧急控制 (Emergency Override)</h4>
                  <p class="emergency-desc">立即停止所有伺服运动并锁定刹车系统。</p>
                </div>
                <button class="btn-emergency" @click="emergencyStop">
                  EMERGENCY STOP
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, h } from 'vue'
import UserIcon from '@/components/icons/UserIcon.vue'

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

// Icons
const AntennaIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M12 2v20M6 8a6 6 0 0 1 12 0c0 3-2 5-6 10-4-5-6-7-6-10z' })
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

const TuneIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M3 17h18M3 12h18M3 7h18' })
    ])
  }
}

// 菜单展开状态
const expandedMenus = ref({
  deviceControl: true,
  antenna: true,
  remoteControl: false
})

// 选中的设备
const selectedDevice = ref('antenna-01')

// 设备信息
const deviceInfo = ref({
  id: 'ANT-01-STD',
  name: '标准测控天线-01'
})

// UTC时间
const utcTime = ref('14:22:56.402')

// 状态卡片数据
const statusCards = ref([
  { label: '方位角 (Azimuth)', value: '182.45', unit: '°', locked: false, highlight: false },
  { label: '俯仰角 (Elevation)', value: '45.12', unit: '°', locked: false, highlight: false },
  { label: '方位速率 (Az Rate)', value: '0.024', unit: '°/s', locked: false, highlight: false },
  { label: '俯仰速率 (El Rate)', value: '0.008', unit: '°/s', locked: false, highlight: false },
  { label: '极化角 (Pol)', value: '90.00', unit: '°', locked: false, highlight: false },
  { label: '锁定状态 (Lock)', value: '已锁定', unit: '', locked: true, highlight: true }
])

// 控制参数
const controlParams = ref([
  { name: '目标方位角 (Target Azimuth)', range: '0.00 - 360.00 DEG', value: '180.00', type: 'input', unlocked: false },
  { name: '目标俯仰角 (Target Elevation)', range: '0.00 - 90.00 DEG', value: '45.00', type: 'input', unlocked: false },
  { name: '扫描模式 (Scan Mode)', range: '程序 / 手动 / 步进', value: '程序跟踪', type: 'select', options: ['程序跟踪', '等幅扫描', '手动控制'], unlocked: false },
  { name: '极化补偿 (Pol Compensation)', range: '-180.00 - 180.00 DEG', value: '0.00', type: 'input', unlocked: true },
  { name: '信标接收频率 (Beacon Frequency)', range: 'GHz 频段', value: '11.450', type: 'input', unlocked: false }
])

// 切换菜单展开
const toggleMenu = (menu: keyof typeof expandedMenus.value) => {
  expandedMenus.value[menu] = !expandedMenus.value[menu]
}

// 选择设备
const selectDevice = (device: string) => {
  selectedDevice.value = device
  // 更新设备信息
  const deviceNames: Record<string, { id: string, name: string }> = {
    'antenna-01': { id: 'ANT-01-STD', name: '标准测控天线-01' },
    'antenna-02': { id: 'ANT-02-STD', name: '标准测控天线-02' },
    'converter': { id: 'CONV-01', name: '变频设备-01' },
    'baseband': { id: 'BB-01', name: '数传基带设备-01' },
    'storage': { id: 'STOR-01', name: '数据分发与存储设备-01' },
    'environment': { id: 'ENV-01', name: '环境设备-01' }
  }
  if (deviceNames[device]) {
    deviceInfo.value = deviceNames[device]
  }
}

// 监听全局侧边栏动作
const handleSidebarAction = (e: Event) => {
  const action = (e as CustomEvent).detail
  if (typeof action === 'string' && action.startsWith('device:')) {
    selectDevice(action.replace('device:', ''))
  }
}

onMounted(() => {
  document.addEventListener('sidebar-action', handleSidebarAction)
})

onUnmounted(() => {
  document.removeEventListener('sidebar-action', handleSidebarAction)
})

// 切换解锁状态
const toggleUnlock = (index: number) => {
  controlParams.value[index].unlocked = !controlParams.value[index].unlocked
}

// 应用参数
const applyParam = (index: number) => {
  const param = controlParams.value[index]
  console.log(`应用参数: ${param.name} = ${param.value}`)
  alert(`已应用参数: ${param.name} = ${param.value}`)
  param.unlocked = false
}

// 紧急停止
const emergencyStop = () => {
  if (confirm('确定要执行紧急停止吗？这将立即停止所有伺服运动。')) {
    alert('紧急停止已触发！')
  }
}

// 更新时间
let timeInterval: number | null = null
let dataInterval: number | null = null

function updateTime() {
  const now = new Date()
  const hours = String(now.getUTCHours()).padStart(2, '0')
  const minutes = String(now.getUTCMinutes()).padStart(2, '0')
  const seconds = String(now.getUTCSeconds()).padStart(2, '0')
  const ms = String(now.getUTCMilliseconds()).padStart(3, '0')
  utcTime.value = `${hours}:${minutes}:${seconds}.${ms}`
}

// 模拟实时数据更新
function updateData() {
  statusCards.value[0].value = (182 + Math.random() * 2 - 1).toFixed(2)
  statusCards.value[1].value = (45 + Math.random() * 0.5 - 0.25).toFixed(2)
  statusCards.value[2].value = (0.024 + Math.random() * 0.002 - 0.001).toFixed(3)
  statusCards.value[3].value = (0.008 + Math.random() * 0.002 - 0.001).toFixed(3)
}

onMounted(() => {
  updateTime()
  timeInterval = window.setInterval(updateTime, 50)
  dataInterval = window.setInterval(updateData, 2000)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
  if (dataInterval) clearInterval(dataInterval)
})
</script>

<style scoped>
.device-control-page {
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
  background: var(--gs-overlay-light);
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

/* Side Navigation - Control */
.side-nav-control {
  width: 260px;
  border-right: 1px solid var(--gs-overlay-light);
  background: var(--gs-bg-default);
  display: flex;
  flex-direction: column;
  z-index: 40;
}

.side-header {
  padding: 24px;
  border-bottom: 1px solid var(--gs-overlay-light);
}

.side-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--gs-text-disabled);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
}

.side-menu {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}

.menu-group {
  display: flex;
  flex-direction: column;
}

.menu-level1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: transparent;
  border: none;
  border-left: 4px solid transparent;
  color: var(--gs-text-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 4px;
}

.menu-level1:hover {
  background: var(--gs-overlay-light);
  color: var(--gs-text-primary);
}

.menu-level1.active {
  background: var(--gs-overlay-light);
  border-left-color: var(--gs-primary-main);
  color: var(--gs-text-primary);
}

.menu-icon-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-icon {
  width: 20px;
  height: 20px;
}

.expand-icon {
  font-size: 10px;
  transition: transform 0.3s;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

/* Level 2 Menu */
.menu-level2-container {
  margin-top: 2px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.menu-level2 {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px 10px 32px;
  background: transparent;
  border: none;
  color: var(--gs-text-disabled);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 4px;
  text-align: left;
}

.menu-level2:hover {
  background: var(--gs-overlay-light);
  color: var(--gs-text-primary);
}

.menu-level2.active {
  color: var(--gs-primary-main);
  font-weight: 500;
}

.level2-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gs-bg-elevated);
}

.level2-dot.active {
  background: var(--gs-primary-main);
}

/* Level 3 Menu */
.menu-level3-container {
  margin-left: 40px;
  margin-top: 2px;
  border-left: 1px solid var(--gs-overlay-light);
  display: flex;
  flex-direction: column;
}

.menu-level3 {
  display: block;
  padding: 8px 16px;
  color: var(--gs-text-disabled);
  font-size: 12px;
  text-decoration: none;
  transition: all 0.2s;
  border-left: 2px solid transparent;
}

.menu-level3:hover {
  color: var(--gs-text-secondary);
}

.menu-level3.active {
  color: var(--gs-text-primary);
  background: var(--gs-overlay-medium);
  border-left-color: var(--gs-primary-main);
  font-weight: 500;
}

/* Main Content */
.main-content {
  flex: 1;
  overflow-y: auto;
  background: var(--gs-bg-default);
  padding-bottom: 32px;
}

.content-wrapper {
  padding: 32px;
  position: relative;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--gs-overlay-light);
}

.header-tags {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.tag-system {
  padding: 2px 8px;
  background: var(--gs-overlay-light);
  color: var(--gs-primary-main);
  font-size: 10px;
  font-weight: 700;
  border-radius: 4px;
  border: 1px solid var(--gs-overlay-medium);
}

.tag-id {
  font-family: 'Fira Code', monospace;
  font-size: 10px;
  color: var(--gs-text-disabled);
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--gs-text-primary);
  margin: 0;
  letter-spacing: 0.02em;
}

.title-divider {
  color: color-mix(in srgb, var(--gs-primary-main), transparent 50%);
}

.header-time {
  text-align: right;
}

.time-label {
  font-family: 'Fira Code', monospace;
  font-size: 10px;
  color: var(--gs-text-disabled);
  text-transform: uppercase;
  margin: 0 0 4px 0;
}

.time-value {
  font-family: 'Fira Code', monospace;
  font-size: 18px;
  color: var(--gs-primary-main);
  margin: 0;
}

/* Status Grid */
.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  margin-bottom: 40px;
}

.status-card {
  background: var(--gs-bg-paper);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid var(--gs-overlay-light);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 80px;
  transition: all 0.3s;
}

.status-card:hover {
  border-color: var(--gs-glow-primary);
}

.status-card.status-locked {
  box-shadow: 0 0 2px var(--gs-success-main), 0 0 12px var(--gs-glow-success);
  border: 1px solid var(--gs-glow-success);
}

.status-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--gs-text-disabled);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-value-wrapper {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-top: 8px;
}

.status-value {
  font-family: 'Fira Code', monospace;
  font-size: 24px;
  color: var(--gs-text-primary);
  transition: color 0.3s;
}

.status-value.text-primary {
  color: var(--gs-success-main);
  font-weight: 700;
}

.status-card:hover .status-value {
  color: var(--gs-primary-main);
}

.status-unit {
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  color: var(--gs-text-disabled);
}

/* Control Panel */
.control-panel {
  background: var(--gs-bg-paper);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--gs-overlay-light);
  box-shadow: 0 20px 40px var(--gs-overlay-dark);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: color-mix(in srgb, var(--gs-bg-elevated), transparent 50%);
  border-bottom: 1px solid var(--gs-overlay-light);
}

.panel-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.panel-icon {
  width: 20px;
  height: 20px;
  color: var(--gs-primary-main);
}

.panel-title {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--gs-text-primary);
  margin: 0;
}

.panel-status {
  font-family: 'Fira Code', monospace;
  font-size: 10px;
  color: var(--gs-text-disabled);
  text-transform: uppercase;
}

.panel-content {
  padding: 24px;
}

/* Control Rows */
.control-rows {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.control-row {
  display: grid;
  grid-template-columns: 2fr 3fr 2fr;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-radius: 4px;
  border-bottom: 1px solid var(--gs-overlay-light);
  transition: all 0.2s;
}

.control-row:hover {
  background: var(--gs-overlay-light);
}

.control-row.active {
  background: var(--gs-overlay-light);
}

.param-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.param-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--gs-text-secondary);
}

.control-row.active .param-name {
  color: var(--gs-primary-main);
}

.param-range {
  font-family: 'Fira Code', monospace;
  font-size: 10px;
  color: var(--gs-text-disabled);
  margin: 0;
}

.param-input-wrapper {
  padding: 0 16px;
}

.param-input {
  width: 100%;
  background: var(--gs-bg-paper);
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--gs-text-disabled);
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  padding: 10px 12px;
  border-radius: 4px 4px 0 0;
  outline: none;
  transition: all 0.2s;
}

.param-input.unlocked {
  border-bottom-color: var(--gs-primary-main);
  color: var(--gs-text-primary);
}

.param-input:focus {
  border-bottom-color: var(--gs-primary-main);
}

.param-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.param-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-unlock {
  padding: 6px 16px;
  background: transparent;
  border: 1px solid var(--gs-overlay-medium);
  color: var(--gs-primary-main);
  font-size: 12px;
  font-weight: 700;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-unlock:hover {
  background: var(--gs-overlay-light);
}

.btn-unlock.locked {
  background: var(--gs-overlay-light);
  border-color: color-mix(in srgb, var(--gs-primary-main), transparent 50%);
}

.btn-apply {
  padding: 6px 16px;
  background: var(--gs-primary-main);
  border: none;
  color: var(--gs-bg-default);
  font-size: 12px;
  font-weight: 700;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-apply:hover {
  box-shadow: 0 0 10px var(--gs-glow-primary);
}

.btn-apply.disabled {
  background: var(--gs-bg-elevated);
  color: var(--gs-text-disabled);
  cursor: not-allowed;
  box-shadow: none;
}

/* Emergency Section */
.emergency-section {
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: var(--gs-overlay-light);
  border: 1px solid var(--gs-glow-error);
  border-radius: 8px;
}

.emergency-info {
  flex: 1;
}

.emergency-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--gs-error-main);
  text-transform: uppercase;
  margin: 0 0 4px 0;
}

.emergency-desc {
  font-size: 10px;
  color: var(--gs-text-disabled);
  margin: 0;
}

.btn-emergency {
  padding: 12px 24px;
  background: var(--gs-error-main);
  border: none;
  color: var(--gs-bg-default);
  font-size: 14px;
  font-weight: 800;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 0 20px var(--gs-glow-error);
  transition: all 0.2s;
}

.btn-emergency:hover {
  background: var(--gs-error-main);
}

/* Status Footer */
.status-footer {
  height: 32px;
  background: var(--gs-bg-paper);
  border-top: 1px solid var(--gs-overlay-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  z-index: 50;
}

.footer-left {
  display: flex;
  gap: 24px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gs-bg-elevated);
}

.status-dot.success {
  background: var(--gs-success-main);
}

.status-text {
  font-size: 10px;
  font-weight: 700;
  color: var(--gs-text-disabled);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.footer-right {
  display: flex;
  gap: 16px;
  font-family: 'Fira Code', monospace;
  font-size: 10px;
  color: var(--gs-text-disabled);
}

.version {
  color: var(--gs-primary-main);
}

/* Responsive */
@media (max-width: 1200px) {
  .status-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .control-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .param-actions {
    justify-content: flex-start;
  }
}

@media (max-width: 1024px) {
  .side-nav-control {
    display: none;
  }

  .main-nav {
    display: none;
  }
}
</style>