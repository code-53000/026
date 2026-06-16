<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Pencil, Trash2, Wind, MapPin, Clock } from 'lucide-vue-next';
import type { Flight, Kite } from '@/types';
import { formatDate, formatDuration, formatPerformance, formatWindLevel, getWindEmoji, getKiteTypeEmoji } from '@/utils/format';

interface Props {
  flight: Flight;
  kite?: Kite;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  edit: [id: string];
  delete: [id: string];
}>();

const router = useRouter();

const performanceColor = computed(() => {
  if (props.flight.performance >= 4) return 'text-green-500';
  if (props.flight.performance >= 3) return 'text-yellow-500';
  return 'text-red-500';
});

function viewKite() {
  if (props.kite) {
    router.push(`/kites/${props.kite.id}`);
  }
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-soft hover:shadow-hover transition-all duration-300 border border-primary/5 overflow-hidden animate-slide-up">
    <div class="p-5">
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0 text-center">
          <div class="text-4xl mb-1">{{ getWindEmoji(flight.windLevel) }}</div>
          <div class="text-xs text-ink-light">{{ formatWindLevel(flight.windLevel) }}</div>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3 mb-2">
            <h4 class="font-serif font-semibold text-ink">{{ formatDate(flight.date) }}</h4>
            <span :class="['text-lg', performanceColor]">{{ formatPerformance(flight.performance) }}</span>
          </div>

          <div
            v-if="kite"
            class="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full mb-3 cursor-pointer hover:bg-primary/10 transition-colors"
            @click="viewKite"
          >
            <span class="text-lg">{{ getKiteTypeEmoji(kite.type) }}</span>
            <span class="text-sm font-medium text-primary">{{ kite.name }}</span>
          </div>

          <div class="flex flex-wrap items-center gap-4 text-sm text-ink-light">
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

          <p v-if="flight.notes" class="mt-3 text-sm text-ink-light whitespace-pre-wrap line-clamp-2">
            {{ flight.notes }}
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <button
            @click="emit('edit', flight.id)"
            class="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            <Pencil class="w-4 h-4" />
          </button>
          <button
            @click="emit('delete', flight.id)"
            class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
