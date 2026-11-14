<template>
  <div v-if="isOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4" dir="rtl">
    <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex justify-between items-center">
        <h3 class="font-extrabold text-slate-800 flex items-center gap-2"><ClipboardList class="w-5 h-5 text-teal-600" /> تطبيق قالب روشتة</h3>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-700 p-1"><X class="w-5 h-5" /></button>
      </div>

      <div v-if="!result" class="p-4 space-y-3">
        <input v-model="tplStore.search" placeholder="بحث..." class="w-full p-2 border border-slate-200 rounded-lg text-sm" />
        <div class="space-y-2 max-h-64 overflow-y-auto">
          <button v-for="t in tplStore.filteredTemplates" :key="t.id" type="button" @click="selectedId = t.id"
            :class="['w-full text-right p-3 rounded-xl border transition', selectedId === t.id ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:bg-slate-50']">
            <div class="flex justify-between"><span class="font-bold text-sm">{{ t.name }}</span><span class="text-[10px] text-slate-400">{{ t.usageCount }} استخدام</span></div>
            <p class="text-[10px] text-slate-400 mt-1">{{ t.diagnoses.length }} تشخيص · {{ t.drugs.length }} دواء · {{ t.tasks.length }} مهمة</p>
          </button>
        </div>
        <div v-if="hasDraftContent" class="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
          <p class="text-xs font-bold text-amber-800">المسودة الحالية غير فارغة — اختر طريقة التطبيق:</p>
          <label class="flex items-center gap-2 text-xs"><input type="radio" v-model="mode" value="append" class="accent-teal-600" /> إضافة مع تخطي المكرر (افتراضي)</label>
          <label class="flex items-center gap-2 text-xs"><input type="radio" v-model="mode" value="replace" class="accent-rose-600" /> استبدال التشخيصات والعناصر الحالية</label>
        </div>
        <button @click="apply" :disabled="!selectedId" class="w-full bg-teal-600 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-40">تطبيق القالب</button>
      </div>

      <div v-else class="p-5 space-y-4 text-center">
        <CheckCircle2 class="w-10 h-10 text-emerald-500 mx-auto" />
        <p class="text-sm font-bold text-slate-800">تمت إضافة {{ result.added }} عنصراً<tspan v-if="result.skipped"> وتخطي {{ result.skipped }} مكرراً</tspan></p>
        <div class="flex gap-2">
          <button @click="undo" class="flex-1 bg-slate-100 text-slate-700 font-bold py-2 rounded-xl text-sm">تراجع</button>
          <button @click="$emit('close')" class="flex-1 bg-teal-600 text-white font-bold py-2 rounded-xl text-sm">تم</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ClipboardList, X, CheckCircle2 } from 'lucide-vue-next';
import { usePrescriptionTemplatesStore, type ApplyMode, type ApplyResult } from '../../../../stores/prescriptionTemplatesStore';
import { usePrescriptionDraftStore } from '../../../../stores/prescriptionDraftStore';

defineProps<{ isOpen: boolean }>();
defineEmits<{ close: [] }>();
const tplStore = usePrescriptionTemplatesStore();
const draft = usePrescriptionDraftStore();
const selectedId = ref<string | null>(null);
const mode = ref<ApplyMode>('append');
const result = ref<ApplyResult | null>(null);
const hasDraftContent = computed(() => draft.planItems.length > 0 || draft.diagnoses.length > 0);

function apply() { if (selectedId.value) result.value = draft.applyTemplate(selectedId.value, mode.value); }
function undo() { draft.undoLastApply(); result.value = null; }
</script>
