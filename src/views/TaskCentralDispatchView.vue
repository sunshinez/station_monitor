<template>
  <div class="task-central-dispatch-page">
    <!-- 顶部导航栏 - 全局统一 -->
    <header class="top-nav">
      <div class="logo">XX地面站软件</div>
      <nav class="main-nav">
        <router-link to="/topology" class="nav-link">图形化监视</router-link>
        <router-link to="/device-control" class="nav-link">控制功能</router-link>
        <router-link to="/task-status" class="nav-link">状态监视</router-link>
        <router-link to="/task-macro" class="nav-link active">任务管理</router-link>
        <router-link to="/log-record" class="nav-link">日志管理</router-link>
        <a href="#" class="nav-link">操作手册</a>
        <router-link to="/file-transfer" class="nav-link">文件传输</router-link>
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
      <!-- 任务管理侧边栏 -->
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
          <router-link to="/task-link-mapping" class="side-link">
            <HubIcon class="side-icon" />
            <span>任务链路映射管理</span>
          </router-link>
          <router-link to="/task-script-editor" class="side-link">
            <TerminalIcon class="side-icon" />
            <span>脚本命令编辑</span>
          </router-link>
          <router-link to="/task-plan-template" class="side-link">
            <DescriptionIcon class="side-icon" />
            <span>操作计划模板</span>
          </router-link>
          <router-link to="/task-mission-param" class="side-link">
            <InputIcon class="side-icon" />
            <span>型号任务参数接收</span>
          </router-link>
          <router-link to="/task-plan-reception" class="side-link">
            <DownloadIcon class="side-icon" />
            <span>任务计划接收</span>
          </router-link>
          <router-link to="/task-plan-execution" class="side-link">
            <AutoFixHighIcon class="side-icon" />
            <span>操作计划生成与执行</span>
          </router-link>
          <router-link to="/task-script-execution" class="side-link">
            <PlayCircleIcon class="side-icon" />
            <span>脚本执行</span>
          </router-link>
          <router-link to="/task-carrier-wave-monitor" class="side-link">
            <SendIcon class="side-icon" />
            <span>载波监视任务计划发送</span>
          </router-link>
          <router-link to="/task-central-dispatch" class="side-link active">
            <AltRouteIcon class="side-icon" />
            <span>中心调度指令执行</span>
          </router-link>
          <router-link to="/task-local-dispatch" class="side-link">
            <LanIcon class="side-icon" />
            <span>本地调度执行</span>
          </router-link>
          <router-link to="/task-fault-diagnosis" class="side-link">
            <BiotechIcon class="side-icon" />
            <span>故障诊断</span>
          </router-link>
        </nav>
      </aside>

      <!-- 主内容区 -->
      <main class="main-content">
        <!-- 头部 -->
        <div class="page-header">
          <div class="header-left">
            <h1 class="page-title">中心调度指令执行</h1>
            <p class="page-subtitle">Central Command Execution & Telemetry Validation</p>
          </div>
          <div class="header-right">
            <div class="status-badge">
              <span class="status-dot pulse"></span>
              <span class="mono">上行链路激活: 2.4kbps</span>
            </div>
            <div class="status-badge">
              <span class="mono">UTC: {{ currentTime }}</span>
            </div>
          </div>
        </div>

        <!-- 实时调度指令流 -->
        <section class="command-stream-section">
          <div class="section-header-bar">
            <div class="section-title-group">
              <DynamicFeedIcon class="section-icon" />
              <h2 class="section-title">实时调度指令流</h2>
            </div>
            <span class="stream-badge">实时流数据</span>
          </div>
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>指令ID (Hex)</th>
                  <th>时间戳</th>
                  <th>操作类型</th>
                  <th>执行脚本</th>
                  <th class="text-center">优先级</th>
                  <th class="text-right">执行状态</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(cmd, index) in commandStream" :key="index" class="table-row">
                  <td class="mono text-primary font-bold">{{ cmd.id }}</td>
                  <td class="mono text-dim">{{ cmd.timestamp }}</td>
                  <td>{{ cmd.type }}</td>
                  <td>{{ cmd.script }}</td>
                  <td class="text-center">
                    <span :class="['priority-tag', cmd.priorityClass]">{{ cmd.priority }}</span>
                  </td>
                  <td class="text-right">
                    <span :class="['exec-status', cmd.statusClass]">
                      <component :is="cmd.statusIcon" class="status-icon" />
                      {{ cmd.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- 执行日志 -->
        <section class="execution-log-section">
          <div class="section-header-bar">
            <div class="section-title-group">
              <AssignmentLateIcon class="section-icon text-error" />
              <h2 class="section-title">执行日志</h2>
            </div>
          </div>
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>时间戳</th>
                  <th>干预操作</th>
                  <th>干预结果</th>
                  <th>分机ACK状态</th>
                  <th>执行备注</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(log, index) in executionLogs" :key="index" class="table-row">
                  <td class="mono text-dim">{{ log.timestamp }}</td>
                  <td :class="['font-bold', log.opClass]">{{ log.operation }}</td>
                  <td>
                    <span :class="['result-badge', log.resultClass]">{{ log.result }}</span>
                  </td>
                  <td :class="['mono', log.ackClass]">{{ log.ack }}</td>
                  <td class="text-dim font-body">{{ log.remark }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>

    <!-- 底部状态栏 -->
    <footer class="status-footer">
      <div class="status-item">
        <span class="status-dot-green"></span>
        <span class="status-text">Uplink Status: Nominal</span>
      </div>
      <div class="status-item">
        <span class="status-dot-green"></span>
        <span class="status-text">Sync: 102.4ms</span>
      </div>
      <div class="spacer"></div>
      <div class="footer-info">
        <span>UTC: {{ currentTime }}</span>
        <span>LAT: 39.9042° N | LON: 116.4074° E</span>
      </div>
    </footer>
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
const DynamicFeedIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M12 2v20' }),
      h('path', { d: 'M2 10h20' }),
      h('path', { d: 'M2 14h20' }),
      h('path', { d: 'M2 6h20' }),
      h('path', { d: 'M2 18h20' })
    ])
  }
}

const AssignmentLateIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z' }),
      h('path', { d: 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z' })
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

const SyncIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3' })
    ])
  }
}

const SendSmallIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('line', { x1: '22', y1: '2', x2: '11', y2: '13' }),
      h('polygon', { points: '22 2 15 22 11 13 2 9 22 2' })
    ])
  }
}

// 数据
const commandStream = ref([
  {
    id: '0x55AA02FFE10A',
    timestamp: '14:30:04.221',
    type: '紧急转储 (EMERG_DUMP)',
    script: 'EMERG_DUMP',
    priority: '高优先级',
    priorityClass: 'priority-high',
    status: '执行成功',
    statusClass: 'status-success',
    statusIcon: CheckCircleIcon
  },
  {
    id: '0x55AA03A10204',
    timestamp: '14:29:58.105',
    type: '频率切换 (FREQ_SW)',
    script: 'FREQ_SW_V2',
    priority: '中优先级',
    priorityClass: 'priority-medium',
    status: '解析中',
    statusClass: 'status-parsing',
    statusIcon: SyncIcon
  },
  {
    id: '0x55AA01000000',
    timestamp: '14:29:45.002',
    type: '心跳校准 (HEARTBEAT)',
    script: 'HEARTBEAT_CHECK',
    priority: '低优先级',
    priorityClass: 'priority-low',
    status: '已分发',
    statusClass: 'status-sent',
    statusIcon: SendSmallIcon
  }
])

const executionLogs = ref([
  {
    timestamp: '2024-05-20 14:02:11',
    operation: '强制切断执行流',
    opClass: 'text-error',
    result: 'SUCCESS',
    resultClass: 'result-success',
    ack: 'EMERG_DUMP',
    ackClass: 'text-dim',
    remark: '操作员手动接入，防止上行频率冲突'
  },
  {
    timestamp: '2024-05-20 13:45:00',
    operation: '重定向至备机脚本',
    opClass: 'text-primary',
    result: 'SUCCESS',
    resultClass: 'result-success',
    ack: 'FREQ_SW_V2',
    ackClass: 'text-dim',
    remark: '主分机通信链路超时，系统自动执行切换逻辑'
  },
  {
    timestamp: '2024-05-20 12:12:44',
    operation: '参数手动覆盖',
    opClass: 'text-error',
    result: 'FAILED',
    resultClass: 'result-failed',
    ack: 'HEARTBEAT_CHECK',
    ackClass: 'text-error font-bold',
    remark: '当前用户权限等级不足，指令被分机控制单元拒绝'
  },
  {
    timestamp: '2024-05-20 09:30:15',
    operation: '清空解析队列',
    opClass: 'text-primary',
    result: 'SUCCESS',
    resultClass: 'result-success',
    ack: '0x00 (NORMAL)',
    ackClass: 'text-dim',
    remark: '日常系统维护操作，清除所有挂起的低优先级任务'
  }
])

const currentTime = ref('2024-05-20 14:30:05')

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
.task-central-dispatch-page {
  min-height: 100vh;
  background-color: #131318;
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
  background: #131318;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
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
  color: #60a5fa;
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
  color: #60a5fa;
  border-bottom-color: #60a5fa;
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
  color: #94a3b8;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.05);
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
  background: #1b1b20;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
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
  padding: 0 12px;
}

.side-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  color: #94a3b8;
  text-decoration: none;
  font-size: 13px;
  border-radius: 4px;
  transition: all 0.2s;
  border-left: 4px solid transparent;
  margin-bottom: 2px;
}

.side-link:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #e4e1e9;
}

.side-link.active {
  background: #2a292f;
  color: #60a5fa;
  border-left-color: #60a5fa;
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
  gap: 20px;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-shrink: 0;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.page-subtitle {
  font-size: 12px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 6px 0 0 0;
}

.header-right {
  display: flex;
  gap: 12px;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  background: #1b1b20;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  font-size: 12px;
  color: #94a3b8;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ae176;
  box-shadow: 0 0 2px #4ae176, 0 0 10px rgba(74, 225, 118, 0.4);
}

.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}

.mono {
  font-family: 'Fira Code', monospace;
}

/* 区域通用 */
.command-stream-section {
  background: #1b1b20;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-left: 4px solid #60a5fa;
  padding: 24px;
  flex-shrink: 0;
}

.execution-log-section {
  background: #1b1b20;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-left: 4px solid #ffb4ab;
  padding: 24px;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.section-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-icon {
  width: 20px;
  height: 20px;
  color: #60a5fa;
}

.section-title {
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.stream-badge {
  padding: 4px 10px;
  background: rgba(96, 165, 250, 0.1);
  color: #60a5fa;
  border: 1px solid rgba(96, 165, 250, 0.2);
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.text-error {
  color: #ffb4ab;
}

.text-primary {
  color: #60a5fa;
}

.text-dim {
  color: #94a3b8;
}

.font-body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.font-bold {
  font-weight: 700;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
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
  font-size: 10px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.data-table td {
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
}

.table-row {
  transition: all 0.2s;
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.03);
}

/* 优先级标签 */
.priority-tag {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
}

.priority-high {
  background: rgba(255, 180, 171, 0.1);
  color: #ffb4ab;
  border: 1px solid rgba(255, 180, 171, 0.2);
}

.priority-medium {
  background: rgba(96, 165, 250, 0.1);
  color: #60a5fa;
  border: 1px solid rgba(96, 165, 250, 0.2);
}

.priority-low {
  background: rgba(100, 116, 139, 0.15);
  color: #94a3b8;
  border: 1px solid rgba(100, 116, 139, 0.2);
}

/* 执行状态 */
.exec-status {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  font-weight: 700;
}

.status-success {
  color: #4ae176;
}

.status-parsing {
  color: #60a5fa;
}

.status-sent {
  color: #64748b;
}

.status-icon {
  width: 14px;
  height: 14px;
}

:deep(.animate-spin) {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 结果徽章 */
.result-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 9999px;
  font-size: 9px;
  font-weight: 700;
}

.result-success {
  background: rgba(74, 225, 118, 0.1);
  color: #4ae176;
  border: 1px solid rgba(74, 225, 118, 0.2);
}

.result-failed {
  background: rgba(255, 180, 171, 0.1);
  color: #ffb4ab;
  border: 1px solid rgba(255, 180, 171, 0.2);
}

/* 底部状态栏 */
.status-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 32px;
  background: #0e0e13;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
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
  color: #94a3b8;
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
  color: #64748b;
  font-family: 'Fira Code', monospace;
}
</style>
