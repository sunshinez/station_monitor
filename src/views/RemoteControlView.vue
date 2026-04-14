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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  z-index: 50;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.logo {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: #e4e1e9;
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
  color: #e4e1e9;
  border-bottom-color: #e4e1e9;
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
  color: #94a3b8;
  cursor: pointer;
  padding: 8px;
  transition: color 0.2s;
}

.icon-btn:hover {
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
.side-nav-control {
  width: 260px;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  background: #131318;
  display: flex;
  flex-direction: column;
  z-index: 40;
  flex-shrink: 0;
}

.side-header {
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.side-title {
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
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
  color: #94a3b8;
  font-size: 14px;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.2s;
  border-left: 4px solid transparent;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #e4e1e9;
}

.menu-item.active {
  background: rgba(255, 255, 255, 0.05);
  border-left-color: #a4c9ff;
  color: #ffffff;
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
  background: #131318;
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
  color: #ffffff;
  margin: 0 0 8px 0;
  letter-spacing: 0.02em;
}

.title-sub {
  color: rgba(164, 201, 255, 0.5);
  font-weight: 300;
  font-size: 20px;
  margin-left: 8px;
}

.page-desc {
  font-size: 14px;
  color: #94a3b8;
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
  background: rgba(27, 27, 32, 0.8);
  border: 1px solid rgba(66, 71, 84, 0.1);
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

/* Rack Grid */
.rack-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.rack-card {
  background: #1f1f24;
  padding: 16px;
  border: 1px solid rgba(66, 71, 84, 0.1);
  cursor: pointer;
  transition: all 0.3s;
}

.rack-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(140, 144, 159, 0.3);
}

.rack-card.selected {
  border-color: rgba(59, 130, 246, 0.4);
  background: rgba(59, 130, 246, 0.05);
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
  color: #64748b;
}

.rack-card.selected .rack-name {
  color: #e4e1e9;
}

.rack-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.rack-status-dot.online {
  background: #4ae176;
  box-shadow: 0 0 8px rgba(74, 225, 118, 0.5);
}

.rack-status-dot.warning {
  background: #f59e0b;
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.5);
}

.rack-status-dot.error {
  background: #ffb4ab;
  box-shadow: 0 0 8px rgba(255, 180, 171, 0.5);
}

.rack-visual {
  background: #0e0e13;
  border-left: 2px solid rgba(51, 65, 85, 0.5);
  border-right: 2px solid rgba(51, 65, 85, 0.5);
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
  background: rgba(74, 225, 118, 0.2);
  border-color: #4ae176;
}

.rack-unit.warning {
  background: rgba(245, 158, 11, 0.2);
  border-color: #f59e0b;
}

.rack-unit.error {
  background: rgba(255, 180, 171, 0.2);
  border-color: #ffb4ab;
}

.rack-unit.empty {
  background: rgba(31, 31, 36, 0.3);
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
  color: #64748b;
}

.rack-status-text.online {
  color: #4ae176;
}

.rack-status-text.warning {
  color: #f59e0b;
}

.rack-status-text.error {
  color: #ffb4ab;
}

.rack-power {
  font-size: 12px;
  font-family: 'Fira Code', monospace;
  color: #e4e1e9;
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
  background: #1f1f24;
  border-left: 1px solid rgba(59, 130, 246, 0.2);
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
  color: #e4e1e9;
}

.panel-title {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #ffffff;
  margin: 0;
}

.panel-scale {
  font-size: 10px;
  font-family: 'Fira Code', monospace;
  color: #64748b;
}

.rack-container {
  background: #0e0e13;
  border: 2px solid #1e293b;
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
  background: rgba(74, 225, 118, 0.1);
  border: 1px solid rgba(74, 225, 118, 0.4);
}

.detail-unit.primary {
  background: rgba(164, 201, 255, 0.1);
  border: 1px solid rgba(164, 201, 255, 0.4);
}

.detail-unit.normal {
  background: rgba(42, 41, 47, 0.5);
  border: 1px solid rgba(66, 71, 84, 0.2);
}

.detail-unit.warning {
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.4);
}

.detail-unit.error {
  background: rgba(255, 180, 171, 0.1);
  border: 1px solid rgba(255, 180, 171, 0.4);
}

.detail-unit.placeholder {
  background: rgba(31, 31, 36, 0.2);
  border: 1px solid rgba(66, 71, 84, 0.05);
}

.unit-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.unit-name {
  font-size: 10px;
  font-weight: 700;
  color: #e4e1e9;
}

.detail-unit.tertiary .unit-name {
  color: #4ae176;
}

.detail-unit.primary .unit-name {
  color: #a4c9ff;
}

.detail-unit.warning .unit-name {
  color: #f59e0b;
}

.detail-unit.error .unit-name {
  color: #ffb4ab;
}

.detail-unit.normal .unit-name {
  font-style: italic;
  color: #94a3b8;
  font-weight: 400;
}

.unit-position {
  font-size: 9px;
  font-family: 'Fira Code', monospace;
  color: #64748b;
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
  background: #4ae176;
}

.unit-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 4px;
  margin-top: 8px;
}

.grid-cell {
  height: 20px;
  background: rgba(255, 180, 171, 0.2);
  border: 1px solid rgba(255, 180, 171, 0.2);
}

/* Control Panels */
.control-panels {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Power Control Panel */
.power-control-panel {
  background: #1f1f24;
  border-top: 1px solid rgba(59, 130, 246, 0.1);
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
  color: #64748b;
  margin-left: 12px;
  font-weight: 400;
}

.panel-actions {
  display: flex;
  gap: 8px;
}

.btn-primary {
  padding: 6px 16px;
  background: #a4c9ff;
  border: none;
  color: #00315d;
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
  border: 1px solid rgba(66, 71, 84, 0.3);
  color: #94a3b8;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #e4e1e9;
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
  color: #64748b;
  padding: 12px 8px;
  border-bottom: 1px solid rgba(66, 71, 84, 0.1);
}

.power-table td {
  padding: 16px 8px;
  border-bottom: 1px solid rgba(66, 71, 84, 0.05);
  font-size: 12px;
  font-family: 'Fira Code', monospace;
  color: #e4e1e9;
}

.power-table tr:hover {
  background: rgba(255, 255, 255, 0.05);
}

.device-name {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
}

.device-position {
  color: #64748b;
}

.status-badge {
  padding: 2px 8px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  border-radius: 4px;
}

.status-badge.online {
  background: rgba(74, 225, 118, 0.1);
  color: #4ae176;
}

.status-badge.offline {
  background: #1f2937;
  color: #64748b;
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
  background: rgba(74, 225, 118, 0.1);
  color: #4ae176;
}

.btn-power-on:hover {
  background: rgba(74, 225, 118, 0.2);
}

.btn-power-off {
  background: rgba(255, 180, 171, 0.1);
  color: #ffb4ab;
}

.btn-power-off:hover {
  background: rgba(255, 180, 171, 0.2);
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
  background: #1f1f24;
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
  background: rgba(14, 14, 19, 0.5);
  border-left: 2px solid #4c93e7;
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
  color: #e4e1e9;
}

.maintenance-name.disabled {
  color: #94a3b8;
}

.maintenance-uptime {
  font-size: 10px;
  font-family: 'Fira Code', monospace;
  color: #4ae176;
}

.maintenance-status {
  font-size: 10px;
  font-family: 'Fira Code', monospace;
  color: #64748b;
}

.maintenance-actions {
  display: flex;
  gap: 8px;
}

.btn-action {
  flex: 1;
  padding: 8px;
  background: #2a292f;
  border: 1px solid rgba(66, 71, 84, 0.2);
  color: #e4e1e9;
  font-size: 10px;
  font-family: 'Fira Code', monospace;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-action:hover {
  background: rgba(59, 130, 246, 0.2);
}

.btn-console {
  width: 100%;
  padding: 8px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #e4e1e9;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-console:hover {
  background: rgba(59, 130, 246, 0.2);
}

/* Environment Panel */
.env-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 24px;
}

.env-card {
  background: #0e0e13;
  padding: 16px;
  text-align: center;
}

.env-label {
  font-size: 10px;
  color: #64748b;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.env-value {
  font-size: 24px;
  font-family: 'Fira Code', monospace;
  font-weight: 700;
}

.text-tertiary {
  color: #4ae176;
}

.text-primary {
  color: #e4e1e9;
}

.env-bar {
  height: 4px;
  background: #2a292f;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 12px;
}

.env-fill {
  height: 100%;
  border-radius: 2px;
}

.env-fill.tertiary {
  background: #4ae176;
}

.env-fill.primary {
  background: #60a5fa;
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
  background: rgba(14, 14, 19, 0.5);
  border: 1px solid rgba(66, 71, 84, 0.1);
  border-radius: 4px;
}

.env-control-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #e4e1e9;
}

.env-control-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-adjust {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 16px;
  transition: color 0.2s;
}

.btn-adjust:hover {
  color: #e4e1e9;
}

.env-control-value {
  font-size: 12px;
  font-family: 'Fira Code', monospace;
  color: #e4e1e9;
  min-width: 40px;
  text-align: center;
}

.btn-refresh {
  width: 100%;
  padding: 8px;
  background: #2a292f;
  border: none;
  color: #94a3b8;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-refresh:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #e4e1e9;
}

/* Status Ticker */
.status-ticker {
  background: rgba(14, 14, 19, 0.5);
  padding: 16px 24px;
  border: 1px solid rgba(66, 71, 84, 0.1);
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
  color: #64748b;
}

.ticker-value {
  font-size: 12px;
  font-family: 'Fira Code', monospace;
}

.ticker-right {
  font-size: 10px;
  font-family: 'Fira Code', monospace;
  color: #475569;
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