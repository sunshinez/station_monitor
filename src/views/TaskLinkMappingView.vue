<template>
  <main class="main-content">
    <!-- 任务选择栏 -->
    <div class="mission-bar">
      <div class="mission-select-group">
        <label class="select-label">任务选择</label>
        <div class="select-wrapper">
          <select class="mission-select" v-model="selectedMission">
            <option v-for="mission in missions" :key="mission.id" :value="mission.id">
              {{ mission.name }}
            </option>
          </select>
          <ExpandMoreIcon class="select-icon" />
        </div>
      </div>
      <button class="btn-save" @click="saveChanges">保存更改</button>
    </div>

    <!-- 前向链路 -->
    <div class="link-panel uplink-panel">
      <div class="panel-header">
        <h2 class="panel-title">
          <ArrowUpwardIcon class="panel-icon" />
          前向链路 (Uplink)
        </h2>
        <div class="status-badges">
          <span class="badge badge-success">4 条链路</span>
          <span class="badge badge-default">数据流向: 基带 → 变频器 → 功放 → 天线</span>
        </div>
      </div>

      <div class="links-table">
        <div class="links-table-header">
          <div class="th-link">链路编号</div>
          <div class="th-device">基带设备</div>
          <div class="th-device">变频器</div>
          <div class="th-device">功放设备</div>
          <div class="th-flow">流向</div>
        </div>
        <div
          v-for="(link, index) in forwardLinks"
          :key="`fw-${index}`"
          class="link-row"
        >
          <div class="td-link">
            <span class="link-index">链路 {{ index + 1 }}</span>
          </div>
          <div class="td-device">
            <select
              class="device-select"
              :value="link.baseband || ''"
              @change="handleSelect('forward', index, 'baseband', ($event.target as HTMLSelectElement).value)"
            >
              <option value="" disabled>请选择基带</option>
              <option
                v-for="dev in forwardDevices.baseband"
                :key="dev.id"
                :value="dev.id"
                :disabled="isDeviceDisabled('forward', 'baseband', dev.id, index)"
              >
                {{ dev.name }}{{ dev.isBackup ? ' (备用)' : '' }}
                {{ getDeviceDisabledReason('forward', 'baseband', dev.id, index) }}
              </option>
            </select>
          </div>
          <div class="td-device">
            <select
              class="device-select"
              :value="link.converter || ''"
              @change="handleSelect('forward', index, 'converter', ($event.target as HTMLSelectElement).value)"
            >
              <option value="" disabled>请选择变频器</option>
              <option
                v-for="dev in forwardDevices.converter"
                :key="dev.id"
                :value="dev.id"
                :disabled="isDeviceDisabled('forward', 'converter', dev.id, index)"
              >
                {{ dev.name }}{{ dev.isBackup ? ' (备用)' : '' }}
                {{ getDeviceDisabledReason('forward', 'converter', dev.id, index) }}
              </option>
            </select>
          </div>
          <div class="td-device">
            <select
              class="device-select"
              :value="link.pa || ''"
              @change="handleSelect('forward', index, 'pa', ($event.target as HTMLSelectElement).value)"
            >
              <option value="" disabled>请选择功放</option>
              <option
                v-for="dev in forwardDevices.pa"
                :key="dev.id"
                :value="dev.id"
                :disabled="isDeviceDisabled('forward', 'pa', dev.id, index)"
              >
                {{ dev.name }}{{ dev.isBackup ? ' (备用)' : '' }}
                {{ getDeviceDisabledReason('forward', 'pa', dev.id, index) }}
              </option>
            </select>
          </div>
          <div class="td-flow">
            <div class="mini-flow forward">
              <span class="mini-node">BB</span>
              <span class="mini-arrow">→</span>
              <span class="mini-node">UC</span>
              <span class="mini-arrow">→</span>
              <span class="mini-node">PA</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 反向链路 -->
    <div class="link-panel downlink-panel">
      <div class="panel-header">
        <h2 class="panel-title">
          <ArrowDownwardIcon class="panel-icon" />
          反向链路 (Downlink)
        </h2>
        <div class="status-badges">
          <span class="badge badge-primary">8 条链路</span>
          <span class="badge badge-default">数据流向: 天线 → 功放 → 变频器 → 基带</span>
        </div>
      </div>

      <div class="links-table">
        <div class="links-table-header">
          <div class="th-link">链路编号</div>
          <div class="th-device">功放设备</div>
          <div class="th-device">变频器</div>
          <div class="th-device">基带设备</div>
          <div class="th-flow">流向</div>
        </div>
        <div
          v-for="(link, index) in reverseLinks"
          :key="`rv-${index}`"
          class="link-row"
        >
          <div class="td-link">
            <span class="link-index">链路 {{ index + 1 }}</span>
          </div>
          <div class="td-device">
            <select
              class="device-select"
              :value="link.pa || ''"
              @change="handleSelect('reverse', index, 'pa', ($event.target as HTMLSelectElement).value)"
            >
              <option value="" disabled>请选择功放</option>
              <option
                v-for="dev in reverseDevices.pa"
                :key="dev.id"
                :value="dev.id"
                :disabled="isDeviceDisabled('reverse', 'pa', dev.id, index)"
              >
                {{ dev.name }}{{ dev.isBackup ? ' (备用)' : '' }}
                {{ getDeviceDisabledReason('reverse', 'pa', dev.id, index) }}
              </option>
            </select>
          </div>
          <div class="td-device">
            <select
              class="device-select"
              :value="link.converter || ''"
              @change="handleSelect('reverse', index, 'converter', ($event.target as HTMLSelectElement).value)"
            >
              <option value="" disabled>请选择变频器</option>
              <option
                v-for="dev in reverseDevices.converter"
                :key="dev.id"
                :value="dev.id"
                :disabled="isDeviceDisabled('reverse', 'converter', dev.id, index)"
              >
                {{ dev.name }}{{ dev.isBackup ? ' (备用)' : '' }}
                {{ getDeviceDisabledReason('reverse', 'converter', dev.id, index) }}
              </option>
            </select>
          </div>
          <div class="td-device">
            <select
              class="device-select"
              :value="link.baseband || ''"
              @change="handleSelect('reverse', index, 'baseband', ($event.target as HTMLSelectElement).value)"
            >
              <option value="" disabled>请选择基带</option>
              <option
                v-for="dev in reverseDevices.baseband"
                :key="dev.id"
                :value="dev.id"
                :disabled="isDeviceDisabled('reverse', 'baseband', dev.id, index)"
              >
                {{ dev.name }}{{ dev.isBackup ? ' (备用)' : '' }}
                {{ getDeviceDisabledReason('reverse', 'baseband', dev.id, index) }}
              </option>
            </select>
          </div>
          <div class="td-flow">
            <div class="mini-flow reverse">
              <span class="mini-node">PA</span>
              <span class="mini-arrow">→</span>
              <span class="mini-node">UC</span>
              <span class="mini-arrow">→</span>
              <span class="mini-node">BB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'

type DeviceType = 'baseband' | 'converter' | 'pa'

interface Device {
  id: string
  name: string
  status: 'normal' | 'fault'
  isBackup: boolean
}

interface LinkConfig {
  baseband: string | null
  converter: string | null
  pa: string | null
}

// Icons
const ExpandMoreIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('polyline', { points: '6 9 12 15 18 9' })
    ])
  }
}

const ArrowUpwardIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('line', { x1: '12', y1: '19', x2: '12', y2: '5' }),
      h('polyline', { points: '5 12 12 5 19 12' })
    ])
  }
}

const ArrowDownwardIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('line', { x1: '12', y1: '5', x2: '12', y2: '19' }),
      h('polyline', { points: '19 12 12 19 5 12' })
    ])
  }
}

// 任务数据
const selectedMission = ref('alpha7')
const missions = ref([
  { id: 'alpha7', name: 'Alpha-7 综合测控任务' },
  { id: 'beta2', name: 'Beta-2 轨道维持任务' },
  { id: 'gamma9', name: 'Gamma-9 数据接收任务' }
])

// 创建设备池辅助函数
function createDevices(prefix: string, count: number, faultIndices: number[] = []): Device[] {
  const devices: Device[] = []
  for (let i = 1; i <= count; i++) {
    devices.push({
      id: `${prefix}-${i}`,
      name: `${prefix}-${String(i).padStart(2, '0')}`,
      status: faultIndices.includes(i) ? 'fault' : 'normal',
      isBackup: false
    })
  }
  devices.push({
    id: `${prefix}-BK`,
    name: `${prefix}-备用`,
    status: 'normal',
    isBackup: true
  })
  return devices
}

// 前向设备池：4个子设备 + 1个备用
const forwardDevices = ref<Record<DeviceType, Device[]>>({
  baseband: createDevices('前向基带', 4, [3]),
  converter: createDevices('上变频器', 4, []),
  pa: createDevices('前向功放', 4, [2])
})

// 反向设备池：8个子设备 + 1个备用
const reverseDevices = ref<Record<DeviceType, Device[]>>({
  baseband: createDevices('反向基带', 8, [5]),
  converter: createDevices('下变频器', 8, []),
  pa: createDevices('反向功放', 8, [4, 7])
})

// 链路配置
const forwardLinks = ref<LinkConfig[]>([
  { baseband: null, converter: null, pa: null },
  { baseband: null, converter: null, pa: null },
  { baseband: null, converter: null, pa: null },
  { baseband: null, converter: null, pa: null }
])

const reverseLinks = ref<LinkConfig[]>(Array.from({ length: 8 }, () => ({
  baseband: null,
  converter: null,
  pa: null
})))

function getLinks(direction: 'forward' | 'reverse'): LinkConfig[] {
  return direction === 'forward' ? forwardLinks.value : reverseLinks.value
}

function getDevices(direction: 'forward' | 'reverse', type: DeviceType): Device[] {
  return direction === 'forward' ? forwardDevices.value[type] : reverseDevices.value[type]
}

// 判断设备是否被禁用
function isDeviceDisabled(
  direction: 'forward' | 'reverse',
  type: DeviceType,
  deviceId: string,
  currentLinkIndex: number
): boolean {
  const devices = getDevices(direction, type)
  const device = devices.find(d => d.id === deviceId)
  if (!device) return true
  if (device.status === 'fault') return true

  const links = getLinks(direction)
  const usedInOther = links.some((link, idx) => {
    return idx !== currentLinkIndex && link[type] === deviceId
  })
  return usedInOther
}

// 获取禁用原因文字
function getDeviceDisabledReason(
  direction: 'forward' | 'reverse',
  type: DeviceType,
  deviceId: string,
  currentLinkIndex: number
): string {
  const devices = getDevices(direction, type)
  const device = devices.find(d => d.id === deviceId)
  if (!device) return ''
  if (device.status === 'fault') return ' [故障]'

  const links = getLinks(direction)
  const usedInOtherIndex = links.findIndex((link, idx) => {
    return idx !== currentLinkIndex && link[type] === deviceId
  })
  if (usedInOtherIndex !== -1) {
    return ` [已被链路${usedInOtherIndex + 1}使用]`
  }
  return ''
}

// 处理选择
function handleSelect(
  direction: 'forward' | 'reverse',
  linkIndex: number,
  type: DeviceType,
  value: string
) {
  const links = direction === 'forward' ? forwardLinks : reverseLinks
  links.value[linkIndex][type] = value || null
}

// 保存
function saveChanges() {
  // 校验前向链路
  for (let i = 0; i < forwardLinks.value.length; i++) {
    const link = forwardLinks.value[i]
    if (!link.baseband || !link.converter || !link.pa) {
      alert(`前向链路 ${i + 1} 存在未选择的设备，请完善后再保存`)
      return
    }
  }
  // 校验反向链路
  for (let i = 0; i < reverseLinks.value.length; i++) {
    const link = reverseLinks.value[i]
    if (!link.baseband || !link.converter || !link.pa) {
      alert(`反向链路 ${i + 1} 存在未选择的设备，请完善后再保存`)
      return
    }
  }

  const payload = {
    mission: selectedMission.value,
    forward: forwardLinks.value,
    reverse: reverseLinks.value
  }
  console.log('保存链路映射:', payload)
  alert('链路映射配置已保存')
}
</script>

<style scoped>
.task-link-mapping-page {
  min-height: 100vh;
  background-color: var(--gs-bg-default);
  color: var(--gs-text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* 主内容区 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  overflow-y: auto;
  margin-bottom: 40px;
}

/* 任务选择栏 */
.mission-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: color-mix(in srgb, var(--gs-bg-default), transparent 60%);
  padding: 20px 24px;
  border-radius: 8px;
  border: 1px solid var(--gs-overlay-light);
  margin-bottom: 24px;
}

.mission-select-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.select-label {
  font-size: 13px;
  color: var(--gs-text-disabled);
}

.select-wrapper {
  position: relative;
}

.mission-select {
  background: var(--gs-bg-paper);
  border: 1px solid var(--gs-overlay-medium);
  border-radius: 4px;
  padding: 10px 40px 10px 16px;
  color: var(--gs-text-primary);
  font-size: 13px;
  min-width: 280px;
  appearance: none;
  cursor: pointer;
  outline: none;
}

.mission-select:focus {
  border-color: var(--gs-primary-main);
}

.select-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--gs-text-disabled);
  pointer-events: none;
}

.btn-save {
  background: var(--gs-primary-main);
  color: var(--gs-text-primary);
  border: none;
  padding: 10px 32px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px var(--gs-glow-primary);
}

.btn-save:hover {
  background: var(--gs-primary-main);
  transform: translateY(-1px);
}

.btn-save:active {
  transform: scale(0.98);
}

/* 链路面板 */
.link-panel {
  background: color-mix(in srgb, var(--gs-bg-default), transparent 40%);
  border-radius: 12px;
  border: 1px solid var(--gs-overlay-light);
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 4px 24px -2px var(--gs-overlay-dark);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 700;
  color: var(--gs-text-primary);
  margin: 0;
}

.uplink-panel .panel-title {
  color: var(--gs-primary-main);
}

.downlink-panel .panel-title {
  color: var(--gs-primary-main);
}

.panel-icon {
  width: 24px;
  height: 24px;
}

.status-badges {
  display: flex;
  gap: 12px;
}

.badge {
  font-size: 11px;
  padding: 4px 12px;
  border-radius: 4px;
  font-family: 'Fira Code', monospace;
}

.badge-success {
  background: var(--gs-overlay-light);
  color: var(--gs-success-main);
  border: 1px solid var(--gs-overlay-medium);
}

.badge-primary {
  background: var(--gs-overlay-light);
  color: var(--gs-primary-main);
  border: 1px solid var(--gs-overlay-medium);
}

.badge-default {
  background: var(--gs-bg-paper);
  color: var(--gs-text-disabled);
}

/* 链路表格 */
.links-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.links-table-header {
  display: grid;
  grid-template-columns: 100px 1fr 1fr 1fr 140px;
  gap: 16px;
  padding: 0 16px;
  font-size: 11px;
  color: var(--gs-text-disabled);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.th-link,
.th-device,
.th-flow {
  display: flex;
  align-items: center;
}

.link-row {
  display: grid;
  grid-template-columns: 100px 1fr 1fr 1fr 140px;
  gap: 16px;
  align-items: center;
  background: var(--gs-bg-paper);
  border: 1px solid var(--gs-overlay-light);
  border-radius: 8px;
  padding: 16px;
  transition: all 0.2s;
}

.link-row:hover {
  border-color: var(--gs-overlay-medium);
}

.td-link {
  display: flex;
  align-items: center;
}

.link-index {
  font-size: 13px;
  font-weight: 600;
  color: var(--gs-text-primary);
  font-family: 'Fira Code', monospace;
}

.td-device {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.device-select {
  width: 100%;
  background: var(--gs-bg-default);
  border: 1px solid var(--gs-overlay-medium);
  border-radius: 6px;
  padding: 10px 12px;
  color: var(--gs-text-primary);
  font-size: 13px;
  outline: none;
  cursor: pointer;
  transition: all 0.2s;
}

.device-select:focus {
  border-color: var(--gs-primary-main);
}

.device-select option:disabled {
  color: var(--gs-text-disabled);
  background: var(--gs-bg-paper);
}

.device-select option {
  background: var(--gs-bg-paper);
  color: var(--gs-text-primary);
  padding: 8px;
}

.td-flow {
  display: flex;
  align-items: center;
  justify-content: center;
}

.mini-flow {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-family: 'Fira Code', monospace;
  padding: 6px 10px;
  border-radius: 4px;
  background: var(--gs-overlay-light);
}

.mini-flow.forward {
  color: var(--gs-success-main);
}

.mini-flow.reverse {
  color: var(--gs-primary-main);
}

.mini-node {
  padding: 2px 6px;
  border-radius: 3px;
  background: var(--gs-overlay-light);
}

.mini-arrow {
  opacity: 0.7;
}

/* 响应式 */
@media (max-width: 1200px) {
  .links-table-header,
  .link-row {
    grid-template-columns: 80px 1fr 1fr 1fr 120px;
    gap: 12px;
  }
}

@media (max-width: 1024px) {
  .links-table-header,
  .link-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .links-table-header {
    display: none;
  }

  .link-row {
    padding: 12px;
  }

  .td-flow {
    justify-content: flex-start;
  }
}
</style>
