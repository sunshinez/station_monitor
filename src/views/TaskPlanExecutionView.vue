<template>
  <main class="main-content">
        <!-- 页面头部 -->
        <div class="content-header">
          <div class="header-left">
            <h1 class="page-title">操作计划生成</h1>
            <p class="page-subtitle">Operation Plan Execution & Device Real-time Status</p>
          </div>
          <div class="header-right">
            <span class="time-label">当前系统时间 (UTC)</span>
            <span class="time-value mono">{{ currentTime }}</span>
          </div>
        </div>

        <!-- 顶部4设备参数卡片 -->
        <div class="device-cards">
          <div class="device-card">
            <div class="device-card-header">
              <AntennaIcon class="device-icon" />
              <h3 class="device-title">天线设备状态</h3>
            </div>
            <div class="device-params mono">
              <div class="param-row">
                <span class="param-label">方位角</span>
                <span class="param-value">142.55°</span>
              </div>
              <div class="param-row">
                <span class="param-label">俯仰角</span>
                <span class="param-value">45.20°</span>
              </div>
              <div class="param-row">
                <span class="param-label">跟踪状态</span>
                <span class="param-value status-success">
                  <span class="status-dot pulse"></span>
                  自动跟踪中
                </span>
              </div>
            </div>
          </div>

          <div class="device-card">
            <div class="device-card-header">
              <SwapCallsIcon class="device-icon" />
              <h3 class="device-title">变频设备状态</h3>
            </div>
            <div class="device-params mono">
              <div class="param-row">
                <span class="param-label">本振频率</span>
                <span class="param-value">2250.00 MHz</span>
              </div>
              <div class="param-row">
                <span class="param-label">衰减值</span>
                <span class="param-value">15.5 dB</span>
              </div>
              <div class="param-row">
                <span class="param-label">输出电平</span>
                <span class="param-value">-22.4 dBm</span>
              </div>
            </div>
          </div>

          <div class="device-card">
            <div class="device-card-header">
              <RouterIcon class="device-icon" />
              <h3 class="device-title">基带设备状态</h3>
            </div>
            <div class="device-params mono">
              <div class="param-row">
                <span class="param-label">解调方式</span>
                <span class="param-value">QPSK / LDPC</span>
              </div>
              <div class="param-row">
                <span class="param-label">码速率</span>
                <span class="param-value">120.00 Mbps</span>
              </div>
              <div class="param-row">
                <span class="param-label">锁定状态</span>
                <span class="param-value status-success">帧锁定</span>
              </div>
            </div>
          </div>

          <div class="device-card">
            <div class="device-card-header">
              <DatabaseIcon class="device-icon" />
              <h3 class="device-title">数据分发与存储</h3>
            </div>
            <div class="device-params mono">
              <div class="param-row">
                <span class="param-label">剩余容量</span>
                <span class="param-value">8.42 TB / 12 TB</span>
              </div>
              <div class="param-row">
                <span class="param-label">写入速度</span>
                <span class="param-value text-secondary">155.2 MB/s</span>
              </div>
              <div class="param-row">
                <span class="param-label">通道状态</span>
                <span class="param-value">运行中 (通道-01)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 中部控制与实时状态 -->
        <div class="control-row">
          <!-- 执行控制 -->
          <div class="control-panel">
            <div class="panel-header-bar">
              <h3 class="panel-title">
                <GamepadIcon class="panel-icon" />
                执行控制
              </h3>
              <span class="panel-badge">人工干预模式</span>
            </div>
            <div class="control-buttons">
              <button class="control-btn btn-abort">
                <CancelIcon class="control-btn-icon" />
                <span class="control-btn-label">中止 (Abort)</span>
              </button>
              <button class="control-btn btn-pause">
                <PauseCircleIcon class="control-btn-icon" />
                <span class="control-btn-label">暂停 (Pause)</span>
              </button>
              <button class="control-btn btn-resume">
                <PlayCircleIcon class="control-btn-icon" />
                <span class="control-btn-label">接续 (Resume)</span>
              </button>
              <button class="control-btn btn-skip">
                <SkipNextIcon class="control-btn-icon" />
                <span class="control-btn-label">跳转 (Skip)</span>
              </button>
            </div>
          </div>

          <!-- 应急脚本实时调度 -->
          <div class="script-panel">
            <div class="panel-header-bar border-bottom">
              <h3 class="panel-title text-error">
                <EmergencyShareIcon class="panel-icon" />
                应急脚本实时调度
              </h3>
              <span class="panel-badge">实时指令流</span>
            </div>
            <div class="script-log">
              <div class="log-entry" v-for="(log, idx) in scriptLogs" :key="idx">
                <span class="log-time mono">{{ log.time }}</span>
                <span :class="['log-tag', log.tagClass]">{{ log.tag }}</span>
                <span :class="['log-message', log.messageClass]">{{ log.message }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 自动化操作计划列表 -->
        <div class="plan-table-panel">
          <div class="panel-header-bar border-bottom">
            <h3 class="panel-title">
              <ViewListIcon class="panel-icon" />
              自动化操作计划列表
            </h3>
            <div class="legend">
              <div class="legend-item">
                <span class="legend-dot dot-success"></span>
                <span class="legend-text">成功</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot dot-primary"></span>
                <span class="legend-text">执行中</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot dot-muted"></span>
                <span class="legend-text">等待中</span>
              </div>
            </div>
          </div>
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>计划名称</th>
                  <th>开始时间</th>
                  <th>结束时间</th>
                  <th>关联任务</th>
                  <th>链路配置</th>
                  <th>参数宏</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(plan, index) in planList" :key="index" :class="['table-row', plan.active ? 'active-row' : '']">
                  <td :class="['plan-name', plan.active ? 'text-primary' : '']">{{ plan.name }}</td>
                  <td :class="['mono', plan.active ? 'text-primary' : '', plan.waiting ? 'text-muted' : '']">{{ plan.startTime }}</td>
                  <td :class="['mono', plan.active ? 'text-primary' : '', plan.waiting ? 'text-muted' : '']">{{ plan.endTime }}</td>
                  <td :class="plan.active ? 'text-white' : (plan.waiting ? 'text-muted' : 'text-dim')">{{ plan.mission }}</td>
                  <td :class="plan.active ? 'text-white' : (plan.waiting ? 'text-muted' : 'text-dim')">{{ plan.link }}</td>
                  <td :class="plan.active ? 'text-white' : (plan.waiting ? 'text-muted' : 'text-dim')">{{ plan.macro }}</td>
                  <td>
                    <span :class="['status-tag', plan.statusClass]">
                      {{ plan.status }}
                      <span v-if="plan.active" class="ping-dot"></span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, h } from 'vue'
import UserIcon from '@/components/icons/UserIcon.vue'

// 顶部导航图标
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

// 侧边栏图标
const BiotechIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M18 12v6a2 2 0 0 0 2 2H4a2 2 0 0 0 2-2v-6' }),
      h('path', { d: 'M12 2v13' }),
      h('path', { d: 'M7 7l5-5 5 5' })
    ])
  }
}

const SettingsInputIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('rect', { x: '3', y: '3', width: '18', height: '18', rx: '2' }),
      h('path', { d: 'M9 12h6' }),
      h('path', { d: 'M12 9v6' })
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

const TerminalIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('polyline', { points: '4 17 10 11 4 5' }),
      h('line', { x1: '12', y1: '19', x2: '20', y2: '19' })
    ])
  }
}

const DescriptionIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
      h('polyline', { points: '14 2 14 8 20 8' })
    ])
  }
}

const InputIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M12 5v14M5 12h14' })
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

const AutoFixHighIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z' })
    ])
  }
}

const PlayCircleIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('polygon', { points: '10 8 16 12 10 16 10 8' })
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

const AltRouteIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M9 18c0 .8.7 1.5 1.5 1.5h4c.8 0 1.5-.7 1.5-1.5' }),
      h('path', { d: 'M12 3v15' }),
      h('path', { d: 'M16 7l-4-4-4 4' }),
      h('path', { d: 'M8 13l4 4 4-4' })
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

// 业务区图标
const AntennaIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M12 2v20' }),
      h('path', { d: 'M2 12h20' }),
      h('circle', { cx: '12', cy: '12', r: '4' })
    ])
  }
}

const SwapCallsIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M17 2l4 4-4 4' }),
      h('path', { d: 'M3 11v-1a4 4 0 0 1 4-4h14' }),
      h('path', { d: 'M7 22l-4-4 4-4' }),
      h('path', { d: 'M21 13v1a4 4 0 0 1-4 4H3' })
    ])
  }
}

const RouterIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('rect', { x: '2', y: '13', width: '20', height: '8', rx: '2' }),
      h('line', { x1: '12', y1: '3', x2: '12', y2: '13' }),
      h('circle', { cx: '18', cy: '17', r: '2' }),
      h('circle', { cx: '6', cy: '17', r: '2' })
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

const GamepadIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('line', { x1: '6', y1: '12', x2: '10', y2: '12' }),
      h('line', { x1: '8', y1: '10', x2: '8', y2: '14' }),
      h('line', { x1: '15', y1: '13', x2: '15.01', y2: '13' }),
      h('line', { x1: '18', y1: '11', x2: '18.01', y2: '11' }),
      h('rect', { x: '2', y: '6', width: '20', height: '12', rx: '2' })
    ])
  }
}

const CancelIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('line', { x1: '15', y1: '9', x2: '9', y2: '15' }),
      h('line', { x1: '9', y1: '9', x2: '15', y2: '15' })
    ])
  }
}

const PauseCircleIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('line', { x1: '10', y1: '15', x2: '10', y2: '9' }),
      h('line', { x1: '14', y1: '15', x2: '14', y2: '9' })
    ])
  }
}

const SkipNextIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('polygon', { points: '5 4 15 12 5 20 5 4' }),
      h('line', { x1: '19', y1: '5', x2: '19', y2: '19' })
    ])
  }
}

const EmergencyShareIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('line', { x1: '12', y1: '8', x2: '12', y2: '12' }),
      h('line', { x1: '12', y1: '16', x2: '12.01', y2: '16' })
    ])
  }
}

const ViewListIcon = {
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

// 数据
const scriptLogs = ref([
  { time: '14:36:01', tag: '[系统]', tagClass: 'tag-success', message: '接收中心指令: 执行应急转储程序 V4', messageClass: '' },
  { time: '14:36:05', tag: '[脚本]', tagClass: 'tag-primary', message: '正在初始化 X频段下行链路参数...', messageClass: '' },
  { time: '14:36:12', tag: '[链路]', tagClass: 'tag-secondary', message: '基带解调器配置完成 (QPSK / 120Mbps)', messageClass: '' },
  { time: '14:36:18', tag: '[系统]', tagClass: 'tag-success', message: '指令同步成功，等待载波捕获。', messageClass: 'text-success' },
  { time: '14:36:25', tag: '[执行]', tagClass: 'tag-primary', message: '设置衰减值 --参数=15.5dB --目标=变频器_01', messageClass: 'text-white pulse' }
])

const planList = ref([
  {
    name: 'LEO_TRACK_001',
    startTime: '14:15:00',
    endTime: '14:28:00',
    mission: 'STARLINK_G12',
    link: 'X-Band / LHCP',
    macro: 'CFG_STD_04',
    status: '成功',
    statusClass: 'tag-success',
    active: false,
    waiting: false
  },
  {
    name: 'LEO_TRACK_002',
    startTime: '14:35:00',
    endTime: '14:50:00',
    mission: 'ORBIT_X_SCAN',
    link: 'Ka-Band / Dual',
    macro: 'CFG_ENH_01',
    status: '执行中',
    statusClass: 'tag-active',
    active: true,
    waiting: false
  },
  {
    name: 'LEO_TRACK_003',
    startTime: '15:05:00',
    endTime: '15:15:00',
    mission: 'RS_DATA_DWN',
    link: 'X-Band / RHCP',
    macro: 'CFG_STD_04',
    status: '准备就绪',
    statusClass: 'tag-ready',
    active: false,
    waiting: true
  }
])

const currentTime = ref('2024-05-20 14:35:08')

// 更新时间
let timeInterval: number | null = null

onMounted(() => {
  timeInterval = window.setInterval(() => {
    const now = new Date()
    currentTime.value = now.toISOString().replace('T', ' ').slice(0, 19)
  }, 1000)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
})
</script>

<style scoped>
.task-plan-execution-page {
  min-height: 100vh;
  background-color: var(--gs-bg-default);
  color: var(--gs-text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* 顶部导航栏 */
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

/* 主布局 */
.main-layout {
  display: flex;
  padding-top: 64px;
  height: 100vh;
  overflow: hidden;
}

/* 侧边栏 */
.side-nav {
  width: 256px;
  background: var(--gs-bg-paper);
  border-right: 1px solid var(--gs-overlay-light);
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  flex-shrink: 0;
}

.side-header {
  padding: 0 24px 24px;
}

.side-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.side-header-icon {
  width: 20px;
  height: 20px;
  color: var(--gs-primary-main);
}

.side-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--gs-text-primary);
  margin: 0;
}

.side-subtitle {
  font-size: 10px;
  color: var(--gs-text-disabled);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin: 0;
  padding-left: 32px;
}

.side-menu {
  flex: 1;
  overflow-y: auto;
  padding: 0 12px;
}

.side-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  color: var(--gs-text-secondary);
  text-decoration: none;
  font-size: 13px;
  border-radius: 4px;
  transition: all 0.2s;
  border-left: 4px solid transparent;
  margin-bottom: 2px;
}

.side-link:hover {
  background: var(--gs-overlay-light);
  color: var(--gs-text-primary);
}

.side-link.active {
  background: var(--gs-bg-paper);
  color: var(--gs-primary-main);
  border-left-color: var(--gs-primary-main);
  font-weight: 600;
}

.side-icon {
  width: 18px;
  height: 18px;
}

/* 主内容区 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  overflow-y: auto;
  position: relative;
  margin-bottom: 32px;
}

/* 内容头部 */
.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--gs-text-primary);
  margin: 0;
}

.page-subtitle {
  font-size: 11px;
  color: var(--gs-text-disabled);
  font-family: 'Fira Code', monospace;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0;
}

.header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.time-label {
  font-size: 10px;
  color: var(--gs-text-disabled);
  text-transform: uppercase;
}

.time-value {
  font-size: 20px;
  color: var(--gs-success-main);
  font-weight: 500;
}

/* 设备卡片 */
.device-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
  flex-shrink: 0;
}

.device-card {
  background: var(--gs-bg-paper);
  border-radius: 8px;
  border: 1px solid var(--gs-overlay-light);
  border-left: 4px solid var(--gs-primary-main);
  padding: 20px;
}

.device-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.device-icon {
  width: 20px;
  height: 20px;
  color: var(--gs-primary-main);
}

.device-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--gs-text-primary);
  margin: 0;
}

.device-params {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.param-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.param-label {
  color: var(--gs-text-disabled);
}

.param-value {
  color: var(--gs-text-primary);
}

.status-success {
  color: var(--gs-success-main);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gs-success-main);
}

.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}

.text-secondary {
  color: var(--gs-primary-main);
}

.text-white {
  color: var(--gs-text-primary);
}

.text-muted {
  color: var(--gs-text-disabled);
}

.text-dim {
  color: var(--gs-text-secondary);
}

.text-primary {
  color: var(--gs-primary-main);
}

.text-error {
  color: var(--gs-error-main);
}

.mono {
  font-family: 'Fira Code', monospace;
}

/* 中部控制行 */
.control-row {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 20px;
  margin-bottom: 20px;
  flex-shrink: 0;
}

.control-panel {
  background: var(--gs-bg-paper);
  border-radius: 8px;
  border: 1px solid var(--gs-overlay-light);
  padding: 20px;
}

.script-panel {
  background: var(--gs-bg-paper);
  border-radius: 8px;
  border: 1px solid var(--gs-overlay-light);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header-bar.border-bottom {
  padding: 16px 20px;
  border-bottom: 1px solid var(--gs-overlay-light);
  background: color-mix(in srgb, var(--gs-bg-paper), transparent 60%);
}

.panel-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--gs-text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.panel-icon {
  width: 18px;
  height: 18px;
}

.panel-badge {
  font-size: 10px;
  color: var(--gs-text-disabled);
  font-family: 'Fira Code', monospace;
  text-transform: uppercase;
}

.control-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.control-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
}

.control-btn-icon {
  width: 24px;
  height: 24px;
}

.control-btn-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.btn-abort {
  background: color-mix(in srgb, var(--gs-error-main), transparent 90%);
  border-color: var(--gs-glow-error);
  color: var(--gs-error-main);
}

.btn-abort:hover {
  background: var(--gs-glow-error);
}

.btn-pause {
  background: color-mix(in srgb, var(--gs-primary-main), transparent 90%);
  border-color: color-mix(in srgb, var(--gs-primary-main), transparent 80%);
  color: var(--gs-primary-main);
}

.btn-pause:hover {
  background: color-mix(in srgb, var(--gs-primary-main), transparent 80%);
}

.btn-resume {
  background: color-mix(in srgb, var(--gs-success-main), transparent 90%);
  border-color: color-mix(in srgb, var(--gs-success-main), transparent 80%);
  color: var(--gs-success-main);
}

.btn-resume:hover {
  background: color-mix(in srgb, var(--gs-success-main), transparent 80%);
}

.btn-skip {
  background: var(--gs-overlay-light);
  border-color: var(--gs-overlay-medium);
  color: var(--gs-primary-main);
}

.btn-skip:hover {
  background: var(--gs-overlay-medium);
}

.script-log {
  flex: 1;
  padding: 16px 20px;
  font-family: 'Fira Code', monospace;
  font-size: 11px;
  background: color-mix(in srgb, var(--gs-overlay-dark), transparent 67%);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.log-entry {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.log-time {
  color: var(--gs-text-disabled);
  white-space: nowrap;
  flex-shrink: 0;
}

.log-tag {
  white-space: nowrap;
  flex-shrink: 0;
}

.tag-success {
  color: var(--gs-success-main);
}

.tag-primary {
  color: var(--gs-primary-main);
}

.tag-secondary {
  color: var(--gs-primary-main);
}

.log-message {
  color: var(--gs-text-secondary);
  flex: 1;
}

/* 计划表格 */
.plan-table-panel {
  flex: 1;
  min-height: 0;
  background: var(--gs-bg-paper);
  border-radius: 8px;
  border: 1px solid var(--gs-overlay-light);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.legend {
  display: flex;
  align-items: center;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--gs-text-disabled);
}

.legend-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.dot-success {
  background: var(--gs-success-main);
}

.dot-primary {
  background: var(--gs-primary-main);
}

.dot-muted {
  background: var(--gs-text-disabled);
}

.table-wrapper {
  flex: 1;
  overflow: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.data-table th {
  background: color-mix(in srgb, var(--gs-bg-paper), transparent 60%);
  padding: 14px 20px;
  text-align: left;
  font-size: 10px;
  font-weight: 600;
  color: var(--gs-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--gs-overlay-light);
}

.data-table td {
  padding: 14px 20px;
  border-bottom: 1px solid color-mix(in srgb, var(--gs-overlay-light), transparent 60%);
}

.table-row {
  transition: all 0.2s;
}

.table-row:hover {
  background: var(--gs-overlay-light);
}

.active-row {
  background: var(--gs-overlay-light);
  border-top: 1px solid var(--gs-overlay-medium);
  border-bottom: 1px solid var(--gs-overlay-medium);
}

.plan-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--gs-text-primary);
}

.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  text-transform: uppercase;
}

.tag-success {
  background: color-mix(in srgb, var(--gs-success-main), transparent 90%);
  color: var(--gs-success-main);
  border: 1px solid color-mix(in srgb, var(--gs-success-main), transparent 80%);
}

.tag-active {
  background: var(--gs-primary-main);
  color: var(--gs-text-inverse);
  border: 1px solid var(--gs-glow-primary);
  font-weight: 600;
}

.tag-ready {
  background: color-mix(in srgb, var(--gs-primary-main), transparent 85%);
  color: var(--gs-primary-main);
  border: 1px solid color-mix(in srgb, var(--gs-primary-main), transparent 70%);
}

.ping-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gs-text-primary);
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping {
  75%, 100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

/* 底部状态栏 */
.status-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 32px;
  background: var(--gs-bg-paper);
  border-top: 1px solid var(--gs-overlay-light);
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 24px;
  z-index: 50;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--gs-text-secondary);
}

.status-dot-green {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gs-success-main);
}

.spacer {
  flex: 1;
}

.footer-info {
  display: flex;
  gap: 24px;
  font-size: 12px;
  color: var(--gs-text-disabled);
  font-family: 'Fira Code', monospace;
}
</style>
