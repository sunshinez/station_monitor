<template>
  <main class="main-content">
        <!-- 故障参数定制 -->
        <section class="param-panel">
          <div class="panel-header-bar">
            <div class="panel-title-group">
              <TuneIcon class="panel-icon text-primary" />
              <h2 class="panel-title">故障参数定制</h2>
            </div>
            <button class="btn-add">
              <PlusIcon class="btn-add-icon" />
              增加故障参数
            </button>
          </div>
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>分机名称</th>
                  <th>监控参数</th>
                  <th>报警阈值 (LOW / HIGH)</th>
                  <th>当前值</th>
                  <th>状态</th>
                  <th class="text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(param, index) in paramList" :key="index" class="table-row">
                  <td class="font-medium">{{ param.device }}</td>
                  <td class="text-dim">{{ param.param }}</td>
                  <td class="mono text-primary">{{ param.threshold }}</td>
                  <td :class="['mono', param.valueClass]">{{ param.value }}</td>
                  <td>
                    <span :class="['status-group', param.statusClass]">
                      <span :class="['status-dot-sm', param.dotClass]"></span>
                      {{ param.status }}
                    </span>
                  </td>
                  <td class="text-right">
                    <div class="action-btns">
                      <button class="action-btn" title="编辑">
                        <EditIcon class="action-icon" />
                      </button>
                      <button class="action-btn danger" title="删除">
                        <DeleteIcon class="action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- 实时故障监视 -->
        <section class="monitor-section">
          <div class="section-title-group">
            <AnalyticsIcon class="section-icon text-primary" />
            <h2 class="section-title">实时故障监视</h2>
          </div>
          <div class="monitor-cards">
            <div v-for="(card, index) in monitorCards" :key="index"
                 :class="['monitor-card', card.error ? 'card-error' : '']">
              <div class="card-header">
                <div>
                  <p class="card-category">{{ card.category }}</p>
                  <h3 class="card-name">{{ card.name }}</h3>
                </div>
                <span :class="['card-dot', card.dotClass]"></span>
              </div>
              <div class="card-value-row">
                <span :class="['card-value mono', card.valueClass]">{{ card.value }}</span>
                <span class="card-unit">{{ card.unit }}</span>
              </div>
              <div class="card-footer">
                <span class="card-range mono">范围: {{ card.range }}</span>
                <span :class="['card-status', card.statusClass]">{{ card.status }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 故障历史日志 -->
        <section class="log-panel">
          <div class="panel-header-bar border-bottom">
            <div class="panel-title-group">
              <ListAltIcon class="panel-icon text-primary" />
              <h2 class="panel-title">故障历史日志</h2>
            </div>
            <div class="header-actions">
              <button class="btn-text">导出报表</button>
              <button class="btn-text">清除记录</button>
            </div>
          </div>
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr class="log-thead">
                  <th>发生时间 (UTC)</th>
                  <th>故障分机</th>
                  <th>故障等级</th>
                  <th>故障描述</th>
                  <th class="text-right">当前状态</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(log, index) in faultLogs" :key="index" class="table-row">
                  <td :class="['mono', index === 0 ? 'text-on-surface' : 'text-dim']">{{ log.time }}</td>
                  <td class="font-medium">{{ log.device }}</td>
                  <td>
                    <span :class="['level-badge', log.levelClass]">{{ log.level }}</span>
                  </td>
                  <td class="text-dim">{{ log.desc }}</td>
                  <td class="text-right">
                    <span :class="['log-status mono', log.statusClass]">
                      <span v-if="log.active" class="status-dot-xs pulse"></span>
                      {{ log.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="log-footer">
            <p class="footer-text">当前任务阶段显示 3 条记录</p>
            <div class="pagination">
              <button class="page-btn">上一页</button>
              <span class="page-current">01</span>
              <button class="page-btn">下一页</button>
            </div>
          </div>
        </section>
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

const AnalyticsIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('line', { x1: '18', y1: '20', x2: '18', y2: '10' }),
      h('line', { x1: '12', y1: '20', x2: '12', y2: '4' }),
      h('line', { x1: '6', y1: '20', x2: '6', y2: '14' })
    ])
  }
}

// 业务区图标
const TuneIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('line', { x1: '4', y1: '21', x2: '4', y2: '14' }),
      h('line', { x1: '4', y1: '10', x2: '4', y2: '3' }),
      h('line', { x1: '12', y1: '21', x2: '12', y2: '12' }),
      h('line', { x1: '12', y1: '8', x2: '12', y2: '3' }),
      h('line', { x1: '20', y1: '21', x2: '20', y2: '16' }),
      h('line', { x1: '20', y1: '12', x2: '20', y2: '3' }),
      h('circle', { cx: '4', cy: '12', r: '2' }),
      h('circle', { cx: '12', cy: '10', r: '2' }),
      h('circle', { cx: '20', cy: '14', r: '2' })
    ])
  }
}

const PlusIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '3' }, [
      h('line', { x1: '12', y1: '5', x2: '12', y2: '19' }),
      h('line', { x1: '5', y1: '12', x2: '19', y2: '12' })
    ])
  }
}

const EditIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' }),
      h('path', { d: 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' })
    ])
  }
}

const DeleteIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('polyline', { points: '3 6 5 6 21 6' }),
      h('path', { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' })
    ])
  }
}

const ListAltIcon = {
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
const paramList = ref([
  {
    device: '天线控制分机 (ANT-CTRL-01)',
    param: '核心温度 (Core Temp)',
    threshold: '10.0 ~ 85.0 °C',
    value: '42.8',
    valueClass: '',
    status: '正常',
    statusClass: 'text-tertiary',
    dotClass: 'dot-success-glow'
  },
  {
    device: '数传基带分机 (BASEBAND-D-02)',
    param: 'AGC电平 (AGC Level)',
    threshold: '-80.0 ~ -20.0 dBm',
    value: '-12.4',
    valueClass: 'text-error',
    status: '越限',
    statusClass: 'text-error',
    dotClass: 'dot-error-glow pulse'
  },
  {
    device: '变频单元分机 (CONV-UNIT-04)',
    param: '发射功率 (TX Power)',
    threshold: '15.0 ~ 30.0 dBW',
    value: '24.1',
    valueClass: '',
    status: '正常',
    statusClass: 'text-tertiary',
    dotClass: 'dot-success-glow'
  },
  {
    device: '功率放大分机 (HPA-UNIT-01)',
    param: '供电电压 (VCC Input)',
    threshold: '180.0 ~ 240.0 V',
    value: '219.4',
    valueClass: '',
    status: '正常',
    statusClass: 'text-tertiary',
    dotClass: 'dot-success-glow'
  }
])

const monitorCards = ref([
  {
    category: '天线控制 / 核心温度',
    name: 'ANT-TEMP-01',
    value: '42.8',
    valueClass: '',
    unit: '°C',
    range: '10.0 - 85.0',
    status: '正常 (NOMINAL)',
    statusClass: 'text-tertiary',
    dotClass: 'dot-success-glow',
    error: false
  },
  {
    category: '数传基带 / AGC电平',
    name: 'BASE-AGC-02',
    value: '-12.4',
    valueClass: 'text-error',
    unit: 'dBm',
    range: '-80.0 - -20.0',
    status: '严重越限 (CRITICAL)',
    statusClass: 'text-error font-bold',
    dotClass: 'dot-error-glow pulse',
    error: true
  },
  {
    category: '变频单元 / 发射功率',
    name: 'CONV-TX-04',
    value: '24.1',
    valueClass: '',
    unit: 'dBW',
    range: '15.0 - 30.0',
    status: '正常 (NOMINAL)',
    statusClass: 'text-tertiary',
    dotClass: 'dot-success-glow',
    error: false
  },
  {
    category: '供电单元 / 输入电压',
    name: 'PWR-VCC-01',
    value: '219.4',
    valueClass: '',
    unit: 'V',
    range: '180.0 - 240.0',
    status: '正常 (NOMINAL)',
    statusClass: 'text-tertiary',
    dotClass: 'dot-success-glow',
    error: false
  }
])

const faultLogs = ref([
  {
    time: '2023-11-24 14:02:11.452',
    device: '数传基带分机 BASEBAND-D-02',
    level: '严重 (CRITICAL)',
    levelClass: 'level-critical',
    desc: 'AGC电平持续低于 -12dBm，超出设定下限阈值。',
    status: '未恢复',
    statusClass: 'text-error font-bold',
    active: true
  },
  {
    time: '2023-11-24 13:45:02.109',
    device: '天线控制分机 ANT-CTRL-01',
    level: '一般 (WARNING)',
    levelClass: 'level-warning',
    desc: '方位轴伺服电机电流瞬时突跳至 12A。',
    status: '已恢复',
    statusClass: 'text-tertiary font-bold',
    active: false
  },
  {
    time: '2023-11-24 12:20:55.882',
    device: '变频单元分机 CONV-UNIT-04',
    level: '一般 (WARNING)',
    levelClass: 'level-warning',
    desc: '本振1锁定指示信号丢失，自动切换备机。',
    status: '已恢复',
    statusClass: 'text-tertiary font-bold',
    active: false
  }
])

const currentTime = ref('2024-05-20 15:44:22')

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
.task-fault-diagnosis-page {
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
  padding: 20px;
  overflow-y: auto;
  position: relative;
  margin-bottom: 32px;
  gap: 20px;
}

/* 面板头部 */
.panel-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.panel-header-bar.border-bottom {
  padding-bottom: 14px;
  border-bottom: 1px solid var(--gs-overlay-light);
}

.panel-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.panel-icon {
  width: 20px;
  height: 20px;
}

.panel-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--gs-text-primary);
  margin: 0;
}

.text-primary {
  color: var(--gs-primary-main);
}

.text-tertiary {
  color: var(--gs-success-main);
}

.text-error {
  color: var(--gs-error-main);
}

.text-dim {
  color: var(--gs-text-secondary);
}

.text-on-surface {
  color: var(--gs-text-primary);
}

.mono {
  font-family: 'Fira Code', monospace;
}

.font-medium {
  font-weight: 500;
}

.font-bold {
  font-weight: 700;
}

.text-right {
  text-align: right;
}

/* 按钮 */
.btn-add {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--gs-primary-main);
  color: var(--gs-bg-default);
  border: none;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add:hover {
  box-shadow: 0 0 15px var(--gs-glow-primary);
}

.btn-add-icon {
  width: 14px;
  height: 14px;
}

.btn-text {
  padding: 6px 12px;
  background: var(--gs-bg-paper);
  color: var(--gs-text-secondary);
  border: none;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-text:hover {
  color: var(--gs-text-primary);
}

.header-actions {
  display: flex;
  gap: 8px;
}

/* 表格 */
.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.data-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 500;
  color: var(--gs-text-secondary);
  border-bottom: 1px solid var(--gs-overlay-light);
}

.data-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--gs-overlay-light);
}

.table-row {
  transition: all 0.2s;
}

.table-row:hover {
  background: var(--gs-overlay-light);
}

.log-thead {
  background: color-mix(in srgb, var(--gs-bg-paper), transparent 70%);
}

.log-thead th {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 400;
}

/* 操作按钮 */
.action-btns {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.action-btn {
  background: none;
  border: none;
  color: var(--gs-text-secondary);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  color: var(--gs-primary-main);
  background: var(--gs-overlay-light);
}

.action-btn.danger:hover {
  color: var(--gs-error-main);
}

.action-icon {
  width: 18px;
  height: 18px;
}

/* 状态 */
.status-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot-sm {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-dot-xs {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gs-error-main);
}

.dot-success-glow {
  background: var(--gs-success-main);
  box-shadow: 0 0 2px var(--gs-success-main), 0 0 8px var(--gs-glow-success);
}

.dot-error-glow {
  background: var(--gs-error-main);
  box-shadow: 0 0 2px var(--gs-error-main), 0 0 8px var(--gs-glow-error);
}

.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}

/* 故障参数定制面板 */
.param-panel {
  background: var(--gs-bg-paper);
  border-radius: 8px;
  border: 1px solid var(--gs-overlay-light);
  border-left: 4px solid var(--gs-primary-main);
  padding: 20px;
  flex-shrink: 0;
}

/* 实时故障监视 */
.monitor-section {
  flex-shrink: 0;
}

.section-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.section-icon {
  width: 20px;
  height: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--gs-text-primary);
  margin: 0;
}

.monitor-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.monitor-card {
  background: var(--gs-bg-paper);
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 20px;
  transition: all 0.2s;
}

.monitor-card:hover {
  border-color: var(--gs-glow-primary);
}

.card-error {
  background: var(--gs-bg-paper);
  border-color: var(--gs-glow-error);
  box-shadow: inset 0 0 20px var(--gs-overlay-light);
}

.card-error:hover {
  border-color: var(--gs-glow-error);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.card-category {
  font-size: 10px;
  color: var(--gs-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 4px 0;
}

.card-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--gs-text-primary);
  margin: 0;
}

.card-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.card-value-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 16px;
}

.card-value {
  font-size: 28px;
  font-weight: 500;
  color: var(--gs-text-primary);
}

.card-unit {
  font-size: 12px;
  color: var(--gs-text-secondary);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
}

.card-range {
  color: var(--gs-text-disabled);
}

.card-status {
  font-size: 10px;
}

/* 故障历史日志 */
.log-panel {
  flex: 1;
  min-height: 0;
  background: var(--gs-bg-paper);
  border-radius: 8px;
  border: 1px solid var(--gs-overlay-light);
  box-shadow: 0 8px 30px color-mix(in srgb, var(--gs-overlay-dark), transparent 67%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.level-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.level-critical {
  background: color-mix(in srgb, var(--gs-error-main), transparent 40%);
  color: var(--gs-error-main);
}

.level-warning {
  background: color-mix(in srgb, var(--gs-warning-main), transparent 85%);
  color: var(--gs-warning-main);
  border: 1px solid var(--gs-overlay-medium);
}

.log-status {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  font-size: 11px;
}

.log-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: color-mix(in srgb, var(--gs-bg-paper), transparent 80%);
  border-top: 1px solid var(--gs-overlay-light);
}

.footer-text {
  font-size: 10px;
  color: var(--gs-text-disabled);
  font-family: 'Fira Code', monospace;
  margin: 0;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 10px;
  color: var(--gs-text-disabled);
}

.page-btn {
  background: none;
  border: none;
  color: var(--gs-text-disabled);
  cursor: pointer;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  transition: all 0.2s;
}

.page-btn:hover {
  color: var(--gs-primary-main);
}

.page-current {
  color: var(--gs-primary-main);
  font-weight: 700;
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
