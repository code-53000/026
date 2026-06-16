<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Plus } from 'lucide-vue-next';
import { useKiteStore } from '@/composables/useKiteStore';
import { useFlightStore } from '@/composables/useFlightStore';
import { useFilter } from '@/composables/useFilter';
import FlightFilter from '@/components/flight/FlightFilter.vue';
import FlightCard from '@/components/flight/FlightCard.vue';

const router = useRouter();
const kiteStore = useKiteStore();
const flightStore = useFlightStore();
const { filters, hasActiveFilters, setKiteType, setPerformance, setLocation, setSearchText, clearFilters } = useFilter();

function getKite(kiteId: string) {
  return kiteStore.getKiteById(kiteId);
}

function handleEdit(id: string) {
  router.push(`/flights/${id}/edit`);
}

function handleDelete(id: string) {
  if (confirm('确定要删除这条放飞记录吗？')) {
    flightStore.deleteFlight(id);
  }
}

function addNewFlight() {
  router.push('/flights/new');
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-serif font-bold text-ink">放飞日志</h1>
        <p class="text-ink-light text-sm mt-1">记录每一次与风筝的蓝天之约</p>
      </div>
      <button
        @click="addNewFlight"
        class="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors shadow-soft"
      >
        <Plus class="w-5 h-5" />
        记录放飞
      </button>
    </div>

    <FlightFilter
      v-model:searchText="filters.searchText"
      v-model:selectedType="filters.kiteType"
      v-model:selectedPerformance="filters.performance"
      v-model:location="filters.location"
      :hasActiveFilters="hasActiveFilters"
      @clear="clearFilters"
    />

    <div v-if="flightStore.filteredFlights(filters).length > 0" class="space-y-4">
      <FlightCard
        v-for="flight in flightStore.filteredFlights(filters).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())"
        :key="flight.id"
        :flight="flight"
        :kite="getKite(flight.kiteId)"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <div v-else class="text-center py-16">
      <div class="text-6xl mb-4">🌬️</div>
      <h3 class="text-xl font-serif font-semibold text-ink mb-2">
        {{ hasActiveFilters ? '没有符合条件的记录' : '还没有放飞记录' }}
      </h3>
      <p class="text-ink-light mb-6">
        {{ hasActiveFilters ? '试试调整筛选条件' : '开始记录您的第一次放飞吧' }}
      </p>
      <button
        v-if="!hasActiveFilters && kiteStore.kiteCount > 0"
        @click="addNewFlight"
        class="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
      >
        <Plus class="w-5 h-5" />
        记录第一次放飞
      </button>
      <button
        v-else-if="!hasActiveFilters && kiteStore.kiteCount === 0"
        @click="router.push('/kites/new')"
        class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
      >
        <Plus class="w-5 h-5" />
        先添加一只风筝
      </button>
    </div>
  </div>
</template>
