<script setup lang="ts">
import { computed, ref } from 'vue';
import { Plus, Trash2, FileText, X, Save, Edit2 } from 'lucide-vue-next';
import { useCraftStore } from '@/composables/useCraftStore';
import { KITE_TYPES, type KiteType, type CraftTemplate } from '@/types';
import { getKiteTypeEmoji } from '@/utils/format';

interface Props {
  mode?: 'select' | 'manage';
  selectedKiteType?: KiteType;
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'select',
});

const emit = defineEmits<{
  select: [templateId: string];
  close: [];
}>();

const craftStore = useCraftStore();
const showCreateForm = ref(false);
const editingTemplate = ref<CraftTemplate | null>(null);

const newTemplateName = ref('');
const newTemplateType = ref<KiteType>('沙燕');
const newStepsText = ref('选竹备料\n削骨成形\n绑扎骨架\n糊面蒙皮\n彩绘装饰\n系线调试');

const filteredTemplates = computed(() => {
  if (props.selectedKiteType) {
    return craftStore.templates.filter((t) => t.kiteType === props.selectedKiteType);
  }
  return craftStore.templates;
});

function startCreate() {
  newTemplateName.value = '';
  newTemplateType.value = props.selectedKiteType || '沙燕';
  newStepsText.value = '选竹备料\n削骨成形\n绑扎骨架\n糊面蒙皮\n彩绘装饰\n系线调试';
  showCreateForm.value = true;
  editingTemplate.value = null;
}

function startEdit(template: CraftTemplate) {
  editingTemplate.value = template;
  newTemplateName.value = template.name;
  newTemplateType.value = template.kiteType;
  newStepsText.value = template.steps
    .sort((a, b) => a.order - b.order)
    .map((s) => s.name)
    .join('\n');
  showCreateForm.value = true;
}

function cancelForm() {
  showCreateForm.value = false;
  editingTemplate.value = null;
}

function saveTemplate() {
  if (!newTemplateName.value.trim()) {
    alert('请输入模板名称');
    return;
  }
  const stepNames = newStepsText.value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  if (stepNames.length === 0) {
    alert('请至少输入一道工序');
    return;
  }

  const steps = stepNames.map((name, idx) => ({
    name,
    description: '',
    materials: [],
    durationMinutes: 0,
    order: idx,
  }));

  if (editingTemplate.value) {
    craftStore.updateTemplate(editingTemplate.value.id, {
      name: newTemplateName.value.trim(),
      kiteType: newTemplateType.value,
      steps,
    });
  } else {
    craftStore.createTemplate({
      name: newTemplateName.value.trim(),
      kiteType: newTemplateType.value,
      steps,
    });
  }

  cancelForm();
}

function deleteTemplate(id: string) {
  if (confirm('确定要删除这个工序模板吗？')) {
    craftStore.deleteTemplate(id);
  }
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-soft border border-primary/5 overflow-hidden">
    <div class="flex items-center justify-between px-5 py-4 bg-gradient-to-br from-primary/10 to-accent/10 border-b border-primary/5">
      <h3 class="font-serif font-bold text-lg text-ink flex items-center gap-2">
        <FileText class="w-5 h-5 text-primary" />
        工序模板
        <span v-if="selectedKiteType" class="text-sm font-normal text-ink-light">
          · {{ getKiteTypeEmoji(selectedKiteType) }} {{ selectedKiteType }}
        </span>
      </h3>
      <div class="flex items-center gap-2">
        <button
          @click="startCreate"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors text-sm"
        >
          <Plus class="w-4 h-4" />
          新建模板
        </button>
        <button
          v-if="mode === 'select'"
          @click="emit('close')"
          class="p-1.5 text-ink-light hover:text-ink hover:bg-white/60 rounded-lg transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div v-if="showCreateForm" class="p-5 bg-paper-dark/30 border-b border-primary/5 animate-fade-in">
      <h4 class="font-medium text-ink mb-3">
        {{ editingTemplate ? '编辑模板' : '新建模板' }}
      </h4>
      <div class="space-y-3">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-ink mb-1">模板名称</label>
            <input
              v-model="newTemplateName"
              type="text"
              class="input-field"
              placeholder="例如：传统沙燕标准工序"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink mb-1">适用风筝类型</label>
            <select v-model="newTemplateType" class="input-field">
              <option v-for="type in KITE_TYPES" :key="type" :value="type">
                {{ getKiteTypeEmoji(type) }} {{ type }}
              </option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-ink mb-1">
            工序名称（每行一道，按顺序排列）
          </label>
          <textarea
            v-model="newStepsText"
            class="input-field min-h-[140px] font-mono text-sm"
            placeholder="选竹备料&#10;削骨成形&#10;绑扎骨架&#10;..."
          />
        </div>
        <div class="flex gap-2 pt-2">
          <button
            @click="saveTemplate"
            class="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm"
          >
            <Save class="w-4 h-4" />
            保存模板
          </button>
          <button
            @click="cancelForm"
            class="px-4 py-2 border border-primary/20 text-ink-light rounded-lg hover:bg-primary/5 transition-colors text-sm"
          >
            取消
          </button>
        </div>
      </div>
    </div>

    <div v-if="filteredTemplates.length > 0" class="divide-y divide-primary/5">
      <div
        v-for="template in filteredTemplates"
        :key="template.id"
        class="p-4 hover:bg-paper-dark/30 transition-colors"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h4 class="font-serif font-semibold text-ink">{{ template.name }}</h4>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                {{ getKiteTypeEmoji(template.kiteType) }} {{ template.kiteType }}
              </span>
            </div>
            <div class="flex flex-wrap gap-1.5 mt-2">
              <span
                v-for="(step, idx) in [...template.steps].sort((a, b) => a.order - b.order)"
                :key="idx"
                class="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary/10 text-secondary text-xs rounded-full"
              >
                {{ idx + 1 }}. {{ step.name }}
              </span>
            </div>
            <p class="text-xs text-ink-light mt-2">
              共 {{ template.steps.length }} 道工序
            </p>
          </div>
          <div class="flex gap-1 flex-shrink-0">
            <button
              v-if="mode === 'select'"
              @click="emit('select', template.id)"
              class="px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm"
            >
              使用此模板
            </button>
            <button
              @click="startEdit(template)"
              class="p-2 text-ink-light hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
              title="编辑"
            >
              <Edit2 class="w-4 h-4" />
            </button>
            <button
              @click="deleteTemplate(template.id)"
              class="p-2 text-ink-light hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="删除"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="p-8 text-center">
      <div class="text-4xl mb-3">📋</div>
      <h4 class="font-serif font-semibold text-ink mb-1">还没有工序模板</h4>
      <p class="text-sm text-ink-light mb-3">
        {{ selectedKiteType ? `该类型暂无模板，` : '' }}创建模板后可快速复用工序流程
      </p>
      <button
        @click="startCreate"
        class="inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors text-sm"
      >
        <Plus class="w-4 h-4" />
        创建第一个模板
      </button>
    </div>
  </div>
</template>
