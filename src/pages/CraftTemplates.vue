<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import CraftTemplateSelector from '@/components/craft/CraftTemplateSelector.vue';

const router = useRouter();

function goBack() {
  router.back();
}
</script>

<template>
  <div>
    <button
      @click="goBack"
      class="flex items-center gap-2 text-ink-light hover:text-primary mb-6 transition-colors"
    >
      <ArrowLeft class="w-5 h-5" />
      返回
    </button>

    <div class="mb-6">
      <h1 class="text-2xl font-serif font-bold text-ink flex items-center gap-2">
        <span class="text-3xl">📋</span>
        工序模板管理
      </h1>
      <p class="text-ink-light mt-1">
        创建和管理不同类型风筝的制作工序模板，下次制作同类风筝时可直接复用
      </p>
    </div>

    <CraftTemplateSelector mode="manage" />
  </div>
</template>
