import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type {
  CraftProcess,
  CraftStep,
  CraftTemplate,
  CraftMaterial,
  KiteType,
} from '@/types';
import {
  loadCraftProcesses,
  saveCraftProcesses,
  loadCraftTemplates,
  saveCraftTemplates,
  generateId,
} from '@/utils/storage';
import { DEFAULT_CRAFT_STEP_NAMES, createEmptyCraftStep } from '@/types';

export const useCraftStore = defineStore('craft', () => {
  const processes = ref<CraftProcess[]>(loadCraftProcesses() as CraftProcess[]);
  const templates = ref<CraftTemplate[]>(loadCraftTemplates() as CraftTemplate[]);

  const templateCount = computed(() => templates.value.length);
  const processCount = computed(() => processes.value.length);

  function getProcessByKiteId(kiteId: string): CraftProcess | undefined {
    return processes.value.find((p) => p.kiteId === kiteId);
  }

  function getProcessById(id: string): CraftProcess | undefined {
    return processes.value.find((p) => p.id === id);
  }

  function getSortedSteps(process: CraftProcess): CraftStep[] {
    return [...process.steps].sort((a, b) => a.order - b.order);
  }

  function getProgress(process: CraftProcess): { completed: number; total: number; percentage: number } {
    const total = process.steps.length;
    const completed = process.steps.filter((s) => s.completed).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { completed, total, percentage };
  }

  function getTotalDuration(process: CraftProcess): number {
    return process.steps.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  }

  function getCompletedDuration(process: CraftProcess): number {
    return process.steps
      .filter((s) => s.completed)
      .reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  }

  function getAllMaterials(process: CraftProcess): CraftMaterial[] {
    return process.steps.flatMap((s) => s.materials);
  }

  function createProcessForKite(kiteId: string, kiteType?: KiteType): CraftProcess {
    const existing = getProcessByKiteId(kiteId);
    if (existing) return existing;

    const now = new Date().toISOString();
    let steps: CraftStep[] = [];

    const typeTemplate = templates.value.find((t) => t.kiteType === kiteType);
    if (typeTemplate) {
      steps = typeTemplate.steps.map((s, idx) => ({
        name: s.name,
        description: s.description,
        materials: s.materials.map((m) => ({
          ...m,
          id: generateId(),
        })),
        durationMinutes: s.durationMinutes,
        id: generateId(),
        completed: false,
        order: idx,
      }));
    } else {
      steps = DEFAULT_CRAFT_STEP_NAMES.map((name, idx) => ({
        ...createEmptyCraftStep(idx),
        id: generateId(),
        name,
      }));
    }

    const newProcess: CraftProcess = {
      id: generateId(),
      kiteId,
      steps,
      createdAt: now,
      updatedAt: now,
    };
    processes.value.push(newProcess);
    saveCraftProcesses(processes.value);
    return newProcess;
  }

  function updateProcess(id: string, updates: Partial<Omit<CraftProcess, 'id' | 'createdAt' | 'kiteId'>>): boolean {
    const index = processes.value.findIndex((p) => p.id === id);
    if (index !== -1) {
      processes.value[index] = {
        ...processes.value[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      saveCraftProcesses(processes.value);
      return true;
    }
    return false;
  }

  function deleteProcess(id: string): boolean {
    const index = processes.value.findIndex((p) => p.id === id);
    if (index !== -1) {
      processes.value.splice(index, 1);
      saveCraftProcesses(processes.value);
      return true;
    }
    return false;
  }

  function deleteProcessesByKiteId(kiteId: string): void {
    processes.value = processes.value.filter((p) => p.kiteId !== kiteId);
    saveCraftProcesses(processes.value);
  }

  function addStep(processId: string, stepData: Omit<CraftStep, 'id' | 'order'>): CraftStep | null {
    const process = getProcessById(processId);
    if (!process) return null;

    const maxOrder = process.steps.reduce((max, s) => Math.max(max, s.order), -1);
    const newStep: CraftStep = {
      ...stepData,
      id: generateId(),
      order: maxOrder + 1,
    };
    process.steps.push(newStep);
    updateProcess(processId, { steps: process.steps });
    return newStep;
  }

  function updateStep(processId: string, stepId: string, updates: Partial<Omit<CraftStep, 'id'>>): boolean {
    const process = getProcessById(processId);
    if (!process) return false;

    const stepIndex = process.steps.findIndex((s) => s.id === stepId);
    if (stepIndex === -1) return false;

    process.steps[stepIndex] = {
      ...process.steps[stepIndex],
      ...updates,
    };
    updateProcess(processId, { steps: process.steps });
    return true;
  }

  function deleteStep(processId: string, stepId: string): boolean {
    const process = getProcessById(processId);
    if (!process) return false;

    const stepIndex = process.steps.findIndex((s) => s.id === stepId);
    if (stepIndex === -1) return false;

    process.steps.splice(stepIndex, 1);
    process.steps.forEach((s, idx) => {
      s.order = idx;
    });
    updateProcess(processId, { steps: process.steps });
    return true;
  }

  function toggleStepComplete(processId: string, stepId: string): boolean {
    const process = getProcessById(processId);
    if (!process) return false;

    const step = process.steps.find((s) => s.id === stepId);
    if (!step) return false;

    step.completed = !step.completed;
    step.completedAt = step.completed ? new Date().toISOString() : undefined;
    updateProcess(processId, { steps: process.steps });
    return true;
  }

  function moveStep(processId: string, stepId: string, direction: 'up' | 'down'): boolean {
    const process = getProcessById(processId);
    if (!process) return false;

    const sortedSteps = getSortedSteps(process);
    const currentIndex = sortedSteps.findIndex((s) => s.id === stepId);
    if (currentIndex === -1) return false;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sortedSteps.length) return false;

    [sortedSteps[currentIndex], sortedSteps[targetIndex]] = [
      sortedSteps[targetIndex],
      sortedSteps[currentIndex],
    ];

    sortedSteps.forEach((s, idx) => {
      s.order = idx;
    });

    updateProcess(processId, { steps: sortedSteps });
    return true;
  }

  function addMaterialToStep(processId: string, stepId: string, material: Omit<CraftMaterial, 'id'>): CraftMaterial | null {
    const process = getProcessById(processId);
    if (!process) return null;

    const step = process.steps.find((s) => s.id === stepId);
    if (!step) return null;

    const newMaterial: CraftMaterial = {
      ...material,
      id: generateId(),
    };
    step.materials.push(newMaterial);
    updateStep(processId, stepId, { materials: step.materials });
    return newMaterial;
  }

  function removeMaterialFromStep(processId: string, stepId: string, materialId: string): boolean {
    const process = getProcessById(processId);
    if (!process) return false;

    const step = process.steps.find((s) => s.id === stepId);
    if (!step) return false;

    step.materials = step.materials.filter((m) => m.id !== materialId);
    updateStep(processId, stepId, { materials: step.materials });
    return true;
  }

  function applyTemplateToProcess(processId: string, templateId: string): boolean {
    const process = getProcessById(processId);
    const template = getTemplateById(templateId);
    if (!process || !template) return false;

    const newSteps: CraftStep[] = template.steps.map((s, idx) => ({
      name: s.name,
      description: s.description,
      materials: s.materials.map((m) => ({
        ...m,
        id: generateId(),
      })),
      durationMinutes: s.durationMinutes,
      id: generateId(),
      completed: false,
      order: idx,
    }));

    updateProcess(processId, { steps: newSteps });
    return true;
  }

  function getTemplatesByType(kiteType: KiteType): CraftTemplate[] {
    return templates.value.filter((t) => t.kiteType === kiteType);
  }

  function getTemplateById(id: string): CraftTemplate | undefined {
    return templates.value.find((t) => t.id === id);
  }

  function createTemplate(data: {
    name: string;
    kiteType: KiteType;
    steps: {
      name: string;
      description: string;
      materials: Omit<CraftMaterial, 'id'>[];
      durationMinutes: number;
      order: number;
    }[];
  }): CraftTemplate {
    const now = new Date().toISOString();
    const newTemplate: CraftTemplate = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    templates.value.push(newTemplate);
    saveCraftTemplates(templates.value);
    return newTemplate;
  }

  function updateTemplate(id: string, updates: Partial<{
    name: string;
    kiteType: KiteType;
    steps: {
      name: string;
      description: string;
      materials: Omit<CraftMaterial, 'id'>[];
      durationMinutes: number;
      order: number;
    }[];
  }>): boolean {
    const index = templates.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      templates.value[index] = {
        ...templates.value[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      saveCraftTemplates(templates.value);
      return true;
    }
    return false;
  }

  function deleteTemplate(id: string): boolean {
    const index = templates.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      templates.value.splice(index, 1);
      saveCraftTemplates(templates.value);
      return true;
    }
    return false;
  }

  function createTemplateFromProcess(processId: string, name: string, kiteType: KiteType): CraftTemplate | null {
    const process = getProcessById(processId);
    if (!process) return null;

    const templateSteps = getSortedSteps(process).map((s) => ({
      name: s.name,
      description: s.description,
      materials: s.materials.map((m) => ({ name: m.name, quantity: m.quantity })),
      durationMinutes: s.durationMinutes,
      order: s.order,
    }));

    return createTemplate({
      name,
      kiteType,
      steps: templateSteps,
    });
  }

  return {
    processes,
    templates,
    templateCount,
    processCount,
    getProcessByKiteId,
    getProcessById,
    getSortedSteps,
    getProgress,
    getTotalDuration,
    getCompletedDuration,
    getAllMaterials,
    createProcessForKite,
    updateProcess,
    deleteProcess,
    deleteProcessesByKiteId,
    addStep,
    updateStep,
    deleteStep,
    toggleStepComplete,
    moveStep,
    addMaterialToStep,
    removeMaterialFromStep,
    applyTemplateToProcess,
    getTemplatesByType,
    getTemplateById,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    createTemplateFromProcess,
  };
});
