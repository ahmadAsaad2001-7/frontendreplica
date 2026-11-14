<template>
  <div v-if="isOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4" dir="rtl">
    <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex justify-between items-center">
        <h3 class="font-extrabold text-slate-800 flex items-center gap-2"><BookmarkPlus class="w-5 h-5 text-teal-600" /> حفظ الروشتة كقالب</h3>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-700 p-1"><X class="w-5 h-5" /></button>
      </div>
      <div class="p-4 space-y-3">
        <p class="text-xs text-slate-500">سيُحفظ التشخيص والأدوية والمهام الحالية كقالب قابل لإعادة الاستخدام. لا تُحفظ أي بيانات مريض.</p>
        <div><label class="text-[11px] font-bold text-slate-500">اسم القالب</label><input v-model="name" class="w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder="مثال: بروتوكول القولون العصبي" /></div>
        <div><label class="text-[11px] font-bold text-slate-500">التخصص</label><input v-model="specialty" class="w-full p-2 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label class="text-[11px] font-bold text-slate-500">الوسوم (فواصل)</label><input v-model="tags" class="w-full p-2 border border-slate-200 rounded-lg text-sm" /></div>
        <button @click="save" :disabled="!name.trim() || !canSave" class="w-full bg-teal-600 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-40">حفظ في المكتبة</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { BookmarkPlus, X } from 'lucide-vue-next';
import { usePrescriptionDraftStore } from '../../../../stores/prescriptionDraftStore';
import { usePrescriptionTemplatesStore, tplUid } from '../../../../stores/prescriptionTemplatesStore';

defineProps<{ isOpen: boolean }>();
const emit = defineEmits<{ close: []; saved: [name: string] }>();
const draft = usePrescriptionDraftStore();
const tplStore = usePrescriptionTemplatesStore();
const name = ref(''); const specialty = ref(''); const tags = ref('');
const canSave = computed(() => draft.planItems.length > 0);

function save() {
  if (!name.value.trim() || !canSave.value) return;
  tplStore.addTemplate({
    name: name.value.trim(), specialty: specialty.value.trim(), description: '',
    tags: tags.value.split(',').map(s => s.trim()).filter(Boolean),
    diagnoses: draft.diagnoses.map(d => ({ icd10: d.icd10, title: d.title })),
    drugs: draft.planItems.filter(i => i.kind === 'medication').map(i => ({
      id: tplUid('td'), title: i.title, scientificName: i.scientificName,
      dosage: i.dosage ?? '', frequency: i.frequency ?? '', instructions: i.instructions,
      durationDays: i.schedule.duration_days ?? 7, times: [...(i.schedule.times ?? [])],
    })),
    tasks: draft.planItems.filter(i => i.kind !== 'medication').map(i => ({
      id: tplUid('tt'), kind: i.kind as 'exercise' | 'measurement' | 'nutrition' | 'care',
      title: i.title, instructions: i.instructions, frequency: i.frequency,
      time: i.schedule.times?.[0], durationDays: i.schedule.duration_days ?? 7,
    })),
  });
  emit('saved', name.value.trim());
  name.value = ''; specialty.value = ''; tags.value = '';
  emit('close');
}
</script>
