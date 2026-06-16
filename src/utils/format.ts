import type { PerformanceRating } from '@/types';

export function formatDate(date: string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatPerformance(rating: PerformanceRating): string {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}分钟`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
}

export function formatWingspan(cm: number): string {
  if (cm >= 100) {
    const meters = (cm / 100).toFixed(1);
    return `${meters}米`;
  }
  return `${cm}厘米`;
}

export function formatWindLevel(level: number): string {
  const descriptions: Record<number, string> = {
    1: '1级（软风）',
    2: '2级（轻风）',
    3: '3级（微风）',
    4: '4级（和风）',
    5: '5级（清劲风）',
    6: '6级（强风）',
    7: '7级（疾风）',
    8: '8级（大风）',
    9: '9级（烈风）',
    10: '10级（狂风）',
    11: '11级（暴风）',
    12: '12级（飓风）',
  };
  return descriptions[level] || `${level}级`;
}

export function getKiteTypeEmoji(type: string): string {
  const emojis: Record<string, string> = {
    '沙燕': '🐦',
    '蝴蝶': '🦋',
    '金鱼': '🐟',
    '老鹰': '🦅',
    '软体': '🎈',
    '其他': '🪁',
  };
  return emojis[type] || '🪁';
}

export function getWindEmoji(level: number): string {
  if (level <= 2) return '🍃';
  if (level <= 4) return '🌬️';
  if (level <= 6) return '💨';
  return '🌪️';
}
