<script setup lang="ts">
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  data: { kiteName: string; avgPerformance: number; flightCount: number }[];
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '风筝飞行表现对比',
});

const chartData = computed(() => ({
  labels: props.data.map((d) => d.kiteName),
  datasets: [
    {
      label: '平均表现',
      data: props.data.map((d) => d.avgPerformance),
      backgroundColor: 'rgba(230, 126, 34, 0.8)',
      borderRadius: 6,
      yAxisID: 'y',
    },
    {
      label: '放飞次数',
      data: props.data.map((d) => d.flightCount),
      backgroundColor: 'rgba(91, 155, 213, 0.8)',
      borderRadius: 6,
      yAxisID: 'y1',
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#2C3E50',
        font: {
          size: 12,
        },
        usePointStyle: true,
        padding: 20,
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
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#5D6D7E',
        font: {
          size: 12,
        },
      },
    },
    y: {
      type: 'linear' as const,
      display: true,
      position: 'left' as const,
      beginAtZero: true,
      max: 5,
      title: {
        display: true,
        text: '平均表现（星）',
        color: '#E67E22',
      },
      grid: {
        color: 'rgba(230, 126, 34, 0.1)',
      },
      ticks: {
        color: '#5D6D7E',
        font: {
          size: 12,
        },
      },
    },
    y1: {
      type: 'linear' as const,
      display: true,
      position: 'right' as const,
      beginAtZero: true,
      title: {
        display: true,
        text: '放飞次数',
        color: '#5B9BD5',
      },
      grid: {
        drawOnChartArea: false,
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
    <div class="h-72">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
