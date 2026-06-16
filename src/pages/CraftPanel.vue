<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, Plus, Clock, Package, FileText, Scissors } from 'lucide-vue-next';
import { useKiteStore } from '@/composables/useKiteStore';
import { useCraftStore } from '@/composables/useCraftStore';
import CraftTimeline from '@/components/craft/CraftTimeline.vue';
import CraftProcessCard from '@/components/craft/CraftProcessCard.vue';
import CraftTemplateSelector from '@/components/craft/CraftTemplateSelector.vue';
import { useRoute } from 'vue-router';
import { computed as _computed } from 'vue';
import type { CraftStep, CraftMaterial } from '@/types';
import { formatDuration, getKiteTypeEmoji } from '@/utils/format';

const router = useRouter();
const route = useRoute();
const kiteStore = useKiteStore();
const craftStore = useCraftStore();

const kiteId = computed(() => route.params.id as string);
const kite = computed(() => kiteStore.getKiteById(kiteId.value));

const process = computed(() => {
  const p = craftStore.getProcessByKiteId(kiteId.value);
  if (!p && kite.value) {
    return craftStore.createProcessForKite(kiteId.value, kite.value.type);
  }
  return p;
});

const sortedSteps = computed(() => {
  if (!process.value) return [];
  return craftStore.getSortedSteps(process.value);
});

const showTemplates = ref(false);

if (!kite.value) {
  router.push('/kites');
}

function goBack() {
  router.back();
}

function goToDetail() {
  router.push(`/kites/${kiteId.value}`);
}

function toggleStep(stepId: string) {
  if (!process.value) return;
  craftStore.toggleStepComplete(process.value.id, stepId);
}

function moveStep(stepId: string, direction: 'up' | 'down') {
  if (!process.value) return;
  craftStore.moveStep(process.value.id, stepId, direction);
}

function deleteStep(stepId: string) {
  if (!process.value) return;
  if (confirm('确定要删除这道工序吗？')) {
    craftStore.deleteStep(process.value.id, stepId);
  }
}

function updateStep(stepId: string, updates: Partial<CraftStep>) {
  if (!process.value) return;
  craftStore.updateStep(process.value.id, stepId, updates);
}

function addMaterial(stepId: string, material: Omit<CraftMaterial, 'id'>) {
  if (!process.value) return;
  craftStore.addMaterialToStep(process.value.id, stepId, material);
}

function removeMaterial(stepId: string, materialId: string) {
  if (!process.value) return;
  craftStore.removeMaterialFromStep(process.value.id, stepId, materialId);
}

function addNewStep() {
  if (!process.value) return;
  craftStore.addStep(process.value.id, {
    name: '新工序',
    description: '',
    materials: [],
    durationMinutes: 0,
    completed: false,
  });
}

function applyTemplate(templateId: string) {
  if (!process.value) return;
  if (confirm('应用模板会替换当前所有工序，确定继续吗？')) {
    craftStore.applyTemplateToProcess(process.value.id, templateId);
    showTemplates.value = false;
  }
}

function saveAsTemplate() {
  if (!process.value || !kite.value) return;
  const name = prompt('请输入模板名称：', `${kite.value.name} 制作流程`);
  if (!name) return;
  craftStore.createTemplateFromProcess(process.value.id, name, kite.value.type);
  alert('模板已保存！');
}
</script>

<template>
  <div v-if="kite && process">
    <button
      @click="goBack"
      class="flex items-center gap-2 text-ink-light hover:text-primary mb-6 transition-colors"
    >
      <ArrowLeft class="w-5 h-5" />
      返回
    </button>

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <div class="flex items-center gap-3">
          <span class="text-5xl">{{ getKiteTypeEmoji(kite.type) }}</span>
          <div>
            <h1 class="text-2xl font-serif font-bold text-ink flex items-center gap-2">
              <Scissors class="w-6 h-6 text-accent" />
              {{ kite.name }} · 制作工序
            </h1>
            <p class="text-ink-light mt-1">
              记录每一道工序，追踪这只风筝的诞生过程
            </p>
          </div>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          @click="showTemplates = !showTemplates"
          :class="[
            'flex items-center gap-1.5 px-4 py-2 rounded-lg transition-colors text-sm',
            showTemplates
              ? 'bg-primary text-white'
              : 'border border-primary/30 text-primary hover:bg-primary/5',
          ]"
        >
          <FileText class="w-4 h-4" />
          {{ showTemplates ? '隐藏模板' : '选择模板' }}
        </button>
        <button
          @click="saveAsTemplate"
          class="flex items-center gap-1.5 px-4 py-2 border border-secondary/30 text-secondary rounded-lg hover:bg-secondary/5 transition-colors text-sm"
        >
          <Plus class="w-4 h-4" />
          存为模板
        </button>
        <button
          @click="goToDetail"
          class="flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors text-sm"
        >
          查看风筝详情
        </button>
      </div>
    </div>

    <div v-if="showTemplates" class="mb-6 animate-fade-in">
      <CraftTemplateSelector
        mode="select"
        :selected-kite-type="kite.type"
        @select="applyTemplate"
        @close="showTemplates = false"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-1 space-y-6">
        <CraftTimeline :process="process" />

        <div class="bg-white rounded-xl shadow-soft border border-primary/5 p-5">
          <h3 class="font-serif font-bold text-ink mb-4 flex items-center gap-2">
            <Clock class="w-5 h-5 text-accent" />
            时间统计
          </h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-ink-light">预计总耗时</span>
              <span class="font-medium text-ink">
                {{ formatDuration(craftStore.getTotalDuration(process)) || '—' }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-ink-light">已投入时间</span>
              <span class="font-medium text-green-600">
                {{ formatDuration(craftStore.getCompletedDuration(process)) || '—' }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-ink-light">材料种类</span>
              <span class="font-medium text-secondary">
                {{ craftStore.getAllMaterials(process).length }} 种
              </span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-soft border border-primary/5 p-5">
          <h3 class="font-serif font-bold text-ink mb-4 flex items-center gap-2">
            <Package class="w-5 h-5 text-secondary" />
            全部材料
          </h3>
          <div v-if="craftStore.getAllMaterials(process).length > 0" class="space-y-2">
            <div
              v-for="mat in craftStore.getAllMaterials(process)"
              :key="mat.id"
              class="flex items-center justify-between py-1 border-b border-primary/5 last:border-0"
            >
              <span class="text-ink">{{ mat.name }}</span>
              <span class="text-sm text-ink-light">{{ mat.quantity }}</span>
            </div>
          </div>
          <p v-else class="text-sm text-ink-light">
            暂无材料记录，在工序中添加材料吧
          </p>
        </div>
      </div>

      <div class="lg:col-span-2 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-serif font-bold text-ink">
            工序列表 ({{ sortedSteps.length }})
          </h2>
          <button
            @click="addNewStep"
            class="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm"
          >
            <Plus class="w-4 h-4" />
            添加工序
          </button>
        </div>

        <div v-if="sortedSteps.length > 0" class="space-y-3">
          <CraftProcessCard
            v-for="(step, idx) in sortedSteps"
            :key="step.id"
            :step="step"
            :process-id="process.id"
            :is-first="idx === 0"
            :is-last="idx === sortedSteps.length - 1"
            @toggle="toggleStep"
            @move-up="(id) => moveStep(id, 'up')"
            @move-down="(id) => moveStep(id, 'down')"
            @delete="deleteStep"
            @update="updateStep"
            @add-material="addMaterial"
            @remove-material="removeMaterial"
          />
        </div>

        <div v-else class="text-center py-16 bg-white rounded-xl border border-primary/5">
          <div class="text-5xl mb-3">🛠️</div>
          <h3 class="text-lg font-serif font-semibold text-ink mb-2">还没有任何工序</h3>
          <p class="text-ink-light mb-4">点击上方按钮添加第一道工序</p>
          <div class="flex gap-2 justify-center">
            <button
              @click="showTemplates = true"
              class="flex items-center gap-1.5 px-4 py-2 border border-primary/30 text-primary rounded-lg hover:bg-primary/5 transition-colors text-sm"
            >
              <FileText class="w-4 h-4" />
              从模板开始
            </button>
            <button
              @click="addNewStep"
              class="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm"
            >
              <Plus class="w-4 h-4" />
              添加工序
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
