<template>
  <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 animate-in fade-in duration-300">

    <!-- Header -->
    <div class="flex justify-between items-center border-b border-slate-100 pb-3">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-xs">4</div>
        <h3 class="font-extrabold text-slate-800 text-sm">الأدوية الموصوفة (PRESCRIBED MEDICATIONS)</h3>
      </div>
      <button
        @click="isAddDrugModalOpen = true"
        class="text-xs font-bold text-teal-600 hover:bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100 transition flex items-center gap-1"
      >
        <Plus class="w-3.5 h-3.5" /> إضافة دواء
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="draftDrugs.length === 0" class="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
      <Pill class="w-8 h-8 mx-auto mb-2 opacity-50" />
      لم يتم إضافة أي أدوية للروشتة حتى الآن.
    </div>

    <!-- Drugs List -->
    <div v-else class="space-y-3">
      <div v-for="(med, index) in draftDrugs" :key="med.id" class="border border-slate-200 rounded-xl p-4 relative bg-slate-50 group hover:border-teal-200 transition">

        <!-- زر الحذف -->
        <button @click="removeDrug(med.id)" class="absolute top-3 left-3 text-rose-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition opacity-0 group-hover:opacity-100">
          <Trash2 class="w-4 h-4" />
        </button>

        <!-- معلومات الدواء الأساسية -->
        <div class="flex items-start gap-3 mb-3 pr-2">
          <div class="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Pill class="w-5 h-5" />
          </div>
          <div class="flex-1">
            <h4 class="font-bold text-slate-800 text-sm">{{ med.title }}</h4>
            <p class="text-[10px] text-slate-500 font-mono mt-0.5">{{ med.scientificName || 'مادة فعالة' }}</p>
          </div>
        </div>

        <!-- الحقول الطبية القياسية (Grid بسيط) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">

          <!-- 1. الجرعة -->
          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-1">الجرعة:</label>
            <input
              v-model="med.dosage"
              type="text"
              placeholder="مثال: قرص واحد"
              class="w-full p-2 border border-slate-200 rounded-lg bg-white text-xs outline-none focus:border-teal-500"
            >
          </div>

          <!-- 2. التكرار (حقل نصي حر) -->
          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-1">التكرار:</label>
            <input
              v-model="med.frequency"
              type="text"
              placeholder="مثال: كل 12 ساعة، مرة يومياً، عند اللزوم..."
              class="w-full p-2 border border-slate-200 rounded-lg bg-white text-xs outline-none focus:border-teal-500"
            >
          </div>

          <!-- 3. المدة -->
          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-1">المدة (بالأيام):</label>
            <input
              v-model="med.schedule.duration_days"
              type="number"
              min="1"
              class="w-full p-2 border border-slate-200 rounded-lg bg-white text-xs outline-none focus:border-teal-500"
            >
          </div>

        </div>

        <!-- 4. ملاحظات إضافية (اختياري) -->
        <div class="mt-3">
          <input
            v-model="med.instructions"
            type="text"
            placeholder="ملاحظات إضافية (مثال: مع الأكل، تجنب الشمس...)"
            class="w-full p-2 border border-slate-200 rounded-lg bg-white text-xs outline-none focus:border-teal-500"
          >
        </div>

      </div>
    </div>

    <!-- Add Drug Modal -->
    <AddDrugModal
      :is-open="isAddDrugModalOpen"
      @close="isAddDrugModalOpen = false"
      @add-drug="handleAddSingleDrug"
      @add-container="handleAddContainer"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Pill, Plus, Trash2 } from 'lucide-vue-next';
import { usePrescriptionDraftStore } from '../../../stores/prescriptionDraftStore';
import AddDrugModal from './modals/AddDrugModal.vue';

const draftStore = usePrescriptionDraftStore();
const isAddDrugModalOpen = ref(false);

// فلترة الأدوية فقط
const draftDrugs = computed(() => {
  return draftStore.planItems.filter(item => item.kind === 'medication');
});

// إضافة دواء من الكتالوج
function handleAddSingleDrug(drug: any) {
  draftStore.addPlanItem({
    kind: 'medication',
    title: drug.name,
    scientificName: drug.scientificName,
    dosage: drug.defaultDose || 'قرص',
    frequency: drug.defaultFrequency || 'مرة واحدة يومياً',
    instructions: '',
    schedule: { times: [], recurrence: { kind: 'daily' }, duration_days: 7 }
  });
  isAddDrugModalOpen.value = false;
}

// إضافة حاوية كاملة
function handleAddContainer(containerDrugs: any[]) {
  containerDrugs.forEach(drug => {
    draftStore.addPlanItem({
      kind: 'medication',
      title: drug.name,
      scientificName: drug.scientificName,
      dosage: drug.defaultDose || 'قرص',
      frequency: drug.defaultFrequency || 'مرة واحدة يومياً',
      instructions: '',
      schedule: { times: [], recurrence: { kind: 'daily' }, duration_days: 7 }
    });
  });
  isAddDrugModalOpen.value = false;
}

// حذف دواء
function removeDrug(id: string) {
  draftStore.removePlanItem(id);
}
</script>
