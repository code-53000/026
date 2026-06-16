<script setup lang="ts">
import { computed } from 'vue';
import { Check, Clock, Package } from 'lucide-vue-next';
import type { CraftProcess } from '@/types';
import { useCraftStore } from '@/composables/useCraftStore';
import { formatDuration } from '@/utils/format';

interface Props {
  process: CraftProcess;
  compact?: boolean;
}

const props = defineProps<Props>();
const craftStore = useCraftStore();

const sortedSteps = computed(() => craftStore.getSortedSteps(props.process));
const progress = computed(() => craftStore.getProgress(props.process));
const totalDuration = computed(() => craftStore.getTotalDuration(props.process));
const completedDuration = computed(() => craftStore.getCompletedDuration(props.process));
const allMaterials = computed(() => craftStore.getAllMaterials(props.process));

const statusText = computed(() => {
  if (progress.value.total === 0) return '尚未开始';
  if (progress.value.percentage === 100) return '制作完成';
  if (progress.value.percentage === 0) return '准备开始';
  return `进行中 ${progress.value.percentage}%`;
});

const statusColor = computed(() => {
  if (progress.value.percentage === 100) return 'bg-green-500';
  if (progress.value.percentage === 0) return 'bg-gray-400';
  return 'bg-accent';
});
</script>

<template>
  <div class="bg-white rounded-xl shadow-soft border border-primary/5 overflow-hidden">
    <div class="bg-gradient-to-br from-secondary/10 to-accent/10 p-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-serif font-bold text-lg text-ink flex items-center gap-2">
          <span class="text-2xl">📜</span>
          制作进度
        </h3>
        <span
          :class="[
            'px-3 py-1 rounded-full text-sm font-medium text-white',
            statusColor,
          ]"
        >
          {{ statusText }}
        </span>
      </div>

      <div class="relative h-3 bg-white/60 rounded-full overflow-hidden">
        <div
          :class="['h-full rounded-full transition-all duration-500', statusColor]"
          :style="{ width: `${progress.percentage}%` }"
        />
      </div>
      <p class="text-sm text-ink-light mt-2">
        已完成 {{ progress.completed }} / {{ progress.total }} 道工序
      </p>
    </div>

    <div v-if="!compact" class="grid grid-cols-2 md:grid-cols-3 gap-4 p-5 border-t border-primary/5">
      <div class="text-center">
        <div class="flex items-center justify-center gap-1.5 text-accent mb-1">
          <Clock class="w-5 h-5" />
          <span class="text-xl font-bold text-ink">{{ formatDuration(totalDuration) || '—' }}</span>
        </div>
        <p class="text-xs text-ink-light">预计总耗时</p>
      </div>
      <div class="text-center">
        <div class="flex items-center justify-center gap-1.5 text-green-600 mb-1">
          <Check class="w-5 h-5" />
          <span class="text-xl font-bold text-ink">{{ formatDuration(completedDuration) || '—' }}</span>
        </div>
        <p class="text-xs text-ink-light">已投入时间</p>
      </div>
      <div class="text-center col-span-2 md:col-span-1">
        <div class="flex items-center justify-center gap-1.5 text-secondary mb-1">
          <Package class="w-5 h-5" />
          <span class="text-xl font-bold text-ink">{{ allMaterials.length }}</span>
        </div>
        <p class="text-xs text-ink-light">使用材料种类</p>
      </div>
    </div>

    <div v-if="sortedSteps.length > 0" class="border-t border-primary/5">
      <div class="px-5 py-3 bg-paper-dark/50">
        <p class="text-sm font-medium text-ink">工序时间线</p>
      </div>
      <div class="p-5">
        <div class="relative">
          <div
            class="absolute left-3.5 top-0 bottom-0 w-0.5 bg-primary/20"
            aria-hidden="true"
          />
          <div class="space-y-3">
            <div
              v-for="(step, idx) in sortedSteps"
              :key="step.id"
              class="relative flex items-start gap-3"
            >
              <div
                :class="[
                  'relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0',
                  step.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-white border-primary/30 text-ink-light',
                ]"
              >
                <Check v-if="step.completed" class="w-4 h-4" />
                <span v-else>{{ idx + 1 }}</span>
              </div>
              <div class="flex-1 min-w-0 pt-0.5">
                <div class="flex items-center gap-2 flex-wrap">
                  <span
                    :class="[
                      'font-medium text-sm',
                      step.completed ? 'text-ink-light line-through' : 'text-ink',
                    ]"
                  >
                    {{ step.name || '未命名工序' }}
                  </span>
                  <span v-if="step.durationMinutes > 0" class="text-xs text-ink-light">
                    · {{ formatDuration(step.durationMinutes) }}
                  </span>
                </div>
                <p
                  v-if="step.description"
                  class="text-xs text-ink-light mt-0.5 line-clamp-2"
                >
                  {{ step.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
