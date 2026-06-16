<script setup lang="ts">
import { computed } from 'vue';
import { Scatter } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  data: { windLevel: number; avgPerformance: number }[];
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '风力与飞行表现关联',
});

const chartData = computed(() => ({
  datasets: [
    {
      label: '飞行表现',
      data: props.data.map((d) => ({ x: d.windLevel, y: d.avgPerformance })),
      backgroundColor: 'rgba(139, 90, 43, 0.8)',
      pointRadius: 8,
      pointHoverRadius: 10,
      showLine: true,
      borderColor: '#8B5A2B',
      borderWidth: 2,
      tension: 0.3,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
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
      borderColor: 'rgba(139, 90, 43, 0.3)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: function(context: { parsed: { x: number; y: number } }) {
          return `${context.parsed.x}级风力: 平均${context.parsed.y}星`;
        }
      }
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: '风力等级',
        color: '#2C3E50',
      },
      min: 0,
      max: 13,
      grid: {
        color: 'rgba(139, 90, 43, 0.1)',
      },
      ticks: {
        color: '#5D6D7E',
        font: {
          size: 12,
        },
        stepSize: 1,
      },
    },
    y: {
      title: {
        display: true,
        text: '平均表现（星）',
        color: '#2C3E50',
      },
      beginAtZero: true,
      max: 5,
      grid: {
        color: 'rgba(139, 90, 43, 0.1)',
      },
      ticks: {
        color: '#5D6D7E',
        font: {
          size: 12,
        },
        stepSize: 1,
      },
    },
  },
};
</script>

<template>
  <div class="bg-white rounded-xl p-6 shadow-soft border border-primary/5">
    <div class="h-64">
      <Scatter :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
