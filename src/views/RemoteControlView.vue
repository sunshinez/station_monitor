<template>
  <main class="main-content">
        <div class="content-wrapper">
          <!-- Dashboard Header -->
          <div class="dashboard-header">
            <div>
              <h1 class="page-title">
                远程控制中心 <span class="title-sub">/ GLOBAL_MONITORING</span>
              </h1>
              <p class="page-desc">选择下方机架以查看其详细智能电源控制、远程维护及环控状态。</p>
            </div>
            <div class="system-health">
              <div class="health-indicator">
                <span class="health-dot"></span>
                <span class="health-text">系统健康: 良好</span>
              </div>
            </div>
          </div>

          <!-- Top Section: Multi-Rack View -->
          <section class="rack-grid">
            <div
              v-for="(rack, index) in racks"
              :key="index"
              class="rack-card"
              :class="{ selected: selectedRack === index }"
              @click="selectRack(index)"
            >
              <div class="rack-header">
                <span class="rack-name">{{ rack.name }}</span>
                <span class="rack-status-dot" :class="rack.status"></span>
              </div>
              <div class="rack-visual">
                <div
                  v-for="(unit, uIndex) in rack.units"
                  :key="uIndex"
                  class="rack-unit"
                  :class="unit.type"
                  :style="{ height: unit.height + 'px' }"
                >
                </div>
              </div>
              <div class="rack-footer">
                <span class="rack-status-text" :class="rack.status">{{ rack.statusText }}</span>
                <span class="rack-power">{{ rack.power }}</span>
              </div>
            </div>
          </section>

          <!-- Main Detailed Area -->
          <div class="detail-grid">
            <!-- Left: Detailed 42U Rack -->
            <div class="rack-detail-panel">
              <div class="panel-header">
                <div class="panel-header-left">
                  <ViewIcon class="panel-icon" />
                  <h2 class="panel-title">{{ racks[selectedRack].name }} 物理拓扑 (42U)</h2>
                </div>
                <span class="panel-scale">比例 1:15</span>
              </div>
              <div class="rack-container">
                <div class="rack-units">
                  <div
                    v-for="(unit, index) in rackDetailUnits"
                    :key="index"
                    class="detail-unit"
                    :class="unit.type"
                    :style="{ height: unit.height + 'px' }"
                  >
                    <div class="unit-content">
                      <span class="unit-name">{{ unit.name }}</span>
                      <span class="unit-position">{{ unit.position }}</span>
                    </div>
                    <div v-if="unit.indicators" class="unit-indicators">
                      <span v-for="n in unit.indicators" :key="n" class="indicator"></span>
                    </div>
                    <div v-if="unit.grid" class="unit-grid">
                      <div v-for="n in unit.grid" :key="n" class="grid-cell"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Actionable Control Panels -->
            <div class="control-panels">
              <!-- 1. Smart Power Control -->
              <section class="power-control-panel">
                <div class="panel-header-compact">
                  <div class="panel-header-left">
                    <BoltIcon class="panel-icon" />
                    <h2 class="panel-title">
                      智能电源控制 <span class="panel-subtitle">/ {{ racks[selectedRack].name }}-供电</span>
                    </h2>
                  </div>
                  <div class="panel-actions">
                    <button class="btn-primary" @click="powerGroupOn">一键分组加电</button>
                    <button class="btn-outline">详细日志</button>
                  </div>
                </div>
                <div class="power-table-wrapper">
                  <table class="power-table">
                    <thead>
                      <tr>
                        <th>设备名称</th>
                        <th>U位标识</th>
                        <th>当前功率</th>
                        <th>状态</th>
                        <th class="text-right">电源操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(device, index) in powerDevices" :key="index">
                        <td class="device-name">{{ device.name }}</td>
                        <td class="device-position">{{ device.position }}</td>
                        <td class="device-power">{{ device.power }}</td>
                        <td>
                          <span class="status-badge" :class="device.status">{{ device.statusText }}</span>
                        </td>
                        <td class="text-right">
                          <button
                            class="btn-power"
                            :class="device.status === 'online' ? 'btn-power-off' : 'btn-power-on'"
                            @click="togglePower(device)"
                          >
                            <PowerIcon v-if="device.status === 'online'" class="btn-icon" />
                            <FlashIcon v-else class="btn-icon" />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <div class="sub-panels">
                <!-- 2. Remote Maintenance -->
                <div class="maintenance-panel">
                  <div class="panel-header-small">
                    <ConstructionIcon class="panel-icon" />
                    <h2 class="panel-title">远程维护</h2>
                  </div>
                  <div class="maintenance-list">
                    <div class="maintenance-item">
                      <div class="maintenance-item-header">
                        <span class="maintenance-name">系统管理: 节点_01</span>
                        <span class="maintenance-uptime">在线: 12d 4h</span>
                      </div>
                      <div class="maintenance-actions">
                        <button class="btn-action" @click="rebootPhysical">物理重启 REBOOT</button>
                        <button class="btn-action" @click="restartSystem">系统重启 RESTART</button>
                      </div>
                    </div>
                    <div class="maintenance-item">
                      <div class="maintenance-item-header">
                        <span class="maintenance-name disabled">远程终端: 主控中心</span>
                        <span class="maintenance-status">已连接</span>
                      </div>
                      <button class="btn-console" @click="enterConsole">进入控制台 CONSOLE</button>
                    </div>
                  </div>
                </div>

                <!-- 3. Environmental Monitoring -->
                <div class="environment-panel">
                  <div class="panel-header-small">
                    <ThermostatIcon class="panel-icon" />
                    <h2 class="panel-title">环控监视</h2>
                  </div>
                  <div class="env-grid">
                    <div class="env-card">
                      <div class="env-label">机架进风温度</div>
                      <div class="env-value text-tertiary">{{ envTemp }}°C</div>
                      <div class="env-bar">
                        <div class="env-fill tertiary" :style="{ width: (envTemp / 50 * 100) + '%' }"></div>
                      </div>
                    </div>
                    <div class="env-card">
                      <div class="env-label">机架环境湿度</div>
                      <div class="env-value text-primary">{{ envHumidity }}%</div>
                      <div class="env-bar">
                        <div class="env-fill primary" :style="{ width: envHumidity + '%' }"></div>
                      </div>
                    </div>
                  </div>
                  <div class="env-control">
                    <div class="env-control-item">
                      <span class="env-control-label">温控阀值设置</span>
                      <div class="env-control-actions">
                        <button class="btn-adjust" @click="adjustTemp(-1)">−</button>
                        <span class="env-control-value">{{ tempThreshold }}°C</span>
                        <button class="btn-adjust" @click="adjustTemp(1)">+</button>
                      </div>
                    </div>
                    <button class="btn-refresh" @click="refreshSensors">刷新传感器数据</button>
                  </div>
                </div>
              </div>

              <!-- Global Status Ticker -->
              <div class="status-ticker">
                <div class="ticker-left">
                  <div class="ticker-item">
                    <span class="ticker-label">UPS 备载时长:</span>
                    <span class="ticker-value text-tertiary">{{ upsTime }}</span>
                  </div>
                  <div class="ticker-item">
                    <span class="ticker-label">外电网电压:</span>
                    <span class="ticker-value">{{ gridVoltage }}V</span>
                  </div>
                  <div class="ticker-item">
                    <span class="ticker-label">安全防护状态:</span>
                    <span class="ticker-value text-tertiary">SECURE</span>
                  </div>
                </div>
                <div class="ticker-right">
                  <span class="ticker-time">最后更新: {{ lastUpdate }}</span>
                </div>
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
const TuneIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M3 17h18M3 12h18M3 7h18' })
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

const ViewIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('rect', { x: '3', y: '3', width: '18', height: '18', rx: '2' }),
      h('path', { d: 'M3 9h18M9 21V9' })
    ])
  }
}

const BoltIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('polygon', { points: '13 2 3 14 12 14 11 22 21 10 12 10 13 2' })
    ])
  }
}

const PowerIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M18.36 6.64a9 9 0 1 1-12.73 0' }),
      h('line', { x1: '12', y1: '2', x2: '12', y2: '12' })
    ])
  }
}

const FlashIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('polygon', { points: '13 2 3 14 12 14 11 22 21 10 12 10 13 2' })
    ])
  }
}

const ConstructionIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('rect', { x: '2', y: '6', width: '20', height: '8', rx: '1' }),
      h('path', { d: 'M17 14v7' }),
      h('path', { d: 'M7 14v7' }),
      h('path', { d: 'M17 3v3' }),
      h('path', { d: 'M7 3v3' })
    ])
  }
}

const ThermostatIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z' })
    ])
  }
}

// Selected rack
const selectedRack = ref(0)

// Racks data
const racks = ref([
  { name: '机架_01 (已选择)', status: 'online', statusText: '正常', power: '4.2kW', units: [
    { type: 'tertiary', height: 16 }, { type: 'tertiary', height: 24 }, { type: 'empty', height: 40 }, { type: 'tertiary', height: 16 }
  ]},
  { name: '机架_02', status: 'warning', statusText: '警告', power: '3.8kW', units: [
    { type: 'tertiary', height: 16 }, { type: 'warning', height: 24 }, { type: 'empty', height: 40 }
  ]},
  { name: '机架_03', status: 'online', statusText: '正常', power: '2.1kW', units: [
    { type: 'tertiary', height: 32 }, { type: 'empty', height: 40 }, { type: 'tertiary', height: 16 }
  ]},
  { name: '机架_04', status: 'error', statusText: '故障', power: '-- kW', units: [
    { type: 'error', height: 40 }, { type: 'empty', height: 40 }
  ]}
])

// Rack detail units
const rackDetailUnits = ref([
  { name: '核心监控服务器 (U41-42)', position: 'U41-42', type: 'tertiary', height: 64, indicators: 3 },
  { name: '数传分流器 (U38-40)', position: 'U38-40', type: 'primary', height: 80, indicators: 3 },
  { name: '系统交换机 A (U37)', position: 'U37', type: 'normal', height: 32 },
  { name: '系统交换机 B (U36)', position: 'U36', type: 'normal', height: 32 },
  { type: 'placeholder', height: 16 },
  { type: 'placeholder', height: 16 },
  { name: 'PDU 智能电源 (U20)', position: 'U20', type: 'warning', height: 40 },
  { type: 'placeholder', height: 16 },
  { type: 'placeholder', height: 16 },
  { type: 'placeholder', height: 16 },
  { type: 'placeholder', height: 16 },
  { type: 'placeholder', height: 16 },
  { type: 'placeholder', height: 16 },
  { type: 'placeholder', height: 16 },
  { type: 'placeholder', height: 16 },
  { type: 'placeholder', height: 16 },
  { name: '分布式存储集群 (U1-4)', position: 'U1-4', type: 'error', height: 96, grid: 6 }
])

// Power devices
const powerDevices = ref([
  { name: '核心监控服务器', position: 'U41-42', power: '420W', status: 'online', statusText: '已上线' },
  { name: '分布式存储集群', position: 'U1-4', power: '--', status: 'offline', statusText: '已关机' }
])

// Environment data
const envTemp = ref(22.4)
const envHumidity = ref(45.2)
const tempThreshold = ref(22)

// Status ticker
const upsTime = ref('14:22:05')
const gridVoltage = ref(380.2)
const lastUpdate = ref('2023-11-24 14:20:01')

// Methods
const selectRack = (index: number) => {
  selectedRack.value = index
}

const togglePower = (device: any) => {
  device.status = device.status === 'online' ? 'offline' : 'online'
  device.statusText = device.status === 'online' ? '已上线' : '已关机'
  device.power = device.status === 'online' ? '420W' : '--'
}

const powerGroupOn = () => {
  alert('一键分组加电执行中...')
}

const rebootPhysical = () => {
  if (confirm('确定要执行物理重启吗？')) {
    alert('物理重启命令已发送')
  }
}

const restartSystem = () => {
  if (confirm('确定要执行系统重启吗？')) {
    alert('系统重启命令已发送')
  }
}

const enterConsole = () => {
  alert('正在进入控制台...')
}

const adjustTemp = (delta: number) => {
  tempThreshold.value += delta
}

const refreshSensors = () => {
  envTemp.value = 20 + Math.random() * 5
  envHumidity.value = 40 + Math.random() * 10
  const now = new Date()
  lastUpdate.value = now.toISOString().slice(0, 19).replace('T', ' ')
}

// Update time
let timeInterval: number | null = null

onMounted(() => {
  timeInterval = window.setInterval(() => {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    upsTime.value = `${hours}:${minutes}:${seconds}`
  }, 1000)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
})
</script>

<style scoped>
.remote-control-page {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  z-index: 50;
  border-bottom: 1px solid var(--gs-overlay-light);
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

.nav-link:hover {
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


/* Side Navigation */
.side-nav-control {
  width: 260px;
  border-right: 1px solid var(--gs-overlay-light);
  background: var(--gs-bg-default);
  display: flex;
  flex-direction: column;
  z-index: 40;
  flex-shrink: 0;
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
  gap: 4px;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  color: var(--gs-text-secondary);
  font-size: 14px;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.2s;
  border-left: 4px solid transparent;
}

.menu-item:hover {
  background: var(--gs-overlay-light);
  color: var(--gs-text-primary);
}

.menu-item.active {
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
}

/* Main Content */
.main-content {
  flex: 1;
  overflow-y: auto;
  background: var(--gs-bg-default);
}

.content-wrapper {
  padding: 32px;
}

/* Dashboard Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--gs-text-primary);
  margin: 0 0 8px 0;
  letter-spacing: 0.02em;
}

.title-sub {
  color: var(--gs-glow-primary);
  font-weight: 300;
  font-size: 20px;
  margin-left: 8px;
}

.page-desc {
  font-size: 14px;
  color: var(--gs-text-secondary);
  margin: 0;
  max-width: 600px;
}

.system-health {
  display: flex;
  gap: 12px;
}

.health-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: color-mix(in srgb, var(--gs-bg-paper), transparent 20%);
  border: 1px solid color-mix(in srgb, var(--gs-border-main), transparent 90%);
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

/* Rack Grid */
.rack-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.rack-card {
  background: var(--gs-bg-paper);
  padding: 16px;
  border: 1px solid color-mix(in srgb, var(--gs-border-main), transparent 90%);
  cursor: pointer;
  transition: all 0.3s;
}

.rack-card:hover {
  background: var(--gs-overlay-light);
  border-color: color-mix(in srgb, var(--gs-border-main), transparent 70%);
}

.rack-card.selected {
  border-color: var(--gs-glow-primary);
  background: var(--gs-overlay-light);
}

.rack-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.rack-name {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gs-text-disabled);
}

.rack-card.selected .rack-name {
  color: var(--gs-text-primary);
}

.rack-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.rack-status-dot.online {
  background: var(--gs-success-main);
  box-shadow: 0 0 8px var(--gs-glow-success);
}

.rack-status-dot.warning {
  background: var(--gs-warning-main);
  box-shadow: 0 0 8px var(--gs-glow-warning);
}

.rack-status-dot.error {
  background: var(--gs-error-main);
  box-shadow: 0 0 8px var(--gs-glow-error);
}

.rack-visual {
  background: var(--gs-bg-paper);
  border-left: 2px solid color-mix(in srgb, var(--gs-border-main), transparent 50%);
  border-right: 2px solid color-mix(in srgb, var(--gs-border-main), transparent 50%);
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  height: 120px;
}

.rack-unit {
  border-left: 2px solid;
}

.rack-unit.tertiary {
  background: var(--gs-overlay-medium);
  border-color: var(--gs-success-main);
}

.rack-unit.warning {
  background: var(--gs-overlay-medium);
  border-color: var(--gs-warning-main);
}

.rack-unit.error {
  background: var(--gs-glow-error);
  border-color: var(--gs-error-main);
}

.rack-unit.empty {
  background: color-mix(in srgb, var(--gs-bg-paper), transparent 70%);
  flex: 1;
}

.rack-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.rack-status-text {
  font-size: 10px;
  font-family: 'Fira Code', monospace;
  text-transform: uppercase;
  color: var(--gs-text-disabled);
}

.rack-status-text.online {
  color: var(--gs-success-main);
}

.rack-status-text.warning {
  color: var(--gs-warning-main);
}

.rack-status-text.error {
  color: var(--gs-error-main);
}

.rack-power {
  font-size: 12px;
  font-family: 'Fira Code', monospace;
  color: var(--gs-text-primary);
}

/* Detail Grid */
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 32px;
  align-items: start;
}

/* Rack Detail Panel */
.rack-detail-panel {
  background: var(--gs-bg-paper);
  border-left: 1px solid var(--gs-overlay-medium);
  padding: 24px;
  position: sticky;
  top: 0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.panel-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.panel-icon {
  width: 20px;
  height: 20px;
  color: var(--gs-text-primary);
}

.panel-title {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--gs-text-primary);
  margin: 0;
}

.panel-scale {
  font-size: 10px;
  font-family: 'Fira Code', monospace;
  color: var(--gs-text-disabled);
}

.rack-container {
  background: var(--gs-bg-paper);
  border: 2px solid var(--gs-border-main);
  border-radius: 4px;
  padding: 8px;
  height: 720px;
  overflow: hidden;
}

.rack-units {
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rack-units::-webkit-scrollbar {
  width: 2px;
}

.detail-unit {
  padding: 8px;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.detail-unit.tertiary {
  background: var(--gs-overlay-light);
  border: 1px solid var(--gs-glow-success);
}

.detail-unit.primary {
  background: var(--gs-overlay-light);
  border: 1px solid var(--gs-glow-primary);
}

.detail-unit.normal {
  background: color-mix(in srgb, var(--gs-bg-paper), transparent 50%);
  border: 1px solid color-mix(in srgb, var(--gs-border-main), transparent 80%);
}

.detail-unit.warning {
  background: var(--gs-overlay-light);
  border: 1px solid var(--gs-glow-warning);
}

.detail-unit.error {
  background: var(--gs-overlay-light);
  border: 1px solid var(--gs-glow-error);
}

.detail-unit.placeholder {
  background: color-mix(in srgb, var(--gs-bg-paper), transparent 80%);
  border: 1px solid var(--gs-overlay-light);
}

.unit-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.unit-name {
  font-size: 10px;
  font-weight: 700;
  color: var(--gs-text-primary);
}

.detail-unit.tertiary .unit-name {
  color: var(--gs-success-main);
}

.detail-unit.primary .unit-name {
  color: var(--gs-primary-main);
}

.detail-unit.warning .unit-name {
  color: var(--gs-warning-main);
}

.detail-unit.error .unit-name {
  color: var(--gs-error-main);
}

.detail-unit.normal .unit-name {
  font-style: italic;
  color: var(--gs-text-secondary);
  font-weight: 400;
}

.unit-position {
  font-size: 9px;
  font-family: 'Fira Code', monospace;
  color: var(--gs-text-disabled);
}

.unit-indicators {
  display: flex;
  gap: 4px;
  margin-top: 4px;
}

.indicator {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--gs-success-main);
}

.unit-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 4px;
  margin-top: 8px;
}

.grid-cell {
  height: 20px;
  background: var(--gs-glow-error);
  border: 1px solid var(--gs-glow-error);
}

/* Control Panels */
.control-panels {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Power Control Panel */
.power-control-panel {
  background: var(--gs-bg-paper);
  border-top: 1px solid var(--gs-overlay-light);
  padding: 24px;
}

.panel-header-compact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.panel-subtitle {
  font-size: 12px;
  font-family: 'Fira Code', monospace;
  color: var(--gs-text-disabled);
  margin-left: 12px;
  font-weight: 400;
}

.panel-actions {
  display: flex;
  gap: 8px;
}

.btn-primary {
  padding: 6px 16px;
  background: var(--gs-primary-main);
  border: none;
  color: var(--gs-text-inverse);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-outline {
  padding: 6px 16px;
  background: transparent;
  border: 1px solid color-mix(in srgb, var(--gs-border-main), transparent 70%);
  color: var(--gs-text-secondary);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover {
  background: var(--gs-overlay-light);
  color: var(--gs-text-primary);
}

.power-table-wrapper {
  overflow-x: auto;
}

.power-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.power-table th {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gs-text-disabled);
  padding: 12px 8px;
  border-bottom: 1px solid color-mix(in srgb, var(--gs-border-main), transparent 90%);
}

.power-table td {
  padding: 16px 8px;
  border-bottom: 1px solid var(--gs-overlay-light);
  font-size: 12px;
  font-family: 'Fira Code', monospace;
  color: var(--gs-text-primary);
}

.power-table tr:hover {
  background: var(--gs-overlay-light);
}

.device-name {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
}

.device-position {
  color: var(--gs-text-disabled);
}

.status-badge {
  padding: 2px 8px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  border-radius: 4px;
}

.status-badge.online {
  background: var(--gs-overlay-light);
  color: var(--gs-success-main);
}

.status-badge.offline {
  background: var(--gs-bg-paper);
  color: var(--gs-text-disabled);
}

.text-right {
  text-align: right;
}

.btn-power {
  padding: 6px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-power-on {
  background: var(--gs-overlay-light);
  color: var(--gs-success-main);
}

.btn-power-on:hover {
  background: var(--gs-overlay-medium);
}

.btn-power-off {
  background: var(--gs-overlay-light);
  color: var(--gs-error-main);
}

.btn-power-off:hover {
  background: var(--gs-glow-error);
}

.btn-icon {
  width: 16px;
  height: 16px;
  display: block;
}

/* Sub Panels */
.sub-panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

/* Maintenance Panel */
.maintenance-panel,
.environment-panel {
  background: var(--gs-bg-paper);
  padding: 24px;
}

.panel-header-small {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.maintenance-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.maintenance-item {
  padding: 16px;
  background: color-mix(in srgb, var(--gs-bg-paper), transparent 50%);
  border-left: 2px solid var(--gs-primary-main);
}

.maintenance-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.maintenance-name {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--gs-text-primary);
}

.maintenance-name.disabled {
  color: var(--gs-text-secondary);
}

.maintenance-uptime {
  font-size: 10px;
  font-family: 'Fira Code', monospace;
  color: var(--gs-success-main);
}

.maintenance-status {
  font-size: 10px;
  font-family: 'Fira Code', monospace;
  color: var(--gs-text-disabled);
}

.maintenance-actions {
  display: flex;
  gap: 8px;
}

.btn-action {
  flex: 1;
  padding: 8px;
  background: var(--gs-bg-paper);
  border: 1px solid color-mix(in srgb, var(--gs-border-main), transparent 80%);
  color: var(--gs-text-primary);
  font-size: 10px;
  font-family: 'Fira Code', monospace;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-action:hover {
  background: var(--gs-overlay-medium);
}

.btn-console {
  width: 100%;
  padding: 8px;
  background: var(--gs-overlay-light);
  border: 1px solid var(--gs-overlay-medium);
  color: var(--gs-text-primary);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-console:hover {
  background: var(--gs-overlay-medium);
}

/* Environment Panel */
.env-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 24px;
}

.env-card {
  background: var(--gs-bg-paper);
  padding: 16px;
  text-align: center;
}

.env-label {
  font-size: 10px;
  color: var(--gs-text-disabled);
  text-transform: uppercase;
  margin-bottom: 8px;
}

.env-value {
  font-size: 24px;
  font-family: 'Fira Code', monospace;
  font-weight: 700;
}

.text-tertiary {
  color: var(--gs-success-main);
}

.text-primary {
  color: var(--gs-text-primary);
}

.env-bar {
  height: 4px;
  background: var(--gs-bg-paper);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 12px;
}

.env-fill {
  height: 100%;
  border-radius: 2px;
}

.env-fill.tertiary {
  background: var(--gs-success-main);
}

.env-fill.primary {
  background: var(--gs-primary-main);
}

.env-control {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.env-control-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: color-mix(in srgb, var(--gs-bg-paper), transparent 50%);
  border: 1px solid color-mix(in srgb, var(--gs-border-main), transparent 90%);
  border-radius: 4px;
}

.env-control-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--gs-text-primary);
}

.env-control-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-adjust {
  background: none;
  border: none;
  color: var(--gs-text-disabled);
  cursor: pointer;
  font-size: 16px;
  transition: color 0.2s;
}

.btn-adjust:hover {
  color: var(--gs-text-primary);
}

.env-control-value {
  font-size: 12px;
  font-family: 'Fira Code', monospace;
  color: var(--gs-text-primary);
  min-width: 40px;
  text-align: center;
}

.btn-refresh {
  width: 100%;
  padding: 8px;
  background: var(--gs-bg-paper);
  border: none;
  color: var(--gs-text-secondary);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-refresh:hover {
  background: var(--gs-overlay-light);
  color: var(--gs-text-primary);
}

/* Status Ticker */
.status-ticker {
  background: color-mix(in srgb, var(--gs-bg-paper), transparent 50%);
  padding: 16px 24px;
  border: 1px solid color-mix(in srgb, var(--gs-border-main), transparent 90%);
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ticker-left {
  display: flex;
  gap: 32px;
}

.ticker-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ticker-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--gs-text-disabled);
}

.ticker-value {
  font-size: 12px;
  font-family: 'Fira Code', monospace;
}

.ticker-right {
  font-size: 10px;
  font-family: 'Fira Code', monospace;
  color: var(--gs-text-disabled);
}

/* Responsive */
@media (max-width: 1400px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .rack-detail-panel {
    position: static;
  }

  .sub-panels {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1024px) {
  .rack-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .side-nav-control {
    display: none;
  }

  .main-nav {
    display: none;
  }
}
</style>