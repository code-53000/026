const STORAGE_KEYS = {
  KITES: 'kite-flyer-kites',
  FLIGHTS: 'kite-flyer-flights',
  CRAFT_PROCESSES: 'kite-flyer-craft-processes',
  CRAFT_TEMPLATES: 'kite-flyer-craft-templates',
};

export function loadFromStorage<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveToStorage<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('保存数据失败:', error);
  }
}

export function loadKites() {
  return loadFromStorage(STORAGE_KEYS.KITES) as unknown[];
}

export function saveKites(data: unknown[]) {
  saveToStorage(STORAGE_KEYS.KITES, data);
}

export function loadFlights() {
  return loadFromStorage(STORAGE_KEYS.FLIGHTS) as unknown[];
}

export function saveFlights(data: unknown[]) {
  saveToStorage(STORAGE_KEYS.FLIGHTS, data);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function loadCraftProcesses() {
  return loadFromStorage(STORAGE_KEYS.CRAFT_PROCESSES) as unknown[];
}

export function saveCraftProcesses(data: unknown[]) {
  saveToStorage(STORAGE_KEYS.CRAFT_PROCESSES, data);
}

export function loadCraftTemplates() {
  return loadFromStorage(STORAGE_KEYS.CRAFT_TEMPLATES) as unknown[];
}

export function saveCraftTemplates(data: unknown[]) {
  saveToStorage(STORAGE_KEYS.CRAFT_TEMPLATES, data);
}
