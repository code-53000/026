<script setup lang="ts">
import { computed } from 'vue';
import { useFlightStore } from '@/composables/useFlightStore';
import TrendChart from '@/components/charts/TrendChart.vue';
import CompareChart from '@/components/charts/CompareChart.vue';
import DistributionChart from '@/components/charts/DistributionChart.vue';
import WindPerformanceChart from '@/components/charts/WindPerformanceChart.vue';
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-vue-next';

const flightStore = useFlightStore();

const monthlyData = computed(() => flightStore.getMonthlyFlightCounts());
const kitePerformanceData = computed(() => flightStore.getKitePerformanceData());
const windDistributionData = computed(() => flightStore.getWindLevelDistribution());
const windPerformanceData = computed(() => flightStore.getWindPerformanceData());

const hasData = computed(() => flightStore.flightCount > 0);
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-serif font-bold text-ink">数据分析</h1>
        <p class="text-ink-light text-sm mt-1">通过图表直观了解您的放飞数据</p>
      </div>
    </div>

    <div v-if="hasData">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="relative">
          <div class="absolute top-4 left-4 z-10">
            <TrendingUp class="w-5 h-5 text-primary" />
          </div>
          <TrendChart :data="monthlyData" title="月度放飞次数趋势" />
        </div>
        <div class="relative">
          <div class="absolute top-4 left-4 z-10">
            <PieChart class="w-5 h-5 text-secondary" />
          </div>
          <DistributionChart :data="windDistributionData" title="风力档位分布" />
        </div>
      </div>

      <div v-if="kitePerformanceData.length > 0" class="mb-6">
        <div class="relative">
          <div class="absolute top-4 left-4 z-10">
            <BarChart3 class="w-5 h-5 text-accent" />
          </div>
          <CompareChart :data="kitePerformanceData" title="风筝飞行表现对比" />
        </div>
      </div>

      <div v-if="windPerformanceData.length > 0">
        <div class="relative">
          <div class="absolute top-4 left-4 z-10">
            <Activity class="w-5 h-5 text-secondary" />
          </div>
          <WindPerformanceChart :data="windPerformanceData" title="风力与飞行表现关联" />
        </div>
      </div>
    </div>

    <div v-else class="text-center py-16 bg-white rounded-xl border border-primary/5">
      <div class="text-6xl mb-4">📊</div>
      <h3 class="text-xl font-serif font-semibold text-ink mb-2">还没有数据</h3>
      <p class="text-ink-light mb-6">记录几次放飞后，这里会显示精美的数据图表</p>
    </div>

    <div class="mt-8 bg-white rounded-xl shadow-soft border border-primary/5 p-6">
      <h3 class="font-serif font-semibold text-ink mb-4">数据说明</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-ink-light">
        <div>
          <h4 class="font-medium text-ink mb-2">放飞次数趋势</h4>
          <p>展示按月统计的放飞次数变化，帮助您了解自己的放飞频率。</p>
        </div>
        <div>
          <h4 class="font-medium text-ink mb-2">风力档位分布</h4>
          <p>统计不同风力等级下的放飞次数，了解您通常在什么风力下放飞。</p>
        </div>
        <div>
          <h4 class="font-medium text-ink mb-2">风筝表现对比</h4>
          <p>对比每只风筝的平均飞行表现和放飞次数，找出您的最佳搭档。</p>
        </div>
        <div>
          <h4 class="font-medium text-ink mb-2">风力与表现关联</h4>
          <p>分析不同风力下的平均飞行表现，了解您的风筝最适合的风力条件。</p>
        </div>
      </div>
    </div>
  </div>
</template>
