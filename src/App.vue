<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue';
</script>

<template>
  <div class="min-h-screen bg-paper">
    <AppHeader />
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>
    <footer class="text-center py-8 text-ink-light text-sm border-t border-primary/10 mt-12">
      <p>🪁 风筝飞行志 - 记录每一只风筝的蓝天之旅</p>
      <p class="mt-1 text-xs">数据保存在您的浏览器本地，请定期备份重要数据</p>
    </footer>
  </div>
</template>