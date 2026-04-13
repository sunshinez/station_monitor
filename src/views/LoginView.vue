<template>
  <div class="login-container">
    <!-- Telemetry Background Elements -->
    <div class="telemetry-grid"></div>

    <!-- Top Left Info -->
    <div class="info-panel top-left">
      <div class="info-item primary">
        <span class="status-dot"></span> 上行链路：已加密
      </div>
      <div class="info-item">工作频率：14.225 GHz</div>
      <div class="info-item">纬度: 34.0522 N | 经度: 118.2437 W</div>
    </div>

    <!-- Bottom Right Info -->
    <div class="info-panel bottom-right">
      <div class="info-item">GS-01 ALPHA_NODE</div>
      <div class="info-item version">内核版本 V.4.2.0-STABLE</div>
    </div>

    <!-- Main Content -->
    <main class="login-main">
      <!-- Logo & Title -->
      <div class="logo-section">
        <div class="logo-wrapper">
          <SatelliteIcon class="logo-icon" />
          <div class="logo-glow"></div>
        </div>
        <h1 class="system-title">卫星地面站监控系统</h1>
        <p class="system-subtitle">GROUND STATION CONTROL CENTER</p>
      </div>

      <!-- Login Card -->
      <div class="login-card">
        <!-- Decorative corners -->
        <div class="corner top-left-corner"></div>
        <div class="corner top-right-corner"></div>
        <div class="corner bottom-left-corner"></div>
        <div class="corner bottom-right-corner"></div>

        <!-- Status Header -->
        <div class="status-header">
          <div class="status-left">
            <span class="status-indicator"></span>
            <span class="status-text">系统状态：正常</span>
          </div>
          <div class="status-time">{{ currentTime }}</div>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="login-form">
          <!-- Operator ID -->
          <div class="form-group">
            <label class="form-label">操作员身份</label>
            <div class="input-wrapper">
              <UserIcon class="input-icon" />
              <input
                v-model="form.username"
                type="text"
                class="form-input"
                placeholder="请输入工号 / 用户名"
              />
            </div>
          </div>

          <!-- Access Credentials -->
          <div class="form-group">
            <label class="form-label">访问凭证</label>
            <div class="input-wrapper">
              <LockIcon class="input-icon" />
              <input
                v-model="form.password"
                type="password"
                class="form-input"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <!-- Action Bar -->
          <div class="action-bar">
            <label class="remember-me">
              <input v-model="form.remember" type="checkbox" class="checkbox" />
              <span>记住该节点</span>
            </label>
            <a href="#" class="reset-link">重置访问权限</a>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="submit-btn" :disabled="loading">
            <span>{{ loading ? '连接中...' : '开启上行连接' }}</span>
            <RocketIcon class="btn-icon" />
          </button>
        </form>
      </div>

      <!-- Footer Notice -->
      <div class="footer-notice">
        <p>仅限授权人员访问。所有访问行为均被记录。</p>
        <p>ASTRA AEROSPACE DYNAMICS 专有软件资产</p>
      </div>
    </main>

    <!-- Background Glow -->
    <div class="bg-glow">
      <div class="glow glow-top-left"></div>
      <div class="glow glow-bottom-right"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import SatelliteIcon from '@/components/icons/SatelliteIcon.vue'
import UserIcon from '@/components/icons/UserIcon.vue'
import LockIcon from '@/components/icons/LockIcon.vue'
import RocketIcon from '@/components/icons/RocketIcon.vue'

const router = useRouter()
const loading = ref(false)
const currentTime = ref('UTC 00:00:00')
let timeInterval: number | null = null

const form = reactive({
  username: '',
  password: '',
  remember: false
})

const updateTime = () => {
  const now = new Date()
  const hours = String(now.getUTCHours()).padStart(2, '0')
  const minutes = String(now.getUTCMinutes()).padStart(2, '0')
  const seconds = String(now.getUTCSeconds()).padStart(2, '0')
  currentTime.value = `UTC ${hours}:${minutes}:${seconds}`
}

const handleLogin = async () => {
  if (!form.username || !form.password) {
    alert('请输入用户名和密码')
    return
  }

  loading.value = true
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: form.username,
        password: form.password
      })
    })

    const data = await response.json()

    if (data.success) {
      localStorage.setItem('token', data.token)
      router.push('/dashboard')
    } else {
      alert(data.message || '登录失败')
    }
  } catch (error) {
    console.error('Login error:', error)
    alert('网络错误，请稍后重试')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  updateTime()
  timeInterval = window.setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  font-family: var(--font-body);
}

/* Telemetry Grid Background */
.telemetry-grid {
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(30, 41, 59, 0.2) 1px, transparent 1px),
    linear-gradient(90deg, rgba(30, 41, 59, 0.2) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
}

/* Info Panels */
.info-panel {
  position: fixed;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.4;
  pointer-events: none;
  z-index: 5;
}

.info-panel.top-left {
  top: 2rem;
  left: 2rem;
}

.info-panel.bottom-right {
  bottom: 2rem;
  right: 2rem;
  text-align: right;
}

.info-item {
  color: var(--text-muted);
}

.info-item.primary {
  color: var(--color-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-item.version {
  color: var(--text-dim);
}

.status-dot {
  width: 4px;
  height: 4px;
  background-color: var(--color-primary);
  border-radius: 50%;
}

/* Main Content */
.login-main {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 440px;
  padding: 0 1.5rem;
}

/* Logo Section */
.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2.5rem;
  text-align: center;
}

.logo-wrapper {
  position: relative;
  margin-bottom: 1rem;
}

.logo-icon {
  width: 48px;
  height: 48px;
  color: var(--color-primary);
}

.logo-glow {
  position: absolute;
  inset: -8px;
  background: var(--color-primary);
  opacity: 0.1;
  filter: blur(16px);
  border-radius: 50%;
  z-index: -1;
}

.system-title {
  font-family: var(--font-headline);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--text-white);
  text-transform: uppercase;
}

.system-subtitle {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-primary);
  opacity: 0.6;
  letter-spacing: 0.4em;
  margin-top: 0.75rem;
  text-transform: uppercase;
}

/* Login Card */
.login-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-card);
  padding: 2rem;
  position: relative;
  box-shadow: 0 0 40px -10px rgba(96, 165, 250, 0.1);
}

/* Decorative Corners */
.corner {
  position: absolute;
  width: 8px;
  height: 8px;
  border-color: var(--color-primary);
  opacity: 0.4;
}

.top-left-corner {
  top: 0;
  left: 0;
  border-top: 1px solid;
  border-left: 1px solid;
}

.top-right-corner {
  top: 0;
  right: 0;
  border-top: 1px solid;
  border-right: 1px solid;
}

.bottom-left-corner {
  bottom: 0;
  left: 0;
  border-bottom: 1px solid;
  border-left: 1px solid;
}

.bottom-right-corner {
  bottom: 0;
  right: 0;
  border-bottom: 1px solid;
  border-right: 1px solid;
}

/* Status Header */
.status-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(30, 41, 59, 0.5);
}

.status-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.status-indicator {
  width: 8px;
  height: 8px;
  background-color: var(--color-success);
  border-radius: 50%;
  animation: breathe 2s ease-in-out infinite;
  box-shadow: 0 0 8px rgba(74, 225, 118, 0.5);
}

@keyframes breathe {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.status-text {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-success);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-time {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-dim);
  opacity: 0.6;
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.form-label {
  font-family: var(--font-headline);
  font-size: 10px;
  font-weight: 600;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  width: 20px;
  height: 20px;
  color: var(--text-muted);
  transition: color 0.2s;
}

.input-wrapper:focus-within .input-icon {
  color: var(--color-primary);
}

.form-input {
  width: 100%;
  background-color: rgba(11, 11, 16, 0.5);
  border: 1px solid var(--border-card);
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--text-white);
  transition: all 0.2s;
  outline: none;
}

.form-input::placeholder {
  color: var(--text-muted);
}

.form-input:focus {
  border-color: rgba(96, 165, 250, 0.5);
  box-shadow: 0 0 0 1px rgba(96, 165, 250, 0.2);
}

/* Action Bar */
.action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.5rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-family: var(--font-headline);
  font-size: 10px;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: color 0.2s;
}

.remember-me:hover {
  color: var(--text-white);
}

.checkbox {
  width: 14px;
  height: 14px;
  accent-color: var(--color-primary);
  cursor: pointer;
}

.reset-link {
  font-family: var(--font-headline);
  font-size: 10px;
  color: var(--color-primary);
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: opacity 0.2s;
}

.reset-link:hover {
  opacity: 1;
}

/* Submit Button */
.submit-btn {
  width: 100%;
  padding: 1rem;
  background-color: var(--color-primary);
  color: var(--bg-card);
  font-family: var(--font-headline);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background-color: rgba(96, 165, 250, 0.9);
  box-shadow: 0 0 25px rgba(96, 165, 250, 0.3);
}

.submit-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-icon {
  width: 16px;
  height: 16px;
}

/* Footer Notice */
.footer-notice {
  margin-top: 2rem;
  text-align: center;
  padding: 0 1rem;
}

.footer-notice p {
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  line-height: 1.6;
}

/* Background Glow */
.bg-glow {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.glow {
  position: absolute;
  width: 40%;
  height: 40%;
  border-radius: 50%;
  filter: blur(120px);
}

.glow-top-left {
  top: -10%;
  left: -10%;
  background-color: rgba(96, 165, 250, 0.05);
}

.glow-bottom-right {
  bottom: -10%;
  right: -10%;
  background-color: rgba(30, 58, 138, 0.1);
}
</style>
