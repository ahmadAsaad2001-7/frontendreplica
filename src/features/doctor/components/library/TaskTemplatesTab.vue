<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-5" dir="rtl">
    <div class="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
      <button @click="isAddOpen = true" class="w-full bg-emerald-600 text-white font-bold py-2 rounded-xl text-sm">+ قالب مهمة جديد</button>
      <div class="space-y-2 max-h-[460px] overflow-y-auto">
        <button v-for="t in tasks.allTemplates" :key="t.id" type="button" @click="selectedId = t.id"
          :class="['w-full text-right p-3 rounded-xl border transition', selectedId === t.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:bg-slate-50']">
          <div class="flex justify-between items-center gap-2">
            <span class="font-bold text-sm text-slate-800 truncate">{{ t.title }}</span>
            <span :class="['text-[9px] px-2 py-0.5 rounded-full font-bold shrink-0', t.isCustom ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500']">{{ t.isCustom ? 'مخصص' : 'نظام' }}</span>
          </div>
          <p class="text-[11px] text-slate-400 mt-1 truncate">{{ t.instructions }}</p>
        </button>
      </div>
    </div>

    <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5">
      <div v-if="!selected" class="text-center py-16 text-slate-400 text-sm">اختر قالباً لعرضه أو تعديله</div>
      <template v-else>
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-extrabold text-slate-800">{{ selected.title }}</h3>
          <div v-if="selected.isCustom" class="flex gap-2">
            <button @click="tasks.togglePublic(selected.id)" class="px-3 py-1.5 rounded-lg text-xs font-bold border" :class="selected.isPublic ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-600 border-slate-200'">{{ selected.isPublic ? 'عام' : 'خاص' }}</button>
            <button @click="removeSelected" class="bg-rose-50 text-rose-600 border border-rose-200 px-3 py-1.5 rounded-lg text-xs font-bold">حذف</button>
          </div>
        </div>
        <div class="space-y-3">
          <div><label class="text-[11px] font-bold text-slate-500">العنوان</label>
            <input :value="selected.title" :disabled="!selected.isCustom" @input="patch({ title: ($event.target as HTMLInputElement).value })" class="w-full p-2 border border-slate-200 rounded-lg text-sm disabled:bg-slate-50" /></div>
          <div><label class="text-[11px] font-bold text-slate-500">التعليمات</label>
            <textarea :value="selected.instructions" :disabled="!selected.isCustom" @input="patch({ instructions: ($event.target as HTMLTextAreaElement).value })" rows="3" class="w-full p-2 border border-slate-200 rounded-lg text-sm disabled:bg-slate-50"></textarea></div>
          <div class="grid grid-cols-2 gap-3">
            <div><label class="text-[11px] font-bold text-slate-500">التكرار</label>
              <input :value="selected.frequency" :disabled="!selected.isCustom" @input="patch({ frequency: ($event.target as HTMLInputElement).value })" class="w-full p-2 border border-slate-200 rounded-lg text-sm disabled:bg-slate-50" /></div>
            <div><label class="text-[11px] font-bold text-slate-500">النوع</label>
              <input :value="kindLabel(selected.kind)" disabled class="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50" /></div>
          </div>
          <p class="text-[11px] text-slate-400">بواسطة: {{ selected.createdBy }}</p>
        </div>
      </template>
    </div>

    <AddTaskModal :is-open="isAddOpen" @close="isAddOpen = false" @add-task="onAddTask" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTaskTemplatesStore, type TaskTemplate } from '../../../../stores/taskTemplatesStore';
import { useAuthStore } from '../../../../stores/authStore';
import type { TaskData } from '../../../../types/doctor';
import AddTaskModal from '../modals/AddTaskModal.vue';

const tasks = useTaskTemplatesStore();
const auth = useAuthStore();
const selectedId = ref<string | null>(tasks.allTemplates[0]?.id ?? null);
const selected = computed(() => tasks.allTemplates.find(t => t.id === selectedId.value) ?? null);
const isAddOpen = ref(false);

const KIND_LABELS: Record<string, string> = { exercise: 'تمرين', measurement: 'قياس', nutrition: 'تغذية', care: 'رعاية', medication: 'دواء' };
const kindLabel = (k: string) => KIND_LABELS[k] ?? k;

function patch(p: Partial<TaskTemplate>) { if (selected.value?.isCustom) tasks.updateCustomTemplate(selected.value.id, p); }
function removeSelected() {
  if (!selected.value?.isCustom) return;
  tasks.removeCustomTemplate(selected.value.id);
  selectedId.value = tasks.allTemplates[0]?.id ?? null;
}
function onAddTask(t: TaskData) {
  tasks.addCustomTemplate({ title: t.title, instructions: t.instructions, frequency: t.frequency, kind: t.kind, isPublic: false, createdBy: auth.currentUser?.name ?? 'طبيب' });
  isAddOpen.value = false;
}
</script>
