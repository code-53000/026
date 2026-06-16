<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft, Save } from 'lucide-vue-next';
import type { Kite, KiteType, WindLevelRange } from '@/types';
import { KITE_TYPES, WIND_LEVEL_RANGES, FRAME_MATERIALS } from '@/types';
import { useKiteStore } from '@/composables/useKiteStore';
import { getTodayDateString } from '@/utils/date';

const route = useRoute();
const router = useRouter();
const kiteStore = useKiteStore();

const isEdit = computed(() => !!route.params.id);
const kiteId = computed(() => route.params.id as string);

const form = ref({
  name: '',
  type: '沙燕' as KiteType,
  frameMaterial: '竹子',
  wingspan: 100,
  madeDate: getTodayDateString(),
  suitableWindLevel: '3-4级和风' as WindLevelRange,
  repairCount: 0,
  notes: '',
});

const errors = ref<Record<string, string>>({});

onMounted(() => {
  if (isEdit.value) {
    const kite = kiteStore.getKiteById(kiteId.value);
    if (kite) {
      form.value = {
        name: kite.name,
        type: kite.type,
        frameMaterial: kite.frameMaterial,
        wingspan: kite.wingspan,
        madeDate: kite.madeDate,
        suitableWindLevel: kite.suitableWindLevel,
        repairCount: kite.repairCount,
        notes: kite.notes,
      };
    } else {
      router.push('/kites');
    }
  }
});

function validate(): boolean {
  errors.value = {};
  if (!form.value.name.trim()) {
    errors.value.name = '请输入风筝名称';
  }
  if (form.value.wingspan <= 0) {
    errors.value.wingspan = '翼展必须大于0';
  }
  return Object.keys(errors.value).length === 0;
}

function handleSubmit() {
  if (!validate()) return;

  const kiteData = {
    ...form.value,
    name: form.value.name.trim(),
    frameMaterial: form.value.frameMaterial.trim() || '其他',
    notes: form.value.notes.trim(),
  };

  if (isEdit.value) {
    kiteStore.updateKite(kiteId.value, kiteData);
  } else {
    kiteStore.addKite(kiteData as Omit<Kite, 'id' | 'createdAt' | 'updatedAt'>);
  }

  router.push('/kites');
}

function goBack() {
  router.back();
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <button
      @click="goBack"
      class="flex items-center gap-2 text-ink-light hover:text-primary mb-6 transition-colors"
    >
      <ArrowLeft class="w-5 h-5" />
      返回
    </button>

    <div class="bg-white rounded-xl shadow-soft border border-primary/5 overflow-hidden">
      <div class="bg-gradient-to-r from-primary/10 to-secondary/10 p-6">
        <h2 class="font-serif text-2xl font-bold text-ink">
          {{ isEdit ? '编辑风筝档案' : '添加新风筝' }}
        </h2>
        <p class="text-ink-light mt-1 text-sm">记录您精心制作的每一只风筝</p>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <div>
          <label class="block text-sm font-medium text-ink mb-2">风筝名称 *</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="给这只风筝起个名字"
            :class="[
              'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all',
              errors.name ? 'border-red-300 focus:ring-red-200' : 'border-primary/20 focus:border-primary'
            ]"
          />
          <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-ink mb-2">风筝类型</label>
            <select
              v-model="form.type"
              class="w-full px-4 py-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-white"
            >
              <option v-for="type in KITE_TYPES" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-ink mb-2">骨架材料</label>
            <select
              v-model="form.frameMaterial"
              class="w-full px-4 py-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-white"
            >
              <option v-for="material in FRAME_MATERIALS" :key="material" :value="material">{{ material }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-ink mb-2">翼展尺寸 (厘米) *</label>
            <input
              v-model.number="form.wingspan"
              type="number"
              min="1"
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all',
                errors.wingspan ? 'border-red-300 focus:ring-red-200' : 'border-primary/20 focus:border-primary'
              ]"
            />
            <p v-if="errors.wingspan" class="text-red-500 text-sm mt-1">{{ errors.wingspan }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-ink mb-2">制作日期</label>
            <input
              v-model="form.madeDate"
              type="date"
              class="w-full px-4 py-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-ink mb-2">适合风力</label>
            <select
              v-model="form.suitableWindLevel"
              class="w-full px-4 py-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-white"
            >
              <option v-for="level in WIND_LEVEL_RANGES" :key="level" :value="level">{{ level }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-ink mb-2">骨架修复次数</label>
            <input
              v-model.number="form.repairCount"
              type="number"
              min="0"
              class="w-full px-4 py-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-ink mb-2">备注</label>
          <textarea
            v-model="form.notes"
            rows="4"
            placeholder="记录制作工艺、特殊设计、历史故事..."
            class="w-full px-4 py-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
          />
        </div>

        <div class="flex gap-4 pt-4">
          <button
            type="button"
            @click="goBack"
            class="flex-1 px-6 py-3 border border-primary/30 text-primary rounded-lg hover:bg-primary/5 transition-colors font-medium"
          >
            取消
          </button>
          <button
            type="submit"
            class="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium shadow-soft"
          >
            <Save class="w-5 h-5" />
            {{ isEdit ? '保存修改' : '添加风筝' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
