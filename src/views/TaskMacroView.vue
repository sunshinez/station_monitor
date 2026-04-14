<template>
  <main class="main-content">
        <!-- 头部操作栏 -->
        <div class="content-header">
          <div class="header-left">
            <h1 class="page-title">任务参数宏管理</h1>
            <p class="page-subtitle">MISSION_PARAM_MACRO_VAULT_v4.2</p>
          </div>
          <div class="header-actions">
            <div class="search-box">
              <SearchIcon class="search-icon" />
              <input type="text" placeholder="检索宏名称或型号..." class="search-input" />
            </div>
            <button class="btn btn-primary">
              <PlusIcon class="btn-icon" />
              新建宏
            </button>
            <button class="btn btn-secondary">
              <CopyIcon class="btn-icon" />
              复制所选
            </button>
            <button class="btn btn-danger">
              <DeleteIcon class="btn-icon" />
              批量删除
            </button>
          </div>
        </div>

        <!-- 内容区域 -->
        <div class="content-body">
          <!-- 左侧表格 -->
          <div class="table-panel">
            <div class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th class="col-checkbox">
                      <input type="checkbox" class="checkbox" />
                    </th>
                    <th class="col-name">宏名称</th>
                    <th class="col-model">关联型号</th>
                    <th class="col-backup">备份链路</th>
                    <th class="col-time">最后修改时间</th>
                    <th class="col-actions">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(macro, index) in macroList" :key="index"
                      :class="['table-row', { active: selectedMacro === index }]"
                      @click="selectMacro(index)">
                    <td class="col-checkbox">
                      <input type="checkbox" class="checkbox" :checked="selectedMacro === index" />
                    </td>
                    <td class="col-name">
                      <div class="macro-name">{{ macro.name }}</div>
                      <div class="macro-id">ID: {{ macro.id }}</div>
                    </td>
                    <td class="col-model">{{ macro.model }}</td>
                    <td class="col-backup">
                      <div class="backup-switch">
                        <div class="switch" :class="{ active: macro.backup }">
                          <div class="switch-thumb"></div>
                        </div>
                        <span class="backup-label" :class="{ active: macro.backup }">
                          {{ macro.backup ? '高优先级推荐' : '中优先级可选' }}
                        </span>
                      </div>
                    </td>
                    <td class="col-time">{{ macro.time }}</td>
                    <td class="col-actions">
                      <div class="action-btns">
                        <button class="action-btn" title="编辑">
                          <EditIcon class="action-icon" />
                        </button>
                        <button class="action-btn" title="复制">
                          <CopyIcon class="action-icon" />
                        </button>
                        <button class="action-btn danger" title="删除">
                          <DeleteIcon class="action-icon" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="table-footer">
              <AnalyticsIcon class="footer-icon" />
              <p class="footer-text">End of Stream — Records: {{ macroList.length }}</p>
            </div>
          </div>

          <!-- 右侧编辑面板 -->
          <div class="edit-panel">
            <div class="panel-header">
              <div>
                <span class="panel-tag">宏配置详情 / 正在编辑</span>
                <h2 class="panel-title">{{ currentMacro.name }}</h2>
              </div>
              <button class="close-btn">
                <CloseIcon class="close-icon" />
              </button>
            </div>

            <div class="panel-body">
              <!-- 天线收发参数 -->
              <section class="param-section">
                <div class="section-header">
                  <span class="section-dot primary"></span>
                  <h3 class="section-title">天线收发参数</h3>
                </div>
                <div class="param-grid">
                  <div class="param-item">
                    <label class="param-label">发射频率 (MHz)</label>
                    <input type="text" class="param-input" v-model="currentMacro.params.txFreq" />
                  </div>
                  <div class="param-item">
                    <label class="param-label">接收频率 (MHz)</label>
                    <input type="text" class="param-input" v-model="currentMacro.params.rxFreq" />
                  </div>
                  <div class="param-item">
                    <label class="param-label">极化方式</label>
                    <select class="param-select" v-model="currentMacro.params.polarization">
                      <option>圆极化 (RHCP)</option>
                      <option>圆极化 (LHCP)</option>
                      <option>垂直极化</option>
                      <option>水平极化</option>
                    </select>
                  </div>
                  <div class="param-item">
                    <label class="param-label">增益控制</label>
                    <div class="slider-control">
                      <input type="range" class="param-slider" min="0" max="60" v-model="currentMacro.params.gain" />
                      <span class="slider-value">{{ currentMacro.params.gain }}dB</span>
                    </div>
                  </div>
                </div>
              </section>

              <!-- 数传变频参数 -->
              <section class="param-section">
                <div class="section-header">
                  <span class="section-dot secondary"></span>
                  <h3 class="section-title">数传变频参数</h3>
                </div>
                <div class="param-grid">
                  <div class="param-item">
                    <label class="param-label">本振频率 (GHz)</label>
                    <input type="text" class="param-input secondary" v-model="currentMacro.params.loFreq" />
                  </div>
                  <div class="param-item">
                    <label class="param-label">输出功率 (dBm)</label>
                    <input type="text" class="param-input secondary" v-model="currentMacro.params.outputPower" />
                  </div>
                  <div class="param-item">
                    <label class="param-label">衰减量 (dB)</label>
                    <input type="text" class="param-input secondary" v-model="currentMacro.params.attenuation" />
                  </div>
                  <div class="param-item">
                    <label class="param-label">变频补偿</label>
                    <select class="param-select" v-model="currentMacro.params.compensation">
                      <option>自动补偿开启</option>
                      <option>手动固定补偿</option>
                    </select>
                  </div>
                </div>
              </section>

              <!-- 基带配置参数 -->
              <section class="param-section">
                <div class="section-header">
                  <span class="section-dot tertiary"></span>
                  <h3 class="section-title">基带配置参数</h3>
                </div>
                <div class="param-grid">
                  <div class="param-item">
                    <label class="param-label">调制方式</label>
                    <select class="param-select" v-model="currentMacro.params.modulation">
                      <option>QPSK</option>
                      <option>UQPSK</option>
                      <option>8PSK</option>
                      <option>16APSK</option>
                    </select>
                  </div>
                  <div class="param-item">
                    <label class="param-label">纠错编码</label>
                    <select class="param-select" v-model="currentMacro.params.fec">
                      <option>LDPC (7/8)</option>
                      <option>Turbo (1/2)</option>
                      <option>RS (255, 223)</option>
                    </select>
                  </div>
                  <div class="param-item">
                    <label class="param-label">码速率 (kbps)</label>
                    <input type="text" class="param-input tertiary" v-model="currentMacro.params.symbolRate" />
                  </div>
                  <div class="param-item">
                    <label class="param-label">副载波频率</label>
                    <input type="text" class="param-input tertiary" v-model="currentMacro.params.subcarrier" />
                  </div>
                </div>
              </section>

              <!-- 存储配置参数 -->
              <section class="param-section">
                <div class="section-header">
                  <span class="section-dot outline"></span>
                  <h3 class="section-title">存储配置参数</h3>
                </div>
                <div class="param-block">
                  <div class="param-item full">
                    <label class="param-label">存储路径</label>
                    <div class="path-input">
                      <input type="text" class="param-input" readonly v-model="currentMacro.params.storagePath" />
                      <button class="path-btn">
                        <FolderOpenIcon class="path-icon" />
                      </button>
                    </div>
                  </div>
                  <div class="param-grid">
                    <div class="param-item">
                      <label class="param-label">数据格式</label>
                      <select class="param-select" v-model="currentMacro.params.dataFormat">
                        <option>CCSDS Frame</option>
                        <option>Raw Stream</option>
                        <option>JSON/KV</option>
                      </select>
                    </div>
                    <div class="param-item">
                      <label class="param-label">保存策略</label>
                      <select class="param-select" v-model="currentMacro.params.retention">
                        <option>保存 30 天</option>
                        <option>保存 90 天</option>
                        <option>永久保留</option>
                      </select>
                    </div>
                  </div>
                  <div class="param-checkbox">
                    <input type="checkbox" id="auto-sync" class="checkbox" v-model="currentMacro.params.autoSync" />
                    <label for="auto-sync" class="checkbox-label">录毕自动同步至中心归档库</label>
                  </div>
                </div>
              </section>
            </div>

            <div class="panel-footer">
              <button class="btn btn-primary flex-1">保存配置</button>
              <button class="btn btn-secondary flex-1">放弃更改</button>
            </div>
          </div>
        </div>

        <!-- 装饰元素 -->
        <div class="decorative-element">
          <div class="rotating-square">
            <div class="inner-square"></div>
            <div class="cross-hair">
              <div class="h-line"></div>
              <div class="v-line"></div>
            </div>
          </div>
        </div>
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

const PlusIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('line', { x1: '12', y1: '5', x2: '12', y2: '19' }),
      h('line', { x1: '5', y1: '12', x2: '19', y2: '12' })
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

const EditIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' }),
      h('path', { d: 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' })
    ])
  }
}

const CloseIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('line', { x1: '18', y1: '6', x2: '6', y2: '18' }),
      h('line', { x1: '6', y1: '6', x2: '18', y2: '18' })
    ])
  }
}

const FolderOpenIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z' })
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

// 数据
const macroList = ref([
  { name: 'GH-S2-OMNIBUS-01', id: 'MACRO-8821-X', model: 'GAOFEN-7A', backup: true, time: '2024-05-20 14:22:11' },
  { name: 'XY-TELEMETRY-MOD-B', id: 'MACRO-4512-Z', model: 'XINYAN-21', backup: false, time: '2024-05-19 09:15:45' },
  { name: 'NAV-ST-LINK-042', id: 'MACRO-1109-L', model: 'BEIDOU-M1', backup: true, time: '2024-05-18 23:44:02' }
])

const selectedMacro = ref(1)

const currentMacro = ref({
  name: 'XY-TELEMETRY-MOD-B',
  params: {
    txFreq: '2245.500',
    rxFreq: '2085.000',
    polarization: '圆极化 (RHCP)',
    gain: 32,
    loFreq: '8.450',
    outputPower: '+15.0',
    attenuation: '6.5',
    compensation: '自动补偿开启',
    modulation: 'QPSK',
    fec: 'LDPC (7/8)',
    symbolRate: '2048',
    subcarrier: '64.0 kHz',
    storagePath: '/mnt/storage/raw/XY21_0520',
    dataFormat: 'CCSDS Frame',
    retention: '保存 30 天',
    autoSync: true
  }
})

const currentTime = ref('2024-05-20 15:44:22.043')

const selectMacro = (index: number) => {
  selectedMacro.value = index
  currentMacro.value.name = macroList.value[index].name
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
.task-macro-page {
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
  margin-bottom: 24px;
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

/* 内容主体 */
.content-body {
  display: flex;
  gap: 24px;
  flex: 1;
  min-height: 0;
}

/* 表格面板 */
.table-panel {
  flex: 1;
  background: #1b1b20;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
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

.data-table th {
  background: rgba(14, 14, 19, 0.5);
  padding: 16px;
  text-align: left;
  font-size: 10px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.data-table td {
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
}

.table-row {
  cursor: pointer;
  transition: all 0.2s;
  border-left: 2px solid transparent;
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.02);
  border-left-color: rgba(96, 165, 250, 0.4);
}

.table-row.active {
  background: rgba(96, 165, 250, 0.1);
  border-left-color: #60a5fa;
}

.col-checkbox {
  width: 40px;
}

.checkbox {
  width: 16px;
  height: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  background: transparent;
  cursor: pointer;
}

.macro-name {
  font-weight: 500;
  color: #a4c9ff;
  margin-bottom: 4px;
}

.macro-id {
  font-size: 10px;
  color: #64748b;
  font-family: 'Fira Code', monospace;
}

.col-model {
  font-family: 'Fira Code', monospace;
  font-size: 12px;
}

.backup-switch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.switch {
  width: 32px;
  height: 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  position: relative;
  padding: 2px;
  display: flex;
  align-items: center;
}

.switch.active {
  background: #00a74b;
  justify-content: flex-end;
}

.switch-thumb {
  width: 12px;
  height: 12px;
  background: #94a3b8;
  border-radius: 50%;
}

.switch.active .switch-thumb {
  background: #ffffff;
}

.backup-label {
  font-size: 9px;
  color: #64748b;
  font-weight: 600;
}

.backup-label.active {
  color: #4ae176;
}

.col-time {
  font-size: 11px;
  color: #94a3b8;
  font-family: 'Fira Code', monospace;
}

.action-btns {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.table-row:hover .action-btns,
.table-row.active .action-btns {
  opacity: 1;
}

.action-btn {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
}

.action-btn:hover {
  color: #a4c9ff;
}

.action-btn.danger:hover {
  color: #ffb4ab;
}

.action-icon {
  width: 16px;
  height: 16px;
}

.col-actions {
  text-align: right;
}

/* 表格底部 */
.table-footer {
  padding: 24px;
  background: rgba(14, 14, 19, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.footer-icon {
  width: 40px;
  height: 40px;
  color: rgba(255, 255, 255, 0.1);
}

.footer-text {
  font-size: 10px;
  color: #64748b;
  font-family: 'Fira Code', monospace;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
}

/* 编辑面板 */
.edit-panel {
  width: 480px;
  background: #2a292f;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
}

.panel-header {
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.panel-tag {
  font-size: 10px;
  font-weight: 700;
  color: #a4c9ff;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
  display: block;
}

.panel-title {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #e4e1e9;
}

.close-icon {
  width: 20px;
  height: 20px;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.param-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.section-dot {
  width: 4px;
  height: 12px;
  border-radius: 2px;
}

.section-dot.primary {
  background: #a4c9ff;
}

.section-dot.secondary {
  background: #adc6ff;
}

.section-dot.tertiary {
  background: #4ae176;
}

.section-dot.outline {
  background: #8c909f;
}

.section-title {
  font-size: 11px;
  font-weight: 700;
  color: #e4e1e9;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.param-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  background: rgba(14, 14, 19, 0.3);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.param-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.param-item.full {
  grid-column: span 2;
}

.param-label {
  font-size: 10px;
  color: #94a3b8;
  text-transform: uppercase;
  font-weight: 500;
}

.param-input,
.param-select {
  background: #0e0e13;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 10px 12px;
  color: #a4c9ff;
  font-size: 13px;
  font-family: 'Fira Code', monospace;
  outline: none;
  transition: border-color 0.2s;
}

.param-input:focus,
.param-select:focus {
  border-color: rgba(96, 165, 250, 0.5);
}

.param-input.secondary {
  color: #adc6ff;
}

.param-input.tertiary {
  color: #4ae176;
}

.param-select {
  color: #e4e1e9;
  cursor: pointer;
}

.slider-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.param-slider {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
}

.param-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  background: #a4c9ff;
  border-radius: 50%;
  cursor: pointer;
}

.slider-value {
  font-size: 12px;
  color: #a4c9ff;
  font-family: 'Fira Code', monospace;
  min-width: 40px;
  text-align: right;
}

.param-block {
  background: rgba(14, 14, 19, 0.3);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.path-input {
  display: flex;
  gap: 8px;
}

.path-input .param-input {
  flex: 1;
  color: #94a3b8;
}

.path-btn {
  background: #1b1b20;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 10px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
}

.path-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

.path-icon {
  width: 16px;
  height: 16px;
}

.param-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
}

.checkbox-label {
  font-size: 11px;
  color: #94a3b8;
  cursor: pointer;
}

/* 面板底部 */
.panel-footer {
  padding: 24px;
  background: rgba(53, 52, 58, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  gap: 12px;
}

.flex-1 {
  flex: 1;
}

/* 装饰元素 */
.decorative-element {
  position: absolute;
  bottom: 60px;
  right: 24px;
  width: 160px;
  height: 160px;
  opacity: 0.1;
  pointer-events: none;
  z-index: 0;
}

.rotating-square {
  width: 100%;
  height: 100%;
  border: 1px solid #a4c9ff;
  transform: rotate(12deg);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.inner-square {
  width: 75%;
  height: 75%;
  border: 1px solid #a4c9ff;
  transform: rotate(45deg);
}

.cross-hair {
  position: absolute;
  inset: 0;
}

.h-line,
.v-line {
  position: absolute;
  background: #a4c9ff;
}

.h-line {
  width: 100%;
  height: 1px;
  top: 50%;
}

.v-line {
  width: 1px;
  height: 100%;
  left: 50%;
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
}

::-webkit-scrollbar-track {
  background: #131318;
}

::-webkit-scrollbar-thumb {
  background: #424754;
  border-radius: 2px;
}

/* 响应式 */
@media (max-width: 1400px) {
  .edit-panel {
    width: 400px;
  }
}

@media (max-width: 1200px) {
  .content-body {
    flex-direction: column;
  }

  .edit-panel {
    width: 100%;
    max-height: 400px;
  }
}
</style>