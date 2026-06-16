import { ref, computed } from 'vue';
import type { FilterOptions, KiteType, WindLevelRange, PerformanceRating } from '@/types';

export function useFilter() {
  const filters = ref<FilterOptions>({
    kiteType: undefined,
    suitableWindLevel: undefined,
    performance: undefined,
    location: undefined,
    searchText: '',
  });

  const hasActiveFilters = computed(() => {
    return (
      filters.value.kiteType !== undefined ||
      filters.value.suitableWindLevel !== undefined ||
      filters.value.performance !== undefined ||
      (filters.value.location !== undefined && filters.value.location !== '') ||
      (filters.value.searchText !== undefined && filters.value.searchText !== '')
    );
  });

  function setKiteType(type: KiteType | undefined) {
    filters.value.kiteType = type;
  }

  function setSuitableWindLevel(level: WindLevelRange | undefined) {
    filters.value.suitableWindLevel = level;
  }

  function setPerformance(rating: PerformanceRating | undefined) {
    filters.value.performance = rating;
  }

  function setLocation(location: string | undefined) {
    filters.value.location = location;
  }

  function setSearchText(text: string) {
    filters.value.searchText = text;
  }

  function clearFilters() {
    filters.value = {
      kiteType: undefined,
      suitableWindLevel: undefined,
      performance: undefined,
      location: undefined,
      searchText: '',
    };
  }

  return {
    filters,
    hasActiveFilters,
    setKiteType,
    setSuitableWindLevel,
    setPerformance,
    setLocation,
    setSearchText,
    clearFilters,
  };
}
