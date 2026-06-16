<script setup lang="ts">
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  data: { month: string; count: number }[];
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '放飞次数趋势',
});

const chartData = computed(() => ({
  labels: props.data.map((d) => d.month),
  datasets: [
    {
      label: '放飞次数',
      data: props.data.map((d) => d.count),
      borderColor: '#5B9BD5',
      backgroundColor: 'rgba(91, 155, 213, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#5B9BD5',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
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
      beginAtZero: true,
      grid: {
        color: 'rgba(91, 155, 213, 0.1)',
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
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
