<template>
  <header class="global-header">
    <div class="logo">XX地面站软件</div>
    <nav class="main-nav">
      <router-link to="/topology" class="nav-link" active-class="active">图形化监视</router-link>
      <router-link to="/device-control" class="nav-link" active-class="active">控制功能</router-link>
      <router-link to="/task-status" class="nav-link" active-class="active">状态监视</router-link>
      <router-link to="/task-macro" class="nav-link" active-class="active">任务管理</router-link>
      <router-link to="/log-record" class="nav-link" active-class="active">日志管理</router-link>
      <a href="#" class="nav-link">操作手册</a>
      <router-link to="/file-transfer" class="nav-link" active-class="active">文件传输</router-link>
    </nav>
    <div class="user-actions">
      <div class="theme-dropdown" v-click-outside="closeTheme">
        <button class="icon-btn" title="切换主题" @click="toggleTheme">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </button>
        <div v-if="themeOpen" class="theme-menu">
          <button
            v-for="t in themeStore.themes"
            :key="t.name"
            class="theme-option"
            :class="{ active: themeStore.currentTheme === t.name }"
            @click="selectTheme(t.name)"
          >
            <span class="theme-dot" :style="{ background: t.colors['--gs-primary-main'] }"></span>
            <span>{{ t.label }}</span>
          </button>
        </div>
      </div>
      <button class="icon-btn" title="通知">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span class="notification-dot"></span>
      </button>
      <button class="icon-btn" title="用户账户" @click="logout">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore, type ThemeName } from '@/stores/theme'

const router = useRouter()
const themeStore = useThemeStore()
const themeOpen = ref(false)

const toggleTheme = () => {
  themeOpen.value = !themeOpen.value
}

const closeTheme = () => {
  themeOpen.value = false
}

const selectTheme = (name: ThemeName) => {
  themeStore.applyTheme(name)
  themeOpen.value = false
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/')
}

// Simple click-outside directive
const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    const handler = (e: Event) => {
      if (!el.contains(e.target as Node)) binding.value()
    }
    document.addEventListener('click', handler)
    ;(el as any)._clickOutside = handler
  },
  unmounted(el: HTMLElement) {
    const handler = (el as any)._clickOutside
    if (handler) document.removeEventListener('click', handler)
  }
}
</script>

<style scoped>
.global-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 52px;
  background: var(--gs-bg-elevated);
  border-bottom: 1px solid var(--gs-border-main);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
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
  color: var(--gs-primary-main);
  text-transform: uppercase;
}

.main-nav {
  display: flex;
  gap: 32px;
}

.nav-link {
  font-size: 14px;
  color: var(--gs-text-secondary);
  text-decoration: none;
  transition: color 0.2s;
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
}

.nav-link:hover {
  color: var(--gs-text-primary);
}

.nav-link.active {
  color: var(--gs-primary-main);
  border-bottom-color: var(--gs-primary-main);
  font-weight: 600;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.theme-dropdown {
  position: relative;
}

.theme-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  min-width: 160px;
  background: var(--gs-bg-paper);
  border: 1px solid var(--gs-border-main);
  border-radius: 6px;
  padding: 6px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  z-index: 100;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 10px;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: var(--gs-text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
}

.theme-option:hover,
.theme-option.active {
  background: var(--gs-overlay-light);
  color: var(--gs-text-primary);
}

.theme-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.icon-btn {
  position: relative;
  background: none;
  border: none;
  color: var(--gs-text-secondary);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  background: var(--gs-overlay-light);
  color: var(--gs-text-primary);
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
  background: var(--gs-error-main);
  box-shadow: 0 0 6px var(--gs-glow-error);
}
</style>
