import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Kite, KiteType, WindLevelRange } from '@/types';
import { loadKites, saveKites, generateId } from '@/utils/storage';
import type { FilterOptions } from '@/types';

export const useKiteStore = defineStore('kites', () => {
  const kites = ref<Kite[]>(loadKites() as Kite[]);

  const kiteCount = computed(() => kites.value.length);

  const filteredKites = computed(() => (filters: FilterOptions) => {
    return kites.value.filter((kite) => {
      if (filters.kiteType && kite.type !== filters.kiteType) return false;
      if (filters.suitableWindLevel && kite.suitableWindLevel !== filters.suitableWindLevel) return false;
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        const matchesName = kite.name.toLowerCase().includes(searchLower);
        const matchesNotes = kite.notes.toLowerCase().includes(searchLower);
        const matchesMaterial = kite.frameMaterial.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesNotes && !matchesMaterial) return false;
      }
      return true;
    });
  });

  function getKiteById(id: string): Kite | undefined {
    return kites.value.find((k) => k.id === id);
  }

  function addKite(kiteData: Omit<Kite, 'id' | 'createdAt' | 'updatedAt'>): Kite {
    const now = new Date().toISOString();
    const newKite: Kite = {
      ...kiteData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    kites.value.push(newKite);
    saveKites(kites.value);
    return newKite;
  }

  function updateKite(id: string, updates: Partial<Omit<Kite, 'id' | 'createdAt'>>): boolean {
    const index = kites.value.findIndex((k) => k.id === id);
    if (index !== -1) {
      kites.value[index] = {
        ...kites.value[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      saveKites(kites.value);
      return true;
    }
    return false;
  }

  function deleteKite(id: string): boolean {
    const index = kites.value.findIndex((k) => k.id === id);
    if (index !== -1) {
      kites.value.splice(index, 1);
      saveKites(kites.value);
      return true;
    }
    return false;
  }

  function getKitesByType(type: KiteType): Kite[] {
    return kites.value.filter((k) => k.type === type);
  }

  function getKitesByWindLevel(windLevel: WindLevelRange): Kite[] {
    return kites.value.filter((k) => k.suitableWindLevel === windLevel);
  }

  function incrementRepairCount(id: string): boolean {
    const kite = getKiteById(id);
    if (kite) {
      return updateKite(id, { repairCount: kite.repairCount + 1 });
    }
    return false;
  }

  return {
    kites,
    kiteCount,
    filteredKites,
    getKiteById,
    addKite,
    updateKite,
    deleteKite,
    getKitesByType,
    getKitesByWindLevel,
    incrementRepairCount,
  };
});
