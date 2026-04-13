<template>
  <div class="task-link-mapping-page">
    <!-- 顶部导航栏 - 全局统一 -->
    <header class="top-nav">
      <div class="logo">XX地面站软件</div>
      <nav class="main-nav">
        <router-link to="/topology" class="nav-link">图形化监视</router-link>
        <router-link to="/device-control" class="nav-link">控制功能</router-link>
        <router-link to="/task-status" class="nav-link">状态监视</router-link>
        <router-link to="/task-macro" class="nav-link active">任务管理</router-link>
        <a href="#" class="nav-link">日志管理</a>
        <a href="#" class="nav-link">操作手册</a>
        <a href="#" class="nav-link">文件传输</a>
      </nav>
      <div class="user-actions">
        <button class="icon-btn" title="设置">
          <SettingsIcon class="icon" />
        </button>
        <button class="icon-btn" title="通知">
          <NotificationIcon class="icon" />
          <span class="notification-dot"></span>
        </button>
        <button class="icon-btn" title="用户账户">
          <UserIcon class="icon" />
        </button>
      </div>
    </header>

    <div class="main-layout">
      <!-- 任务管理侧边栏 - 与任务参数宏管理一致 -->
      <aside class="side-nav">
        <div class="side-header">
          <div class="side-title-row">
            <BiotechIcon class="side-header-icon" />
            <h2 class="side-title">任务管理</h2>
          </div>
          <p class="side-subtitle">MISSION CONTROL</p>
        </div>
        <nav class="side-menu">
          <router-link to="/task-macro" class="side-link">
            <SettingsInputIcon class="side-icon" />
            <span>任务参数宏管理</span>
          </router-link>
          <a href="#" class="side-link active">
            <AccountTreeIcon class="side-icon" />
            <span>任务链路映射管理</span>
          </a>
          <a href="#" class="side-link">
            <TerminalIcon class="side-icon" />
            <span>脚本命令编辑</span>
          </a>
          <a href="#" class="side-link">
            <DescriptionIcon class="side-icon" />
            <span>操作计划模版</span>
          </a>
          <a href="#" class="side-link">
            <SatelliteAltIcon class="side-icon" />
            <span>型号任务参数接收</span>
          </a>
          <a href="#" class="side-link">
            <EventNoteIcon class="side-icon" />
            <span>任务计划接收</span>
          </a>
          <a href="#" class="side-link">
            <AutoFixIcon class="side-icon" />
            <span>操作计划生成</span>
          </a>
          <a href="#" class="side-link">
            <PlayCircleIcon class="side-icon" />
            <span>脚本执行</span>
          </a>
          <a href="#" class="side-link">
            <RssFeedIcon class="side-icon" />
            <span>载波监视任务计划发送</span>
          </a>
          <a href="#" class="side-link">
            <HubIcon class="side-icon" />
            <span>中心调度指令执行</span>
          </a>
          <a href="#" class="side-link">
            <DnsIcon class="side-icon" />
            <span>本地调度执行</span>
          </a>
          <a href="#" class="side-link">
            <BiotechIcon class="side-icon" />
            <span>故障诊断</span>
          </a>
          <a href="#" class="side-link">
            <AnalyticsIcon class="side-icon" />
            <span>数据统计管理</span>
          </a>
        </nav>
        <div class="side-footer">
          <div class="operator-card">
            <div class="operator-avatar"></div>
            <div class="operator-info">
              <p class="operator-name">Operator-042</p>
              <p class="operator-station">Delta Station</p>
            </div>
            <span class="status-dot-online"></span>
          </div>
        </div>
      </aside>

      <!-- 主内容区 -->
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

        <!-- 前向链路面板 -->
        <div class="link-panel uplink-panel">
          <div class="panel-header">
            <h2 class="panel-title">
              <ArrowUpwardIcon class="panel-icon" />
              前向链路 (Uplink)
            </h2>
            <div class="status-badges">
              <span class="badge badge-success">载波锁定: NOMINAL</span>
              <span class="badge badge-default">频率: 2.1 GHz</span>
            </div>
          </div>

          <div class="link-grid">
            <!-- 数据/分发系统 -->
            <div class="link-column">
              <p class="column-label">数据/分发系统</p>
              <div class="link-card selected">
                <p class="card-title">中心业务分发单元</p>
                <p class="card-status">已选择</p>
              </div>
            </div>

            <!-- 基带单元 -->
            <div class="link-column">
              <p class="column-label">基带单元</p>
              <div class="baseband-list">
                <div v-for="(bb, index) in uplinkBasebands" :key="index"
                     :class="['baseband-item', bb.status]"
                     @click="selectUplinkBaseband(index)">
                  <span class="bb-name">{{ bb.name }}</span>
                  <span :class="['bb-status', bb.status]">{{ bb.statusText }}</span>
                </div>
              </div>
            </div>

            <!-- 信道链路/变频器 -->
            <div class="link-column">
              <p class="column-label">信道链路/变频器</p>
              <div class="converter-list">
                <div v-for="(conv, index) in uplinkConverters" :key="index"
                     :class="['converter-item', conv.status]"
                     @click="selectUplinkConverter(index)">
                  <span class="conv-name">{{ conv.name }}</span>
                  <span v-if="conv.status === 'active'" class="conv-status">ACTIVE</span>
                </div>
              </div>
            </div>

            <!-- 天线系统 -->
            <div class="link-column">
              <p class="column-label">天线系统</p>
              <div class="antenna-card">
                <SatelliteAltIcon class="antenna-icon" />
                <p class="antenna-title">7.3m 高增益发射口</p>
                <p class="antenna-coords">AZ: {{ antennaAzimuth }}° EL: {{ antennaElevation }}°</p>
              </div>
            </div>
          </div>

          <!-- 流向指示器 -->
          <div class="flow-indicator">
            <div class="flow-line"></div>
            <div class="flow-badge">
              <span class="flow-text">数 据 流 向 D A T A F L O W</span>
              <div class="flow-arrow">
                <div class="arrow-line"></div>
                <ChevronRightIcon class="arrow-icon" />
              </div>
            </div>
          </div>
        </div>

        <!-- 返向链路面板 -->
        <div class="link-panel downlink-panel">
          <div class="panel-header">
            <div class="status-badges">
              <span class="badge badge-primary">解调锁定: STABLE</span>
              <span class="badge badge-default">频率: 8.4 GHz</span>
            </div>
            <h2 class="panel-title">
              返向链路 (Downlink)
              <ArrowDownwardIcon class="panel-icon" />
            </h2>
          </div>

          <div class="link-grid">
            <!-- 天线系统 -->
            <div class="link-column">
              <p class="column-label">天线系统</p>
              <div class="antenna-card">
                <WifiTetheringIcon class="antenna-icon" />
                <p class="antenna-title">7.3m 高增益接收口</p>
                <p class="antenna-coords">RX GAIN: 54.2 dB</p>
              </div>
            </div>

            <!-- 信道链路/变频器 -->
            <div class="link-column">
              <p class="column-label">信道链路/变频器</p>
              <div class="converter-list">
                <div v-for="(conv, index) in downlinkConverters" :key="index"
                     :class="['converter-item', conv.status]"
                     @click="selectDownlinkConverter(index)">
                  <span class="conv-name">{{ conv.name }}</span>
                  <span v-if="conv.status === 'active'" class="conv-status">ACTIVE</span>
                </div>
              </div>
            </div>

            <!-- 基带单元 -->
            <div class="link-column">
              <p class="column-label">基带单元</p>
              <div class="downlink-grid">
                <div v-for="(bb, index) in downlinkBasebands" :key="index"
                     :class="['downlink-item', bb.status]"
                     @click="selectDownlinkBaseband(index)">
                  {{ bb.name }}
                </div>
              </div>
            </div>

            <!-- 数据/分发系统 -->
            <div class="link-column">
              <p class="column-label">数据/分发系统</p>
              <div class="link-card selected">
                <p class="card-title">集群数据存储系统</p>
                <p class="card-status storage">NOMINAL • 82% CAP</p>
              </div>
            </div>
          </div>

          <!-- 流向指示器 -->
          <div class="flow-indicator">
            <div class="flow-line"></div>
            <div class="flow-badge">
              <span class="flow-text">数 据 流 向 D A T A F L O W</span>
              <div class="flow-arrow">
                <div class="arrow-line"></div>
                <ChevronRightIcon class="arrow-icon" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- 底部状态栏 -->
      <footer class="status-footer">
        <div class="footer-left">
          <div class="status-item">
            <span class="status-dot-pulse"></span>
            <span class="status-text">系统运行正常</span>
          </div>
          <div class="status-item">
            <span class="status-dot-default"></span>
            <span class="status-text">同步延迟: <span class="status-value">{{ syncDelay }}ms</span></span>
          </div>
        </div>
        <div class="footer-right">
          <span>世界协调时: <span class="time-value">{{ utcTime }}</span></span>
          <span>恒星时: <span class="time-value">{{ lstTime }}</span></span>
        </div>
      </footer>
    </div>
  </div>
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

const AccountTreeIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '18', cy: '5', r: '3' }),
      h('circle', { cx: '6', cy: '12', r: '3' }),
      h('circle', { cx: '18', cy: '19', r: '3' }),
      h('path', { d: 'M8 12h6a4 4 0 0 1 4-4' }),
      h('path', { d: 'M8 12h6a4 4 0 0 0 4 4' })
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

const SatelliteAltIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M12 2v20M6 8a6 6 0 0 1 12 0c0 3-2 5-6 10-4-5-6-7-6-10z' })
    ])
  }
}

const EventNoteIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('rect', { x: '3', y: '4', width: '18', height: '18', rx: '2', ry: '2' }),
      h('line', { x1: '16', y1: '2', x2: '16', y2: '6' }),
      h('line', { x1: '8', y1: '2', x2: '8', y2: '6' }),
      h('line', { x1: '3', y1: '10', x2: '21', y2: '10' })
    ])
  }
}

const AutoFixIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M7 11l5-5 5 5M7 17l5-5 5 5' })
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

const RssFeedIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M4 11a9 9 0 0 1 9 9' }),
      h('path', { d: 'M4 4a16 16 0 0 1 16 16' }),
      h('circle', { cx: '5', cy: '19', r: '1' })
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

const DnsIcon = {
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

// 内容区图标
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

const ChevronRightIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('polyline', { points: '9 18 15 12 9 6' })
    ])
  }
}

const WifiTetheringIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z' })
    ])
  }
}

// 数据
const selectedMission = ref('alpha7')
const missions = ref([
  { id: 'alpha7', name: 'Alpha-7 综合测控任务' },
  { id: 'beta2', name: 'Beta-2 轨道维持任务' },
  { id: 'gamma9', name: 'Gamma-9 数据接收任务' }
])

const antennaAzimuth = ref(182.4)
const antennaElevation = ref(42.1)
const syncDelay = ref(0.12)
const utcTime = ref('2023-11-24 08:42:12')
const lstTime = ref('14:12:05')

const uplinkBasebands = ref([
  { name: '前向基带 01', status: 'standby', statusText: '待命' },
  { name: '前向基带 02', status: 'selected', statusText: '已选择' },
  { name: '前向基带 03', status: 'occupied', statusText: '已占用' },
  { name: '前向基带 04', status: 'standby', statusText: '待命' }
])

const uplinkConverters = ref([
  { name: '上变频器 #1', status: 'active' },
  { name: '上变频器 #2', status: 'standby' }
])

const downlinkConverters = ref([
  { name: '下变频器 #1', status: 'standby' },
  { name: '下变频器 #2', status: 'active' }
])

const downlinkBasebands = ref([
  { name: '返向 A (选)', status: 'selected' },
  { name: '返向 B', status: 'standby' },
  { name: '返向 C (占)', status: 'occupied' },
  { name: '返向 D', status: 'standby' },
  { name: '返向 E', status: 'standby' },
  { name: '返向 F', status: 'standby' },
  { name: '返向 G', status: 'standby' },
  { name: '返向 H', status: 'standby' }
])

// 选择方法
const selectUplinkBaseband = (index: number) => {
  uplinkBasebands.value.forEach((bb, i) => {
    if (i === index && bb.status !== 'occupied') {
      bb.status = bb.status === 'selected' ? 'standby' : 'selected'
      bb.statusText = bb.status === 'selected' ? '已选择' : '待命'
    } else if (bb.status !== 'occupied') {
      bb.status = 'standby'
      bb.statusText = '待命'
    }
  })
}

const selectUplinkConverter = (index: number) => {
  uplinkConverters.value.forEach((conv, i) => {
    conv.status = i === index ? 'active' : 'standby'
  })
}

const selectDownlinkConverter = (index: number) => {
  downlinkConverters.value.forEach((conv, i) => {
    conv.status = i === index ? 'active' : 'standby'
  })
}

const selectDownlinkBaseband = (index: number) => {
  downlinkBasebands.value.forEach((bb, i) => {
    if (i === index && bb.status !== 'occupied') {
      bb.status = bb.status === 'selected' ? 'standby' : 'selected'
    } else if (bb.status !== 'occupied') {
      bb.status = 'standby'
    }
  })
}

const saveChanges = () => {
  alert('链路映射配置已保存')
}

// 更新时间
let timeInterval: number | null = null

onMounted(() => {
  timeInterval = window.setInterval(() => {
    const now = new Date()
    utcTime.value = now.toISOString().replace('T', ' ').slice(0, 19)

    // 模拟同步延迟变化
    syncDelay.value = Number((0.10 + Math.random() * 0.05).toFixed(2))
  }, 1000)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
})
</script>

<style scoped>
.task-link-mapping-page {
  min-height: 100vh;
  background-color: #0b0b10;
  color: #e4e1e9;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* 顶部导航栏 */
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: #0b0b10;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  z-index: 50;
}

.logo {
  font-size: 20px;
  font-weight: 700;
  color: #3b82f6;
  letter-spacing: -0.02em;
}

.main-nav {
  display: flex;
  gap: 32px;
}

.nav-link {
  font-size: 13px;
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s;
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
  font-weight: 500;
}

.nav-link:hover {
  color: #ffffff;
}

.nav-link.active {
  color: #ffffff;
  border-bottom-color: #4c93e7;
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
  color: #94a3b8;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

.icon {
  width: 20px;
  height: 20px;
}

.notification-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ffb4ab;
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
  width: 260px;
  background: #0b0b10;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.side-header {
  padding: 24px;
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
  color: #60a5fa;
}

.side-title {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.side-subtitle {
  font-size: 10px;
  color: #64748b;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin: 0;
  padding-left: 32px;
}

.side-menu {
  flex: 1;
  overflow-y: auto;
  padding: 0 8px;
}

.side-menu::-webkit-scrollbar {
  width: 4px;
}

.side-menu::-webkit-scrollbar-track {
  background: transparent;
}

.side-menu::-webkit-scrollbar-thumb {
  background: #2a2d35;
  border-radius: 2px;
}

.side-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #94a3b8;
  text-decoration: none;
  font-size: 13px;
  border-radius: 4px;
  transition: all 0.2s;
  margin-bottom: 2px;
}

.side-link:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

.side-link.active {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  border-left: 4px solid #4c93e7;
}

.side-icon {
  width: 18px;
  height: 18px;
}

.side-footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.operator-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
}

.operator-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f59e0b;
}

.operator-info {
  flex: 1;
}

.operator-name {
  font-size: 13px;
  font-weight: 600;
  color: #e4e1e9;
  margin: 0;
}

.operator-station {
  font-size: 11px;
  color: #64748b;
  margin: 0;
}

.status-dot-online {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ae176;
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
  background: rgba(19, 20, 24, 0.4);
  padding: 20px 24px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 24px;
}

.mission-select-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.select-label {
  font-size: 13px;
  color: #64748b;
}

.select-wrapper {
  position: relative;
}

.mission-select {
  background: #1b1c21;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 10px 40px 10px 16px;
  color: #e4e1e9;
  font-size: 13px;
  min-width: 280px;
  appearance: none;
  cursor: pointer;
  outline: none;
}

.mission-select:focus {
  border-color: #4c93e7;
}

.select-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #64748b;
  pointer-events: none;
}

.btn-save {
  background: #4c93e7;
  color: #ffffff;
  border: none;
  padding: 10px 32px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(76, 147, 231, 0.2);
}

.btn-save:hover {
  background: #3b82f6;
  transform: translateY(-1px);
}

.btn-save:active {
  transform: scale(0.98);
}

/* 链路面板 */
.link-panel {
  background: rgba(19, 20, 24, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 4px 24px -2px rgba(0, 0, 0, 0.5);
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
  color: #ffffff;
  margin: 0;
}

.uplink-panel .panel-title {
  color: #4c93e7;
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
  background: rgba(74, 225, 118, 0.1);
  color: #4ae176;
  border: 1px solid rgba(74, 225, 118, 0.2);
}

.badge-primary {
  background: rgba(76, 147, 231, 0.1);
  color: #4c93e7;
  border: 1px solid rgba(76, 147, 231, 0.2);
}

.badge-default {
  background: #1b1c21;
  color: #64748b;
}

/* 链路网格 */
.link-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.link-column {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.column-label {
  font-size: 10px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 20px;
}

/* 链路卡片 */
.link-card {
  width: 100%;
  aspect-ratio: 4/3;
  background: #1b1c21;
  border: 1px solid rgba(74, 225, 118, 0.4);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
}

.link-card.selected {
  background: rgba(74, 225, 118, 0.02);
  box-shadow: 0 0 20px rgba(74, 225, 118, 0.1);
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #e4e1e9;
  margin: 0 0 8px 0;
}

.card-status {
  font-size: 10px;
  color: #4ae176;
  font-weight: 600;
}

.card-status.storage {
  font-family: 'Fira Code', monospace;
  letter-spacing: 0.05em;
}

/* 基带列表 */
.baseband-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.baseband-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #1b1c21;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.baseband-item:hover {
  border-color: rgba(255, 255, 255, 0.1);
}

.baseband-item.selected {
  background: rgba(74, 225, 118, 0.05);
  border-color: rgba(74, 225, 118, 0.6);
}

.baseband-item.occupied {
  background: rgba(255, 180, 171, 0.05);
  border-color: rgba(255, 180, 171, 0.4);
}

.baseband-item.standby {
  opacity: 0.5;
}

.bb-name {
  font-size: 12px;
  color: #e4e1e9;
}

.baseband-item.selected .bb-name {
  color: #4ae176;
  font-weight: 600;
}

.baseband-item.occupied .bb-name {
  color: #ffb4ab;
}

.bb-status {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
}

.bb-status.selected {
  background: rgba(74, 225, 118, 0.2);
  color: #4ae176;
}

.bb-status.occupied {
  background: rgba(255, 180, 171, 0.2);
  color: #ffb4ab;
}

.bb-status.standby {
  color: #64748b;
}

/* 变频器列表 */
.converter-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.converter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #1b1c21;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.converter-item.active {
  background: rgba(74, 225, 118, 0.05);
  border-color: rgba(74, 225, 118, 0.5);
}

.converter-item.standby {
  opacity: 0.3;
  justify-content: center;
}

.conv-name {
  font-size: 12px;
  font-weight: 600;
}

.converter-item.active .conv-name {
  color: #e4e1e9;
}

.converter-item.standby .conv-name {
  color: #94a3b8;
}

.conv-status {
  font-size: 10px;
  color: #4ae176;
  font-family: 'Fira Code', monospace;
  font-weight: 700;
}

/* 天线卡片 */
.antenna-card {
  width: 100%;
  aspect-ratio: 4/3;
  background: #1b1c21;
  border: 1px solid rgba(74, 225, 118, 0.4);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
  background: rgba(74, 225, 118, 0.02);
}

.antenna-icon {
  width: 48px;
  height: 48px;
  color: #4ae176;
  margin-bottom: 12px;
}

.antenna-title {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.antenna-coords {
  font-size: 10px;
  color: #64748b;
  font-family: 'Fira Code', monospace;
  text-transform: uppercase;
}

/* 返向基带网格 */
.downlink-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.downlink-item {
  padding: 12px;
  background: #1b1c21;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  text-align: center;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}

.downlink-item:hover {
  background: rgba(5, 102, 217, 0.1);
}

.downlink-item.selected {
  background: rgba(74, 225, 118, 0.05);
  border-color: rgba(74, 225, 118, 0.6);
  color: #4ae176;
  font-weight: 600;
}

.downlink-item.occupied {
  background: rgba(255, 180, 171, 0.05);
  border-color: rgba(255, 180, 171, 0.4);
  color: #ffb4ab;
}

.downlink-item.standby {
  opacity: 0.4;
  color: #94a3b8;
}

/* 流向指示器 */
.flow-indicator {
  margin-top: 40px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flow-line {
  position: absolute;
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.05);
}

.flow-badge {
  position: relative;
  background: #131418;
  padding: 12px 32px;
  border: 1px solid rgba(74, 225, 118, 0.4);
  border-radius: 9999px;
  display: flex;
  align-items: center;
  gap: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.flow-text {
  font-size: 11px;
  font-weight: 700;
  color: #4ae176;
  letter-spacing: 0.3em;
  font-family: 'Space Grotesk', sans-serif;
}

.flow-arrow {
  display: flex;
  align-items: center;
}

.arrow-line {
  width: 48px;
  height: 2px;
  background: #4ae176;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  color: #4ae176;
  margin-left: -4px;
}

/* 底部状态栏 */
.status-footer {
  position: fixed;
  bottom: 0;
  left: 260px;
  right: 0;
  height: 40px;
  background: #0b0b10;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 40;
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

.status-dot-pulse {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4ae176;
  animation: pulse 2s infinite;
}

.status-dot-default {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #374151;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-text {
  font-size: 11px;
  color: #64748b;
  font-family: 'Fira Code', monospace;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.status-value {
  color: #94a3b8;
}

.footer-right {
  display: flex;
  gap: 8px;
  font-size: 11px;
  color: #64748b;
  font-family: 'Fira Code', monospace;
}

.time-value {
  color: #94a3b8;
}

/* 响应式 */
@media (max-width: 1400px) {
  .link-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
}

@media (max-width: 1024px) {
  .side-nav {
    display: none;
  }

  .status-footer {
    left: 0;
  }

  .main-nav {
    display: none;
  }
}
</style>