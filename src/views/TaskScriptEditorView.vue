<template>
  <div class="task-script-editor-page">
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
          <router-link to="/task-script-editor" class="side-link active">
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
          <router-link to="/task-local-dispatch" class="side-link">
            <LanIcon class="side-icon" />
            <span>本地调度执行</span>
          </router-link>
          <a href="#" class="side-link">
            <BiotechIcon class="side-icon" />
            <span>故障诊断</span>
          </a>
        </nav>
      </aside>

      <!-- 主内容区 -->
      <main class="main-content">
        <!-- 脚本管理库 -->
        <div class="script-library">
          <div class="library-header">
            <div class="library-title-group">
              <h3 class="library-title">脚本管理库</h3>
              <div class="search-box">
                <SearchIcon class="search-icon" />
                <input type="text" placeholder="搜索脚本库..." class="search-input" />
              </div>
            </div>
            <div class="library-actions">
              <button class="action-btn-icon" title="新建">
                <AddBoxIcon class="action-icon" />
              </button>
              <button class="action-btn-icon" title="复制">
                <CopyIcon class="action-icon" />
              </button>
              <button class="action-btn-icon danger" title="删除">
                <DeleteIcon class="action-icon" />
              </button>
            </div>
          </div>
          <div class="library-body">
            <table class="data-table">
              <thead>
                <tr>
                  <th>脚本名称 (Script Name)</th>
                  <th>版本 (Version)</th>
                  <th>最后修改日期 (Last Modified)</th>
                  <th>作者 (Author)</th>
                  <th class="text-right">状态</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(script, index) in scriptList"
                  :key="index"
                  :class="['table-row', { active: selectedScript === index }]"
                  @click="selectScript(index)"
                >
                  <td>
                    <div class="script-name">{{ script.name }}</div>
                  </td>
                  <td>{{ script.version }}</td>
                  <td class="text-muted">{{ script.date }}</td>
                  <td class="text-muted font-mono">{{ script.author }}</td>
                  <td class="text-right">
                    <span v-if="script.status === 'loaded'" class="status-badge">
                      <span class="status-dot primary"></span>
                      <span class="status-text primary">已加载</span>
                    </span>
                    <span v-else class="text-muted">空闲</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 图形化流程编辑器 -->
        <div class="flow-editor">
          <div class="editor-toolbar">
            <div class="toolbar-group">
              <button class="tool-btn"><ZoomInIcon class="tool-icon" /></button>
              <button class="tool-btn"><ZoomOutIcon class="tool-icon" /></button>
              <div class="toolbar-divider"></div>
              <button class="tool-btn"><GridIcon class="tool-icon" /></button>
            </div>
          </div>
          <div class="editor-canvas">
            <div class="flow-container">
              <!-- Start Node -->
              <div class="flow-node flow-node-green">
                <div class="node-header">
                  <div class="node-title-group">
                    <div class="node-icon-bg green">
                      <PlayCircleIcon class="node-icon-sm" />
                    </div>
                    <span class="node-title">开始 (START)</span>
                  </div>
                  <CheckCircleIcon class="node-status-icon green" />
                </div>
                <div class="node-body">
                  <div class="node-param">
                    <span>初始参数</span>
                    <span class="node-param-tag">REQUIRED</span>
                  </div>
                  <div class="node-param">
                    <span>内存分配</span>
                    <MenuIcon class="node-param-icon" />
                  </div>
                </div>
              </div>

              <!-- Connector -->
              <div class="connector">
                <div class="connector-line"></div>
                <div class="connector-arrow">
                  <ChevronRightIcon class="connector-arrow-icon" />
                </div>
              </div>

              <!-- Action Node 1 -->
              <div class="flow-node flow-node-blue">
                <div class="node-header">
                  <div class="node-title-group">
                    <div class="node-icon-bg blue">
                      <SatelliteAltIcon class="node-icon-sm" />
                    </div>
                    <span class="node-title font-mono">ANT_POS_SET</span>
                  </div>
                  <CheckCircleIcon class="node-status-icon blue" />
                </div>
                <div class="node-body compact">
                  <p>设置天线指向位置参数</p>
                  <p class="node-code">CMD_CODE: 0xAF01</p>
                </div>
              </div>

              <!-- Connector -->
              <div class="connector">
                <div class="connector-line"></div>
                <div class="connector-arrow">
                  <ChevronRightIcon class="connector-arrow-icon" />
                </div>
              </div>

              <!-- Decision Node -->
              <div class="decision-wrapper">
                <div class="diamond">
                  <div class="diamond-content">
                    <HelpIcon class="diamond-icon" />
                    <span class="diamond-text">判断</span>
                  </div>
                </div>
                <span class="diamond-label">CHECK_SIGNAL_LOCK</span>
              </div>

              <!-- Connector -->
              <div class="connector">
                <div class="connector-line"></div>
                <div class="connector-arrow">
                  <ChevronRightIcon class="connector-arrow-icon" />
                </div>
              </div>

              <!-- Right Column: Loop + Action -->
              <div class="flow-column">
                <!-- Loop Node -->
                <div class="hexagon">
                  <div class="hexagon-content">
                    <AutorenewIcon class="hexagon-icon" />
                    <span class="hexagon-text">循环 (LOOP)</span>
                    <span class="hexagon-sub">RETRY: 5</span>
                  </div>
                </div>

                <!-- Vertical Connector -->
                <div class="connector-vertical">
                  <div class="connector-line-v"></div>
                  <div class="connector-arrow-v">
                    <ChevronDownIcon class="connector-arrow-icon" />
                  </div>
                </div>

                <!-- Action Node 2 -->
                <div class="flow-node flow-node-blue active-ring">
                  <div class="node-header">
                    <div class="node-title-group">
                      <div class="node-icon-bg blue">
                        <ElectricBoltIcon class="node-icon-sm" />
                      </div>
                      <span class="node-title font-mono">ANT_DRIVE_ON</span>
                    </div>
                    <CheckCircleIcon class="node-status-icon blue" />
                  </div>
                  <div class="node-body compact blue-bg">
                    <p>使能天线驱动控制器</p>
                    <p class="node-code bright">CMD_CODE: 0xAF02</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 节点参数配置 -->
        <div class="param-config">
          <div class="config-header">
            <div class="config-title-group">
              <h3 class="config-title">
                <span class="pulse-dot"></span>
                节点参数配置
              </h3>
              <p class="config-subtitle">Configuration Parameters</p>
            </div>
            <div class="config-status">
              <CheckCircleIcon class="config-status-icon" />
              <span>参数校验通过 (READY)</span>
            </div>
          </div>
          <div class="config-body">
            <!-- 左侧基础配置 -->
            <div class="config-base">
              <div class="config-field">
                <label class="config-label">分机名称 (Subsystem)</label>
                <select class="config-select">
                  <option>天线伺服分机 (ANT_SRV)</option>
                  <option>测控基带分机 (TT&amp;C_BBD)</option>
                  <option>信道变频分机 (CH_CONV)</option>
                </select>
              </div>
              <div class="config-field">
                <label class="config-label">命令名称 (Command)</label>
                <div class="config-readonly font-mono">ANT_DRIVE_ON</div>
              </div>
            </div>
            <!-- 右侧参数卡片 -->
            <div class="config-cards">
              <div class="param-card">
                <div class="param-card-header">
                  <span class="param-card-title">驱动模式</span>
                  <span class="param-card-tag">DRV_MODE</span>
                </div>
                <select class="config-select dark">
                  <option>程序引导 (PROGRAM)</option>
                  <option>手动驱动 (MANUAL)</option>
                  <option>自动跟踪 (AUTO)</option>
                </select>
              </div>
              <div class="param-card">
                <div class="param-card-header">
                  <span class="param-card-title">执行速度 (deg/s)</span>
                  <span class="param-card-tag">SPEED_VAL</span>
                </div>
                <div class="param-card-input-row">
                  <input type="text" value="0.5000" class="param-input-underline" />
                  <span class="param-type-tag">FLOAT</span>
                </div>
              </div>
              <div class="param-card">
                <div class="param-card-header">
                  <span class="param-card-title">超时限制 (ms)</span>
                  <span class="param-card-tag">TIMEOUT</span>
                </div>
                <div class="param-card-input-row">
                  <input type="text" value="3000" class="param-input-underline" />
                  <span class="param-type-tag">UINT32</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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

// 内容区图标
const SearchIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '11', cy: '11', r: '8' }),
      h('path', { d: 'M21 21l-4.35-4.35' })
    ])
  }
}

const AddBoxIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('rect', { x: '3', y: '3', width: '18', height: '18', rx: '2', ry: '2' }),
      h('line', { x1: '12', y1: '8', x2: '12', y2: '16' }),
      h('line', { x1: '8', y1: '12', x2: '16', y2: '12' })
    ])
  }
}

const CopyIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('rect', { x: '9', y: '9', width: '13', height: '13', rx: '2', ry: '2' }),
      h('path', { d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' })
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

const GridIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('rect', { x: '3', y: '3', width: '18', height: '18', rx: '2', ry: '2' }),
      h('line', { x1: '3', y1: '9', x2: '21', y2: '9' }),
      h('line', { x1: '3', y1: '15', x2: '21', y2: '15' }),
      h('line', { x1: '9', y1: '3', x2: '9', y2: '21' }),
      h('line', { x1: '15', y1: '3', x2: '15', y2: '21' })
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

const CheckCircleIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' }),
      h('polyline', { points: '22 4 12 14.01 9 11.01' })
    ])
  }
}

const MenuIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('line', { x1: '3', y1: '12', x2: '21', y2: '12' }),
      h('line', { x1: '3', y1: '6', x2: '21', y2: '6' }),
      h('line', { x1: '3', y1: '18', x2: '21', y2: '18' })
    ])
  }
}

const HelpIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('path', { d: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' }),
      h('line', { x1: '12', y1: '17', x2: '12.01', y2: '17' })
    ])
  }
}

const AutorenewIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('polyline', { points: '23 4 23 10 17 10' }),
      h('polyline', { points: '1 20 1 14 7 14' }),
      h('path', { d: 'M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15' })
    ])
  }
}

const ElectricBoltIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('polygon', { points: '13 2 3 14 12 14 11 22 21 10 12 10 13 2' })
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

const ChevronDownIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('polyline', { points: '6 9 12 15 18 9' })
    ])
  }
}

// 数据
const scriptList = ref([
  { name: 'SC_ANTENNA_DEPLOY_01', version: 'V2.4', date: '2023-10-24 14:20', author: 'OPERATOR_01', status: 'loaded' },
  { name: 'SC_PWR_CHECK_INIT', version: 'V1.0', date: '2023-10-22 09:15', author: 'SYS_ADMIN', status: 'idle' },
  { name: 'SC_TELEM_LINK_EST', version: 'V3.1', date: '2023-10-20 16:45', author: 'OPERATOR_02', status: 'idle' }
])

const selectedScript = ref(0)
const currentTime = ref('2024-05-20 15:44:22')

const selectScript = (index: number) => {
  selectedScript.value = index
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
.task-script-editor-page {
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
  overflow: hidden;
  position: relative;
  margin-bottom: 32px;
}

/* 脚本管理库 */
.script-library {
  height: 28%;
  background: #0e0e13;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
}

.library-header {
  padding: 12px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.library-title-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.library-title {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
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
  font-size: 11px;
  width: 220px;
  outline: none;
}

.search-input::placeholder {
  color: #64748b;
}

.library-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn-icon {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn-icon:hover {
  color: #a4c9ff;
}

.action-btn-icon.danger:hover {
  color: #ffb4ab;
}

.action-icon {
  width: 18px;
  height: 18px;
}

.library-body {
  flex: 1;
  overflow: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.data-table thead {
  position: sticky;
  top: 0;
  background: #0e0e13;
}

.data-table th {
  padding: 12px 24px;
  text-align: left;
  font-size: 9px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.data-table td {
  padding: 12px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.table-row {
  cursor: pointer;
  transition: all 0.2s;
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.03);
}

.table-row.active {
  background: rgba(96, 165, 250, 0.1);
}

.table-row.active .script-name {
  color: #a4c9ff;
}

.script-name {
  font-weight: 500;
  color: #e4e1e9;
  font-family: 'Fira Code', monospace;
  text-transform: uppercase;
  font-size: 11px;
}

.text-muted {
  color: #64748b;
}

.text-right {
  text-align: right;
}

.font-mono {
  font-family: 'Fira Code', monospace;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}

.status-dot.primary {
  background: #a4c9ff;
}

.status-text.primary {
  color: #a4c9ff;
  font-size: 10px;
}

/* 流程编辑器 */
.flow-editor {
  flex: 1;
  position: relative;
  background-image: radial-gradient(circle, rgba(164, 201, 255, 0.05) 1px, transparent 1px);
  background-size: 32px 32px;
  overflow: auto;
  min-height: 0;
}

.editor-toolbar {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 10;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(30, 41, 59, 0.9);
  backdrop-filter: blur(10px);
  padding: 4px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tool-btn {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tool-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #e4e1e9;
}

.tool-icon {
  width: 18px;
  height: 18px;
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 2px;
}

.editor-canvas {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
}

.flow-container {
  display: flex;
  align-items: center;
  gap: 24px;
}

.flow-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.flow-node {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 14px;
  min-width: 190px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
}

.flow-node-green {
  border-color: #22c55e;
  border-width: 1.5px;
}

.flow-node-blue {
  border-color: #3b82f6;
  border-width: 1.5px;
}

.flow-node-blue.active-ring {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3), 0 4px 6px -1px rgba(0, 0, 0, 0.2);
}

.node-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.node-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.node-icon-bg {
  padding: 4px;
  border-radius: 4px;
}

.node-icon-bg.green {
  background: rgba(34, 197, 94, 0.2);
}

.node-icon-bg.blue {
  background: rgba(59, 130, 246, 0.2);
}

.node-icon-sm {
  width: 14px;
  height: 14px;
  display: block;
}

.node-icon-sm.green {
  color: #22c55e;
}

.node-icon-sm.blue {
  color: #3b82f6;
}

.node-title {
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.node-status-icon {
  width: 14px;
  height: 14px;
}

.node-status-icon.green {
  color: #22c55e;
}

.node-status-icon.blue {
  color: #3b82f6;
}

.node-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.node-body.compact {
  background: rgba(0, 0, 0, 0.2);
  padding: 10px;
  border-radius: 6px;
  font-size: 10px;
  color: #94a3b8;
  line-height: 1.5;
}

.node-body.compact.blue-bg {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #cbd5e1;
}

.node-code {
  color: rgba(164, 201, 255, 0.7);
  font-family: 'Fira Code', monospace;
  margin-top: 4px;
}

.node-code.bright {
  color: #60a5fa;
}

.node-param {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 10px;
  color: #94a3b8;
}

.node-param-tag {
  color: #475569;
  font-family: 'Fira Code', monospace;
  font-size: 9px;
}

.node-param-icon {
  width: 12px;
  height: 12px;
}

.connector {
  display: flex;
  align-items: center;
  position: relative;
  width: 32px;
}

.connector-line {
  flex: 1;
  height: 2px;
  background: #334155;
  border-radius: 1px;
}

.connector-arrow {
  position: absolute;
  right: -2px;
  color: #334155;
}

.connector-arrow-icon {
  width: 14px;
  height: 14px;
}

.connector-vertical {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  height: 32px;
  width: 14px;
}

.connector-line-v {
  flex: 1;
  width: 2px;
  background: #334155;
  border-radius: 1px;
}

.connector-arrow-v {
  position: absolute;
  bottom: -2px;
  color: #334155;
}

/* Decision Diamond */
.decision-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.diamond {
  width: 90px;
  height: 90px;
  background: #1e293b;
  border: 2px solid #f59e0b;
  transform: rotate(45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.diamond-content {
  transform: rotate(-45deg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.diamond-icon {
  width: 16px;
  height: 16px;
  color: #f59e0b;
}

.diamond-text {
  font-size: 10px;
  font-weight: 700;
  color: #ffffff;
}

.diamond-label {
  font-size: 9px;
  color: #64748b;
  font-family: 'Fira Code', monospace;
}

/* Hexagon */
.hexagon {
  width: 130px;
  height: 72px;
  background: #1e293b;
  border: 2px solid #a855f7;
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hexagon-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.hexagon-icon {
  width: 16px;
  height: 16px;
  color: #a855f7;
}

.hexagon-text {
  font-size: 10px;
  font-weight: 700;
  color: #ffffff;
}

.hexagon-sub {
  font-size: 8px;
  color: rgba(168, 85, 247, 0.7);
  font-family: 'Fira Code', monospace;
}

/* 节点参数配置 */
.param-config {
  height: 32%;
  background: #0f172a;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
}

.config-header {
  padding: 12px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.config-title-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.config-title {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #a4c9ff;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.config-subtitle {
  font-size: 9px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: 'Fira Code', monospace;
  margin: 0;
  padding-left: 16px;
}

.config-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: #4ae176;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.config-status-icon {
  width: 14px;
  height: 14px;
  color: #4ae176;
}

.config-body {
  flex: 1;
  display: flex;
  gap: 32px;
  padding: 16px 24px;
  overflow-x: auto;
}

.config-base {
  width: 220px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
}

.config-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.config-label {
  font-size: 10px;
  color: #64748b;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.config-select {
  width: 100%;
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 10px 12px;
  color: #e4e1e9;
  font-size: 12px;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
}

.config-select:focus {
  border-color: rgba(96, 165, 250, 0.4);
}

.config-select.dark {
  background-color: #0f172a;
}

.config-readonly {
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 10px 12px;
  color: #a4c9ff;
  font-size: 12px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
}

.config-cards {
  flex: 1;
  display: flex;
  gap: 16px;
  overflow-x: auto;
  min-width: 0;
}

.param-card {
  width: 240px;
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
  transition: border-color 0.2s;
}

.param-card:hover {
  border-color: rgba(96, 165, 250, 0.2);
}

.param-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.param-card-title {
  font-size: 12px;
  font-weight: 600;
  color: #cbd5e1;
}

.param-card-tag {
  font-size: 9px;
  color: #64748b;
  font-family: 'Fira Code', monospace;
  letter-spacing: 0.02em;
}

.param-card-input-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.param-input-underline {
  flex: 1;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(164, 201, 255, 0.4);
  padding: 6px 2px;
  color: #a4c9ff;
  font-size: 14px;
  font-family: 'Fira Code', monospace;
  outline: none;
  transition: border-color 0.2s;
}

.param-input-underline:focus {
  border-bottom-color: #a4c9ff;
}

.param-type-tag {
  font-size: 9px;
  color: #94a3b8;
  padding: 2px 8px;
  border: 1px solid #334155;
  border-radius: 4px;
  background: #0f172a;
  font-family: 'Fira Code', monospace;
}

/* 底部状态栏 */
.status-footer {
  position: fixed;
  bottom: 0;
  left: 288px;
  right: 0;
  height: 32px;
  background: #0e0e13;
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
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4ae176;
  box-shadow: 0 0 6px rgba(74, 225, 118, 0.5);
}

.status-text {
  font-size: 10px;
  color: #4ae176;
  font-family: 'Fira Code', monospace;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.spacer {
  flex: 1;
}

.footer-info {
  display: flex;
  gap: 16px;
}

.footer-info span {
  font-size: 10px;
  color: #64748b;
  font-family: 'Fira Code', monospace;
}

/* 滚动条 */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: #0b0b10;
}

::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #334155;
}

/* 响应式 */
@media (max-width: 1024px) {
  .side-nav {
    display: none;
  }

  .status-footer {
    left: 0;
  }
}
</style>
