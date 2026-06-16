<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Wind, FileText, BarChart3, Plus, Trophy, Calendar, Wind as WindIcon } from 'lucide-vue-next';
import { useKiteStore } from '@/composables/useKiteStore';
import { useFlightStore } from '@/composables/useFlightStore';
import StatsCard from '@/components/layout/StatsCard.vue';
import { WIND_LEVEL_RANGES } from '@/types';
import type { WindLevelRange } from '@/types';

const router = useRouter();
const kiteStore = useKiteStore();
const flightStore = useFlightStore();

const windLevelStyles: Record<WindLevelRange, { emoji: string; class: string }> = {
  '1-2级轻风': { emoji: '🍃', class: 'bg-green-100 text-green-700' },
  '3-4级和风': { emoji: '🌬️', class: 'bg-blue-100 text-blue-700' },
  '5-6级清劲风': { emoji: '💨', class: 'bg-yellow-100 text-yellow-700' },
  '7级以上强风': { emoji: '🌪️', class: 'bg-red-100 text-red-700' },
};

function navigate(path: string) {
  router.push(path);
}
</script>

<template>
  <div>
    <div class="text-center mb-12 pt-8">
      <div class="text-7xl mb-4 animate-float inline-block">🪁</div>
      <h1 class="text-4xl font-serif font-bold text-ink mb-3">风筝飞行志</h1>
      <p class="text-ink-light text-lg max-w-lg mx-auto">
        记录每一只亲手扎制的风筝，珍藏每一次乘风而起的美好时光
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <StatsCard
        title="风筝总数"
        :value="kiteStore.kiteCount"
        :icon="Wind"
        color="primary"
        subtitle="精心制作的宝贝"
      />
      <StatsCard
        title="放飞总次数"
        :value="flightStore.flightCount"
        :icon="FileText"
        color="secondary"
        subtitle="与蓝天的约会"
      />
      <StatsCard
        title="本月放飞"
        :value="flightStore.currentMonthFlights"
        :icon="Calendar"
        color="accent"
        subtitle="这个月的成果"
      />
      <StatsCard
        title="最佳表现风筝"
        :value="flightStore.bestPerformingKite?.name || '暂无'"
        :icon="Trophy"
        color="primary"
        :subtitle="flightStore.bestPerformingKite ? '平均表现最佳' : '多飞几次评选吧'"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <button
        @click="navigate('/kites/new')"
        class="group p-8 bg-gradient-to-br from-primary to-primary-dark rounded-2xl text-white shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-1 text-left"
      >
        <div class="flex items-center gap-4 mb-4">
          <div class="p-3 bg-white/20 rounded-xl">
            <Plus class="w-8 h-8" />
          </div>
          <WindIcon class="w-12 h-12 opacity-80" />
        </div>
        <h3 class="text-xl font-serif font-bold mb-2">添加新风筝</h3>
        <p class="text-white/80 text-sm">记录您最新扎制的风筝，包含样式、骨架材料、翼展等详细信息</p>
      </button>

      <button
        @click="navigate('/flights/new')"
        class="group p-8 bg-gradient-to-br from-accent to-accent-dark rounded-2xl text-white shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-1 text-left"
      >
        <div class="flex items-center gap-4 mb-4">
          <div class="p-3 bg-white/20 rounded-xl">
            <Plus class="w-8 h-8" />
          </div>
          <FileText class="w-12 h-12 opacity-80" />
        </div>
        <h3 class="text-xl font-serif font-bold mb-2">记录放飞</h3>
        <p class="text-white/80 text-sm">记下今天的风力、地点和飞行表现，积累宝贵的飞行经验</p>
      </button>

      <button
        @click="navigate('/analytics')"
        class="group p-8 bg-gradient-to-br from-secondary to-secondary-dark rounded-2xl text-white shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-1 text-left"
      >
        <div class="flex items-center gap-4 mb-4">
          <div class="p-3 bg-white/20 rounded-xl">
            <BarChart3 class="w-8 h-8" />
          </div>
          <BarChart3 class="w-12 h-12 opacity-80" />
        </div>
        <h3 class="text-xl font-serif font-bold mb-2">数据分析</h3>
        <p class="text-white/80 text-sm">通过图表查看放飞趋势，分析不同风筝的飞行表现</p>
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-soft border border-primary/5 p-6">
      <h3 class="font-serif font-semibold text-ink mb-4 flex items-center gap-2">
        <WindIcon class="w-5 h-5 text-primary" />
        今日放飞建议
      </h3>
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div class="flex-1">
          <p class="text-ink-light">
            根据您的风筝档案，以下风筝适合在不同风力条件下放飞：
          </p>
          <div class="flex flex-wrap gap-2 mt-3">
            <template v-for="range in WIND_LEVEL_RANGES" :key="range">
              <span
                v-for="kite in kiteStore.getKitesByWindLevel(range).slice(0, 3)"
                :key="kite.id"
                :class="[
                  'inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm',
                  windLevelStyles[range].class
                ]"
              >
                {{ windLevelStyles[range].emoji }} {{ kite.name }}
              </span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
