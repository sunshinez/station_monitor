<template>
  <main class="main-content">
        <!-- 可用工作流脚本列表 -->
        <section class="script-list-section">
          <div class="script-list-panel">
            <div class="panel-header-bar border-bottom">
              <div class="panel-title-group">
                <TerminalIcon class="panel-icon text-primary" />
                <h4 class="panel-title">可用工作流脚本列表</h4>
              </div>
              <div class="search-box">
                <SearchIcon class="search-icon" />
                <input type="text" placeholder="搜索脚本..." class="search-input-sm" />
              </div>
            </div>
            <div class="table-wrapper-sm">
              <table class="data-table compact">
                <thead>
                  <tr>
                    <th class="col-checkbox">选择</th>
                    <th>脚本名称</th>
                    <th>版本</th>
                    <th>描述</th>
                    <th>最后修改时间</th>
                    <th class="text-right">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(script, index) in scriptList" :key="index"
                      :class="['table-row', selectedScript === index ? 'selected-row' : '']"
                      @click="selectScript(index)">
                    <td class="col-checkbox">
                      <input type="radio" name="script_select" :checked="selectedScript === index" />
                    </td>
                    <td>
                      <span class="mono font-bold">{{ script.name }}</span>
                    </td>
                    <td>
                      <span :class="['tag-sm', script.versionClass]">{{ script.version }}</span>
                    </td>
                    <td class="text-dim max-w truncate">{{ script.desc }}</td>
                    <td class="text-dim mono">{{ script.time }}</td>
                    <td class="text-right">
                      <button :class="['text-btn', selectedScript === index ? 'text-primary' : 'text-dim']">详情</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- 选中脚本概览 -->
        <section class="script-overview">
          <div class="overview-card">
            <div class="overview-main">
              <div class="overview-icon-box">
                <DescriptionIcon class="overview-icon" />
              </div>
              <div class="overview-info">
                <div class="overview-name-row">
                  <h3 class="overview-name">{{ currentScript.name }}</h3>
                  <span class="overview-badge">当前选中</span>
                </div>
              </div>
            </div>
            <div class="overview-stats">
              <div class="stat-item">
                <p class="stat-label">指令总数</p>
                <p class="stat-value">{{ currentScript.steps }} <span class="stat-unit">Step</span></p>
              </div>
              <div class="stat-item">
                <p class="stat-label">预计时长</p>
                <p class="stat-value">{{ currentScript.duration }}</p>
              </div>
              <div class="stat-item">
                <p class="stat-label">解析状态</p>
                <div class="stat-status">
                  <span class="status-dot-glow"></span>
                  <span class="status-text-success">已就绪</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 主执行区 -->
        <section class="execution-main">
          <!-- 左侧：指令序列流 -->
          <div class="instruction-stream">
            <div class="panel-header-bar border-bottom">
              <h4 class="panel-title">指令序列流</h4>
              <div class="badge-group">
                <span class="badge">自动滚动</span>
                <span class="badge badge-primary">实时监控</span>
              </div>
            </div>
            <div class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>执行时间 (T+)</th>
                    <th>目标分机</th>
                    <th>指令内容</th>
                    <th class="text-right">状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(step, index) in instructionList" :key="index"
                      :class="['instruction-row', step.status]">
                    <td :class="['mono', step.idClass]">{{ step.id }}</td>
                    <td :class="['mono', step.idClass]">{{ step.time }}</td>
                    <td :class="['mono font-bold', step.targetClass]">{{ step.target }}</td>
                    <td :class="['mono', step.idClass]">{{ step.content }}</td>
                    <td class="text-right">
                      <span :class="['step-status', step.statusClass]">
                        {{ step.statusText }}
                        <CheckCircleIcon v-if="step.status === 'completed'" class="step-status-icon" />
                        <span v-if="step.status === 'executing'" class="pulse-dot"></span>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 右侧：状态面板 -->
          <div class="status-panel">
            <!-- 执行进度 -->
            <div class="progress-card">
              <div class="progress-header">
                <h4 class="progress-title">执行进度</h4>
                <span class="progress-percent">35<span class="percent-unit">.4%</span></span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: 35.4%"></div>
              </div>
              <div class="progress-stats">
                <div class="mini-stat border-success">
                  <p class="mini-label">成功</p>
                  <p class="mini-value text-success">43</p>
                </div>
                <div class="mini-stat border-error">
                  <p class="mini-label">失败</p>
                  <p class="mini-value text-error">0</p>
                </div>
                <div class="mini-stat border-muted">
                  <p class="mini-label">跳过</p>
                  <p class="mini-value text-muted">1</p>
                </div>
              </div>
            </div>

            <!-- 当前步骤详情 -->
            <div class="step-detail-card">
              <h4 class="detail-title">当前步骤详情</h4>
              <div class="detail-body">
                <div class="detail-block">
                  <p class="detail-block-title">指令参数原型</p>
                  <pre class="detail-pre">CMD_044: SWITCH_MODE
{
  "target": "BASEBAND_Z1",
  "mode": "X_BAND_DOWN",
  "timeout": 5000,
  "params": {
    "auto_lock": true,
    "pll_bw": "WIDE"
  }
}</pre>
                </div>
                <div class="detail-block">
                  <p class="detail-block-title">回显执行日志</p>
                  <div class="detail-log">
                    <p><span class="log-dim">[08:42:15.002]</span> <span class="log-primary">SEND</span> -&gt; BASEBAND_Z1</p>
                    <p><span class="log-dim">[08:42:15.154]</span> <span class="log-secondary">INFO</span>: Socket connection established</p>
                    <p><span class="log-dim">[08:42:16.021]</span> <span class="log-success">WAIT</span>: Awaiting ACK for 0x44...</p>
                    <p class="log-pulse">[08:42:16.500] PROCESSING...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 控制控制台 -->
        <footer class="control-console">
          <div class="control-main">
            <button class="btn-ctrl btn-play">
              <PlayFillIcon class="btn-ctrl-icon" />
              开始执行
            </button>
            <button class="btn-ctrl btn-pause-border">
              <PauseIcon class="btn-ctrl-icon" />
              暂停
            </button>
            <button class="btn-ctrl btn-stop">
              <StopIcon class="btn-ctrl-icon" />
              中止执行
            </button>
          </div>
          <div class="divider-v"></div>
          <div class="control-sub">
            <span class="intervention-label">手动干预</span>
            <button class="btn-sub">
              <SkipNextIcon class="btn-sub-icon" />
              跳过当前步
            </button>
            <button class="btn-sub">
              <RefreshIcon class="btn-sub-icon" />
              重试当前步
            </button>
            <button class="btn-sub btn-edit">
              <EditIcon class="btn-sub-icon" />
              临时修改参数
            </button>
          </div>
        </footer>
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
const SearchIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '11', cy: '11', r: '8' }),
      h('path', { d: 'M21 21l-4.35-4.35' })
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

const PlayFillIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', stroke: 'none' }, [
      h('polygon', { points: '5 3 19 12 5 21 5 3' })
    ])
  }
}

const PauseIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('rect', { x: '6', y: '4', width: '4', height: '16' }),
      h('rect', { x: '14', y: '4', width: '4', height: '16' })
    ])
  }
}

const StopIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('rect', { x: '6', y: '6', width: '12', height: '12', rx: '1' })
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

const RefreshIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('polyline', { points: '23 4 23 10 17 10' }),
      h('polyline', { points: '1 20 1 14 7 14' }),
      h('path', { d: 'M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15' })
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

// 数据
const selectedScript = ref(0)

const scriptList = ref([
  {
    name: 'LEO_ORBIT_ENTRY_V4',
    version: 'v4.2.1',
    versionClass: 'tag-primary',
    desc: '低轨卫星入轨执行程序，包含测控链路初始化。',
    time: '2024-05-20 14:30:22'
  },
  {
    name: 'PAYLOAD_INIT_X2',
    version: 'v1.0.0',
    versionClass: 'tag-muted',
    desc: '载荷设备X2初始化及自检序列。',
    time: '2024-05-18 09:15:45'
  },
  {
    name: 'EMERGENCY_DEORBIT_SYS',
    version: 'v2.1.0',
    versionClass: 'tag-error',
    desc: '紧急离轨系统触发及姿态调整指令集。',
    time: '2024-05-15 11:22:10'
  },
  {
    name: 'DATA_DUMP_ROUTINE',
    version: 'v3.5.0',
    versionClass: 'tag-muted',
    desc: '常规数据卸载流程，支持多站轮替模式。',
    time: '2024-05-10 18:00:00'
  }
])

const currentScript = ref({
  name: 'LEO_ORBIT_ENTRY_V4',
  steps: 124,
  duration: '00:18:45'
})

const instructionList = ref([
  {
    id: '#042',
    time: '00:12:05',
    target: '天线 A',
    content: 'SET_ANTENNA_AZIMUTH(145.2, 0.5)',
    status: 'completed',
    statusText: 'ACK 收到',
    statusClass: 'status-success',
    idClass: 'text-dim',
    targetClass: 'text-secondary'
  },
  {
    id: '#043',
    time: '00:12:10',
    target: '天线 A',
    content: 'LOCK_TRACKING_OBJECT(LEO_102)',
    status: 'completed',
    statusText: 'ACK 收到',
    statusClass: 'status-success',
    idClass: 'text-dim',
    targetClass: 'text-secondary'
  },
  {
    id: '#044',
    time: '00:12:15',
    target: '基带 Z1',
    content: 'SWITCH_MODE(X_BAND_DOWNLINK)',
    status: 'executing',
    statusText: '正在下发',
    statusClass: 'status-executing',
    idClass: 'text-primary',
    targetClass: 'text-primary'
  },
  {
    id: '#045',
    time: '00:12:20',
    target: '存储阵列',
    content: 'INIT_DATA_INGESTION_STREAM()',
    status: 'waiting',
    statusText: '等待中',
    statusClass: 'status-waiting',
    idClass: 'text-dim',
    targetClass: ''
  },
  {
    id: '#046',
    time: '00:12:35',
    target: '主控时钟',
    content: 'SYNC_TIMESTAMP(GROUND_LOCAL)',
    status: 'waiting',
    statusText: '等待中',
    statusClass: 'status-waiting',
    idClass: 'text-dim',
    targetClass: ''
  }
])

const currentTime = ref('2024-05-20 15:44:22')

const selectScript = (index: number) => {
  selectedScript.value = index
  currentScript.value.name = scriptList.value[index].name
}

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
.task-script-execution-page {
  min-height: 100vh;
  background-color: #EDEFF3;
  color: #4B4C57;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

/* 顶部导航栏 */
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
  background: rgba(0, 0, 0, 0.05);
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
  background: #F7F8FB;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
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
  color: #1C6AFF;
}

.side-title {
  font-size: 18px;
  font-weight: 700;
  color: #4B4C57;
  margin: 0;
}

.side-subtitle {
  font-size: 10px;
  color: #9C9DA6;
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
  color: #9C9DA6;
  text-decoration: none;
  font-size: 13px;
  border-radius: 4px;
  transition: all 0.2s;
  border-left: 4px solid transparent;
  margin-bottom: 2px;
}

.side-link:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #4B4C57;
}

.side-link.active {
  background: #F7F8FB;
  color: #1C6AFF;
  border-left-color: #1C6AFF;
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
  overflow: hidden;
  position: relative;
  margin-bottom: 32px;
  gap: 16px;
}

/* 脚本列表 */
.script-list-section {
  flex-shrink: 0;
}

.script-list-panel {
  background: #F7F8FB;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 220px;
}

.panel-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
}

.panel-header-bar.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background: rgba(0, 0, 0, 0.02);
}

.panel-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.panel-title {
  font-size: 13px;
  font-weight: 700;
  color: #4B4C57;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.panel-icon {
  width: 18px;
  height: 18px;
}

.text-primary {
  color: #1C6AFF;
}

.search-box {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: #9C9DA6;
}

.search-input-sm {
  background: #F7F8FB;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  padding: 6px 10px 6px 28px;
  color: #4B4C57;
  font-size: 12px;
  width: 180px;
  outline: none;
}

.search-input-sm::placeholder {
  color: #9C9DA6;
}

.table-wrapper-sm {
  flex: 1;
  overflow: auto;
}

.table-wrapper {
  flex: 1;
  overflow: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table.compact td,
.data-table.compact th {
  padding: 10px 18px;
}

.data-table th {
  background: rgba(247, 248, 251, 0.9);
  text-align: left;
  font-size: 10px;
  font-weight: 600;
  color: #9C9DA6;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.data-table td {
  border-bottom: 1px solid rgba(0, 0, 0, 0.02);
}

.table-row {
  transition: all 0.2s;
  cursor: pointer;
}

.table-row:hover {
  background: rgba(0, 0, 0, 0.03);
}

.selected-row {
  background: rgba(28, 106, 255, 0.08);
  border-left: 3px solid #1C6AFF;
}

.col-checkbox {
  width: 60px;
}

.text-dim {
  color: #9C9DA6;
}

.text-muted {
  color: #9C9DA6;
}

.mono {
  font-family: 'Microsoft YaHei', monospace;
}

.max-w {
  max-width: 240px;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.text-right {
  text-align: right;
}

.text-btn {
  background: none;
  border: none;
  font-size: 11px;
  cursor: pointer;
  text-decoration: underline;
}

.text-btn:hover {
  opacity: 0.8;
}

/* 标签 */
.tag-sm {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
}

.tag-primary {
  background: rgba(28, 106, 255, 0.1);
  color: #1C6AFF;
  border: 1px solid rgba(28, 106, 255, 0.2);
}

.tag-muted {
  background: #F7F8FB;
  color: #9C9DA6;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.tag-error {
  background: rgba(237, 59, 59, 0.08);
  color: #ED3B3B;
  border: 1px solid rgba(237, 59, 59, 0.15);
}

/* 脚本概览 */
.script-overview {
  flex-shrink: 0;
}

.overview-card {
  background: #F7F8FB;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.overview-main {
  display: flex;
  align-items: center;
  gap: 16px;
}

.overview-icon-box {
  padding: 12px;
  background: rgba(28, 106, 255, 0.1);
  border-radius: 8px;
}

.overview-icon {
  width: 28px;
  height: 28px;
  color: #1C6AFF;
}

.overview-name-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.overview-name {
  font-size: 20px;
  font-weight: 700;
  color: #4B4C57;
  text-transform: uppercase;
  margin: 0;
}

.overview-badge {
  font-size: 10px;
  background: rgba(28, 106, 255, 0.15);
  color: #1C6AFF;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(28, 106, 255, 0.2);
}

.overview-stats {
  display: flex;
  gap: 40px;
  border-left: 1px solid rgba(0, 0, 0, 0.05);
  padding-left: 40px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 10px;
  color: #9C9DA6;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  margin: 0;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1C6AFF;
  font-family: 'Microsoft YaHei', monospace;
}

.stat-unit {
  font-size: 12px;
  color: #9C9DA6;
  font-weight: 500;
}

.stat-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.status-dot-glow {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4ae176;
  box-shadow: 0 0 2px #4ae176, 0 0 10px rgba(0, 167, 75, 0.3);
}

.status-text-success {
  font-size: 18px;
  font-weight: 700;
  color: #4ae176;
}

/* 主执行区 */
.execution-main {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  overflow: hidden;
}

.instruction-stream {
  background: #F7F8FB;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.badge-group {
  display: flex;
  gap: 8px;
}

.badge {
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  background: #F7F8FB;
  color: #9C9DA6;
}

.badge-primary {
  background: rgba(28, 106, 255, 0.15);
  color: #1C6AFF;
  border: 1px solid rgba(28, 106, 255, 0.2);
}

.instruction-row {
  transition: all 0.2s;
}

.instruction-row.completed {
  background: rgba(0, 167, 75, 0.05);
}

.instruction-row.executing {
  background: rgba(28, 106, 255, 0.12);
  border-top: 1px solid rgba(28, 106, 255, 0.2);
  border-bottom: 1px solid rgba(28, 106, 255, 0.2);
}

.instruction-row.waiting {
  opacity: 0.5;
}

.instruction-row.waiting:hover {
  opacity: 1;
}

.step-status {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  font-weight: 600;
}

.status-success {
  color: #4ae176;
}

.status-executing {
  color: #1C6AFF;
}

.status-waiting {
  color: #9C9DA6;
}

.step-status-icon {
  width: 16px;
  height: 16px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #1C6AFF;
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .3; }
}

.text-secondary {
  color: #1C6AFF;
}

/* 右侧面板 */
.status-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
}

.progress-card {
  background: #F7F8FB;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 12px;
}

.progress-title {
  font-size: 13px;
  font-weight: 700;
  color: #4B4C57;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.progress-percent {
  font-size: 28px;
  font-weight: 700;
  color: #1C6AFF;
  font-family: 'Microsoft YaHei', monospace;
}

.percent-unit {
  font-size: 18px;
  color: #9C9DA6;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: #F2F4F7;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 16px;
}

.progress-fill {
  height: 100%;
  background: #1C6AFF;
  box-shadow: 0 0 10px rgba(28, 106, 255, 0.5);
}

.progress-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.mini-stat {
  background: rgba(247, 248, 251, 0.8);
  padding: 10px;
  border-radius: 4px;
  text-align: center;
  border-bottom: 2px solid transparent;
}

.border-success {
  border-bottom-color: rgba(0, 167, 75, 0.3);
}

.border-error {
  border-bottom-color: rgba(237, 59, 59, 0.25);
}

.border-muted {
  border-bottom-color: rgba(0, 0, 0, 0.06);
}

.mini-label {
  font-size: 9px;
  color: #9C9DA6;
  text-transform: uppercase;
  font-weight: 700;
  margin: 0 0 4px 0;
}

.mini-value {
  font-size: 20px;
  font-weight: 700;
  font-family: 'Microsoft YaHei', monospace;
  margin: 0;
}

.text-success {
  color: #4ae176;
}

.text-error {
  color: #ED3B3B;
}

.step-detail-card {
  flex: 1;
  min-height: 0;
  background: #F7F8FB;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.detail-title {
  font-size: 13px;
  font-weight: 700;
  color: #4B4C57;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 12px 0;
}

.detail-body {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-block {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  padding: 12px;
}

.detail-block-title {
  font-size: 10px;
  color: #9C9DA6;
  text-transform: uppercase;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.detail-pre {
  font-family: 'Microsoft YaHei', monospace;
  font-size: 11px;
  color: #1C6AFF;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
}

.detail-log {
  font-family: 'Microsoft YaHei', monospace;
  font-size: 11px;
  color: #4B4C57;
  line-height: 1.8;
}

.detail-log p {
  margin: 0;
}

.log-dim {
  color: #DFE3EA;
}

.log-primary {
  color: #1C6AFF;
}

.log-secondary {
  color: #1C6AFF;
}

.log-success {
  color: #4ae176;
}

.log-pulse {
  color: #1C6AFF;
  font-weight: 700;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* 控制控制台 */
.control-console {
  flex-shrink: 0;
  background: #F7F8FB;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.control-main {
  display: flex;
  gap: 10px;
}

.btn-ctrl {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-ctrl:active {
  transform: scale(0.98);
}

.btn-ctrl-icon {
  width: 18px;
  height: 18px;
}

.btn-play {
  background: #1C6AFF;
  color: #1C6AFF;
  box-shadow: 0 0 20px rgba(28, 106, 255, 0.3);
}

.btn-play:hover {
  filter: brightness(1.1);
}

.btn-pause-border {
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #4B4C57;
}

.btn-pause-border:hover {
  background: rgba(0, 0, 0, 0.05);
}

.btn-stop {
  background: transparent;
  border: 1px solid rgba(237, 59, 59, 0.2);
  color: #ED3B3B;
}

.btn-stop:hover {
  background: rgba(237, 59, 59, 0.08);
}

.divider-v {
  width: 1px;
  height: 40px;
  background: rgba(0, 0, 0, 0.06);
}

.control-sub {
  display: flex;
  align-items: center;
  gap: 10px;
}

.intervention-label {
  font-size: 10px;
  color: #9C9DA6;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-right: 6px;
}

.btn-sub {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  color: #4B4C57;
}

.btn-sub:hover {
  background: rgba(0, 0, 0, 0.06);
}

.btn-edit {
  background: rgba(28, 106, 255, 0.1);
  border-color: rgba(28, 106, 255, 0.2);
  color: #1C6AFF;
}

.btn-edit:hover {
  background: rgba(28, 106, 255, 0.2);
}

.btn-sub-icon {
  width: 14px;
  height: 14px;
}

/* 底部状态栏 */
.status-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 32px;
  background: #F2F4F7;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
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
  color: #9C9DA6;
}

.status-dot-green {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ae176;
}

.spacer {
  flex: 1;
}

.footer-info {
  display: flex;
  gap: 24px;
  font-size: 12px;
  color: #9C9DA6;
  font-family: 'Microsoft YaHei', monospace;
}
</style>
