<script setup lang="ts">
import { Search, X, Filter } from 'lucide-vue-next';
import type { KiteType, PerformanceRating } from '@/types';
import { KITE_TYPES } from '@/types';

interface Props {
  searchText: string;
  selectedType: KiteType | undefined;
  selectedPerformance: PerformanceRating | undefined;
  location: string;
  hasActiveFilters: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:searchText': [value: string];
  'update:selectedType': [value: KiteType | undefined];
  'update:selectedPerformance': [value: PerformanceRating | undefined];
  'update:location': [value: string];
  'clear': [];
}>();

const performanceOptions: { value: PerformanceRating; label: string }[] = [
  { value: 5, label: '★★★★★ 完美' },
  { value: 4, label: '★★★★☆ 很好' },
  { value: 3, label: '★★★☆☆ 一般' },
  { value: 2, label: '★★☆☆☆ 较差' },
  { value: 1, label: '★☆☆☆☆ 很差' },
];
</script>

<template>
  <div class="bg-white rounded-xl p-5 shadow-soft mb-6 border border-primary/5">
    <div class="flex items-center gap-2 mb-4">
      <Filter class="w-5 h-5 text-accent" />
      <h3 class="font-serif font-semibold text-ink">筛选条件</h3>
      <button
        v-if="hasActiveFilters"
        @click="emit('clear')"
        class="ml-auto flex items-center gap-1 text-sm text-accent hover:text-accent-dark transition-colors"
      >
        <X class="w-4 h-4" />
        清除筛选
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-light" />
        <input
          type="text"
          :value="searchText"
          @input="emit('update:searchText', ($event.target as HTMLInputElement).value)"
          placeholder="搜索地点、备注..."
          class="w-full pl-10 pr-4 py-2.5 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-ink placeholder:text-ink-light"
        />
      </div>

      <div>
        <select
          :value="selectedType || ''"
          @change="emit('update:selectedType', ($event.target as HTMLSelectElement).value as KiteType || undefined)"
          class="w-full px-4 py-2.5 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-ink bg-white"
        >
          <option value="">全部风筝类型</option>
          <option v-for="type in KITE_TYPES" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>

      <div>
        <select
          :value="selectedPerformance || ''"
          @change="emit('update:selectedPerformance', Number(($event.target as HTMLSelectElement).value) as PerformanceRating || undefined)"
          class="w-full px-4 py-2.5 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-ink bg-white"
        >
          <option value="">全部飞行表现</option>
          <option v-for="opt in performanceOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>

      <div>
        <input
          type="text"
          :value="location"
          @input="emit('update:location', ($event.target as HTMLInputElement).value)"
          placeholder="按地点筛选"
          class="w-full px-4 py-2.5 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-ink placeholder:text-ink-light"
        />
      </div>
    </div>
  </div>
</template>
