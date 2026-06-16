<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Plus } from 'lucide-vue-next';
import { useKiteStore } from '@/composables/useKiteStore';
import { useFlightStore } from '@/composables/useFlightStore';
import { useFilter } from '@/composables/useFilter';
import KiteFilter from '@/components/kite/KiteFilter.vue';
import KiteCard from '@/components/kite/KiteCard.vue';

const router = useRouter();
const kiteStore = useKiteStore();
const flightStore = useFlightStore();
const { filters, hasActiveFilters, setKiteType, setSuitableWindLevel, setSearchText, clearFilters } = useFilter();

function getFlightCount(kiteId: string): number {
  return flightStore.getFlightsByKiteId(kiteId).length;
}

function handleEdit(id: string) {
  router.push(`/kites/${id}/edit`);
}

function handleDelete(id: string) {
  if (confirm('确定要删除这只风筝吗？相关的放飞记录也会被删除。')) {
    flightStore.deleteFlightsByKiteId(id);
    kiteStore.deleteKite(id);
  }
}

function addNewKite() {
  router.push('/kites/new');
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-serif font-bold text-ink">风筝档案</h1>
        <p class="text-ink-light text-sm mt-1">记录您的每一只风筝</p>
      </div>
      <button
        @click="addNewKite"
        class="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-soft"
      >
        <Plus class="w-5 h-5" />
        添加风筝
      </button>
    </div>

    <KiteFilter
      v-model:searchText="filters.searchText"
      v-model:selectedType="filters.kiteType"
      v-model:selectedWindLevel="filters.suitableWindLevel"
      :hasActiveFilters="hasActiveFilters"
      @clear="clearFilters"
    />

    <div v-if="kiteStore.filteredKites(filters).length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <KiteCard
        v-for="kite in kiteStore.filteredKites(filters)"
        :key="kite.id"
        :kite="kite"
        :flightCount="getFlightCount(kite.id)"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <div v-else class="text-center py-16">
      <div class="text-6xl mb-4">🪁</div>
      <h3 class="text-xl font-serif font-semibold text-ink mb-2">
        {{ hasActiveFilters ? '没有符合条件的风筝' : '还没有添加风筝' }}
      </h3>
      <p class="text-ink-light mb-6">
        {{ hasActiveFilters ? '试试调整筛选条件' : '开始记录您的第一只风筝吧' }}
      </p>
      <button
        v-if="!hasActiveFilters"
        @click="addNewKite"
        class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
      >
        <Plus class="w-5 h-5" />
        添加第一只风筝
      </button>
    </div>
  </div>
</template>
