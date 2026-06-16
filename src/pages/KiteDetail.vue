<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft, Pencil, Trash2, Plus, Calendar, Ruler, Wrench, Wind, MapPin, Clock, Star } from 'lucide-vue-next';
import { useKiteStore } from '@/composables/useKiteStore';
import { useFlightStore } from '@/composables/useFlightStore';
import { formatWingspan, formatDate, formatDuration, formatPerformance, getKiteTypeEmoji, formatWindLevel, getWindEmoji } from '@/utils/format';

const route = useRoute();
const router = useRouter();
const kiteStore = useKiteStore();
const flightStore = useFlightStore();

const kiteId = computed(() => route.params.id as string);
const kite = computed(() => kiteStore.getKiteById(kiteId.value));
const flights = computed(() => flightStore.getFlightsByKiteId(kiteId.value));

const avgPerformance = computed(() => {
  if (flights.value.length === 0) return 0;
  const total = flights.value.reduce((sum, f) => sum + f.performance, 0);
  return Math.round((total / flights.value.length) * 10) / 10;
});

const totalDuration = computed(() => {
  return flights.value.reduce((sum, f) => sum + f.duration, 0);
});

if (!kite.value) {
  router.push('/kites');
}

function goBack() {
  router.back();
}

function editKite() {
  router.push(`/kites/${kiteId.value}/edit`);
}

function deleteKite() {
  if (confirm('确定要删除这只风筝吗？相关的放飞记录也会被删除。')) {
    flightStore.deleteFlightsByKiteId(kiteId.value);
    kiteStore.deleteKite(kiteId.value);
    router.push('/kites');
  }
}

function addFlight() {
  router.push({ path: '/flights/new', query: { kiteId: kiteId.value } });
}

function editFlight(id: string) {
  router.push(`/flights/${id}/edit`);
}

function deleteFlight(id: string) {
  if (confirm('确定要删除这条放飞记录吗？')) {
    flightStore.deleteFlight(id);
  }
}
</script>

<template>
  <div v-if="kite">
    <button
      @click="goBack"
      class="flex items-center gap-2 text-ink-light hover:text-primary mb-6 transition-colors"
    >
      <ArrowLeft class="w-5 h-5" />
      返回列表
    </button>

    <div class="bg-white rounded-xl shadow-soft border border-primary/5 overflow-hidden mb-6">
      <div class="bg-gradient-to-br from-primary/10 to-secondary/10 p-8">
        <div class="flex flex-col md:flex-row md:items-center gap-6">
          <div class="text-7xl text-center md:text-left">{{ getKiteTypeEmoji(kite.type) }}</div>
          <div class="flex-1 text-center md:text-left">
            <h1 class="text-3xl font-serif font-bold text-ink">{{ kite.name }}</h1>
            <span class="inline-block mt-2 px-4 py-1 bg-white/80 rounded-full text-sm text-secondary font-medium">
              {{ kite.type }}
            </span>
            <div class="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
              <span
                :class="[
                  'inline-block px-4 py-1.5 rounded-full text-sm font-medium',
                  kite.suitableWindLevel.includes('1-2') ? 'bg-green-100 text-green-700' :
                  kite.suitableWindLevel.includes('3-4') ? 'bg-blue-100 text-blue-700' :
                  kite.suitableWindLevel.includes('5-6') ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                ]"
              >
                适合 {{ kite.suitableWindLevel }}
              </span>
            </div>
          </div>
          <div class="flex gap-3 justify-center md:justify-start">
            <button
              @click="editKite"
              class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Pencil class="w-4 h-4" />
              编辑
            </button>
            <button
              @click="deleteKite"
              class="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 class="w-4 h-4" />
              删除
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
        <div class="text-center">
          <div class="flex items-center justify-center gap-2 text-primary mb-1">
            <Ruler class="w-5 h-5" />
            <span class="text-2xl font-bold text-ink">{{ formatWingspan(kite.wingspan) }}</span>
          </div>
          <p class="text-sm text-ink-light">翼展</p>
        </div>
        <div class="text-center">
          <div class="flex items-center justify-center gap-2 text-secondary mb-1">
            <Wrench class="w-5 h-5" />
            <span class="text-2xl font-bold text-ink">{{ kite.repairCount }}</span>
          </div>
          <p class="text-sm text-ink-light">修复次数</p>
        </div>
        <div class="text-center">
          <div class="flex items-center justify-center gap-2 text-accent mb-1">
            <Calendar class="w-5 h-5" />
            <span class="text-2xl font-bold text-ink">{{ formatDate(kite.madeDate) }}</span>
          </div>
          <p class="text-sm text-ink-light">制作日期</p>
        </div>
        <div class="text-center">
          <div class="flex items-center justify-center gap-2 text-primary mb-1">
            <Wind class="w-5 h-5" />
            <span class="text-2xl font-bold text-ink">{{ kite.frameMaterial }}</span>
          </div>
          <p class="text-sm text-ink-light">骨架材料</p>
        </div>
      </div>

      <div class="border-t border-primary/10 p-6" v-if="kite.notes">
        <h3 class="font-serif font-semibold text-ink mb-3">备注说明</h3>
        <p class="text-ink-light whitespace-pre-wrap">{{ kite.notes }}</p>
      </div>
    </div>

    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-xl font-serif font-bold text-ink">放飞记录</h2>
        <div class="flex items-center gap-4 text-sm text-ink-light mt-1">
          <span>共 {{ flights.length }} 次放飞</span>
          <span v-if="flights.length > 0">
            平均表现: <span class="text-accent font-medium">{{ avgPerformance }}</span>
          </span>
          <span v-if="flights.length > 0">
            总时长: <span class="text-primary font-medium">{{ formatDuration(totalDuration) }}</span>
          </span>
        </div>
      </div>
      <button
        @click="addFlight"
        class="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
      >
        <Plus class="w-4 h-4" />
        记录放飞
      </button>
    </div>

    <div v-if="flights.length > 0" class="space-y-4">
      <div
        v-for="flight in flights"
        :key="flight.id"
        class="bg-white rounded-xl p-5 shadow-soft border border-primary/5 hover:shadow-hover transition-all"
      >
        <div class="flex flex-col md:flex-row md:items-center gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-2xl">{{ getWindEmoji(flight.windLevel) }}</span>
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-medium text-ink">{{ formatDate(flight.date) }}</span>
                  <span class="text-accent">{{ formatPerformance(flight.performance) }}</span>
                </div>
                <div class="flex flex-wrap items-center gap-4 text-sm text-ink-light mt-1">
                  <span class="flex items-center gap-1">
                    <Wind class="w-4 h-4" />
                    {{ formatWindLevel(flight.windLevel) }}
                  </span>
                  <span class="flex items-center gap-1">
                    <MapPin class="w-4 h-4" />
                    {{ flight.location }}
                  </span>
                  <span class="flex items-center gap-1">
                    <Clock class="w-4 h-4" />
                    {{ formatDuration(flight.duration) }}
                  </span>
                </div>
              </div>
            </div>
            <p v-if="flight.notes" class="text-sm text-ink-light ml-11">{{ flight.notes }}</p>
          </div>
          <div class="flex gap-2 ml-11 md:ml-0">
            <button
              @click="editFlight(flight.id)"
              class="px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              编辑
            </button>
            <button
              @click="deleteFlight(flight.id)"
              class="px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12 bg-white rounded-xl border border-primary/5">
      <div class="text-5xl mb-3">🌬️</div>
      <h3 class="text-lg font-serif font-semibold text-ink mb-2">还没有放飞记录</h3>
      <p class="text-ink-light mb-4">开始记录这只风筝的第一次飞行吧</p>
      <button
        @click="addFlight"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
      >
        <Plus class="w-4 h-4" />
        记录第一次放飞
      </button>
    </div>
  </div>
</template>
