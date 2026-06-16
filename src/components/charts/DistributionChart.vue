<script setup lang="ts">
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  data: { level: number; count: number }[];
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '风力档位分布',
});

const windLevelColors = [
  'rgba(144, 238, 144, 0.8)',
  'rgba(144, 238, 144, 0.8)',
  'rgba(135, 206, 235, 0.8)',
  'rgba(135, 206, 235, 0.8)',
  'rgba(255, 215, 0, 0.8)',
  'rgba(255, 215, 0, 0.8)',
  'rgba(255, 99, 71, 0.8)',
  'rgba(255, 99, 71, 0.8)',
  'rgba(255, 69, 0, 0.8)',
  'rgba(255, 69, 0, 0.8)',
  'rgba(139, 0, 0, 0.8)',
  'rgba(139, 0, 0, 0.8)',
];

const chartData = computed(() => ({
  labels: props.data.map((d) => `${d.level}级`),
  datasets: [
    {
      data: props.data.map((d) => d.count),
      backgroundColor: props.data.map((d) => windLevelColors[d.level - 1] || 'rgba(155, 89, 182, 0.8)'),
      borderColor: '#fff',
      borderWidth: 3,
      hoverOffset: 10,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '60%',
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        color: '#2C3E50',
        font: {
          size: 12,
        },
        usePointStyle: true,
        padding: 15,
      },
    },
    title: {
      display: true,
      text: props.title,
      font: {
        family: "'Noto Serif SC', serif",
        size: 16,
        weight: 600,
      },
      color: '#2C3E50',
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#2C3E50',
      bodyColor: '#5D6D7E',
      borderColor: 'rgba(91, 155, 213, 0.3)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: function(context: { label: string; parsed: number; dataset: { data: number[] } }) {
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
          const percentage = ((context.parsed / total) * 100).toFixed(1);
          return `${context.label}: ${context.parsed}次 (${percentage}%)`;
        }
      }
    },
  },
};
</script>

<template>
  <div class="bg-white rounded-xl p-6 shadow-soft border border-primary/5">
    <div class="h-64">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
