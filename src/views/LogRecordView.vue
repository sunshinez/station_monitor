<template>
  <div class="log-record-page">
    <!-- TopNavBar -->
    <header class="top-nav">
      <div class="logo">XX地面站软件</div>
      <nav class="main-nav">
        <router-link to="/topology" class="nav-link">图形化监视</router-link>
        <router-link to="/device-control" class="nav-link">控制功能</router-link>
        <router-link to="/task-status" class="nav-link">状态监视</router-link>
        <router-link to="/task-macro" class="nav-link">任务管理</router-link>
        <router-link to="/log-record" class="nav-link active">日志管理</router-link>
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
        <button class="icon-btn" title="用户账户" @click="logout">
          <UserIcon class="icon" />
        </button>
      </div>
    </header>

    <div class="main-layout">
      <!-- SideNavBar -->
      <aside class="side-nav">
        <div class="side-header">
          <h2 class="side-title">日志管理</h2>
        </div>
        <nav class="side-menu">
          <router-link to="/log-record" class="side-link active">
            <DocIcon class="side-icon" />
            <span>日志记录</span>
          </router-link>
          <router-link to="/log-query" class="side-link">
            <SearchIcon class="side-icon" />
            <span>日志查询</span>
          </router-link>
        </nav>

      </aside>

      <!-- Main Content Area -->
      <main class="main-content">
        <div class="content-wrapper">
          <!-- 头部状态栏 -->
          <div class="page-header">
            <div class="header-left">
              <div class="header-tag">
                <span class="pulse-dot error"></span>
                <h1 class="page-title">实时日志记录中心</h1>
              </div>
              <p class="page-subtitle">子系统状态采集与实时控制事件流同步记录中</p>
            </div>
            <div class="header-right">
              <div class="storage-card">
                <span class="storage-label">存储负载:</span>
                <div class="storage-bar">
                  <div class="storage-progress" style="width: 35%"></div>
                </div>
                <span class="storage-value">12.4 GB / 32 GB</span>
              </div>
              <button class="btn-secondary">
                <RefreshIcon class="btn-icon" />
                <span>自动备份: 开启</span>
              </button>
              <button class="btn-primary" @click="toggleRecording">
                <SaveIcon class="btn-icon" />
                <span>{{ isRecording ? '停止记录' : '开始记录' }}</span>
              </button>
            </div>
          </div>

          <div class="content-grid">
            <!-- 左侧主要展示区 -->
            <section class="left-section">
              <!-- 1. 实时日志记录区 (控制流) -->
              <div class="panel event-panel">
                <div class="panel-header">
                  <div class="panel-title-group">
                    <FeedIcon class="panel-icon" />
                    <h2 class="panel-title">实时事件记录 (控制流)</h2>
                  </div>
                  <span class="status-badge">同步中</span>
                </div>
                <div class="panel-body table-wrapper">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>发生时间</th>
                        <th>事件类型</th>
                        <th>指令/响应负载内容</th>
                        <th>源/目标设备</th>
                        <th class="text-right">执行结果</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(event, index) in eventLogs" :key="index" :class="{ highlight: index % 2 === 1 }">
                        <td class="time-cell">{{ event.time }}</td>
                        <td>
                          <span :class="['event-type', event.typeClass]">{{ event.type }}</span>
                        </td>
                        <td>{{ event.content }}</td>
                        <td class="device-cell">{{ event.device }}</td>
                        <td class="text-right" :class="event.resultClass">{{ event.result }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- 2. 状态轮询监视区 (子系统状态) -->
              <div class="panel status-panel">
                <div class="panel-header">
                  <div class="panel-title-group">
                    <HeartbeatIcon class="panel-icon tertiary" />
                    <h2 class="panel-title">状态轮询监视 (子系统状态)</h2>
                  </div>
                  <div class="panel-meta">
                    <span class="meta-item">轮询周期: 1s</span>
                    <span class="meta-item success">系统状态: 良好</span>
                  </div>
                </div>
                <div class="panel-body table-wrapper">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>监测时间</th>
                        <th>子系统名称</th>
                        <th>当前运行状态</th>
                        <th>连接链路</th>
                        <th class="text-right">负载率</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(status, index) in statusLogs" :key="index" :class="{ highlight: index % 2 === 1 }">
                        <td class="time-cell">{{ status.time }}</td>
                        <td>{{ status.name }}</td>
                        <td>
                          <span class="status-running">
                            <span class="status-dot"></span>
                            {{ status.state }}
                          </span>
                        </td>
                        <td class="device-cell">{{ status.link }}</td>
                        <td class="text-right">{{ status.load }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <!-- 右侧: 轮询配置面板 -->
            <aside class="right-section">
              <section class="panel config-panel">
                <div class="panel-title-group">
                  <SettingsInputIcon class="panel-icon" />
                  <h3 class="panel-title">轮询周期配置面板</h3>
                </div>
                <div class="config-body">
                  <p class="config-section-title">子系统专项采集周期</p>
                  <div class="config-list">
                    <div v-for="(item, index) in pollConfig" :key="index" class="config-item">
                      <span class="config-name">{{ item.name }}</span>
                      <select v-model="item.value" class="config-select">
                        <option v-for="opt in item.options" :key="opt" :value="opt">{{ opt }}</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button class="btn-outline" @click="syncConfig">
                  同步更新至采集器
                </button>
              </section>

              <div class="info-card">
                <p class="info-text">
                  [信息] 日志服务当前以双模冗余模式运行。子系统级状态异常将自动触发关联事件流快照。
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { h } from 'vue'
import UserIcon from '@/components/icons/UserIcon.vue'

const router = useRouter()

const SettingsIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '3' }),
      h('path', { d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09A1.65 1.65 0 0 0 21 12z' })
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

const DocIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
      h('polyline', { points: '14 2 14 8 20 8' }),
      h('line', { x1: '16', y1: '13', x2: '8', y2: '13' }),
      h('line', { x1: '16', y1: '17', x2: '8', y2: '17' }),
      h('polyline', { points: '10 9 9 9 8 9' })
    ])
  }
}

const SearchIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '11', cy: '11', r: '8' }),
      h('line', { x1: '21', y1: '21', x2: '16.65', y2: '16.65' })
    ])
  }
}

const FeedIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M12 2v20M2 12h20M17 7l-5-5-5 5M17 17l-5 5-5-5' })
    ])
  }
}

const HeartbeatIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('polyline', { points: '22 12 18 12 15 21 9 3 6 12 2 12' })
    ])
  }
}

const SettingsInputIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('line', { x1: '4', y1: '21', x2: '4', y2: '14' }),
      h('line', { x1: '4', y1: '10', x2: '4', y2: '3' }),
      h('line', { x1: '12', y1: '21', x2: '12', y2: '12' }),
      h('line', { x1: '12', y1: '8', x2: '12', y2: '3' }),
      h('line', { x1: '20', y1: '21', x2: '20', y2: '16' }),
      h('line', { x1: '20', y1: '12', x2: '20', y2: '3' }),
      h('line', { x1: '1', y1: '14', x2: '7', y2: '14' }),
      h('line', { x1: '9', y1: '8', x2: '15', y2: '8' }),
      h('line', { x1: '17', y1: '16', x2: '23', y2: '16' })
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

const SaveIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z' }),
      h('polyline', { points: '17 21 17 13 7 13 7 21' }),
      h('polyline', { points: '7 3 7 8 15 8' })
    ])
  }
}

const isRecording = ref(true)
const currentTime = ref('14:52:01.000')
let timeInterval: number | null = null
let logInterval: number | null = null

const toggleRecording = () => {
  isRecording.value = !isRecording.value
}

const syncConfig = () => {
  alert('配置已同步更新至采集器')
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/')
}

const eventLogs = ref([
  { time: '14:52:01.402', type: '控制命令', typeClass: 'primary', content: '设置方位角 [参数: 242.11°]', device: '中心控制 → 天线_01', result: '已接收', resultClass: 'tertiary' },
  { time: '14:52:01.558', type: '控制响应', typeClass: 'secondary', content: '响应_方位角初始化完成', device: '天线_01 → 中心控制', result: '成功', resultClass: 'tertiary' },
  { time: '14:52:04.221', type: '控制命令', typeClass: 'primary', content: '调整增益 [等级: +3dB]', device: '中心控制 → 射频前端', result: '已接收', resultClass: 'tertiary' },
  { time: '14:52:04.300', type: '控制响应', typeClass: 'secondary', content: '响应_增益调节稳定', device: '射频前端 → 中心控制', result: '成功', resultClass: 'tertiary' },
  { time: '14:52:06.112', type: '控制命令', typeClass: 'primary', content: '启动数据采集 [模式: 连续]', device: '中心控制 → 数传基带', result: '已接收', resultClass: 'tertiary' },
  { time: '14:52:06.245', type: '控制响应', typeClass: 'secondary', content: '响应_采集已启动', device: '数传基带 → 中心控制', result: '成功', resultClass: 'tertiary' }
])

const statusLogs = ref([
  { time: '14:52:12.001', name: '天线伺服子系统', state: '运行中', link: 'FC-AE-1553B', load: '24%' },
  { time: '14:52:12.001', name: '数传基带子系统', state: '运行中', link: 'LVDS / SFP+', load: '45%' },
  { time: '14:52:12.001', name: '射频前端子系统', state: '待机', link: 'RS422', load: '8%' },
  { time: '14:52:12.001', name: '数据分发与存储子系统', state: '运行中', link: '10GbE Network', load: '12%' }
])

const pollConfig = ref([
  { name: '天线伺服子系统', value: '1s', options: ['500ms', '1s', '2s'] },
  { name: '数传基带子系统', value: '1s', options: ['1s', '2s', '5s'] },
  { name: '射频前端子系统', value: '1s', options: ['1s', '2s', '10s'] },
  { name: '数据分发与存储', value: '1s', options: ['1s', '5s', '1min'] }
])

onMounted(() => {
  timeInterval = window.setInterval(() => {
    const now = new Date()
    const h = String(now.getHours()).padStart(2, '0')
    const m = String(now.getMinutes()).padStart(2, '0')
    const s = String(now.getSeconds()).padStart(2, '0')
    const ms = String(now.getMilliseconds()).padStart(3, '0')
    currentTime.value = `${h}:${m}:${s}.${ms}`
  }, 100)

  logInterval = window.setInterval(() => {
    if (!isRecording.value) return
    statusLogs.value.forEach(item => {
      item.time = currentTime.value
    })
    statusLogs.value[0].load = `${20 + Math.floor(Math.random() * 10)}%`
    statusLogs.value[1].load = `${40 + Math.floor(Math.random() * 10)}%`
    statusLogs.value[2].load = `${5 + Math.floor(Math.random() * 6)}%`
    statusLogs.value[3].load = `${10 + Math.floor(Math.random() * 6)}%`
  }, 1000)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
  if (logInterval) clearInterval(logInterval)
})
</script>

<style scoped>
.log-record-page {
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
  background: #1b1b20;
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

.side-nav {
  width: 260px;
  background: #131318;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  z-index: 40;
  flex-shrink: 0;
  padding-top: 16px;
}

.side-header {
  padding: 8px 24px 24px;
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
  display: flex;
  flex-direction: column;
  padding: 0 8px;
  gap: 2px;
}

.side-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #64748b;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s;
  border-radius: 4px;
  border-left: 4px solid transparent;
}

.side-link:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #e4e1e9;
}

.side-link.active {
  background: rgba(255, 255, 255, 0.05);
  border-left-color: #60a5fa;
  color: #e4e1e9;
}

.side-icon {
  width: 20px;
  height: 20px;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  background: #131318;
  padding: 32px;
}

.content-wrapper {
  max-width: 1600px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-tag {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #60a5fa;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.pulse-dot.error {
  background: #ffb4ab;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
}

.page-subtitle {
  font-size: 12px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.storage-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: #2a292f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  font-size: 11px;
}

.storage-label {
  color: #94a3b8;
  font-family: 'Fira Code', monospace;
}

.storage-bar {
  width: 96px;
  height: 6px;
  background: #0e0e13;
  border-radius: 3px;
  overflow: hidden;
}

.storage-progress {
  height: 100%;
  background: #60a5fa;
  border-radius: 3px;
}

.storage-value {
  color: #60a5fa;
  font-family: 'Fira Code', monospace;
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #2a292f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: #e4e1e9;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #35343a;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #60a5fa;
  border: none;
  border-radius: 4px;
  color: #0f172a;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  box-shadow: 0 0 15px rgba(96, 165, 250, 0.4);
}

.btn-icon {
  width: 16px;
  height: 16px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 32px;
  align-items: start;
}

.left-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.right-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.panel {
  background: #1b1b20;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #2a292f;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.panel-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.panel-icon {
  width: 20px;
  height: 20px;
  color: #60a5fa;
}

.panel-icon.tertiary {
  color: #4ae176;
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
  letter-spacing: 0.05em;
}

.status-badge {
  padding: 4px 8px;
  background: rgba(96, 165, 250, 0.1);
  border: 1px solid rgba(96, 165, 250, 0.2);
  border-radius: 4px;
  color: #60a5fa;
  font-size: 10px;
  font-weight: 600;
}

.panel-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.meta-item {
  font-size: 11px;
  font-family: 'Fira Code', monospace;
  color: #94a3b8;
}

.meta-item.success {
  color: #4ae176;
}

.panel-body {
  padding: 0;
  min-height: 200px;
}

.table-wrapper {
  overflow: auto;
  max-height: 320px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 13px;
}

.data-table th {
  font-size: 10px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 14px 24px;
  background: #0e0e13;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  white-space: nowrap;
}

.data-table td {
  padding: 14px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-family: 'Fira Code', monospace;
  font-size: 12px;
}

.data-table tr {
  transition: background 0.2s;
}

.data-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.03);
}

.data-table tbody tr.highlight {
  background: rgba(255, 255, 255, 0.015);
}

.text-right {
  text-align: right;
}

.time-cell {
  color: #60a5fa;
}

.device-cell {
  color: #94a3b8;
}

.event-type {
  font-weight: 600;
}

.event-type.primary {
  color: #60a5fa;
}

.event-type.secondary {
  color: #a4c9ff;
}

.tertiary {
  color: #4ae176;
}

.status-running {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #4ae176;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4ae176;
}

.config-panel {
  padding: 24px;
}

.config-body {
  margin-top: 20px;
  margin-bottom: 20px;
}

.config-section-title {
  font-size: 10px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 16px 0;
}

.config-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.config-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.config-name {
  font-size: 12px;
  color: #e4e1e9;
}

.config-select {
  padding: 6px 10px;
  background: #0e0e13;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: #e4e1e9;
  font-size: 11px;
  font-family: 'Fira Code', monospace;
  cursor: pointer;
}

.btn-outline {
  width: 100%;
  padding: 12px;
  background: rgba(96, 165, 250, 0.1);
  border: 1px solid rgba(96, 165, 250, 0.3);
  border-radius: 4px;
  color: #60a5fa;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover {
  background: rgba(96, 165, 250, 0.2);
}

.info-card {
  padding: 16px;
  background: rgba(96, 165, 250, 0.05);
  border: 1px solid rgba(96, 165, 250, 0.15);
  border-radius: 8px;
}

.info-text {
  font-size: 11px;
  color: rgba(96, 165, 250, 0.7);
  font-family: 'Fira Code', monospace;
  line-height: 1.6;
  margin: 0;
}

.event-panel {
  flex: 3;
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

.status-panel {
  flex: 2;
  min-height: 240px;
  display: flex;
  flex-direction: column;
}

.left-section {
  min-height: 0;
}
</style>
