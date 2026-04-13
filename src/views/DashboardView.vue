<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <div class="header-left">
        <SatelliteIcon class="header-icon" />
        <h1>卫星地面站监控系统</h1>
      </div>
      <div class="header-right">
        <span class="status-badge">
          <span class="status-dot"></span>
          系统运行中
        </span>
        <button @click="logout" class="logout-btn">退出</button>
      </div>
    </header>
    <main class="dashboard-content">
      <div class="welcome-card">
        <h2>欢迎访问</h2>
        <p>您已成功登录卫星地面站监控系统</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import SatelliteIcon from '@/components/icons/SatelliteIcon.vue'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('token')
  router.push('/')
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background-color: var(--bg-primary);
}

.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: var(--bg-card);
  border-bottom: 1px solid var(--border-card);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  width: 32px;
  height: 32px;
  color: var(--color-primary);
}

.header-left h1 {
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--text-white);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-success);
}

.status-dot {
  width: 8px;
  height: 8px;
  background-color: var(--color-success);
  border-radius: 50%;
  animation: breathe 2s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

.logout-btn {
  padding: 0.5rem 1rem;
  background-color: transparent;
  border: 1px solid var(--border-card);
  color: var(--text-dim);
  font-family: var(--font-mono);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.dashboard-content {
  padding: 2rem;
}

.welcome-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  padding: 3rem;
  max-width: 600px;
  margin: 2rem auto;
  text-align: center;
}

.welcome-card h2 {
  font-family: var(--font-headline);
  font-size: 1.5rem;
  color: var(--text-white);
  margin-bottom: 1rem;
}

.welcome-card p {
  color: var(--text-dim);
}
</style>
