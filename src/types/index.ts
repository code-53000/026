export type KiteType = '沙燕' | '蝴蝶' | '金鱼' | '老鹰' | '软体' | '其他';

export type WindLevelRange = '1-2级轻风' | '3-4级和风' | '5-6级清劲风' | '7级以上强风';

export type PerformanceRating = 1 | 2 | 3 | 4 | 5;

export interface Kite {
  id: string;
  name: string;
  type: KiteType;
  frameMaterial: string;
  wingspan: number;
  madeDate: string;
  suitableWindLevel: WindLevelRange;
  repairCount: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Flight {
  id: string;
  kiteId: string;
  date: string;
  windLevel: number;
  location: string;
  duration: number;
  performance: PerformanceRating;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface FilterOptions {
  kiteType?: KiteType;
  suitableWindLevel?: WindLevelRange;
  performance?: PerformanceRating;
  location?: string;
  searchText?: string;
}

export const KITE_TYPES: KiteType[] = ['沙燕', '蝴蝶', '金鱼', '老鹰', '软体', '其他'];

export const WIND_LEVEL_RANGES: WindLevelRange[] = ['1-2级轻风', '3-4级和风', '5-6级清劲风', '7级以上强风'];

export const FRAME_MATERIALS = ['竹子', '碳杆', '玻璃纤维', '其他'];

export const WIND_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
