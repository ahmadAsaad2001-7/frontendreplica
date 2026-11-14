<!-- src/features/doctor/components/PrescriptionBuilder.vue — استبدل الملف بالكامل: نفس الواجهة لكن فوق المخزن الموحّد -->
<template>
  <div class="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden" dir="rtl">

    <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
      <h2 class="font-extrabold text-slate-800 flex items-center gap-2">
        <FileSignature class="w-5 h-5 text-blue-600" />
        بناء الروشتة
      </h2>
      <span v-if="draftStore.planItems.length > 0" class="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
        {{ draftStore.planItems.length }} عناصر
      </span>
    </div>

    <div class="flex-1 overflow-y-auto p-4 space-y-4">

      <PrescriptionTemplateBar />

      <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div class="md:col-span-2">
          <label class="block text-xs font-bold text-slate-700 mb-1">التشخيص</label>
          <input v-model="diagTitle" type="text" placeholder="مثال: التهاب الحلق"
            class="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">ICD-10</label>
          <input v-model="diagIcd" type="text" placeholder="J06.9"
            class="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      <div v-if="draftStore.allergyWarning" class="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2">
        <AlertTriangle class="w-5 h-5 text-rose-600 shrink-0" />
        <p class="text-xs text-rose-800 font-bold">{{ draftStore.allergyWarning }}</p>
      </div>

      <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
        <h3 class="text-xs font-bold text-slate-600 mb-3">إضافة عنصر جديد</h3>
        <div class="space-y-2">
          <input v-model="newItemTitle" type="text" placeholder="اسم الدواء أو المهمة (مثال: سيلبركس)" class="w-full p-2 border rounded-lg text-sm" />
          <select v-model="newItemKind" class="w-full p-2 border rounded-lg text-sm bg-white">
            <option value="medication">دواء</option>
            <option value="exercise">تمرين</option>
            <option value="measurement">قياس</option>
            <option value="nutrition">تغذية</option>
            <option value="care">رعاية / مهمة</option>
          </select>
          <input v-model="newItemTime" type="time" class="w-full p-2 border rounded-lg text-sm" />
          <button @click="handleAddItem" class="w-full bg-blue-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-blue-700 transition">
            إضافة
          </button>
        </div>
      </div>

      <div class="space-y-2">
        <div v-for="item in draftStore.planItems" :key="item.id" class="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
          <div>
            <p class="text-sm font-bold text-slate-800">{{ item.title }}</p>
            <p class="text-xs text-slate-500">{{ item.kind }} • {{ item.schedule.times[0] || 'وقت مفتوح' }}</p>
          </div>
          <button @click="draftStore.removePlanItem(item.id)" class="text-rose-500 hover:text-rose-700 p-1">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>

    <div class="p-4 border-t border-slate-100">
      <button
        @click="draftStore.issuePrescription"
        :disabled="!draftStore.diagnosis || draftStore.planItems.length === 0"
        class="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        توقيع وإصدار الروشتة
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePrescriptionDraftStore } from '../../../stores/prescriptionDraftStore';
import { FileSignature, AlertTriangle, Trash2 } from 'lucide-vue-next';
import PrescriptionTemplateBar from './library/PrescriptionTemplateBar.vue';

const draftStore = usePrescriptionDraftStore();

const diagTitle = computed({
  get: () => draftStore.diagnosis,
  set: (v: string) => draftStore.setDiagnosis(draftStore.icd10, v),
});
const diagIcd = computed({
  get: () => draftStore.icd10,
  set: (v: string) => draftStore.setDiagnosis(v, draftStore.diagnosis),
});

const newItemTitle = ref('');
const newItemKind = ref<'medication' | 'exercise' | 'measurement' | 'nutrition' | 'care'>('medication');
const newItemTime = ref('08:00');

function handleAddItem() {
  if (!newItemTitle.value.trim()) return;
  draftStore.addPlanItem({
    kind: newItemKind.value,
    title: newItemTitle.value.trim(),
    schedule: { times: [newItemTime.value], recurrence: { kind: 'daily' }, duration_days: 7 },
  });
  newItemTitle.value = '';
}
</script>
