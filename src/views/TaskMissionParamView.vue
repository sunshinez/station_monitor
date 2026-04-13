<template>
  <div class="task-mission-param-page">
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
          <router-link to="/task-plan-template" class="side-link">
            <DescriptionIcon class="side-icon" />
            <span>操作计划模板</span>
          </router-link>
          <router-link to="/task-mission-param" class="side-link active">
            <InputIcon class="side-icon" />
            <span>型号任务参数接收</span>
          </router-link>
          <router-link to="/task-plan-reception" class="side-link">
            <DownloadIcon class="side-icon" />
            <span>任务计划接收</span>
          </router-link>
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
            <h1 class="page-title">型号任务参数接收</h1>
            <p class="page-subtitle">Satellite Mission Parameter Ingestion</p>
          </div>
          <div class="header-actions">
            <button class="btn btn-secondary">
              <UploadFileIcon class="btn-icon" />
              手动解析/上传文件
            </button>
          </div>
        </div>

        <!-- 文件接收记录 -->
        <section class="data-section section-primary">
          <div class="section-header-bar">
            <h3 class="section-title">
              <FolderZipIcon class="section-icon" />
              文件接收记录 (控制中心)
            </h3>
            <div class="search-box">
              <SearchIcon class="search-icon" />
              <input type="text" placeholder="搜索文件名..." class="search-input" />
            </div>
          </div>
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>文件名</th>
                  <th>接收时间</th>
                  <th>文件大小</th>
                  <th>数据来源</th>
                  <th>解析状态</th>
                  <th class="text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(file, index) in fileRecords"
                  :key="index"
                  :class="['table-row', { active: selectedFile === index }]"
                  @click="selectFile(index)"
                >
                  <td class="text-primary">{{ file.name }}</td>
                  <td class="font-mono">{{ file.receivedAt }}</td>
                  <td>{{ file.size }}</td>
                  <td class="text-muted uppercase">{{ file.source }}</td>
                  <td>
                    <div class="status-success">
                      <span class="status-dot-glow"></span>
                      <span>{{ file.status }}</span>
                    </div>
                  </td>
                  <td class="text-right">
                    <button class="action-btn" title="查看">
                      <VisibilityIcon class="action-icon" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- 参数宏列表 -->
        <section class="data-section section-secondary">
          <div class="section-header-bar">
            <h3 class="section-title">
              <ListAltIcon class="section-icon" />
              参数宏列表 (已解析)
            </h3>
            <div class="section-actions">
              <button class="btn btn-accent-sm">
                <PlusIcon class="btn-icon-xs" />
                添加参数宏
              </button>
              <div class="search-box">
                <SearchIcon class="search-icon" />
                <input type="text" placeholder="搜索参数宏..." class="search-input" />
              </div>
            </div>
          </div>
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>参数宏名称</th>
                  <th>创建时间</th>
                  <th>更新时间</th>
                  <th>来源文件</th>
                  <th class="text-right">来源地址</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(macro, index) in macroList"
                  :key="index"
                  :class="['table-row', { active: selectedMacro === index }]"
                  @click="selectMacro(index)"
                >
                  <td class="text-secondary">{{ macro.name }}</td>
                  <td class="font-mono">{{ macro.createdAt }}</td>
                  <td class="font-mono">{{ macro.updatedAt }}</td>
                  <td>{{ macro.sourceFile }}</td>
                  <td class="text-right text-muted">{{ macro.sourceAddr }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- 任务参数宏解析详情 -->
        <section class="param-detail-section">
          <div class="detail-header">
            <span class="pulse-dot"></span>
            <h3 class="detail-title">
              任务参数宏解析详情:
              <span class="detail-mono">{{ currentMacro.name }}</span>
            </h3>
          </div>
          <div class="detail-body">
            <div class="detail-grid">
              <!-- 天线系统参数 -->
              <div class="detail-column">
                <div class="column-header header-primary">
                  <SettingsInputAntennaIcon class="column-icon" />
                  <span>天线系统参数</span>
                </div>
                <div class="param-cards">
                  <div class="param-card">
                    <span class="param-label">Track Mode / 跟踪模式</span>
                    <span class="param-value text-primary">AUTO_TRACK</span>
                  </div>
                  <div class="param-card">
                    <span class="param-label">Initial Azimuth / 初始方位</span>
                    <span class="param-value text-primary">124.50°</span>
                  </div>
                  <div class="param-card">
                    <span class="param-label">Initial Elevation / 初始仰角</span>
                    <span class="param-value text-primary">15.20°</span>
                  </div>
                  <div class="param-card">
                    <span class="param-label">Scanning Strategy / 扫描策略</span>
                    <span class="param-value text-primary">SPIRAL_SEARCH</span>
                  </div>
                </div>
              </div>

              <!-- 变频链路参数 -->
              <div class="detail-column">
                <div class="column-header header-secondary">
                  <SwapVertIcon class="column-icon" />
                  <span>变频链路参数</span>
                </div>
                <div class="param-cards">
                  <div class="param-card">
                    <span class="param-label">DL Center Freq / 下行中心频率</span>
                    <span class="param-value text-secondary">2245.00 MHz</span>
                  </div>
                  <div class="param-card">
                    <span class="param-label">UL Center Freq / 上行中心频率</span>
                    <span class="param-value text-secondary">2025.00 MHz</span>
                  </div>
                  <div class="param-card">
                    <span class="param-label">LNA Gain / 低噪放增益</span>
                    <span class="param-value text-secondary">55.0 dB</span>
                  </div>
                  <div class="param-card">
                    <span class="param-label">Attenuator / 衰减值</span>
                    <span class="param-value text-secondary">10.5 dB</span>
                  </div>
                </div>
              </div>

              <!-- 基带处理参数 -->
              <div class="detail-column">
                <div class="column-header header-tertiary">
                  <MemoryIcon class="column-icon" />
                  <span>基带处理参数</span>
                </div>
                <div class="param-cards">
                  <div class="param-card">
                    <span class="param-label">Modulation / 调制方式</span>
                    <span class="param-value text-tertiary">BPSK</span>
                  </div>
                  <div class="param-card">
                    <span class="param-label">Data Rate / 信息速率</span>
                    <span class="param-value text-tertiary">4096 kbps</span>
                  </div>
                  <div class="param-card">
                    <span class="param-label">Coding / 编译码方式</span>
                    <span class="param-value text-tertiary">LDPC (7/8)</span>
                  </div>
                  <div class="param-card">
                    <span class="param-label">Frame Length / 帧长</span>
                    <span class="param-value text-tertiary">1024 Bytes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="detail-footer">
            <button class="btn btn-secondary" @click="cancelChanges">取消更改</button>
            <button class="btn btn-accent">
              <EditIcon class="btn-icon-xs" />
              编辑当前参数
            </button>
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
const UploadFileIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
      h('polyline', { points: '17 8 12 3 7 8' }),
      h('line', { x1: '12', y1: '3', x2: '12', y2: '15' })
    ])
  }
}

const FolderZipIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z' }),
      h('polyline', { points: '12 12 12 18' }),
      h('polyline', { points: '9 15 12 12 15 15' })
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

const VisibilityIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' }),
      h('circle', { cx: '12', cy: '12', r: '3' })
    ])
  }
}

const SettingsInputAntennaIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M12 2v20M6 8a6 6 0 0 1 12 0c0 3-2 5-6 10-4-5-6-7-6-10z' })
    ])
  }
}

const SwapVertIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('polyline', { points: '7 16 12 21 17 16' }),
      h('polyline', { points: '17 8 12 3 7 8' })
    ])
  }
}

const MemoryIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('rect', { x: '4', y: '4', width: '16', height: '16', rx: '2', ry: '2' }),
      h('rect', { x: '9', y: '9', width: '6', height: '6' }),
      h('line', { x1: '9', y1: '1', x2: '9', y2: '4' }),
      h('line', { x1: '15', y1: '1', x2: '15', y2: '4' }),
      h('line', { x1: '9', y1: '20', x2: '9', y2: '23' }),
      h('line', { x1: '15', y1: '20', x2: '15', y2: '23' }),
      h('line', { x1: '20', y1: '9', x2: '23', y2: '9' }),
      h('line', { x1: '20', y1: '15', x2: '23', y2: '15' }),
      h('line', { x1: '1', y1: '9', x2: '4', y2: '9' }),
      h('line', { x1: '1', y1: '15', x2: '4', y2: '15' })
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
const fileRecords = ref([
  { name: 'MISSION_PAR_LEO_0924.xml', receivedAt: '2024-05-24 14:20:01', size: '154.2 KB', source: 'Control Center Alpha', status: '解析成功' },
  { name: 'SAT_CONFIG_GEO_V2.json', receivedAt: '2024-05-23 09:12:44', size: '89.5 KB', source: 'Control Center Beta', status: '解析成功' }
])

const macroList = ref([
  { name: 'MACRO_LEO_ST_2024', createdAt: '2024-05-24 14:20:05', updatedAt: '2024-05-24 14:25:30', sourceFile: 'MISSION_PAR_LEO_0924.xml', sourceAddr: '运控中心' },
  { name: 'GEO_CONFIG_CUSTOM_V1', createdAt: '2024-05-23 10:15:22', updatedAt: '2024-05-23 11:02:14', sourceFile: 'SAT_CONFIG_GEO_V2.json', sourceAddr: '用户自定义' }
])

const selectedFile = ref(0)
const selectedMacro = ref(0)
const currentMacro = ref(macroList.value[0])

const currentTime = ref('2024-05-20 15:44:22')

const selectFile = (index: number) => {
  selectedFile.value = index
}

const selectMacro = (index: number) => {
  selectedMacro.value = index
  currentMacro.value = macroList.value[index]
}

const cancelChanges = () => {
  // reset or cancel logic
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
.task-mission-param-page {
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

.btn-secondary {
  background: #2a292f;
  color: #e4e1e9;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.05);
}

.btn-accent-sm {
  background: rgba(173, 198, 255, 0.1);
  color: #adc6ff;
  border: 1px solid rgba(173, 198, 255, 0.2);
  padding: 6px 12px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.btn-accent-sm:hover {
  background: rgba(173, 198, 255, 0.2);
}

.btn-accent {
  background: rgba(96, 165, 250, 0.1);
  color: #60a5fa;
  border: 1px solid rgba(96, 165, 250, 0.2);
  padding: 8px 16px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.btn-accent:hover {
  background: rgba(96, 165, 250, 0.2);
}

.btn-icon {
  width: 14px;
  height: 14px;
}

.btn-icon-xs {
  width: 12px;
  height: 12px;
}

/* 数据区块 */
.data-section {
  background: #1b1b20;
  border-radius: 8px;
  padding: 20px;
  flex-shrink: 0;
}

.section-primary {
  border-left: 4px solid #60a5fa;
}

.section-secondary {
  border-left: 4px solid #adc6ff;
}

.section-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.section-primary .section-title {
  color: #60a5fa;
}

.section-secondary .section-title {
  color: #adc6ff;
}

.section-icon {
  width: 18px;
  height: 18px;
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 搜索框 */
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
  width: 180px;
  outline: none;
}

.search-input::placeholder {
  color: #64748b;
}

.search-input:focus {
  border-color: rgba(96, 165, 250, 0.5);
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

.text-primary {
  color: #60a5fa;
}

.text-secondary {
  color: #adc6ff;
}

.text-tertiary {
  color: #4ae176;
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

.status-success {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #4ae176;
  font-size: 12px;
}

.status-dot-glow {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4ae176;
  box-shadow: 0 0 8px rgba(74, 225, 118, 0.5);
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

/* 参数解析详情 */
.param-detail-section {
  flex: 1;
  background: #1b1b20;
  border-radius: 8px;
  padding: 20px;
  border-top: 2px solid rgba(96, 165, 250, 0.2);
  display: flex;
  flex-direction: column;
  min-height: 260px;
}

.detail-header {
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

.detail-title {
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  margin: 0;
}

.detail-mono {
  color: #60a5fa;
  font-family: 'Fira Code', monospace;
  margin-left: 8px;
}

.detail-body {
  flex: 1;
  overflow-y: auto;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.detail-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.column-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #2a292f;
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-left: 2px solid transparent;
}

.header-primary {
  border-left-color: #60a5fa;
}

.header-secondary {
  border-left-color: #adc6ff;
}

.header-tertiary {
  border-left-color: #4ae176;
}

.column-icon {
  width: 16px;
  height: 16px;
}

.header-primary .column-icon {
  color: #60a5fa;
}

.header-secondary .column-icon {
  color: #adc6ff;
}

.header-tertiary .column-icon {
  color: #4ae176;
}

.param-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.param-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  background: #131318;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.param-label {
  font-size: 10px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.param-value {
  font-size: 12px;
  font-family: 'Fira Code', monospace;
  font-weight: 500;
}

.detail-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: auto;
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
