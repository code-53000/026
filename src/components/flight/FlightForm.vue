<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft, Save } from 'lucide-vue-next';
import type { Flight, PerformanceRating } from '@/types';
import { WIND_LEVELS } from '@/types';
import { useKiteStore } from '@/composables/useKiteStore';
import { useFlightStore } from '@/composables/useFlightStore';
import { getTodayDateString } from '@/utils/date';
import { getKiteTypeEmoji } from '@/utils/format';

const route = useRoute();
const router = useRouter();
const kiteStore = useKiteStore();
const flightStore = useFlightStore();

const isEdit = computed(() => !!route.params.id);
const flightId = computed(() => route.params.id as string);
const preSelectedKiteId = computed(() => route.query.kiteId as string);

const form = ref({
  kiteId: '',
  date: getTodayDateString(),
  windLevel: 3,
  location: '',
  duration: 60,
  performance: 4 as PerformanceRating,
  notes: '',
});

const errors = ref<Record<string, string>>({});

watch(preSelectedKiteId, (newVal) => {
  if (newVal && !isEdit.value) {
    form.value.kiteId = newVal;
  }
}, { immediate: true });

onMounted(() => {
  if (isEdit.value) {
    const flight = flightStore.getFlightById(flightId.value);
    if (flight) {
      form.value = {
        kiteId: flight.kiteId,
        date: flight.date,
        windLevel: flight.windLevel,
        location: flight.location,
        duration: flight.duration,
        performance: flight.performance,
        notes: flight.notes,
      };
    } else {
      router.push('/flights');
    }
  }
});

function validate(): boolean {
  errors.value = {};
  if (!form.value.kiteId) {
    errors.value.kiteId = '请选择风筝';
  }
  if (!form.value.location.trim()) {
    errors.value.location = '请输入放飞地点';
  }
  if (form.value.duration <= 0) {
    errors.value.duration = '飞行时长必须大于0';
  }
  return Object.keys(errors.value).length === 0;
}

function handleSubmit() {
  if (!validate()) return;

  const flightData = {
    ...form.value,
    location: form.value.location.trim(),
    notes: form.value.notes.trim(),
  };

  if (isEdit.value) {
    flightStore.updateFlight(flightId.value, flightData);
  } else {
    flightStore.addFlight(flightData as Omit<Flight, 'id' | 'createdAt' | 'updatedAt'>);
  }

  router.push('/flights');
}

function goBack() {
  router.back();
}

function setPerformance(rating: PerformanceRating) {
  form.value.performance = rating;
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <button
      @click="goBack"
      class="flex items-center gap-2 text-ink-light hover:text-primary mb-6 transition-colors"
    >
      <ArrowLeft class="w-5 h-5" />
      返回
    </button>

    <div class="bg-white rounded-xl shadow-soft border border-primary/5 overflow-hidden">
      <div class="bg-gradient-to-r from-accent/10 to-primary/10 p-6">
        <h2 class="font-serif text-2xl font-bold text-ink">
          {{ isEdit ? '编辑放飞记录' : '记录放飞' }}
        </h2>
        <p class="text-ink-light mt-1 text-sm">记录这次飞行的详细数据</p>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <div>
          <label class="block text-sm font-medium text-ink mb-2">选择风筝 *</label>
          <select
            v-model="form.kiteId"
            :class="[
              'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all bg-white',
              errors.kiteId ? 'border-red-300 focus:ring-red-200' : 'border-primary/20 focus:border-primary'
            ]"
          >
            <option value="">请选择风筝</option>
            <option v-for="kite in kiteStore.kites" :key="kite.id" :value="kite.id">
              {{ getKiteTypeEmoji(kite.type) }} {{ kite.name }}
            </option>
          </select>
          <p v-if="errors.kiteId" class="text-red-500 text-sm mt-1">{{ errors.kiteId }}</p>
          <p v-if="kiteStore.kites.length === 0" class="text-ink-light text-sm mt-1">
            还没有添加风筝，<a href="/kites/new" class="text-primary hover:underline">先去添加一只</a>
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-ink mb-2">放飞日期</label>
            <input
              v-model="form.date"
              type="date"
              class="w-full px-4 py-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-ink mb-2">实际风力</label>
            <select
              v-model.number="form.windLevel"
              class="w-full px-4 py-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-white"
            >
              <option v-for="level in WIND_LEVELS" :key="level" :value="level">{{ level }}级</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-ink mb-2">放飞地点 *</label>
            <input
              v-model="form.location"
              type="text"
              placeholder="如：奥林匹克森林公园"
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all',
                errors.location ? 'border-red-300 focus:ring-red-200' : 'border-primary/20 focus:border-primary'
              ]"
            />
            <p v-if="errors.location" class="text-red-500 text-sm mt-1">{{ errors.location }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-ink mb-2">飞行时长 (分钟) *</label>
            <input
              v-model.number="form.duration"
              type="number"
              min="1"
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all',
                errors.duration ? 'border-red-300 focus:ring-red-200' : 'border-primary/20 focus:border-primary'
              ]"
            />
            <p v-if="errors.duration" class="text-red-500 text-sm mt-1">{{ errors.duration }}</p>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-ink mb-3">飞行表现</label>
          <div class="flex gap-2">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              @click="setPerformance(star as PerformanceRating)"
              :class="[
                'text-3xl transition-all duration-200 hover:scale-110',
                form.performance >= star ? 'text-accent' : 'text-gray-300'
              ]"
            >
              ★
            </button>
          </div>
          <p class="text-sm text-ink-light mt-2">
            {{ form.performance === 5 ? '完美飞行！' :
               form.performance === 4 ? '表现很好' :
               form.performance === 3 ? '一般般' :
               form.performance === 2 ? '不太理想' : '有待改进' }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-ink mb-2">备注</label>
          <textarea
            v-model="form.notes"
            rows="4"
            placeholder="记录飞行姿态、遇到的问题、改进建议..."
            class="w-full px-4 py-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
          />
        </div>

        <div class="flex gap-4 pt-4">
          <button
            type="button"
            @click="goBack"
            class="flex-1 px-6 py-3 border border-primary/30 text-primary rounded-lg hover:bg-primary/5 transition-colors font-medium"
          >
            取消
          </button>
          <button
            type="submit"
            class="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors font-medium shadow-soft"
          >
            <Save class="w-5 h-5" />
            {{ isEdit ? '保存修改' : '保存记录' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
