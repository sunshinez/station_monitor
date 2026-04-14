<template>
  <div class="app-layout">
    <GlobalHeader />
    <AppSidebar />
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '@/components/layout/GlobalHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  background-color: var(--bg-primary, #0B0B10);
}

.app-main {
  margin-left: 256px;
  padding-top: 64px;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

@media (max-width: 1024px) {
  .app-main {
    margin-left: 0;
  }
}
</style>
