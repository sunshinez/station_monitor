<template>
  <div class="task-carrier-wave-monitor-page">
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
          <router-link to="/task-carrier-wave-monitor" class="side-link active">
            <SendIcon class="side-icon" />
            <span>载波监视任务计划发送</span>
          </router-link>
          <a href="#" class="side-link">
            <AltRouteIcon class="side-icon" />
            <span>中心调度指令执行</span>
          </a>
          <a href="#" class="side-link">
            <LanIcon class="side-icon" />
            <span>本地调度执行</span>
          </a>
          <a href="#" class="side-link">
            <BiotechIcon class="side-icon" />
            <span>故障诊断</span>
          </a>
        </nav>
      </aside>

      <!-- 主内容区 -->
      <main class="main-content">
        <!-- 页面头部 -->
        <div class="page-header">
          <div class="header-left">
            <h1 class="page-title">载波监视任务计划发送</h1>
            <p class="page-subtitle">载波监视任务计划发送控制台</p>
          </div>
          <div class="header-right">
            <p class="time-label">Current UTC Time</p>
            <p class="time-value mono">{{ currentTime }}</p>
          </div>
        </div>

        <!-- 主布局 -->
        <div class="content-grid">
          <!-- 左侧：操作计划列表 -->
          <section class="plan-list-section">
            <div class="section-header">
              <div class="section-title-group">
                <span class="title-bar"></span>
                <h2 class="section-title">操作计划列表</h2>
              </div>
              <span class="count-badge mono">COUNT: 14 ACTIVE</span>
            </div>
            <div class="plan-table-panel">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>任务名称</th>
                    <th>起止时间 (UTC)</th>
                    <th>计划状态</th>
                    <th>推送状态</th>
                    <th class="text-right">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(plan, index) in planList" :key="index"
                      :class="['table-row', selectedPlan === index ? 'selected-row' : '']"
                      @click="selectPlan(index)">
                    <td>
                      <div class="plan-name">{{ plan.name }}</div>
                      <div :class="['plan-id mono', selectedPlan === index ? 'text-primary-dim' : 'text-dim']">ID: {{ plan.id }}</div>
                    </td>
                    <td>
                      <div class="plan-time mono">{{ plan.startTime }}</div>
                      <div class="plan-time mono">{{ plan.endTime }}</div>
                    </td>
                    <td>
                      <div class="status-group">
                        <span :class="['status-dot', plan.statusDotClass]"></span>
                        <span :class="['status-text', plan.statusClass]">{{ plan.status }}</span>
                      </div>
                    </td>
                    <td>
                      <span :class="['push-tag', plan.pushClass]">{{ plan.pushStatus }}</span>
                    </td>
                    <td class="text-right">
                      <button :class="['action-btn', selectedPlan === index ? 'text-primary' : 'text-dim']">
                        <ArrowForwardIcon class="action-icon" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- 右侧：推送详情面板 -->
          <section class="push-panel-section">
            <div class="panel-header">
              <div class="section-title-group">
                <span class="title-bar bar-tertiary"></span>
                <h2 class="section-title">推送详情面板</h2>
              </div>
              <button class="info-btn">
                <InfoIcon class="info-icon" />
              </button>
            </div>
            <div class="push-detail-card">
              <div class="target-header">
                <div class="target-label">Target Mission</div>
                <h3 class="target-name">{{ currentPlan.name }}</h3>
                <p class="target-uuid mono">PLAN_UUID: <span class="uuid-value">77a1-89bc-44fe-112d</span></p>
              </div>
              <div class="detail-body">
                <div class="detail-grid">
                  <div class="detail-item">
                    <p class="detail-label">型号任务名称</p>
                    <p class="detail-value">{{ currentPlan.modelName }}</p>
                  </div>
                  <div class="detail-item">
                    <p class="detail-label">监测点位</p>
                    <p class="detail-value">{{ currentPlan.monitorPoint }}</p>
                  </div>
                </div>
                <div class="freq-card">
                  <p class="detail-label">监测频点</p>
                  <div class="freq-value-row">
                    <span class="freq-value mono">2245.500</span>
                    <span class="freq-unit mono">MHz</span>
                  </div>
                  <WavesIcon class="freq-bg-icon" />
                </div>
                <div class="monitor-items">
                  <p class="detail-label">监测项目</p>
                  <div class="item-tags">
                    <span class="item-tag">载波中心频率</span>
                    <span class="item-tag">信号电平值</span>
                    <span class="item-tag">相位噪声</span>
                    <span class="item-tag">调制指数监测</span>
                  </div>
                </div>
                <div class="push-time">
                  <p class="detail-label">推送时间 (Latest)</p>
                  <p class="detail-value mono">{{ currentPlan.pushTime }}</p>
                </div>
              </div>
              <button class="push-btn">
                <SendIcon class="push-btn-icon" />
                推送至联试系统
              </button>
            </div>
          </section>
        </div>
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
const ArrowForwardIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('line', { x1: '5', y1: '12', x2: '19', y2: '12' }),
      h('polyline', { points: '12 5 19 12 12 19' })
    ])
  }
}

const InfoIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('line', { x1: '12', y1: '16', x2: '12', y2: '12' }),
      h('line', { x1: '12', y1: '8', x2: '12.01', y2: '8' })
    ])
  }
}

const WavesIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1' }),
      h('path', { d: 'M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1' }),
      h('path', { d: 'M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1' })
    ])
  }
}

// 数据
const selectedPlan = ref(0)

const planList = ref([
  {
    name: '天舟八号货运飞船载波监视',
    id: 'TZ-8-CR-001',
    startTime: '08:00:00',
    endTime: '12:30:00',
    status: '正在执行',
    statusClass: 'text-success',
    statusDotClass: 'dot-success-glow',
    pushStatus: '已推送',
    pushClass: 'tag-success',
    modelName: '天舟八号 (TZ-8)',
    monitorPoint: '北京站-ANT-02',
    pushTime: '2024-05-20 08:30:11 UTC'
  },
  {
    name: '中星6D卫星S频段标校',
    id: 'ZX-6D-SB-442',
    startTime: '13:15:00',
    endTime: '14:00:00',
    status: '等待执行',
    statusClass: 'text-amber',
    statusDotClass: 'dot-amber-glow',
    pushStatus: '待推送',
    pushClass: 'tag-primary',
    modelName: '中星6D (ZX-6D)',
    monitorPoint: '上海站-ANT-01',
    pushTime: '未推送'
  },
  {
    name: '北斗三号G3星轨道监视',
    id: 'BDS-3-G3-OM',
    startTime: '04:00:00',
    endTime: '07:30:00',
    status: '已执行',
    statusClass: 'text-muted',
    statusDotClass: 'dot-muted',
    pushStatus: '无需发送',
    pushClass: 'tag-muted',
    modelName: '北斗三号G3 (BDS-3-G3)',
    monitorPoint: '西安站-ANT-03',
    pushTime: '2024-05-20 04:15:22 UTC'
  }
])

const currentPlan = ref({
  name: planList.value[0].name,
  modelName: planList.value[0].modelName,
  monitorPoint: planList.value[0].monitorPoint,
  pushTime: planList.value[0].pushTime
})

const selectPlan = (index: number) => {
  selectedPlan.value = index
  currentPlan.value.name = planList.value[index].name
  currentPlan.value.modelName = planList.value[index].modelName
  currentPlan.value.monitorPoint = planList.value[index].monitorPoint
  currentPlan.value.pushTime = planList.value[index].pushTime
}

const currentTime = ref('2024-05-20 08:42:11')

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
.task-carrier-wave-monitor-page {
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
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 16px;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  margin: 0;
}

.page-subtitle {
  font-size: 13px;
  color: #94a3b8;
  margin: 6px 0 0 0;
}

.header-right {
  text-align: right;
}

.time-label {
  font-size: 10px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 4px 0;
}

.time-value {
  font-size: 18px;
  color: #60a5fa;
  font-weight: 500;
  margin: 0;
}

.mono {
  font-family: 'Fira Code', monospace;
}

/* 主网格 */
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  flex: 1;
  min-height: 0;
}

/* 区域头部 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-bar {
  width: 3px;
  height: 14px;
  background: #60a5fa;
  border-radius: 2px;
}

.bar-tertiary {
  background: #4ae176;
}

.section-title {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
}

.count-badge {
  font-size: 10px;
  color: #64748b;
}

/* 计划列表表格 */
.plan-list-section {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.plan-table-panel {
  background: #1b1b20;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table th {
  background: rgba(42, 41, 47, 0.5);
  padding: 14px 20px;
  text-align: left;
  font-size: 10px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.data-table td {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
}

.table-row {
  transition: all 0.2s;
  cursor: pointer;
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.03);
}

.selected-row {
  background: rgba(96, 165, 250, 0.08);
  border-left: 3px solid #60a5fa;
}

.plan-name {
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
}

.plan-id {
  font-size: 10px;
  margin-top: 3px;
}

.text-primary-dim {
  color: rgba(96, 165, 250, 0.7);
}

.text-dim {
  color: #64748b;
}

.plan-time {
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.5;
}

.status-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dot-success-glow {
  background: #4ae176;
  box-shadow: 0 0 2px #4ae176, 0 0 10px rgba(74, 225, 118, 0.4);
}

.dot-amber-glow {
  background: #f59e0b;
  box-shadow: 0 0 2px #f59e0b, 0 0 10px rgba(245, 158, 11, 0.4);
}

.dot-muted {
  background: #64748b;
}

.status-text {
  font-size: 12px;
}

.text-success {
  color: #4ae176;
}

.text-amber {
  color: #f59e0b;
}

.text-muted {
  color: #64748b;
}

.push-tag {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 10px;
}

.tag-success {
  background: rgba(74, 225, 118, 0.1);
  color: #4ae176;
  border: 1px solid rgba(74, 225, 118, 0.2);
}

.tag-primary {
  background: rgba(96, 165, 250, 0.1);
  color: #60a5fa;
  border: 1px solid rgba(96, 165, 250, 0.2);
}

.tag-muted {
  background: #35343a;
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

.action-icon {
  width: 18px;
  height: 18px;
}

.text-right {
  text-align: right;
}

.text-primary {
  color: #60a5fa;
}

/* 右侧面板 */
.push-panel-section {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.info-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.info-btn:hover {
  color: #e4e1e9;
}

.info-icon {
  width: 18px;
  height: 18px;
}

.push-detail-card {
  flex: 1;
  background: rgba(53, 52, 58, 0.4);
  backdrop-filter: blur(20px);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 24px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.target-header {
  margin-bottom: 24px;
}

.target-label {
  font-size: 10px;
  color: #60a5fa;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
  margin: 0 0 6px 0;
}

.target-name {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 6px 0;
}

.target-uuid {
  font-size: 10px;
  color: #64748b;
  margin: 0;
}

.uuid-value {
  color: #cbd5e1;
}

.detail-body {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.detail-item {
  background: #0e0e13;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 12px;
  border-radius: 6px;
}

.detail-label {
  font-size: 9px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
  margin: 0 0 6px 0;
}

.detail-value {
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.freq-card {
  background: #0e0e13;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 16px;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
}

.freq-value-row {
  display: flex;
  align-items: flex-end;
  gap: 6px;
}

.freq-value {
  font-size: 28px;
  font-weight: 500;
  color: #60a5fa;
  line-height: 1;
}

.freq-unit {
  font-size: 11px;
  color: #64748b;
  margin-bottom: 4px;
}

.freq-bg-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  color: rgba(96, 165, 250, 0.15);
}

.monitor-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.item-tag {
  padding: 5px 10px;
  background: rgba(53, 52, 58, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  font-size: 11px;
  color: #e4e1e9;
}

.push-time {
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.push-btn {
  width: 100%;
  margin-top: 20px;
  padding: 14px;
  background: #3b82f6;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.push-btn:hover {
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
}

.push-btn-icon {
  width: 16px;
  height: 16px;
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
