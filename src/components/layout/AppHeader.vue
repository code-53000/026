<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { Home, Wind, FileText, BarChart3, Menu, X } from 'lucide-vue-next';
import { ref } from 'vue';

const router = useRouter();
const route = useRoute();
const mobileMenuOpen = ref(false);

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/kites', label: '风筝档案', icon: Wind },
  { path: '/flights', label: '放飞日志', icon: FileText },
  { path: '/analytics', label: '数据分析', icon: BarChart3 },
];

function isActive(path: string) {
  return route.path === path;
}

function navigate(path: string) {
  router.push(path);
  mobileMenuOpen.value = false;
}
</script>

<template>
  <header class="bg-white/80 backdrop-blur-md border-b border-primary/10 sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-3 cursor-pointer" @click="navigate('/')">
          <span class="text-3xl animate-float">🪁</span>
          <h1 class="text-xl font-serif font-bold text-secondary">风筝飞行志</h1>
        </div>

        <nav class="hidden md:flex items-center gap-1">
          <button
            v-for="item in navItems"
            :key="item.path"
            @click="navigate(item.path)"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
              isActive(item.path)
                ? 'bg-primary text-white shadow-soft'
                : 'text-ink hover:bg-primary/10 text-ink',
            ]"
          >
            <component :is="item.icon" class="w-4 h-4" />
            <span class="text-sm font-medium">{{ item.label }}</span>
          </button>
        </nav>

        <button
          class="md:hidden p-2 rounded-lg hover:bg-primary/10 text-ink"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>
      </div>

      <div
        v-if="mobileMenuOpen"
        class="md:hidden pb-4 animate-slide-up"
      >
        <nav class="flex flex-col gap-2">
          <button
            v-for="item in navItems"
            :key="item.path"
            @click="navigate(item.path)"
            :class="[
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
              isActive(item.path)
                ? 'bg-primary text-white shadow-soft'
                : 'text-ink hover:bg-primary/10 text-ink',
            ]"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span class="font-medium">{{ item.label }}</span>
          </button>
        </nav>
      </div>
    </div>
  </header>
</template>
