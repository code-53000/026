import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Flight, PerformanceRating } from '@/types';
import { loadFlights, saveFlights, generateId } from '@/utils/storage';
import { getCurrentMonth, getMonthKey } from '@/utils/date';
import type { FilterOptions } from '@/types';
import { useKiteStore } from './useKiteStore';

export const useFlightStore = defineStore('flights', () => {
  const flights = ref<Flight[]>(loadFlights() as Flight[]);
  const kiteStore = useKiteStore();

  const flightCount = computed(() => flights.value.length);

  const currentMonthFlights = computed(() => {
    const currentMonth = getCurrentMonth();
    return flights.value.filter((f) => getMonthKey(f.date) === currentMonth).length;
  });

  const bestPerformingKite = computed(() => {
    const kitePerformances = new Map<string, { total: number; count: number }>();

    flights.value.forEach((flight) => {
      if (!kitePerformances.has(flight.kiteId)) {
        kitePerformances.set(flight.kiteId, { total: 0, count: 0 });
      }
      const perf = kitePerformances.get(flight.kiteId)!;
      perf.total += flight.performance;
      perf.count += 1;
    });

    let bestKiteId: string | null = null;
    let bestAvg = 0;

    kitePerformances.forEach((data, kiteId) => {
      const avg = data.total / data.count;
      if (avg > bestAvg && data.count >= 2) {
        bestAvg = avg;
        bestKiteId = kiteId;
      }
    });

    if (bestKiteId) {
      return kiteStore.getKiteById(bestKiteId);
    }
    return null;
  });

  const filteredFlights = computed(() => (filters: FilterOptions) => {
    return flights.value.filter((flight) => {
      const kite = kiteStore.getKiteById(flight.kiteId);

      if (filters.kiteType && kite?.type !== filters.kiteType) return false;
      if (filters.performance && flight.performance !== filters.performance) return false;
      if (filters.location && !flight.location.includes(filters.location)) return false;
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        const matchesLocation = flight.location.toLowerCase().includes(searchLower);
        const matchesNotes = flight.notes.toLowerCase().includes(searchLower);
        const matchesKiteName = kite?.name.toLowerCase().includes(searchLower);
        if (!matchesLocation && !matchesNotes && !matchesKiteName) return false;
      }
      return true;
    });
  });

  const sortedFlights = computed(() => {
    return [...flights.value].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  function getFlightById(id: string): Flight | undefined {
    return flights.value.find((f) => f.id === id);
  }

  function getFlightsByKiteId(kiteId: string): Flight[] {
    return flights.value
      .filter((f) => f.kiteId === kiteId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  function addFlight(flightData: Omit<Flight, 'id' | 'createdAt' | 'updatedAt'>): Flight {
    const now = new Date().toISOString();
    const newFlight: Flight = {
      ...flightData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    flights.value.push(newFlight);
    saveFlights(flights.value);
    return newFlight;
  }

  function updateFlight(id: string, updates: Partial<Omit<Flight, 'id' | 'createdAt'>>): boolean {
    const index = flights.value.findIndex((f) => f.id === id);
    if (index !== -1) {
      flights.value[index] = {
        ...flights.value[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      saveFlights(flights.value);
      return true;
    }
    return false;
  }

  function deleteFlight(id: string): boolean {
    const index = flights.value.findIndex((f) => f.id === id);
    if (index !== -1) {
      flights.value.splice(index, 1);
      saveFlights(flights.value);
      return true;
    }
    return false;
  }

  function deleteFlightsByKiteId(kiteId: string): void {
    flights.value = flights.value.filter((f) => f.kiteId !== kiteId);
    saveFlights(flights.value);
  }

  function getFlightsByPerformance(performance: PerformanceRating): Flight[] {
    return flights.value.filter((f) => f.performance === performance);
  }

  function getMonthlyFlightCounts(): { month: string; count: number }[] {
    const monthlyCounts = new Map<string, number>();

    flights.value.forEach((flight) => {
      const month = getMonthKey(flight.date);
      monthlyCounts.set(month, (monthlyCounts.get(month) || 0) + 1);
    });

    return Array.from(monthlyCounts.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  function getWindLevelDistribution(): { level: number; count: number }[] {
    const distribution = new Map<number, number>();

    flights.value.forEach((flight) => {
      distribution.set(flight.windLevel, (distribution.get(flight.windLevel) || 0) + 1);
    });

    return Array.from(distribution.entries())
      .map(([level, count]) => ({ level, count }))
      .sort((a, b) => a.level - b.level);
  }

  function getKitePerformanceData(): { kiteName: string; avgPerformance: number; flightCount: number }[] {
    const kiteStats = new Map<string, { total: number; count: number }>();

    flights.value.forEach((flight) => {
      const kite = kiteStore.getKiteById(flight.kiteId);
      if (kite) {
        if (!kiteStats.has(flight.kiteId)) {
          kiteStats.set(flight.kiteId, { total: 0, count: 0 });
        }
        const stats = kiteStats.get(flight.kiteId)!;
        stats.total += flight.performance;
        stats.count += 1;
      }
    });

    return Array.from(kiteStats.entries()).map(([kiteId, stats]) => {
      const kite = kiteStore.getKiteById(kiteId)!;
      return {
        kiteName: kite.name,
        avgPerformance: Math.round((stats.total / stats.count) * 10) / 10,
        flightCount: stats.count,
      };
    });
  }

  function getWindPerformanceData(): { windLevel: number; avgPerformance: number }[] {
    const windStats = new Map<number, { total: number; count: number }>();

    flights.value.forEach((flight) => {
      if (!windStats.has(flight.windLevel)) {
        windStats.set(flight.windLevel, { total: 0, count: 0 });
      }
      const stats = windStats.get(flight.windLevel)!;
      stats.total += flight.performance;
      stats.count += 1;
    });

    return Array.from(windStats.entries())
      .map(([windLevel, stats]) => ({
        windLevel,
        avgPerformance: Math.round((stats.total / stats.count) * 10) / 10,
      }))
      .sort((a, b) => a.windLevel - b.windLevel);
  }

  return {
    flights,
    flightCount,
    currentMonthFlights,
    bestPerformingKite,
    filteredFlights,
    sortedFlights,
    getFlightById,
    getFlightsByKiteId,
    addFlight,
    updateFlight,
    deleteFlight,
    deleteFlightsByKiteId,
    getFlightsByPerformance,
    getMonthlyFlightCounts,
    getWindLevelDistribution,
    getKitePerformanceData,
    getWindPerformanceData,
  };
});
