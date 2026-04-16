import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export type ThemeName =
  | 'default-dark'
  | 'slate-blue'
  | 'light'
  | 'night-oled'
  | 'stalker'
  | 'sonar'
  | 'amber'

export interface ThemeConfig {
  name: ThemeName
  label: string
  colors: Record<string, string>
}

const themes: ThemeConfig[] = [
  {
    name: 'default-dark',
    label: '默认暗色',
    colors: {
      '--gs-primary-main': '#8fa8c4',
      '--gs-secondary-main': '#d6926b',
      '--gs-success-main': '#59d98b',
      '--gs-warning-main': '#ffcc66',
      '--gs-error-main': '#ff5d6c',
      '--gs-info-main': '#8f969e',
      '--gs-bg-default': '#111213',
      '--gs-bg-paper': '#1a1c1e',
      '--gs-bg-elevated': '#23262a',
      '--gs-bg-titlebar': '#171a1d',
      '--gs-border-main': '#383c42',
      '--gs-border-light': '#454a51',
      '--gs-border-dark': '#2b2f35',
      '--gs-overlay-light': 'rgba(154, 159, 166, 0.06)',
      '--gs-overlay-medium': 'rgba(154, 159, 166, 0.12)',
      '--gs-overlay-dark': 'rgba(0, 0, 0, 0.6)',
      '--gs-text-primary': '#e4e1e9',
      '--gs-text-secondary': '#94a3b8',
      '--gs-text-disabled': '#64748b',
      '--gs-text-inverse': '#111213',
      '--gs-glow-success': 'rgba(89, 217, 139, 0.4)',
      '--gs-glow-warning': 'rgba(255, 204, 102, 0.4)',
      '--gs-glow-error': 'rgba(255, 93, 108, 0.4)',
      '--gs-glow-primary': 'rgba(143, 168, 196, 0.4)',
    }
  },
  {
    name: 'slate-blue',
    label: ' slate 蓝',
    colors: {
      '--gs-primary-main': '#4f9dff',
      '--gs-secondary-main': '#7bd3b0',
      '--gs-success-main': '#59d98b',
      '--gs-warning-main': '#ffcc66',
      '--gs-error-main': '#ff5d6c',
      '--gs-info-main': '#8f969e',
      '--gs-bg-default': '#111315',
      '--gs-bg-paper': '#181b1e',
      '--gs-bg-elevated': '#1e2226',
      '--gs-bg-titlebar': '#14171a',
      '--gs-border-main': '#2a2f35',
      '--gs-border-light': '#353b42',
      '--gs-border-dark': '#1e2226',
      '--gs-overlay-light': 'rgba(154, 159, 166, 0.06)',
      '--gs-overlay-medium': 'rgba(154, 159, 166, 0.12)',
      '--gs-overlay-dark': 'rgba(0, 0, 0, 0.6)',
      '--gs-text-primary': '#e4e1e9',
      '--gs-text-secondary': '#8b949e',
      '--gs-text-disabled': '#5d646c',
      '--gs-text-inverse': '#111315',
      '--gs-glow-success': 'rgba(89, 217, 139, 0.4)',
      '--gs-glow-warning': 'rgba(255, 204, 102, 0.4)',
      '--gs-glow-error': 'rgba(255, 93, 108, 0.4)',
      '--gs-glow-primary': 'rgba(79, 157, 255, 0.4)',
    }
  },
  {
    name: 'light',
    label: '浅色',
    colors: {
      '--gs-primary-main': '#1565c0',
      '--gs-secondary-main': '#ad1457',
      '--gs-success-main': '#2e7d32',
      '--gs-warning-main': '#ed6c02',
      '--gs-error-main': '#d32f2f',
      '--gs-info-main': '#0288d1',
      '--gs-bg-default': '#edf1f5',
      '--gs-bg-paper': '#ffffff',
      '--gs-bg-elevated': '#e2e7ee',
      '--gs-bg-titlebar': '#dce5ef',
      '--gs-border-main': '#b5bec8',
      '--gs-border-light': '#c5ced8',
      '--gs-border-dark': '#a5aeb8',
      '--gs-overlay-light': 'rgba(0, 0, 0, 0.03)',
      '--gs-overlay-medium': 'rgba(0, 0, 0, 0.06)',
      '--gs-overlay-dark': 'rgba(0, 0, 0, 0.4)',
      '--gs-text-primary': '#1a1a1a',
      '--gs-text-secondary': '#5a6470',
      '--gs-text-disabled': '#8a94a0',
      '--gs-text-inverse': '#ffffff',
      '--gs-glow-success': 'rgba(46, 125, 50, 0.25)',
      '--gs-glow-warning': 'rgba(237, 108, 2, 0.25)',
      '--gs-glow-error': 'rgba(211, 47, 47, 0.25)',
      '--gs-glow-primary': 'rgba(21, 101, 192, 0.25)',
    }
  },
  {
    name: 'night-oled',
    label: '夜间 OLED',
    colors: {
      '--gs-primary-main': '#7f77c3',
      '--gs-secondary-main': '#a78bfa',
      '--gs-success-main': '#4ade80',
      '--gs-warning-main': '#fbbf24',
      '--gs-error-main': '#f87171',
      '--gs-info-main': '#94a3b8',
      '--gs-bg-default': '#000000',
      '--gs-bg-paper': '#0a0a0a',
      '--gs-bg-elevated': '#111111',
      '--gs-bg-titlebar': '#050505',
      '--gs-border-main': '#222222',
      '--gs-border-light': '#333333',
      '--gs-border-dark': '#111111',
      '--gs-overlay-light': 'rgba(255, 255, 255, 0.03)',
      '--gs-overlay-medium': 'rgba(255, 255, 255, 0.06)',
      '--gs-overlay-dark': 'rgba(0, 0, 0, 0.8)',
      '--gs-text-primary': '#e8e8e8',
      '--gs-text-secondary': '#888888',
      '--gs-text-disabled': '#555555',
      '--gs-text-inverse': '#000000',
      '--gs-glow-success': 'rgba(74, 222, 128, 0.35)',
      '--gs-glow-warning': 'rgba(251, 191, 36, 0.35)',
      '--gs-glow-error': 'rgba(248, 113, 113, 0.35)',
      '--gs-glow-primary': 'rgba(127, 119, 195, 0.35)',
    }
  },
  {
    name: 'stalker',
    label: 'S.T.A.L.K.E.R.',
    colors: {
      '--gs-primary-main': '#7fb800',
      '--gs-secondary-main': '#b85d00',
      '--gs-success-main': '#7fb800',
      '--gs-warning-main': '#e6a700',
      '--gs-error-main': '#ff4444',
      '--gs-info-main': '#8f969e',
      '--gs-bg-default': '#0a0d0a',
      '--gs-bg-paper': '#111411',
      '--gs-bg-elevated': '#1a1d1a',
      '--gs-bg-titlebar': '#0d100d',
      '--gs-border-main': '#2a2f2a',
      '--gs-border-light': '#353a35',
      '--gs-border-dark': '#1f221f',
      '--gs-overlay-light': 'rgba(127, 184, 0, 0.04)',
      '--gs-overlay-medium': 'rgba(127, 184, 0, 0.08)',
      '--gs-overlay-dark': 'rgba(0, 0, 0, 0.7)',
      '--gs-text-primary': '#d8dcc8',
      '--gs-text-secondary': '#8a9a7a',
      '--gs-text-disabled': '#5a6a4a',
      '--gs-text-inverse': '#0a0d0a',
      '--gs-glow-success': 'rgba(127, 184, 0, 0.4)',
      '--gs-glow-warning': 'rgba(230, 167, 0, 0.4)',
      '--gs-glow-error': 'rgba(255, 68, 68, 0.4)',
      '--gs-glow-primary': 'rgba(127, 184, 0, 0.4)',
    }
  },
  {
    name: 'sonar',
    label: '声纳',
    colors: {
      '--gs-primary-main': '#ffb000',
      '--gs-secondary-main': '#ff6600',
      '--gs-success-main': '#00ff88',
      '--gs-warning-main': '#ffcc00',
      '--gs-error-main': '#ff3333',
      '--gs-info-main': '#ffaa44',
      '--gs-bg-default': '#000000',
      '--gs-bg-paper': '#0a0a00',
      '--gs-bg-elevated': '#141400',
      '--gs-bg-titlebar': '#050500',
      '--gs-border-main': '#332a00',
      '--gs-border-light': '#4a3d00',
      '--gs-border-dark': '#1f1a00',
      '--gs-overlay-light': 'rgba(255, 176, 0, 0.04)',
      '--gs-overlay-medium': 'rgba(255, 176, 0, 0.08)',
      '--gs-overlay-dark': 'rgba(0, 0, 0, 0.8)',
      '--gs-text-primary': '#ffe8b8',
      '--gs-text-secondary': '#b8a060',
      '--gs-text-disabled': '#786830',
      '--gs-text-inverse': '#000000',
      '--gs-glow-success': 'rgba(0, 255, 136, 0.35)',
      '--gs-glow-warning': 'rgba(255, 204, 0, 0.35)',
      '--gs-glow-error': 'rgba(255, 51, 51, 0.35)',
      '--gs-glow-primary': 'rgba(255, 176, 0, 0.35)',
    }
  },
  {
    name: 'amber',
    label: '琥珀',
    colors: {
      '--gs-primary-main': '#ff8f5a',
      '--gs-secondary-main': '#ff5d6c',
      '--gs-success-main': '#59d98b',
      '--gs-warning-main': '#ffcc66',
      '--gs-error-main': '#ff5d6c',
      '--gs-info-main': '#8f969e',
      '--gs-bg-default': '#12100f',
      '--gs-bg-paper': '#1c1917',
      '--gs-bg-elevated': '#292522',
      '--gs-bg-titlebar': '#181513',
      '--gs-border-main': '#3d3631',
      '--gs-border-light': '#4d4540',
      '--gs-border-dark': '#2b2622',
      '--gs-overlay-light': 'rgba(255, 143, 90, 0.05)',
      '--gs-overlay-medium': 'rgba(255, 143, 90, 0.10)',
      '--gs-overlay-dark': 'rgba(0, 0, 0, 0.6)',
      '--gs-text-primary': '#e7e0dc',
      '--gs-text-secondary': '#a89b93',
      '--gs-text-disabled': '#6f655e',
      '--gs-text-inverse': '#12100f',
      '--gs-glow-success': 'rgba(89, 217, 139, 0.4)',
      '--gs-glow-warning': 'rgba(255, 204, 102, 0.4)',
      '--gs-glow-error': 'rgba(255, 93, 108, 0.4)',
      '--gs-glow-primary': 'rgba(255, 143, 90, 0.4)',
    }
  }
]

export const useThemeStore = defineStore('theme', () => {
  const savedTheme = (typeof localStorage !== 'undefined'
    ? (localStorage.getItem('gs-theme') as ThemeName | null)
    : null) || 'default-dark'

  const currentTheme = ref<ThemeName>(savedTheme)
  const themeSelectorOpen = ref(false)

  const currentThemeConfig = computed(() =>
    themes.find(t => t.name === currentTheme.value) || themes[0]
  )

  function applyTheme(name: ThemeName) {
    currentTheme.value = name
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('gs-theme', name)
    }
    const root = document.documentElement
    const theme = themes.find(t => t.name === name)
    if (!theme) return
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
    root.setAttribute('data-theme', name)
    if (name === 'light') {
      root.classList.remove('dark')
    } else {
      root.classList.add('dark')
    }
  }

  function toggleThemeSelector() {
    themeSelectorOpen.value = !themeSelectorOpen.value
  }

  function closeThemeSelector() {
    themeSelectorOpen.value = false
  }

  // Auto-apply on load
  watch(currentTheme, applyTheme, { immediate: true })

  return {
    currentTheme,
    themeSelectorOpen,
    currentThemeConfig,
    themes,
    applyTheme,
    toggleThemeSelector,
    closeThemeSelector
  }
})
