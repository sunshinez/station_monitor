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
  background-color: var(--gs-bg-default);
}

.app-main {
  margin-left: 240px;
  padding-top: 52px;
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
