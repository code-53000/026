<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';

interface Props {
  title: string;
  value: string | number;
  icon: Component;
  color?: 'primary' | 'secondary' | 'accent';
  subtitle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
});

const colorClasses = computed(() => {
  const colors = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent',
  };
  return colors[props.color];
});
</script>

<template>
  <div class="bg-white rounded-xl p-6 shadow-soft hover:shadow-hover transition-all duration-300 border border-primary/5">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <p class="text-sm text-ink-light mb-1">{{ title }}</p>
        <p class="text-3xl font-serif font-bold text-ink animate-fade-in">{{ value }}</p>
        <p v-if="subtitle" class="text-xs text-ink-light mt-2">{{ subtitle }}</p>
      </div>
      <div :class="['p-3 rounded-xl', colorClasses]">
        <component :is="icon" class="w-6 h-6" />
      </div>
    </div>
  </div>
</template>
