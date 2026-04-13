<template>
  <div class="task-plan-template-page">
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
        <button class="icon-btn" title="用户账户" @click="logout">
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
          <router-link to="/task-plan-template" class="side-link active">
            <DescriptionIcon class="side-icon" />
            <span>操作计划模板</span>
          </router-link>
          <router-link to="/task-mission-param" class="side-link">
            <InputIcon class="side-icon" />
            <span>型号任务参数接收</span>
          </router-link>
          <a href="#" class="side-link">
            <DownloadIcon class="side-icon" />
            <span>任务计划接收</span>
          </a>
          <a href="#" class="side-link">
            <EditCalendarIcon class="side-icon" />
            <span>操作计划生成与执行</span>
          </a>
          <a href="#" class="side-link">
            <PlayCircleIcon class="side-icon" />
            <span>脚本执行</span>
          </a>
          <a href="#" class="side-link">
            <SendIcon class="side-icon" />
            <span>载波监视任务计划发送</span>
          </a>
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
        <!-- 头部操作栏 -->
        <div class="content-header">
          <div class="header-left">
            <h1 class="page-title">操作计划模版管理</h1>
            <p class="page-subtitle">OPERATION PLAN TEMPLATE ORCHESTRATION</p>
          </div>
          <div class="header-actions">
            <button class="btn btn-secondary">
              <DownloadIcon class="btn-icon" />
              导出配置
            </button>
            <button class="btn btn-primary">
              <SaveIcon class="btn-icon" />
              保存当前模版
            </button>
          </div>
        </div>

        <!-- 模板管理库表格 -->
        <section class="template-library">
          <div class="library-header">
            <div class="library-title-group">
              <h3 class="library-title">模版管理库</h3>
              <div class="search-box">
                <SearchIcon class="search-icon" />
                <input type="text" placeholder="检索模版名称..." class="search-input" />
              </div>
            </div>
            <div class="library-actions">
              <button class="btn btn-accent">
                <PlusIcon class="btn-icon-sm" />
                新建模版
              </button>
              <button class="btn btn-danger-sm">
                <DeleteIcon class="btn-icon-sm" />
                批量删除
              </button>
            </div>
          </div>
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="col-id">ID</th>
                  <th>模版名称</th>
                  <th>任务类型</th>
                  <th>包含节点数</th>
                  <th>最后更新时间</th>
                  <th>状态</th>
                  <th class="text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(template, index) in templateList"
                  :key="index"
                  :class="['table-row', { active: selectedTemplate === index }]"
                  @click="selectTemplate(index)"
                >
                  <td class="col-id font-mono">{{ template.id }}</td>
                  <td class="text-primary">{{ template.name }}</td>
                  <td>{{ template.type }}</td>
                  <td>{{ template.nodes }}</td>
                  <td class="font-mono">{{ template.updatedAt }}</td>
                  <td>
                    <span :class="['status-badge', template.status]">{{ template.statusText }}</span>
                  </td>
                  <td class="text-right">
                    <button class="action-btn" title="编辑">
                      <EditIcon class="action-icon" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- 可视化流程编辑器 -->
        <section class="flow-editor">
          <div class="editor-header">
            <h3 class="editor-title">
              <AccountTreeIcon class="editor-title-icon" />
              可视化流程编辑器 - {{ currentTemplate.name }}
            </h3>
            <div class="editor-tools">
              <button class="tool-btn"><ZoomInIcon class="tool-icon" /></button>
              <button class="tool-btn"><ZoomOutIcon class="tool-icon" /></button>
              <div class="tool-divider"></div>
              <button class="tool-btn"><CenterFocusIcon class="tool-icon" /></button>
            </div>
          </div>
          <div class="editor-canvas-wrapper">
            <div class="flow-canvas">
              <!-- Node 1 -->
              <div class="flow-node-group">
                <div class="flow-node node-success">
                  <div class="node-tags">
                    <span class="node-tag tag-success">Script Node 01</span>
                    <CheckCircleIcon class="node-status-icon success" />
                  </div>
                  <h4 class="node-name">开始流程</h4>
                  <p class="node-desc">START_SEQ_001 Initialization</p>
                  <div class="node-indicators">
                    <span class="indicator-dot active"></span>
                    <span class="indicator-dot"></span>
                  </div>
                </div>
                <div class="flow-arrow">
                  <div class="arrow-line success"></div>
                  <div class="arrow-head success"></div>
                </div>
              </div>

              <!-- Node 2 (Active) -->
              <div class="flow-node-group">
                <div class="flow-node node-active">
                  <div class="node-active-label">ACTIVE SELECTION</div>
                  <div class="node-tags">
                    <span class="node-tag tag-primary">Script Node 02</span>
                    <DragIcon class="node-status-icon" />
                  </div>
                  <h4 class="node-name">天线对准</h4>
                  <p class="node-desc">Antenna Alignment Procedure V2.4</p>
                  <div class="node-meta">
                    <div class="node-indicators">
                      <span class="indicator-dot active"></span>
                      <span class="indicator-dot active"></span>
                      <span class="indicator-dot"></span>
                    </div>
                    <span class="node-time">T+ 00:05:00</span>
                  </div>
                </div>
                <div class="flow-arrow">
                  <div class="arrow-line primary"></div>
                  <div class="arrow-head primary"></div>
                </div>
              </div>

              <!-- Node 3 -->
              <div class="flow-node-group">
                <div class="flow-node node-pending">
                  <div class="node-tags">
                    <span class="node-tag tag-default">Script Node 03</span>
                    <HelpCenterIcon class="node-status-icon pending" />
                  </div>
                  <h4 class="node-name">遥测接收</h4>
                  <p class="node-desc">Telemetry Sync &amp; Frame Locking</p>
                  <div class="node-indicators">
                    <span class="indicator-dot"></span>
                  </div>
                </div>
                <div class="flow-arrow">
                  <div class="arrow-line muted"></div>
                  <div class="arrow-head muted"></div>
                </div>
              </div>

              <!-- Decision Node -->
              <div class="flow-node-group">
                <div class="flow-node node-decision">
                  <div class="decision-diamond">
                    <SyncAltIcon class="decision-icon" />
                  </div>
                  <div class="decision-content">
                    <h4 class="node-name">判定逻辑</h4>
                    <p class="node-desc font-mono">IF LOCK_CHECK == FALSE</p>
                  </div>
                </div>
                <button class="add-node-btn">
                  <PlusIcon class="add-icon" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- 脚本节点属性配置 -->
        <section class="param-config">
          <div class="config-header">
            <span class="pulse-dot"></span>
            <h3 class="config-title">
              脚本节点属性配置:
              <span class="config-node-name">天线对准 (NODE_02)</span>
            </h3>
          </div>
          <div class="config-body">
            <div class="config-grid">
              <!-- Column 1 -->
              <div class="config-column">
                <div class="config-field">
                  <label class="config-label">分机/设备分配 (Equipment Assignment)</label>
                  <div class="select-wrapper">
                    <select class="config-select" v-model="nodeConfig.equipment">
                      <option>S波段全向天线 (ANT_S_OMNI)</option>
                      <option>X波段数传天线 (ANT_X_DT)</option>
                      <option>伺服控制器A机 (SERVO_A)</option>
                    </select>
                    <ExpandMoreIcon class="select-arrow" />
                  </div>
                </div>
                <div class="config-field">
                  <label class="config-label">相对执行时间 (Relative Time)</label>
                  <div class="time-input-row">
                    <span class="time-prefix">T +</span>
                    <input type="text" class="config-input font-mono" v-model="nodeConfig.relativeTime" />
                  </div>
                </div>
              </div>

              <!-- Column 2 -->
              <div class="config-column">
                <div class="config-field">
                  <label class="config-label">执行模式 (Execution Mode)</label>
                  <div class="mode-toggle">
                    <button
                      :class="['mode-btn', { active: nodeConfig.mode === 'auto' }]"
                      @click="nodeConfig.mode = 'auto'"
                    >
                      自动执行
                    </button>
                    <button
                      :class="['mode-btn', { active: nodeConfig.mode === 'manual' }]"
                      @click="nodeConfig.mode = 'manual'"
                    >
                      人工确认
                    </button>
                  </div>
                </div>
                <div class="config-field">
                  <label class="config-label">最大持续时长 (Duration / Sec)</label>
                  <input type="number" class="config-input font-mono" v-model="nodeConfig.duration" />
                </div>
              </div>

              <!-- Column 3 -->
              <div class="config-column">
                <div class="config-field">
                  <label class="config-label">异常处理策略 (Error Handling)</label>
                  <div class="error-strategies">
                    <label
                      v-for="(strategy, idx) in errorStrategies"
                      :key="idx"
                      :class="['strategy-item', strategy.type, { active: nodeConfig.errorStrategy === strategy.type }]"
                    >
                      <input
                        type="radio"
                        name="error-strategy"
                        :value="strategy.type"
                        v-model="nodeConfig.errorStrategy"
                      />
                      <span class="strategy-text">{{ strategy.label }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="config-footer">
              <button class="btn btn-secondary" @click="resetParams">重置参数</button>
              <button class="btn btn-accent" @click="updateNodeConfig">更新节点配置</button>
            </div>
          </div>
        </section>
      </main>

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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, h } from 'vue'
import { useRouter } from 'vue-router'
import UserIcon from '@/components/icons/UserIcon.vue'

const router = useRouter()

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

// 内容区图标
const SaveIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z' }),
      h('polyline', { points: '17 21 17 13 7 13 7 21' }),
      h('polyline', { points: '7 3 7 8 15 8' })
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

const AccountTreeIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('rect', { x: '3', y: '3', width: '18', height: '18', rx: '2', ry: '2' }),
      h('line', { x1: '11', y1: '3', x2: '11', y2: '21' }),
      h('path', { d: 'M11 8H21' }),
      h('path', { d: 'M11 16H21' }),
      h('path', { d: 'M7 8H3' }),
      h('path', { d: 'M7 16H3' })
    ])
  }
}

const ZoomInIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '11', cy: '11', r: '8' }),
      h('line', { x1: '21', y1: '21', x2: '16.65', y2: '16.65' }),
      h('line', { x1: '11', y1: '8', x2: '11', y2: '14' }),
      h('line', { x1: '8', y1: '11', x2: '14', y2: '11' })
    ])
  }
}

const ZoomOutIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '11', cy: '11', r: '8' }),
      h('line', { x1: '21', y1: '21', x2: '16.65', y2: '16.65' }),
      h('line', { x1: '8', y1: '11', x2: '14', y2: '11' })
    ])
  }
}

const CenterFocusIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('line', { x1: '22', y1: '12', x2: '18', y2: '12' }),
      h('line', { x1: '6', y1: '12', x2: '2', y2: '12' }),
      h('line', { x1: '12', y1: '2', x2: '12', y2: '6' }),
      h('line', { x1: '12', y1: '18', x2: '12', y2: '22' })
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

const DragIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '9', cy: '12', r: '1' }),
      h('circle', { cx: '9', cy: '5', r: '1' }),
      h('circle', { cx: '9', cy: '19', r: '1' }),
      h('circle', { cx: '15', cy: '12', r: '1' }),
      h('circle', { cx: '15', cy: '5', r: '1' }),
      h('circle', { cx: '15', cy: '19', r: '1' })
    ])
  }
}

const HelpCenterIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('path', { d: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' }),
      h('line', { x1: '12', y1: '17', x2: '12.01', y2: '17' })
    ])
  }
}

const SyncAltIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('polyline', { points: '15 3 21 3 21 9' }),
      h('polyline', { points: '9 21 3 21 3 15' }),
      h('line', { x1: '21', y1: '3', x2: '14', y2: '10' }),
      h('line', { x1: '3', y1: '21', x2: '10', y2: '14' })
    ])
  }
}

const ExpandMoreIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('polyline', { points: '6 9 12 15 18 9' })
    ])
  }
}

// 数据
const templateList = ref([
  { id: '01', name: 'LEO标准跟踪模版', type: 'LEO 低轨跟踪', nodes: '12 节点', updatedAt: '2024-05-24 10:30:01', status: 'published', statusText: '已发布' },
  { id: '02', name: 'GEO定点保持模版', type: 'GEO 静止轨道', nodes: '8 节点', updatedAt: '2024-05-23 18:15:44', status: 'draft', statusText: '草稿' }
])

const selectedTemplate = ref(0)
const currentTemplate = ref(templateList.value[0])

const nodeConfig = ref({
  equipment: 'S波段全向天线 (ANT_S_OMNI)',
  relativeTime: '00:05:00',
  mode: 'auto',
  duration: 300,
  errorStrategy: 'terminate'
})

const errorStrategies = [
  { type: 'terminate', label: '异常中止 (TERMINATE)' },
  { type: 'skip', label: '忽略并继续 (SKIP)' },
  { type: 'retry', label: '自动重试 (RETRY x3)' }
]

const currentTime = ref('2024-05-20 15:44:22')

const selectTemplate = (index: number) => {
  selectedTemplate.value = index
  currentTemplate.value = templateList.value[index]
}

const resetParams = () => {
  nodeConfig.value = {
    equipment: 'S波段全向天线 (ANT_S_OMNI)',
    relativeTime: '00:05:00',
    mode: 'auto',
    duration: 300,
    errorStrategy: 'terminate'
  }
}

const updateNodeConfig = () => {
  alert('节点配置已更新')
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/')
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
.task-plan-template-page {
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
  margin-bottom: 40px;
  gap: 24px;
}

/* 内容头部 */
.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
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

/* 按钮 */
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

.btn-accent {
  background: rgba(164, 201, 255, 0.1);
  color: #a4c9ff;
  border: 1px solid rgba(164, 201, 255, 0.2);
  padding: 6px 12px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.btn-accent:hover {
  background: rgba(164, 201, 255, 0.2);
}

.btn-danger-sm {
  background: rgba(255, 180, 171, 0.1);
  color: #ffb4ab;
  border: 1px solid rgba(255, 180, 171, 0.2);
  padding: 6px 12px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.btn-danger-sm:hover {
  background: rgba(255, 180, 171, 0.2);
}

.btn-icon {
  width: 14px;
  height: 14px;
}

.btn-icon-sm {
  width: 12px;
  height: 12px;
}

/* 模板管理库 */
.template-library {
  background: #1b1b20;
  border-radius: 8px;
  border-left: 4px solid #60a5fa;
  padding: 20px;
  flex-shrink: 0;
}

.library-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.library-title-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.library-title {
  font-size: 13px;
  font-weight: 700;
  color: #60a5fa;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
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
  color: #64748b;
}

.search-input {
  background: #131318;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 6px 10px 6px 30px;
  color: #e4e1e9;
  font-size: 12px;
  width: 200px;
  outline: none;
}

.search-input::placeholder {
  color: #64748b;
}

.search-input:focus {
  border-color: rgba(96, 165, 250, 0.5);
}

.library-actions {
  display: flex;
  align-items: center;
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

.data-table thead tr {
  color: #94a3b8;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.data-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 500;
}

.data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.table-row {
  cursor: pointer;
  transition: all 0.2s;
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.02);
}

.table-row.active {
  background: rgba(96, 165, 250, 0.08);
}

.col-id {
  width: 50px;
  color: #64748b;
}

.text-primary {
  color: #60a5fa;
}

.text-right {
  text-align: right;
}

.font-mono {
  font-family: 'Fira Code', monospace;
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.published {
  background: rgba(74, 225, 118, 0.1);
  color: #4ae176;
}

.status-badge.draft {
  background: rgba(173, 198, 255, 0.1);
  color: #adc6ff;
}

.action-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
}

.action-btn:hover {
  color: #60a5fa;
}

.action-icon {
  width: 18px;
  height: 18px;
}

/* 可视化流程编辑器 */
.flow-editor {
  flex: 1;
  background: #1b1b20;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  min-height: 320px;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.editor-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #60a5fa;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.editor-title-icon {
  width: 18px;
  height: 18px;
}

.editor-tools {
  display: flex;
  align-items: center;
  gap: 4px;
}

.tool-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  transition: all 0.2s;
}

.tool-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #e4e1e9;
}

.tool-icon {
  width: 18px;
  height: 18px;
}

.tool-divider {
  width: 1px;
  height: 16px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 4px;
}

.editor-canvas-wrapper {
  flex: 1;
  overflow-x: auto;
  display: flex;
  align-items: center;
}

.flow-canvas {
  display: flex;
  align-items: center;
  gap: 0;
  min-width: max-content;
  padding: 20px;
}

.flow-node-group {
  display: flex;
  align-items: center;
}

.flow-node {
  width: 220px;
  padding: 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.node-success {
  background: #2a292f;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.node-success:hover {
  border-color: rgba(74, 225, 118, 0.5);
}

.node-active {
  background: #35343a;
  border: 2px solid #60a5fa;
  box-shadow: 0 0 30px rgba(96, 165, 250, 0.15);
  transform: scale(1.03);
  position: relative;
}

.node-pending {
  background: #2a292f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  opacity: 0.8;
}

.node-pending:hover {
  opacity: 1;
  border-color: rgba(255, 255, 255, 0.2);
}

.node-active-label {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #60a5fa;
  color: #001c39;
  padding: 2px 10px;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-radius: 2px;
}

.node-tags {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.node-tag {
  font-size: 9px;
  font-family: 'Fira Code', monospace;
  padding: 2px 6px;
  border-radius: 2px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tag-success {
  background: rgba(74, 225, 118, 0.1);
  color: #4ae176;
}

.tag-primary {
  background: rgba(96, 165, 250, 0.1);
  color: #60a5fa;
}

.tag-default {
  background: #35343a;
  color: #94a3b8;
}

.node-status-icon {
  width: 16px;
  height: 16px;
}

.node-status-icon.success {
  color: #4ae176;
}

.node-status-icon.pending {
  color: #f59e0b;
}

.node-name {
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 4px 0;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.node-desc {
  font-size: 10px;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

.node-indicators {
  display: flex;
  gap: 4px;
  margin-top: 12px;
}

.indicator-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.indicator-dot.active {
  background: #60a5fa;
}

.node-success .indicator-dot.active {
  background: #4ae176;
}

.node-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.node-time {
  font-size: 9px;
  font-family: 'Fira Code', monospace;
  color: #60a5fa;
}

/* 流程箭头 */
.flow-arrow {
  width: 64px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.arrow-line {
  width: 100%;
  height: 2px;
}

.arrow-line.success {
  background: linear-gradient(to right, #4ae176, #60a5fa);
}

.arrow-line.primary {
  background: linear-gradient(to right, #60a5fa, #adc6ff);
}

.arrow-line.muted {
  background: rgba(255, 255, 255, 0.1);
}

.arrow-head {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 8px solid;
}

.arrow-head.success {
  border-left-color: #60a5fa;
}

.arrow-head.primary {
  border-left-color: #adc6ff;
}

.arrow-head.muted {
  border-left-color: rgba(255, 255, 255, 0.1);
}

/* 判定节点 */
.node-decision {
  width: 180px;
  background: #2a292f;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  position: relative;
}

.decision-diamond {
  width: 32px;
  height: 32px;
  background: #1b1b20;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transform: rotate(45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.decision-icon {
  width: 16px;
  height: 16px;
  color: #adc6ff;
  transform: rotate(-45deg);
}

.decision-content {
  flex: 1;
}

.add-node-btn {
  width: 36px;
  height: 36px;
  margin-left: 24px;
  border-radius: 50%;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  background: none;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.add-node-btn:hover {
  border-color: #60a5fa;
  color: #60a5fa;
}

.add-icon {
  width: 18px;
  height: 18px;
}

/* 参数配置 */
.param-config {
  background: #1b1b20;
  border-radius: 8px;
  padding: 20px;
  border-top: 2px solid rgba(96, 165, 250, 0.2);
  flex-shrink: 0;
}

.config-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #60a5fa;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.config-title {
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  margin: 0;
}

.config-node-name {
  color: #60a5fa;
  margin-left: 8px;
}

.config-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.config-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.config-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.config-label {
  font-size: 10px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.config-select,
.config-input {
  background: #131318;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 10px 12px;
  color: #e4e1e9;
  font-size: 12px;
  outline: none;
  width: 100%;
}

.config-select:focus,
.config-input:focus {
  border-color: #60a5fa;
}

.select-wrapper {
  position: relative;
}

.select-arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #64748b;
  pointer-events: none;
}

.time-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-prefix {
  font-size: 12px;
  font-family: 'Fira Code', monospace;
  color: #64748b;
}

.mode-toggle {
  display: flex;
  background: #131318;
  padding: 4px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.mode-btn {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
}

.mode-btn.active {
  background: #60a5fa;
  color: #001c39;
}

.error-strategies {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.strategy-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 2px solid transparent;
  background: transparent;
}

.strategy-item:hover {
  background: rgba(255, 255, 255, 0.03);
}

.strategy-item.terminate {
  border-left-color: #ffb4ab;
}

.strategy-item.terminate.active {
  background: rgba(255, 180, 171, 0.08);
}

.strategy-item.skip {
  border-left-color: #f59e0b;
  opacity: 0.8;
}

.strategy-item.retry {
  border-left-color: #60a5fa;
  opacity: 0.8;
}

.strategy-item input[type="radio"] {
  width: 16px;
  height: 16px;
  accent-color: #60a5fa;
  cursor: pointer;
}

.strategy-text {
  font-size: 11px;
  color: #e4e1e9;
}

.config-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

/* 底部状态栏 */
.status-footer {
  position: fixed;
  bottom: 0;
  left: 256px;
  right: 0;
  height: 40px;
  background: #131318;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 24px;
  z-index: 40;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot-green {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ae176;
}

.status-text {
  font-size: 12px;
  color: #94a3b8;
}

.spacer {
  flex: 1;
}

.footer-info {
  display: flex;
  gap: 24px;
  font-size: 12px;
  color: #94a3b8;
}
</style>
