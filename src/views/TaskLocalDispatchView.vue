<template>
  <div class="task-local-dispatch-page">
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
          <router-link to="/task-central-dispatch" class="side-link">
            <AltRouteIcon class="side-icon" />
            <span>中心调度指令执行</span>
          </router-link>
          <router-link to="/task-local-dispatch" class="side-link active">
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
        <!-- 执行控制中心 -->
        <section class="control-center">
          <div class="control-header">
            <div class="control-title-group">
              <h2 class="control-title">本地调度执行控制中心</h2>
              <div class="status-badge">
                <span class="status-dot pulse"></span>
                <span class="mono">状态: 正在执行 - 任务 Alpha-7</span>
              </div>
            </div>
            <div class="time-group">
              <p class="time-label">系统时间 (UTC)</p>
              <p class="time-value mono">{{ currentTime }}</p>
            </div>
          </div>
          <div class="control-buttons">
            <button class="ctrl-btn btn-start">
              <PlayArrowIcon class="ctrl-btn-icon" />
              <span class="ctrl-btn-label">开始执行</span>
            </button>
            <button class="ctrl-btn btn-stop">
              <StopIcon class="ctrl-btn-icon" />
              <span class="ctrl-btn-label">中止运行</span>
            </button>
            <button class="ctrl-btn btn-pause">
              <PauseIcon class="ctrl-btn-icon" />
              <span class="ctrl-btn-label">暂停运行</span>
            </button>
            <button class="ctrl-btn btn-resume">
              <SkipNextIcon class="ctrl-btn-icon" />
              <span class="ctrl-btn-label">接续运行</span>
            </button>
            <button class="ctrl-btn btn-jump">
              <RedoIcon class="ctrl-btn-icon" />
              <span class="ctrl-btn-label">跳转步进</span>
            </button>
          </div>
          <div class="progress-area">
            <div class="progress-header">
              <span class="progress-label">当前计划执行进度: 65%</span>
              <span class="progress-time mono">已耗时: 00:12:45 / 预计剩余: 00:06:55</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: 65%">
                <div class="progress-shimmer"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- 表格区域 -->
        <div class="tables-section">
          <!-- 参数宏列表 -->
          <section class="data-panel">
            <div class="panel-header-bar">
              <div class="panel-title-group">
                <TuneIcon class="panel-icon text-secondary" />
                <h3 class="panel-title">参数宏列表</h3>
              </div>
            </div>
            <div class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>宏名称</th>
                    <th>下发时间</th>
                    <th>更新时间</th>
                    <th>来源</th>
                    <th class="text-right">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(macro, index) in macroList" :key="index" class="table-row">
                    <td class="font-medium">{{ macro.name }}</td>
                    <td class="mono text-primary">{{ macro.dispatchTime }}</td>
                    <td class="mono text-dim">{{ macro.updateTime }}</td>
                    <td>{{ macro.source }}</td>
                    <td class="text-right">
                      <button class="more-btn">
                        <MoreVertIcon class="more-icon" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- 操作计划列表 -->
          <section class="data-panel">
            <div class="panel-header-bar">
              <div class="panel-title-group">
                <DescriptionIcon class="panel-icon text-primary" />
                <h3 class="panel-title">操作计划列表</h3>
              </div>
            </div>
            <div class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>操作计划名称</th>
                    <th>生成时间</th>
                    <th>计划执行开始时间</th>
                    <th>计划执行结束时间</th>
                    <th>对应计划任务编号</th>
                    <th>脚本名称</th>
                    <th class="text-right">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(plan, index) in operationPlans" :key="index" class="table-row">
                    <td class="font-medium">{{ plan.name }}</td>
                    <td class="mono text-dim">{{ plan.generateTime }}</td>
                    <td class="mono text-primary">{{ plan.startTime }}</td>
                    <td class="mono text-primary">{{ plan.endTime }}</td>
                    <td class="mono">{{ plan.taskId }}</td>
                    <td>{{ plan.script }}</td>
                    <td class="text-right">
                      <button class="more-btn">
                        <MoreVertIcon class="more-icon" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- 脚本任务列表 -->
          <section class="data-panel">
            <div class="panel-header-bar">
              <div class="panel-title-group">
                <TerminalIcon class="panel-icon text-tertiary" />
                <h3 class="panel-title">脚本任务列表</h3>
              </div>
            </div>
            <div class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>脚本名称</th>
                    <th>脚本说明</th>
                    <th>脚本创建时间</th>
                    <th>脚本修改时间</th>
                    <th>脚本创建人</th>
                    <th class="text-right">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(script, index) in scriptTasks" :key="index" class="table-row">
                    <td class="font-medium">{{ script.name }}</td>
                    <td class="text-dim">{{ script.desc }}</td>
                    <td class="mono">{{ script.createTime }}</td>
                    <td class="mono">{{ script.updateTime }}</td>
                    <td>{{ script.creator }}</td>
                    <td class="text-right">
                      <button class="more-btn">
                        <MoreVertIcon class="more-icon" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <!-- 任务执行监视 -->
        <section class="monitor-section">
          <div class="panel-header-bar">
            <div class="panel-title-group">
              <AnalyticsIcon class="panel-icon text-tertiary" />
              <h3 class="panel-title">任务执行监视</h3>
            </div>
            <div class="panel-actions">
              <span class="monitor-stats">指令下发总数: 142 / 失败: 0</span>
              <div class="divider-v"></div>
              <button class="settings-btn">
                <SettingsSmallIcon class="settings-icon" />
              </button>
            </div>
          </div>
          <div class="table-wrapper monitor-table-wrapper">
            <table class="data-table monitor-table">
              <thead>
                <tr>
                  <th class="col-seq">序号</th>
                  <th>T+时间</th>
                  <th>任务类型</th>
                  <th>执行分机</th>
                  <th>指令内容</th>
                  <th class="text-right">执行状态</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(task, index) in monitorTasks" :key="index" :class="['table-row', task.highlight ? 'highlight-row' : '']">
                  <td class="col-seq text-dim">{{ task.seq }}</td>
                  <td :class="['mono', task.timeClass]">{{ task.time }}</td>
                  <td>
                    <span :class="['type-tag', task.typeClass]">{{ task.type }}</span>
                  </td>
                  <td>{{ task.device }}</td>
                  <td :class="['mono', task.highlight ? '' : 'text-dim']">{{ task.command }}</td>
                  <td class="text-right">
                    <span :class="['exec-status', task.statusClass]">
                      <component :is="task.statusIcon" class="status-icon" />
                      {{ task.status }}
                    </span>
                  </td>
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
const PlayArrowIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', stroke: 'none' }, [
      h('polygon', { points: '8 5 8 19 19 12' })
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

const PauseIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', stroke: 'none' }, [
      h('rect', { x: '6', y: '4', width: '4', height: '16' }),
      h('rect', { x: '14', y: '4', width: '4', height: '16' })
    ])
  }
}

const SkipNextIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', stroke: 'none' }, [
      h('polygon', { points: '6 4 6 20 17 12' }),
      h('rect', { x: '18', y: '4', width: '2', height: '16' })
    ])
  }
}

const RedoIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('polyline', { points: '17 1 21 5 17 9' }),
      h('path', { d: 'M3 11V9a4 4 0 0 1 4-4h14' }),
      h('polyline', { points: '7 23 3 19 7 15' }),
      h('path', { d: 'M21 13v2a4 4 0 0 1-4 4H3' })
    ])
  }
}

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

const MoreVertIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '1' }),
      h('circle', { cx: '12', cy: '5', r: '1' }),
      h('circle', { cx: '12', cy: '19', r: '1' })
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

const SettingsSmallIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '3' }),
      h('path', { d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' })
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

const ScheduleIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('polyline', { points: '12 6 12 12 16 14' })
    ])
  }
}

// 数据
const macroList = ref([
  {
    name: 'GEO-KU-STANDARD-01',
    dispatchTime: '2024-05-20 10:20:00',
    updateTime: '2024-05-20 10:25:12',
    source: '本地库'
  },
  {
    name: 'LEO-X-BURST-V4',
    dispatchTime: '2024-05-19 16:45:00',
    updateTime: '2024-05-19 17:00:00',
    source: '中心下发'
  }
])

const operationPlans = ref([
  {
    name: 'ALPHA-7-COLLECT',
    generateTime: '2024-05-20 12:00:00',
    startTime: '2024-05-20 14:00:00',
    endTime: '2024-05-20 15:30:00',
    taskId: 'TASK-20240520-001',
    script: 'Data_Collection'
  }
])

const scriptTasks = ref([
  {
    name: 'Emergency_Dump',
    desc: '应急数据转储与链路重置脚本',
    createTime: '2023-10-15 08:30:00',
    updateTime: '2024-05-18 14:20:00',
    creator: 'Admin_System'
  }
])

const monitorTasks = ref([
  {
    seq: '042',
    time: '00:12:35.4',
    timeClass: 'text-primary font-bold',
    type: '操作计划任务',
    typeClass: 'tag-blue',
    device: '数传基带 B1',
    command: 'CMD_DATA_FRAME_LOCK_ON',
    status: '成功',
    statusClass: 'status-success',
    statusIcon: CheckCircleIcon,
    highlight: false
  },
  {
    seq: '043',
    time: '00:12:45.0',
    timeClass: 'text-primary font-bold',
    type: '脚本任务',
    typeClass: 'tag-purple',
    device: '天线控制机 A1',
    command: 'CMD_ANT_AUTOTRACK_START',
    status: '执行中',
    statusClass: 'status-parsing',
    statusIcon: SyncIcon,
    highlight: true
  },
  {
    seq: '044',
    time: '00:13:00.0',
    timeClass: 'text-dim',
    type: '操作计划任务',
    typeClass: 'tag-blue',
    device: '后端分发机 C3',
    command: 'CMD_NW_ROUTE_ACTIVATE',
    status: '等待',
    statusClass: 'status-waiting',
    statusIcon: ScheduleIcon,
    highlight: false
  }
])

const currentTime = ref('2024-05-20 14:35:12')

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
.task-local-dispatch-page {
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
  padding: 20px;
  overflow-y: auto;
  position: relative;
  margin-bottom: 32px;
  gap: 20px;
}

/* 控制中心 */
.control-center {
  background: #1b1b20;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-left: 4px solid #60a5fa;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.control-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.control-title-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.control-title {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px;
  background: #2a292f;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  font-size: 12px;
  color: #4ae176;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.status-dot {
  width: 10px;
  height: 10px;
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

.time-group {
  text-align: right;
}

.time-label {
  font-size: 10px;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.1em;
  margin: 0 0 4px 0;
}

.time-value {
  font-size: 13px;
  color: #60a5fa;
  font-weight: 700;
  margin: 0;
}

.control-buttons {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.ctrl-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
}

.ctrl-btn-icon {
  width: 28px;
  height: 28px;
}

.ctrl-btn-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.btn-start {
  background: rgba(96, 165, 250, 0.1);
  border-color: rgba(96, 165, 250, 0.3);
  color: #60a5fa;
}

.btn-start:hover {
  background: #60a5fa;
  color: #00315d;
}

.btn-stop {
  background: rgba(255, 180, 171, 0.1);
  border-color: rgba(255, 180, 171, 0.3);
  color: #ffb4ab;
}

.btn-stop:hover {
  background: #ffb4ab;
  color: #690005;
}

.btn-pause {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.3);
  color: #f59e0b;
}

.btn-pause:hover {
  background: #f59e0b;
  color: #000000;
}

.btn-resume {
  background: rgba(74, 225, 118, 0.1);
  border-color: rgba(74, 225, 118, 0.3);
  color: #4ae176;
}

.btn-resume:hover {
  background: #4ae176;
  color: #003915;
}

.btn-jump {
  background: rgba(53, 52, 58, 0.5);
  border-color: rgba(255, 255, 255, 0.1);
  color: #e4e1e9;
}

.btn-jump:hover {
  background: rgba(255, 255, 255, 0.1);
}

.progress-area {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.progress-label {
  font-size: 10px;
  color: #94a3b8;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.progress-time {
  font-size: 10px;
  color: #60a5fa;
  font-weight: 700;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #35343a;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #60a5fa;
  box-shadow: 0 0 10px rgba(96, 165, 250, 0.5);
  position: relative;
  overflow: hidden;
}

.progress-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* 表格区域 */
.tables-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
}

.data-panel {
  background: #1b1b20;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.panel-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.panel-icon {
  width: 18px;
  height: 18px;
}

.panel-title {
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.text-primary {
  color: #60a5fa;
}

.text-secondary {
  color: #adc6ff;
}

.text-tertiary {
  color: #4ae176;
}

.text-dim {
  color: #94a3b8;
}

.text-error {
  color: #ffb4ab;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.data-table th {
  padding: 12px 20px;
  text-align: left;
  font-size: 10px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.data-table td {
  padding: 12px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
}

.table-row {
  transition: all 0.2s;
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.03);
}

.font-medium {
  font-weight: 500;
  color: #ffffff;
}

.text-right {
  text-align: right;
}

.more-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  transition: all 0.2s;
}

.more-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #e4e1e9;
}

.more-icon {
  width: 16px;
  height: 16px;
}

/* 监视区域 */
.monitor-section {
  flex: 1;
  min-height: 300px;
  background: #1b1b20;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-left: 4px solid #4ae176;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.monitor-stats {
  font-size: 10px;
  color: #94a3b8;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.divider-v {
  width: 1px;
  height: 12px;
  background: rgba(255, 255, 255, 0.1);
}

.settings-btn {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.settings-btn:hover {
  color: #60a5fa;
}

.settings-icon {
  width: 18px;
  height: 18px;
}

.monitor-table-wrapper {
  flex: 1;
  overflow: auto;
}

.monitor-table {
  font-size: 12px;
}

.monitor-table th,
.monitor-table td {
  padding: 12px 16px;
}

.col-seq {
  width: 50px;
}

.highlight-row {
  background: rgba(96, 165, 250, 0.08);
}

.type-tag {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 10px;
}

.tag-blue {
  background: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.tag-purple {
  background: rgba(168, 85, 247, 0.1);
  color: #c084fc;
  border: 1px solid rgba(168, 85, 247, 0.2);
}

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
  font-style: italic;
}

.status-waiting {
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
