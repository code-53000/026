<script setup lang="ts">
import { computed, ref } from 'vue';
import { Check, Pencil, Trash2, ChevronUp, ChevronDown, Clock, Package, Plus, X, Save } from 'lucide-vue-next';
import type { CraftStep, CraftMaterial } from '@/types';
import { formatDuration } from '@/utils/format';

interface Props {
  step: CraftStep;
  processId: string;
  isFirst: boolean;
  isLast: boolean;
  readOnly?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  toggle: [stepId: string];
  moveUp: [stepId: string];
  moveDown: [stepId: string];
  edit: [stepId: string];
  delete: [stepId: string];
  update: [stepId: string, updates: Partial<CraftStep>];
  addMaterial: [stepId: string, material: Omit<CraftMaterial, 'id'>];
  removeMaterial: [stepId: string, materialId: string];
}>();

const isEditing = ref(false);
const editName = ref(props.step.name);
const editDescription = ref(props.step.description);
const editDuration = ref(props.step.durationMinutes);
const newMaterialName = ref('');
const newMaterialQty = ref('');

const stepStatus = computed(() => {
  if (props.step.completed) return 'completed';
  return 'pending';
});

function startEdit() {
  editName.value = props.step.name;
  editDescription.value = props.step.description;
  editDuration.value = props.step.durationMinutes;
  isEditing.value = true;
}

function cancelEdit() {
  isEditing.value = false;
}

function saveEdit() {
  emit('update', props.step.id, {
    name: editName.value,
    description: editDescription.value,
    durationMinutes: editDuration.value,
  });
  isEditing.value = false;
}

function addMaterial() {
  if (!newMaterialName.value.trim()) return;
  emit('addMaterial', props.step.id, {
    name: newMaterialName.value.trim(),
    quantity: newMaterialQty.value.trim() || '适量',
  });
  newMaterialName.value = '';
  newMaterialQty.value = '';
}
</script>

<template>
  <div
    :class="[
      'bg-white rounded-xl border transition-all duration-300 overflow-hidden',
      step.completed ? 'border-green-200 bg-green-50/30' : 'border-primary/10',
    ]"
  >
    <div class="p-5">
      <div class="flex items-start gap-4">
        <button
          v-if="!readOnly"
          @click="emit('toggle', step.id)"
          :class="[
            'w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all',
            step.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-primary/30 hover:border-primary text-transparent hover:text-primary/50',
          ]"
        >
          <Check class="w-4 h-4" />
        </button>
        <div
          v-else
          :class="[
            'w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
            step.completed ? 'bg-green-500 border-green-500 text-white' : 'border-primary/30 bg-white',
          ]"
        >
          <Check v-if="step.completed" class="w-4 h-4" />
        </div>

        <div class="flex-1 min-w-0">
          <div v-if="!isEditing">
            <div class="flex items-center gap-2 flex-wrap">
              <h4
                :class="[
                  'font-serif font-semibold text-lg',
                  step.completed ? 'text-ink line-through opacity-70' : 'text-ink',
                ]"
              >
                {{ step.name || '未命名工序' }}
              </h4>
              <span
                v-if="step.completed && step.completedAt"
                class="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full"
              >
                {{ formatDuration(step.durationMinutes) || '完成' }}
              </span>
            </div>

            <p
              v-if="step.description"
              :class="[
                'text-sm mt-2 whitespace-pre-wrap',
                step.completed ? 'text-ink-light line-through opacity-70' : 'text-ink-light',
              ]"
            >
              {{ step.description }}
            </p>

            <div v-if="step.durationMinutes > 0 && !step.completed" class="flex items-center gap-1.5 mt-3 text-sm text-ink-light">
              <Clock class="w-4 h-4 text-accent" />
              <span>预计 {{ formatDuration(step.durationMinutes) }}</span>
            </div>

            <div v-if="step.materials.length > 0" class="mt-3">
              <div class="flex items-center gap-1.5 text-sm text-secondary mb-2">
                <Package class="w-4 h-4" />
                <span class="font-medium">材料清单</span>
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="mat in step.materials"
                  :key="mat.id"
                  class="inline-flex items-center gap-1 px-2.5 py-1 bg-secondary/10 text-secondary text-xs rounded-full"
                >
                  {{ mat.name }}
                  <span class="text-secondary/70">({{ mat.quantity }})</span>
                  <button
                    v-if="!readOnly && !isEditing"
                    @click.stop="emit('removeMaterial', step.id, mat.id)"
                    class="ml-1 hover:text-red-500 transition-colors"
                  >
                    <X class="w-3 h-3" />
                  </button>
                </span>
              </div>
            </div>
          </div>

          <div v-else class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-ink mb-1">工序名称</label>
              <input
                v-model="editName"
                type="text"
                class="input-field"
                placeholder="例如：选竹备料"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-ink mb-1">工序说明</label>
              <textarea
                v-model="editDescription"
                class="input-field min-h-[80px]"
                placeholder="描述这道工序的具体做法..."
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-ink mb-1">预计耗时（分钟）</label>
              <input
                v-model.number="editDuration"
                type="number"
                min="0"
                class="input-field"
                placeholder="60"
              />
            </div>

            <div v-if="!readOnly">
              <label class="block text-sm font-medium text-ink mb-1">添加材料</label>
              <div class="flex gap-2">
                <input
                  v-model="newMaterialName"
                  type="text"
                  class="input-field flex-1"
                  placeholder="材料名称，如：毛竹"
                  @keyup.enter="addMaterial"
                />
                <input
                  v-model="newMaterialQty"
                  type="text"
                  class="input-field w-28"
                  placeholder="用量"
                  @keyup.enter="addMaterial"
                />
                <button
                  @click="addMaterial"
                  class="px-3 py-2 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-colors"
                >
                  <Plus class="w-4 h-4" />
                </button>
              </div>
              <div v-if="step.materials.length > 0" class="flex flex-wrap gap-2 mt-2">
                <span
                  v-for="mat in step.materials"
                  :key="mat.id"
                  class="inline-flex items-center gap-1 px-2.5 py-1 bg-secondary/10 text-secondary text-xs rounded-full"
                >
                  {{ mat.name }}
                  <span class="text-secondary/70">({{ mat.quantity }})</span>
                  <button
                    @click.stop="emit('removeMaterial', step.id, mat.id)"
                    class="ml-1 hover:text-red-500 transition-colors"
                  >
                    <X class="w-3 h-3" />
                  </button>
                </span>
              </div>
            </div>

            <div class="flex gap-2 pt-2">
              <button
                @click="saveEdit"
                class="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm"
              >
                <Save class="w-4 h-4" />
                保存
              </button>
              <button
                @click="cancelEdit"
                class="px-4 py-2 border border-primary/20 text-ink-light rounded-lg hover:bg-primary/5 transition-colors text-sm"
              >
                取消
              </button>
            </div>
          </div>
        </div>

        <div v-if="!readOnly && !isEditing" class="flex flex-col gap-1 flex-shrink-0">
          <button
            @click="startEdit"
            class="p-2 text-ink-light hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
            title="编辑"
          >
            <Pencil class="w-4 h-4" />
          </button>
          <button
            @click="emit('moveUp', step.id)"
            :disabled="isFirst"
            :class="[
              'p-2 rounded-lg transition-colors',
              isFirst ? 'text-gray-300 cursor-not-allowed' : 'text-ink-light hover:text-primary hover:bg-primary/10',
            ]"
            title="上移"
          >
            <ChevronUp class="w-4 h-4" />
          </button>
          <button
            @click="emit('moveDown', step.id)"
            :disabled="isLast"
            :class="[
              'p-2 rounded-lg transition-colors',
              isLast ? 'text-gray-300 cursor-not-allowed' : 'text-ink-light hover:text-primary hover:bg-primary/10',
            ]"
            title="下移"
          >
            <ChevronDown class="w-4 h-4" />
          </button>
          <button
            @click="emit('delete', step.id)"
            class="p-2 text-ink-light hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="删除"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
