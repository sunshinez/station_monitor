<template>
  <div class="task-plan-reception-page">
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
          <router-link to="/task-plan-reception" class="side-link active">
            <DownloadIcon class="side-icon" />
            <span>任务计划接收</span>
          </router-link>
          <router-link to="/task-plan-execution" class="side-link">
            <EditCalendarIcon class="side-icon" />
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
          <router-link to="/task-central-dispatch" class="side-link">
            <AltRouteIcon class="side-icon" />
            <span>中心调度指令执行</span>
          </router-link>
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
        <!-- 头部操作栏 -->
        <div class="content-header">
          <div class="header-left">
            <h1 class="page-title">任务计划接收与处理</h1>
            <p class="page-subtitle">Mission Plan Reception & Processing</p>
          </div>
          <div class="header-actions">
            <button class="btn btn-secondary">
              <SyncIcon class="btn-icon" />
              手动同步
            </button>
            <button class="btn btn-primary">
              <PlusIcon class="btn-icon" />
              新建任务计划
            </button>
          </div>
        </div>

        <!-- 上部监控卡片 -->
        <div class="monitor-grid">
          <!-- 自动接收监听状态 -->
          <section class="monitor-card card-primary">
            <div class="card-header">
              <h3 class="card-title">
                <RadioIcon class="card-title-icon" />
                自动接收监听状态
              </h3>
              <div class="status-badge">
                <span class="status-dot pulse"></span>
                <span class="status-text">LISTENING</span>
              </div>
            </div>
            <div class="card-body">
              <div class="info-row">
                <span class="info-label">监听端口:</span>
                <span class="info-value mono">8081 (TCP/FTP)</span>
              </div>
              <div class="recent-files">
                <h4 class="section-small-title">最近接收文件日志</h4>
                <div class="file-list">
                  <div class="file-item" v-for="(file, idx) in recentFiles" :key="idx">
                    <div class="file-info">
                      <span class="file-name mono">{{ file.name }}</span>
                      <span class="file-time">{{ file.time }}</span>
                    </div>
                    <CheckCircleIcon class="file-status-icon" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 解析与同步状态 -->
          <section class="monitor-card card-secondary">
            <div class="card-header">
              <h3 class="card-title">
                <SchemaIcon class="card-title-icon" />
                解析与同步状态
              </h3>
            </div>
            <div class="card-body sync-grid">
              <div class="sync-item">
                <div class="sync-item-header">
                  <span class="sync-label">自动解析引擎</span>
                  <span class="sync-value mono active">ACTIVE</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill fill-secondary" style="width: 100%"></div>
                </div>
                <div class="sync-stats">
                  <span>已处理 (今日): <strong class="mono">24</strong></span>
                  <span>解析成功率: <strong class="mono success">100%</strong></span>
                </div>
              </div>
              <div class="sync-item">
                <div class="sync-item-header">
                  <span class="sync-label">数据库同步状态</span>
                  <span class="sync-value mono success">SYNCED</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill fill-success" style="width: 100%"></div>
                </div>
                <div class="sync-stats">
                  <span>待同步节点: <strong class="mono">0</strong></span>
                  <span>最后同步: <strong class="mono">15:45:01</strong></span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- 任务计划列表 -->
        <div class="table-section">
          <div class="table-header-bar">
            <div class="table-header-left">
              <h3 class="table-title">任务计划列表</h3>
              <div class="search-box">
                <SearchIcon class="search-icon" />
                <input type="text" placeholder="搜索任务ID或卫星名称..." class="search-input" />
              </div>
            </div>
            <div class="table-header-right">
              <button class="btn btn-secondary btn-sm">
                <FilterIcon class="btn-icon" />
                筛选
              </button>
              <button class="btn btn-danger btn-sm">
                <DeleteIcon class="btn-icon" />
                批量删除
              </button>
            </div>
          </div>
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="col-mission-id">Mission ID</th>
                  <th>卫星名称</th>
                  <th>计划开始时间</th>
                  <th>计划结束时间</th>
                  <th>计划类型</th>
                  <th>状态</th>
                  <th class="col-actions text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(plan, index) in planList" :key="index" class="table-row">
                  <td class="col-mission-id">
                    <span class="mono text-primary">{{ plan.id }}</span>
                  </td>
                  <td>{{ plan.satellite }}</td>
                  <td :class="['mono', plan.strikethrough ? 'strikethrough text-muted' : '']">{{ plan.startTime }}</td>
                  <td :class="['mono', plan.strikethrough ? 'strikethrough text-muted' : '']">{{ plan.endTime }}</td>
                  <td>
                    <span :class="['tag', plan.typeClass]">{{ plan.type }}</span>
                  </td>
                  <td>
                    <span :class="['tag', plan.statusClass]">{{ plan.status }}</span>
                  </td>
                  <td class="col-actions text-right">
                    <div class="action-btns">
                      <button v-if="!plan.readonly" class="action-btn" title="编辑">
                        <EditIcon class="action-icon" />
                      </button>
                      <button v-if="!plan.readonly" class="action-btn danger" title="删除">
                        <DeleteIcon class="action-icon" />
                      </button>
                      <button v-if="plan.readonly" class="action-btn" title="详情">
                        <InfoIcon class="action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 计划变更日志 -->
        <section class="change-log-panel">
          <div class="change-log-header">
            <div class="change-log-title-group">
              <span class="change-log-dot"></span>
              <h3 class="change-log-title">计划变更日志 (Plan Change Log)</h3>
            </div>
            <span class="change-log-time mono">最后变更检查: 15:58:20</span>
          </div>
          <div class="change-log-body">
            <div v-for="(log, idx) in changeLogs" :key="idx" :class="['change-log-item', `border-${log.borderColor}`]">
              <span class="log-time mono">{{ log.time }}</span>
              <span class="log-message" v-html="log.message"></span>
              <span :class="['log-badge', log.badgeClass]">{{ log.badge }}</span>
            </div>
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

const EditCalendarIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('rect', { x: '3', y: '4', width: '18', height: '18', rx: '2', ry: '2' }),
      h('line', { x1: '16', y1: '2', x2: '16', y2: '6' }),
      h('line', { x1: '8', y1: '2', x2: '8', y2: '6' }),
      h('line', { x1: '3', y1: '10', x2: '21', y2: '10' })
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
const SyncIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3' })
    ])
  }
}

const RadioIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M4.9 19.1C1 15.2 1 8.8 4.9 4.9' }),
      h('path', { d: 'M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5' }),
      h('circle', { cx: '12', cy: '12', r: '2' }),
      h('path', { d: 'M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5' }),
      h('path', { d: 'M19.1 4.9C23 8.8 23 15.1 19.1 19.1' })
    ])
  }
}

const SchemaIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('rect', { x: '3', y: '3', width: '7', height: '7' }),
      h('rect', { x: '14', y: '3', width: '7', height: '7' }),
      h('rect', { x: '14', y: '14', width: '7', height: '7' }),
      h('rect', { x: '3', y: '14', width: '7', height: '7' })
    ])
  }
}

const SearchIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '11', cy: '11', r: '8' }),
      h('path', { d: 'M21 21l-4.35-4.35' })
    ])
  }
}

const PlusIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('line', { x1: '12', y1: '5', x2: '12', y2: '19' }),
      h('line', { x1: '5', y1: '12', x2: '19', y2: '12' })
    ])
  }
}

const FilterIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('polygon', { points: '22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3' })
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

const EditIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' }),
      h('path', { d: 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' })
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

const CheckCircleIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' }),
      h('polyline', { points: '22 4 12 14.01 9 11.01' })
    ])
  }
}

// 数据
const recentFiles = ref([
  { name: 'PLAN_LEO_20240525_001.xml', time: '2024-05-25 09:30:45' },
  { name: 'PLAN_GEO_EMERGENCY_V2.xml', time: '2024-05-25 08:12:12' }
])

const planList = ref([
  {
    id: 'MSN-2024-LEO-082',
    satellite: 'LEO-SAT-05',
    startTime: '2024-05-25 18:00:00',
    endTime: '2024-05-25 18:15:30',
    type: '标准 (Standard)',
    typeClass: 'tag-blue',
    status: '已解析 (Parsed)',
    statusClass: 'tag-tertiary',
    readonly: false,
    strikethrough: false
  },
  {
    id: 'MSN-2024-GEO-014',
    satellite: 'GEO-STATION-A',
    startTime: '2024-05-25 15:30:00',
    endTime: '2024-05-25 23:59:59',
    type: '应急 (Emergency)',
    typeClass: 'tag-amber',
    status: '执行中 (Executing)',
    statusClass: 'tag-secondary pulse',
    readonly: false,
    strikethrough: false
  },
  {
    id: 'MSN-2024-LEO-083',
    satellite: 'LEO-SAT-05',
    startTime: '2024-05-25 19:30:00',
    endTime: '2024-05-25 19:45:00',
    type: '已覆盖',
    typeClass: 'tag-muted',
    status: '已作废',
    statusClass: 'tag-error',
    readonly: true,
    strikethrough: true
  }
])

const changeLogs = ref([
  {
    time: '15:55:01',
    message: '任务 <span class="mono text-primary">[MSN-2024-LEO-083]</span> 被变更计划 <span class="mono text-primary">[MSN-2024-LEO-V-ALT-1]</span> 覆盖。原因：冲突时间重叠。',
    badge: '通知已下发客户端',
    badgeClass: 'badge-error',
    borderColor: 'error'
  },
  {
    time: '15:42:15',
    message: '任务 <span class="mono text-primary">[MSN-2024-GEO-014]</span> 解析成功。检测到紧急优先级。',
    badge: '同步成功',
    badgeClass: 'badge-success',
    borderColor: 'primary'
  },
  {
    time: '15:10:44',
    message: '常规计划包 <span class="mono text-primary">[PLAN_BATCH_20240525]</span> 接收中...',
    badge: '接收中',
    badgeClass: 'badge-info',
    borderColor: 'secondary'
  }
])

const currentTime = ref('2024-05-20 15:44:22.043')

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
.task-plan-reception-page {
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
  overflow: hidden;
  position: relative;
  margin-bottom: 32px;
}

/* 内容头部 */
.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
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
  color: #ffffff;
  margin: 0;
}

.page-subtitle {
  font-size: 11px;
  color: #64748b;
  font-family: 'Fira Code', monospace;
  letter-spacing: 0.05em;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.btn-primary {
  background: #a4c9ff;
  color: #00315d;
}

.btn-primary:hover {
  box-shadow: 0 0 15px rgba(164, 201, 255, 0.4);
}

.btn-secondary {
  background: #2a292f;
  color: #e4e1e9;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.05);
}

.btn-danger {
  background: rgba(255, 180, 171, 0.1);
  color: #ffb4ab;
  border: 1px solid rgba(255, 180, 171, 0.2);
}

.btn-danger:hover {
  background: rgba(255, 180, 171, 0.2);
}

.btn-icon {
  width: 14px;
  height: 14px;
}

/* 搜索框 */
.search-box {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #64748b;
}

.search-input {
  background: #0e0e13;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 10px 12px 10px 36px;
  color: #e4e1e9;
  font-size: 13px;
  width: 240px;
  outline: none;
}

.search-input:focus {
  border-color: rgba(96, 165, 250, 0.5);
}

.search-input::placeholder {
  color: #64748b;
}

/* 监控网格 */
.monitor-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;
  margin-bottom: 20px;
  flex-shrink: 0;
}

.monitor-card {
  background: #1b1b20;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.card-primary {
  border-left: 4px solid #60a5fa;
}

.card-secondary {
  border-left: 4px solid #adc6ff;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.card-primary .card-title {
  color: #60a5fa;
}

.card-secondary .card-title {
  color: #adc6ff;
}

.card-title-icon {
  width: 18px;
  height: 18px;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 700;
  color: #4ae176;
  text-transform: uppercase;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ae176;
}

.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.info-label {
  color: #94a3b8;
}

.info-value {
  color: #e4e1e9;
}

.section-small-title {
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  margin: 0 0 8px 0;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 120px;
  overflow-y: auto;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #0e0e13;
  padding: 10px 12px;
  border-radius: 4px;
}

.file-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.file-name {
  font-size: 11px;
  color: #60a5fa;
}

.file-time {
  font-size: 10px;
  color: #64748b;
}

.file-status-icon {
  width: 16px;
  height: 16px;
  color: #4ae176;
}

/* 同步状态网格 */
.sync-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.sync-item {
  background: #0e0e13;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 16px;
  border-radius: 4px;
}

.sync-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.sync-label {
  font-size: 12px;
  color: #94a3b8;
}

.sync-value {
  font-size: 12px;
}

.sync-value.active {
  color: #adc6ff;
}

.sync-value.success {
  color: #4ae176;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #35343a;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
}

.fill-secondary {
  background: #adc6ff;
}

.fill-success {
  background: #4ae176;
}

.sync-stats {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #94a3b8;
}

.sync-stats strong {
  color: #e4e1e9;
  font-weight: 500;
}

.sync-stats .success {
  color: #4ae176;
}

/* 表格区域 */
.table-section {
  flex: 1;
  min-height: 0;
  background: #1b1b20;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: 20px;
}

.table-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  flex-shrink: 0;
}

.table-header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.table-title {
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
  margin: 0;
}

.table-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-wrapper {
  flex: 1;
  overflow: auto;
  padding: 0 20px 20px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table th {
  background: rgba(14, 14, 19, 0.5);
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
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
}

.table-row {
  transition: all 0.2s;
  background: rgba(14, 14, 19, 0.2);
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.03);
}

.col-mission-id {
  width: 160px;
}

.col-actions {
  width: 100px;
}

.text-right {
  text-align: right;
}

.text-primary {
  color: #60a5fa;
}

.text-muted {
  color: #64748b;
}

.mono {
  font-family: 'Fira Code', monospace;
}

.strikethrough {
  text-decoration: line-through;
}

/* 标签 */
.tag {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 10px;
  text-transform: uppercase;
}

.tag-blue {
  background: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
}

.tag-amber {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.tag-tertiary {
  background: rgba(74, 225, 118, 0.1);
  color: #4ae176;
}

.tag-secondary {
  background: rgba(173, 198, 255, 0.1);
  color: #adc6ff;
}

.tag-error {
  background: rgba(255, 180, 171, 0.1);
  color: #ffb4ab;
}

.tag-muted {
  background: #35343a;
  color: #94a3b8;
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
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  color: #60a5fa;
  background: rgba(255, 255, 255, 0.05);
}

.action-btn.danger:hover {
  color: #ffb4ab;
}

.action-icon {
  width: 18px;
  height: 18px;
}

/* 变更日志 */
.change-log-panel {
  height: 180px;
  flex-shrink: 0;
  background: #1b1b20;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-top: 2px solid rgba(96, 165, 250, 0.2);
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.change-log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-shrink: 0;
}

.change-log-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.change-log-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f59e0b;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.change-log-title {
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
  margin: 0;
}

.change-log-time {
  font-size: 11px;
  color: #64748b;
}

.change-log-body {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.change-log-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: #0e0e13;
  border-left: 3px solid transparent;
  border-radius: 0 4px 4px 0;
  font-size: 12px;
}

.border-error {
  background: rgba(255, 180, 171, 0.05);
  border-left-color: #ffb4ab;
}

.border-primary {
  border-left-color: #60a5fa;
}

.border-secondary {
  border-left-color: #adc6ff;
}

.log-time {
  color: #64748b;
  white-space: nowrap;
  flex-shrink: 0;
}

.border-error .log-time {
  color: #ffb4ab;
}

.log-message {
  color: #e4e1e9;
  flex: 1;
  min-width: 0;
}

.log-badge {
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 9px;
  white-space: nowrap;
  flex-shrink: 0;
}

.badge-error {
  background: rgba(255, 180, 171, 0.1);
  color: #ffb4ab;
}

.badge-success {
  background: rgba(74, 225, 118, 0.1);
  color: #4ae176;
}

.badge-info {
  background: rgba(173, 198, 255, 0.1);
  color: #adc6ff;
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
