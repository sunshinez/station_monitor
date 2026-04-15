<template>
  <main class="main-content">
      <div class="bg-glow top-right"></div>
      <div class="bg-glow bottom-right"></div>

      <div class="content-wrapper">
        <!-- Header Section -->
        <div class="page-header">
          <div>
            <h1 class="page-title">其它设备监视</h1>
            <p class="page-subtitle">
              当前设备: {{ currentDeviceName }} | 设备编号: {{ selectedDevice.toUpperCase() }} | 状态: <span class="status-text success">正常运行</span>
            </p>
          </div>
        </div>

        <!-- Device Control Panel -->
        <div class="device-panel">
          <!-- Panel Header -->
          <div class="panel-header">
            <div class="panel-header-left">
              <ConverterIcon class="panel-icon" />
              <h2 class="panel-title">{{ currentDeviceName }} 详细参数控制</h2>
            </div>
            <div class="panel-actions">
              <button class="refresh-btn" @click="refreshData">
                <RefreshIcon class="refresh-icon" />
                <span>刷新数据</span>
              </button>
            </div>
          </div>

          <!-- Panel Content -->
          <div class="panel-content">
            <!-- Real-time Status Section -->
            <section class="status-section">
              <div class="section-header">
                <div class="section-marker success"></div>
                <span class="section-title success">实时运行状态</span>
              </div>
              <div class="status-grid">
                <div class="status-item">
                  <span class="status-label">输入电平</span>
                  <span class="status-value">{{ realTimeStatus.inputLevel }} <span class="unit">dBm</span></span>
                </div>
                <div class="status-item">
                  <span class="status-label">输出电平</span>
                  <span class="status-value">{{ realTimeStatus.outputLevel }} <span class="unit">dBm</span></span>
                </div>
                <div class="status-item">
                  <span class="status-label">当前增益</span>
                  <span class="status-value highlight">{{ realTimeStatus.currentGain }} <span class="unit">dB</span></span>
                </div>
                <div class="status-item">
                  <span class="status-label">本振锁相</span>
                  <div class="status-indicator">
                    <span class="status-dot success"></span>
                    <span class="status-text success">已锁定</span>
                  </div>
                </div>
                <div class="status-item">
                  <span class="status-label">内部温度</span>
                  <span class="status-value">{{ realTimeStatus.temperature }} <span class="unit">°C</span></span>
                </div>
              </div>
            </section>

            <!-- Control Settings Section -->
            <section class="control-section">
              <div class="section-header">
                <div class="section-marker primary"></div>
                <span class="section-title primary">控制参数设定</span>
              </div>
              <div class="control-list">
                <!-- Row 1: 下行频率 -->
                <div class="control-row">
                  <div class="control-info">
                    <span class="control-name">下行频率</span>
                    <span class="control-desc">DOWNLINK FREQUENCY</span>
                  </div>
                  <div class="control-input-wrapper">
                    <input
                      type="text"
                      class="control-input"
                      :readonly="!isUnlocked.frequency"
                      v-model="controlParams.frequency"
                    />
                  </div>
                  <div class="control-actions">
                    <button
                      class="btn-unlock"
                      :class="{ unlocked: isUnlocked.frequency }"
                      @click="toggleLock('frequency')"
                    >
                      <LockIcon v-if="!isUnlocked.frequency" class="btn-icon" />
                      <UnlockIcon v-else class="btn-icon" />
                      {{ isUnlocked.frequency ? '锁定' : '解锁' }}
                    </button>
                    <button class="btn-set" @click="setParam('frequency')">
                      <SendIcon class="btn-icon" />
                      设置
                    </button>
                  </div>
                </div>

                <!-- Row 2: 衰减度 -->
                <div class="control-row">
                  <div class="control-info">
                    <span class="control-name">衰减度</span>
                    <span class="control-desc">ATTENUATION</span>
                  </div>
                  <div class="control-input-wrapper">
                    <input
                      type="text"
                      class="control-input"
                      :readonly="!isUnlocked.attenuation"
                      v-model="controlParams.attenuation"
                    />
                  </div>
                  <div class="control-actions">
                    <button
                      class="btn-unlock"
                      :class="{ unlocked: isUnlocked.attenuation }"
                      @click="toggleLock('attenuation')"
                    >
                      <LockIcon v-if="!isUnlocked.attenuation" class="btn-icon" />
                      <UnlockIcon v-else class="btn-icon" />
                      {{ isUnlocked.attenuation ? '锁定' : '解锁' }}
                    </button>
                    <button class="btn-set" @click="setParam('attenuation')">
                      <SendIcon class="btn-icon" />
                      设置
                    </button>
                  </div>
                </div>

                <!-- Row 3: 静默控制 -->
                <div class="control-row">
                  <div class="control-info">
                    <span class="control-name">静默控制</span>
                    <span class="control-desc">MUTE CONTROL</span>
                  </div>
                  <div class="control-input-wrapper">
                    <div class="toggle-group">
                      <button
                        class="toggle-btn"
                        :class="{ active: controlParams.mute === 'off' }"
                        @click="setMute('off')"
                      >
                        OFF
                      </button>
                      <button
                        class="toggle-btn"
                        :class="{ active: controlParams.mute === 'on' }"
                        @click="setMute('on')"
                      >
                        ON
                      </button>
                    </div>
                  </div>
                  <div class="control-actions">
                    <button
                      class="btn-unlock"
                      :class="{ unlocked: isUnlocked.mute }"
                      @click="toggleLock('mute')"
                    >
                      <LockIcon v-if="!isUnlocked.mute" class="btn-icon" />
                      <UnlockIcon v-else class="btn-icon" />
                      {{ isUnlocked.mute ? '锁定' : '解锁' }}
                    </button>
                    <button class="btn-set" @click="setParam('mute')">
                      <SendIcon class="btn-icon" />
                      设置
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- Panel Footer -->
          <div class="panel-footer">
            <button class="btn-reset" @click="resetParams">
              <ResetIcon class="btn-icon" />
              取消重置
            </button>
            <button class="btn-close" @click="closePanel">
              关闭窗口
            </button>
          </div>
        </div>
      </div>
    </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, h } from 'vue'
import { useRouter } from 'vue-router'
import UserIcon from '@/components/icons/UserIcon.vue'
import LockIcon from '@/components/icons/LockIcon.vue'

const router = useRouter()

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

// Icons for side menu
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

const ConverterIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' }, [
      h('path', { d: 'M7 16V4M17 8v12M3 12h4m10 0h4' })
    ])
  }
}

const UnlockIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('rect', { x: '3', y: '11', width: '18', height: '11', rx: '2', ry: '2' }),
      h('path', { d: 'M7 11V7a5 5 0 0 1 9.9-1' })
    ])
  }
}

const SendIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('line', { x1: '22', y1: '2', x2: '11', y2: '13' }),
      h('polygon', { points: '22 2 15 22 11 13 2 9 22 2' })
    ])
  }
}

const RefreshIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('polyline', { points: '23 4 23 10 17 10' }),
      h('polyline', { points: '1 20 1 14 7 14' }),
      h('path', { d: 'M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15' })
    ])
  }
}

const ResetIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12' }),
      h('path', { d: 'M3 3v9h9' })
    ])
  }
}

// 设备列表
const deviceList = [
  { id: 'converter-01', name: '变频单元-01' },
  { id: 'converter-02', name: '变频单元-02' },
  { id: 'lna-01', name: '低噪放大-01' },
  { id: 'lna-02', name: '低噪放大-02' },
  { id: 'antenna-01', name: '天线控制-01' },
  { id: 'antenna-02', name: '天线控制-02' },
  { id: 'power-01', name: '电源管理-01' },
  { id: 'power-02', name: '电源管理-02' }
]

// 状态
const showSubMenu = ref(true)
const selectedDevice = ref('converter-01')

// 计算当前设备名称
const currentDeviceName = computed(() => {
  const device = deviceList.find(d => d.id === selectedDevice.value)
  return device ? device.name : '未知设备'
})

// 实时状态数据
const realTimeStatus = ref({
  inputLevel: -45.2,
  outputLevel: -15.0,
  currentGain: 30.2,
  pllLocked: true,
  temperature: 38.5
})

// 控制参数
const controlParams = ref({
  frequency: '2250.00',
  attenuation: '10.5',
  mute: 'off'
})

// 解锁状态
const isUnlocked = ref({
  frequency: false,
  attenuation: false,
  mute: false
})

// 原始值（用于重置）
const originalParams = ref({ ...controlParams.value })

// 切换子菜单显示
const toggleSubMenu = () => {
  showSubMenu.value = !showSubMenu.value
}

// 选择设备
const selectDevice = (deviceId: string) => {
  selectedDevice.value = deviceId
  // 重置所有解锁状态
  isUnlocked.value = {
    frequency: false,
    attenuation: false,
    mute: false
  }
  // 模拟加载新设备数据
  refreshData()
}

// 切换锁定状态
const toggleLock = (param: keyof typeof isUnlocked.value) => {
  isUnlocked.value[param] = !isUnlocked.value[param]
}

// 设置静音
const setMute = (value: string) => {
  if (isUnlocked.value.mute) {
    controlParams.value.mute = value
  }
}

// 设置参数
const setParam = (param: string) => {
  console.log(`设置 ${param}:`, controlParams.value[param as keyof typeof controlParams.value])
  alert(`已发送设置命令: ${param} = ${controlParams.value[param as keyof typeof controlParams.value]}`)
}

// 重置参数
const resetParams = () => {
  controlParams.value = { ...originalParams.value }
  isUnlocked.value = {
    frequency: false,
    attenuation: false,
    mute: false
  }
}

// 关闭面板
const closePanel = () => {
  router.push('/topology')
}

// 刷新数据
const refreshData = () => {
  // 模拟数据刷新
  realTimeStatus.value.inputLevel = Number((-45 + Math.random() * 2 - 1).toFixed(1))
  realTimeStatus.value.outputLevel = Number((-15 + Math.random() * 2 - 1).toFixed(1))
  realTimeStatus.value.currentGain = Number((30 + Math.random() * 0.5).toFixed(1))
  realTimeStatus.value.temperature = Number((38 + Math.random() * 2).toFixed(1))
}

// 定时更新实时数据
let dataInterval: number | null = null

onMounted(() => {
  // 每2秒更新一次实时数据
  dataInterval = window.setInterval(() => {
    realTimeStatus.value.inputLevel = Number((-45 + Math.random() * 2 - 1).toFixed(1))
    realTimeStatus.value.outputLevel = Number((-15 + Math.random() * 2 - 1).toFixed(1))
    realTimeStatus.value.currentGain = Number((30 + Math.random() * 0.5).toFixed(1))
    realTimeStatus.value.temperature = Number((38 + Math.random() * 2).toFixed(1))
  }, 2000)
})

onUnmounted(() => {
  if (dataInterval) {
    clearInterval(dataInterval)
  }
})
</script>

<style scoped>
/* CSS Variables */
:root {
  --primary: #1C6AFF;
  --error: #ED3B3B;
  --success: #4ae176;
  --surface: #EDEFF3;
  --surface-container: #F7F8FB;
  --surface-container-low: #F7F8FB;
  --surface-container-high: #F7F8FB;
  --surface-container-highest: #F7F8FB;
  --on-surface: #4B4C57;
  --on-surface-variant: #7F808F;
  --outline: #9C9DA6;
  --outline-variant: #DFE3EA;
}

.other-devices-page {
  min-height: 100vh;
  background-color: #EDEFF3;
  color: #4B4C57;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

/* TopNavBar */
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: #EDEFF3;
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
  color: #4B4C57;
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

.nav-link:hover,
.nav-link.active {
  color: #4B4C57;
}

.nav-link.active {
  color: #4B4C57;
  border-bottom-color: #4B4C57;
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
  color: #9C9DA6;
  cursor: pointer;
  padding: 8px;
  transition: color 0.2s;
}

.icon-btn:hover {
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


/* SideNavBar */
.side-nav {
  position: fixed;
  left: 0;
  top: 64px;
  bottom: 0;
  width: 256px;
  background: #EDEFF3;
  display: flex;
  flex-direction: column;
  z-index: 40;
}

.side-header {
  padding: 32px 24px 24px;
}

.side-title {
  font-size: 12px;
  color: #4B4C57;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 4px 0;
}

.side-subtitle {
  font-size: 10px;
  color: #9C9DA6;
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
  color: #9C9DA6;
  text-decoration: none;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s;
  border-right: 2px solid transparent;
}

.side-link:hover {
  color: #1C6AFF;
  background: rgba(0, 0, 0, 0.05);
}

.side-link.active {
  color: #4B4C57;
  background: rgba(28, 106, 255, 0.1);
  border-right-color: #4B4C57;
  font-weight: 600;
}

.side-icon {
  width: 20px;
  height: 20px;
}

/* Side Link Group (for expandable menu) */
.side-link-group {
  display: flex;
  flex-direction: column;
}

.side-link-group .side-link {
  cursor: pointer;
}

.expand-icon {
  margin-left: auto;
  font-size: 10px;
  transition: transform 0.3s;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

/* Sub Menu */
.sub-menu {
  background: rgba(0, 0, 0, 0.1);
  padding: 4px 0;
}

.sub-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 24px 8px 48px;
  color: #9C9DA6;
  text-decoration: none;
  font-size: 11px;
  transition: all 0.2s;
}

.sub-link:hover {
  color: #1C6AFF;
  background: rgba(0, 0, 0, 0.03);
}

.sub-link.active {
  color: #4B4C57;
  background: rgba(59, 130, 246, 0.08);
}

.sub-link-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #9C9DA6;
}

.sub-link.active .sub-link-dot {
  background: #1C6AFF;
  box-shadow: 0 0 6px rgba(28, 106, 255, 0.5);
}

.side-footer {
  margin-top: auto;
  padding: 24px;
}

.health-card {
  background: #F7F8FB;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.health-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.health-label {
  font-size: 10px;
  color: #9C9DA6;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.health-bar {
  height: 4px;
  background: #DFE3EA;
  border-radius: 2px;
  overflow: hidden;
}

.health-fill {
  height: 100%;
  background: #1C6AFF;
  border-radius: 2px;
  transition: width 0.3s;
}

/* Main Content */
.main-content {
  position: relative;
  overflow: hidden;
}

.content-wrapper {
  padding: 32px;
  position: relative;
  z-index: 10;
  padding-bottom: 128px;
}

.bg-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  pointer-events: none;
}

.bg-glow.top-right {
  right: -256px;
  top: -256px;
  width: 800px;
  height: 800px;
  background: rgba(28, 106, 255, 0.05);
}

.bg-glow.bottom-right {
  right: 0;
  bottom: 0;
  width: 400px;
  height: 400px;
  background: rgba(0, 167, 75, 0.05);
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #4B4C57;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.page-subtitle {
  font-family: 'Microsoft YaHei', monospace;
  font-size: 14px;
  color: rgba(28, 106, 255, 0.7);
  margin: 0;
}

/* Device Panel */
.device-panel {
  background: rgba(247, 248, 251, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

/* Panel Header */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: rgba(42, 41, 47, 0.8);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.panel-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.panel-icon {
  width: 20px;
  height: 20px;
  color: #1C6AFF;
}

.panel-title {
  font-size: 18px;
  font-weight: 700;
  color: #4B4C57;
  margin: 0;
  letter-spacing: 0.02em;
}

.panel-actions {
  display: flex;
  gap: 12px;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(28, 106, 255, 0.1);
  border: 1px solid rgba(28, 106, 250, 0.2);
  border-radius: 4px;
  color: #4B4C57;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover {
  background: rgba(28, 106, 250, 0.2);
}

.refresh-icon {
  width: 14px;
  height: 14px;
}

/* Panel Content */
.panel-content {
  padding: 24px;
}

/* Status Section */
.status-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.section-marker {
  width: 4px;
  height: 20px;
  border-radius: 2px;
}

.section-marker.success {
  background: #4ae176;
}

.section-marker.primary {
  background: #1C6AFF;
}

.section-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.section-title.success {
  color: #4ae176;
}

.section-title.primary {
  color: #1C6AFF;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 8px;
  background: rgba(247, 248, 251, 0.9);
  padding: 20px;
  border-radius: 8px;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.status-label {
  font-size: 10px;
  color: #9C9DA6;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-value {
  font-family: 'Microsoft YaHei', monospace;
  font-size: 20px;
  color: #4B4C57;
  font-weight: 500;
}

.status-value.highlight {
  color: #1C6AFF;
}

.unit {
  font-size: 12px;
  color: #9C9DA6;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.success {
  background: #4ae176;
  box-shadow: 0 0 8px rgba(0, 167, 75, 0.5);
}

.status-text.success {
  color: #4ae176;
  font-size: 14px;
  font-weight: 500;
}

/* Control Section */
.control-section {
  margin-bottom: 16px;
}

.control-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.control-row {
  display: flex;
  align-items: center;
  padding: 16px;
  background: rgba(247, 248, 251, 0.7);
  border-radius: 8px;
  transition: background 0.2s;
}

.control-row:hover {
  background: rgba(247, 248, 251, 0.9);
}

.control-info {
  width: 200px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.control-name {
  font-size: 14px;
  font-weight: 500;
  color: #4B4C57;
}

.control-desc {
  font-size: 10px;
  color: #9C9DA6;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.control-input-wrapper {
  flex: 1;
  padding: 0 16px;
}

.control-input {
  width: 100%;
  background: #F2F4F7;
  border: 1px solid transparent;
  color: #4B4C57;
  font-family: 'Microsoft YaHei', monospace;
  font-size: 14px;
  padding: 10px 16px;
  border-radius: 4px;
  text-align: right;
  outline: none;
  transition: all 0.2s;
}

.control-input:not([readonly]) {
  border-color: rgba(28, 106, 255, 0.3);
}

.control-input:not([readonly]):focus {
  border-color: rgba(28, 106, 255, 0.5);
  box-shadow: 0 0 0 2px rgba(28, 106, 255, 0.1);
}

.toggle-group {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
}

.toggle-btn {
  padding: 8px 20px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  background: #DFE3EA;
  color: #9C9DA6;
}

.toggle-btn.active {
  background: rgba(237, 59, 59, 0.15);
  color: #ED3B3B;
}

.control-actions {
  display: flex;
  gap: 8px;
  width: 180px;
  justify-content: flex-end;
}

.btn-unlock {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: transparent;
  border: 1px solid rgba(28, 106, 255, 0.2);
  border-radius: 4px;
  color: #1C6AFF;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-unlock:hover {
  background: rgba(28, 106, 255, 0.1);
}

.btn-unlock.unlocked {
  background: rgba(0, 167, 75, 0.1);
  border-color: rgba(0, 167, 75, 0.3);
  color: #4ae176;
}

.btn-set {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: #1C6AFF;
  border: none;
  border-radius: 4px;
  color: #1C6AFF;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-set:hover {
  box-shadow: 0 0 15px rgba(28, 106, 255, 0.4);
}

.btn-icon {
  width: 12px;
  height: 12px;
}

/* Panel Footer */
.panel-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  background: rgba(247, 248, 251, 0.9);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.btn-reset {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: transparent;
  border: 1px solid rgba(140, 144, 159, 0.3);
  border-radius: 4px;
  color: #9C9DA6;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reset:hover {
  color: #4B4C57;
  border-color: rgba(255, 255, 255, 0.3);
}

.btn-close {
  padding: 10px 24px;
  background: #4B4C57;
  border: none;
  border-radius: 4px;
  color: #EDEFF3;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #4B4C57;
}

/* Responsive */
@media (max-width: 1200px) {
  .control-row {
    flex-wrap: wrap;
    gap: 12px;
  }

  .control-info {
    width: 100%;
  }

  .control-input-wrapper {
    flex: 1;
    min-width: 200px;
  }

  .control-actions {
    width: auto;
  }
}

@media (max-width: 1024px) {
  .side-nav {
    transform: translateX(-100%);
  }
  .main-nav {
    display: none;
  }
}
</style>
