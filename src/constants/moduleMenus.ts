export type ModuleKey = 'monitor' | 'control' | 'status' | 'task' | 'log' | 'file'

export interface MenuItem {
  label: string
  path?: string
  icon?: string
  action?: string
  children?: MenuItem[]
}

export interface ModuleMenu {
  title: string
  items: MenuItem[]
}

export const moduleMenus: Record<ModuleKey, ModuleMenu> = {
  monitor: {
    title: '图形化监视',
    items: [
      { label: '系统拓扑图监视', path: '/topology', icon: 'topology' },
      { label: '基带一体化监视', path: '/baseband', icon: 'baseband' },
      { label: '矩阵设备监视', path: '/matrix', icon: 'matrix' },
      { label: '其它设备监视', path: '/other-devices', icon: 'devices' }
    ]
  },
  control: {
    title: '控制终端',
    items: [
      {
        label: '设备控制',
        path: '/device-control',
        icon: 'control',
        children: [
          {
            label: '天线伺服设备',
            children: [
              { label: '标准测控天线-01', action: 'device:antenna-01' },
              { label: '标准测控天线-02', action: 'device:antenna-02' }
            ]
          },
          { label: '变频设备', action: 'device:converter' },
          { label: '数传基带设备', action: 'device:baseband' },
          { label: '数据分发与存储设备', action: 'device:storage' },
          { label: '环境设备', action: 'device:environment' }
        ]
      },
      { label: '远程控制', path: '/remote-control', icon: 'remote' }
    ]
  },
  status: {
    title: '状态监视',
    items: [
      { label: '任务状态监视', path: '/task-status', icon: 'monitor' },
      { label: '测控状态监视', path: '/telemetry-status', icon: 'telemetry' },
      { label: '数据传输监视', path: '/data-transmission', icon: 'transfer' },
      { label: '任务执行状态监视', path: '/task-execution', icon: 'execution' }
    ]
  },
  task: {
    title: '任务管理',
    items: [
      { label: '任务参数宏管理', path: '/task-macro', icon: 'settings' },
      { label: '任务链路映射管理', path: '/task-link-mapping', icon: 'link' },
      { label: '脚本命令编辑', path: '/task-script-editor', icon: 'terminal' },
      { label: '操作计划模板', path: '/task-plan-template', icon: 'template' },
      { label: '型号任务参数接收', path: '/task-mission-param', icon: 'download' },
      { label: '任务计划接收', path: '/task-plan-reception', icon: 'inbox' },
      { label: '操作计划生成与执行', path: '/task-plan-execution', icon: 'calendar' },
      { label: '脚本执行', path: '/task-script-execution', icon: 'play' },
      { label: '载波监视任务计划发送', path: '/task-carrier-wave-monitor', icon: 'send' },
      { label: '中心调度指令执行', path: '/task-central-dispatch', icon: 'dispatch' },
      { label: '本地调度执行', path: '/task-local-dispatch', icon: 'lan' },
      { label: '故障诊断', path: '/task-fault-diagnosis', icon: 'diagnosis' }
    ]
  },
  log: {
    title: '日志管理',
    items: [
      { label: '日志记录', path: '/log-record', icon: 'doc' },
      { label: '日志查询', path: '/log-query', icon: 'search' }
    ]
  },
  file: {
    title: '文件传输',
    items: [
      { label: '文件传输', path: '/file-transfer', icon: 'folder' }
    ]
  }
}

export const moduleTitles: Record<ModuleKey, string> = {
  monitor: '图形化监视',
  control: '控制功能',
  status: '状态监视',
  task: '任务管理',
  log: '日志管理',
  file: '文件传输'
}
