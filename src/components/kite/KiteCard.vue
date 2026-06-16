<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Pencil, Trash2, Calendar, Ruler, Wrench } from 'lucide-vue-next';
import type { Kite } from '@/types';
import { formatWingspan, getKiteTypeEmoji, formatDate } from '@/utils/format';

interface Props {
  kite: Kite;
  flightCount?: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  edit: [id: string];
  delete: [id: string];
}>();

const router = useRouter();

function viewDetail() {
  router.push(`/kites/${props.kite.id}`);
}
</script>

<template>
  <div
    class="bg-white rounded-xl shadow-soft hover:shadow-hover transition-all duration-300 border border-primary/5 overflow-hidden group cursor-pointer animate-slide-up"
    @click="viewDetail"
  >
    <div class="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 text-center">
      <span class="text-5xl block mb-2 group-hover:scale-110 transition-transform duration-300">
        {{ getKiteTypeEmoji(kite.type) }}
      </span>
      <h3 class="font-serif font-bold text-lg text-ink">{{ kite.name }}</h3>
      <span class="inline-block mt-1 px-3 py-0.5 bg-white/80 rounded-full text-xs text-secondary font-medium">
        {{ kite.type }}
      </span>
    </div>

    <div class="p-5">
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="flex items-center gap-2 text-sm text-ink-light">
          <Ruler class="w-4 h-4 text-primary" />
          <span>{{ formatWingspan(kite.wingspan) }}</span>
        </div>
        <div class="flex items-center gap-2 text-sm text-ink-light">
          <Wrench class="w-4 h-4 text-secondary" />
          <span>修复{{ kite.repairCount }}次</span>
        </div>
        <div class="flex items-center gap-2 text-sm text-ink-light col-span-2">
          <Calendar class="w-4 h-4 text-accent" />
          <span>制作于 {{ formatDate(kite.madeDate) }}</span>
        </div>
      </div>

      <div class="mb-4">
        <span
          :class="[
            'inline-block px-3 py-1 rounded-full text-xs font-medium',
            kite.suitableWindLevel.includes('1-2') ? 'bg-green-100 text-green-700' :
            kite.suitableWindLevel.includes('3-4') ? 'bg-blue-100 text-blue-700' :
            kite.suitableWindLevel.includes('5-6') ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          ]"
        >
          {{ kite.suitableWindLevel }}
        </span>
        <span v-if="flightCount !== undefined" class="ml-2 text-xs text-ink-light">
          已放飞 {{ flightCount }} 次
        </span>
      </div>

      <div class="flex gap-2" @click.stop>
        <button
          @click="emit('edit', kite.id)"
          class="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm"
        >
          <Pencil class="w-4 h-4" />
          编辑
        </button>
        <button
          @click="emit('delete', kite.id)"
          class="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors text-sm"
        >
          <Trash2 class="w-4 h-4" />
          删除
        </button>
      </div>
    </div>
  </div>
</template>
