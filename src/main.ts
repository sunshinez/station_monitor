import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/css/main.css'
import { useThemeStore } from './stores/theme'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Apply saved theme immediately before mount
const themeStore = useThemeStore()
themeStore.applyTheme(themeStore.currentTheme)

app.mount('#app')
