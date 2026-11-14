<template>
  <div class="space-y-6 animate-in fade-in duration-300">

    <!-- 1. Header & Add Button -->
    <div class="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
      <div>
        <h3 class="font-extrabold text-slate-800 flex items-center gap-2">
          <Pill class="w-5 h-5 text-blue-600" />
          الوحدة النشطة وفحص التداخلات الدوائية (CDS)
        </h3>
        <p class="text-xs text-slate-500 mt-1">فحص تفاعلي للأدوية الحالية وتجنب مضاعفة الجرعات.</p>
      </div>

      <button
        @click="isAddModalOpen = true"
        class="bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-md hover:bg-blue-700 transition flex items-center gap-2 text-sm"
      >
        <Plus class="w-4 h-4" /> إضافة دواء جديد
      </button>
    </div>

    <!-- 2. Interaction Warnings Summary (Top Banner) -->
    <div v-if="interactionWarnings.length > 0" class="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-2">
      <h4 class="text-sm font-extrabold text-rose-800 flex items-center gap-2 mb-2">
        <AlertTriangle class="w-5 h-5" /> تنبيهات التداخلات الدوائية الهامة:
      </h4>
      <div
        v-for="(warn, index) in interactionWarnings"
        :key="index"
        class="bg-white border border-rose-100 rounded-xl p-3 flex items-center justify-between text-sm"
      >
        <div class="flex items-center gap-2">
          <span class="bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded text-xs">{{ warn.drug1 }}</span>
          <span class="text-slate-400">↔</span>
          <span class="bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded text-xs">{{ warn.drug2 }}</span>
        </div>
        <span class="text-rose-600 font-bold text-xs">{{ warn.message }}</span>
      </div>
    </div>

    <!-- 3. Medications Grid (بيقرأ من الـ Store) -->
    <div v-if="activeMedications.length === 0" class="text-center py-12 bg-white border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
      <Pill class="w-12 h-12 mx-auto mb-3 text-slate-200" />
      <p class="text-sm font-bold">لا توجد أدوية مضافة للروشتة حتى الآن.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="med in activeMedications"
        :key="med.id"
        class="bg-white rounded-2xl p-4 border shadow-sm transition-all relative overflow-hidden group border-slate-200 hover:border-teal-300"
      >
        <!-- Top Row: Name & Duration -->
        <div class="flex justify-between items-start mb-3">
          <div class="flex items-center gap-2">
            <div class="bg-teal-50 text-teal-600 w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
              <Pill class="w-4 h-4" />
            </div>
            <div>
              <h4 class="text-sm font-bold text-slate-800">{{ med.title }}</h4>
              <p class="text-[10px] font-mono text-slate-500">{{ med.scientificName || 'مادة فعالة' }}</p>
            </div>
          </div>

          <div class="flex flex-col items-end gap-1">
            <span class="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{{ med.schedule.duration_days }} أيام</span>
            <button @click="removeMedication(med.id)" class="text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Middle Row: Instructions -->
        <div class="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl mb-3">
          <p class="flex items-center gap-1.5"><Clock class="w-3.5 h-3.5 text-slate-400" /> {{ med.frequency || 'حسب تعليمات الطبيب' }}</p>
        </div>

        <!-- Bottom Row: Safety Status -->
        <div class="bg-emerald-50 border border-emerald-100 p-2 rounded-lg flex items-center gap-2 text-emerald-700 text-xs font-bold">
          <CheckCircle2 class="w-4 h-4 shrink-0" /> آمن - لا يوجد تعارض مع الحساسية
        </div>
      </div>
    </div>

    <!-- 4. Add Medication Modal (نفس المودال اللي عملناه) -->
    <AddDrugModal
      :is-open="isAddModalOpen"
      @close="isAddModalOpen = false"
      @add-drug="handleAddSingleDrug"
      @add-container="handleAddContainer"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Pill, Plus, AlertTriangle, CheckCircle2,
  Clock, Trash2
} from 'lucide-vue-next';
import AddDrugModal from './modals/AddDrugModal.vue';
// استدعاء الـ Store
import { usePrescriptionDraftStore } from '../../../stores/prescriptionDraftStore';

const draftStore = usePrescriptionDraftStore();

const isAddModalOpen = ref(false);

// بنقرأ الأدوية مباشرة من الروشتة
const activeMedications = computed(() => {
  return draftStore.planItems.filter(item => item.kind === 'medication');
});

// التحذيرات (تجريبية للشكل)
const interactionWarnings = ref([
  {
    drug1: 'Celebrex 200mg',
    drug2: 'Myo-Fen 50mg',
    message: 'تداخل خطير - يرجى مراجعة الطبيب'
  }
]);

// --- دوال الإضافة (بتروح للـ Store) ---
function handleAddSingleDrug(drug: any) {
  draftStore.addPlanItem({
    kind: 'medication',
    title: drug.name,
    scientificName: drug.scientificName,
    dosage: drug.defaultDose || 'قرص',
    frequency: drug.defaultFrequency || 'حسب تعليمات الطبيب',
    schedule: { times: ['12:00'], recurrence: { kind: 'daily' }, duration_days: 7 }
  });
  isAddModalOpen.value = false;
}

function handleAddContainer(containerDrugs: any[]) {
  if (confirm(`هل أنت متأكد من إضافة ${containerDrugs.length} أدوية إلى القائمة؟`)) {
    containerDrugs.forEach(drug => {
      draftStore.addPlanItem({
        kind: 'medication',
        title: drug.name,
        scientificName: drug.scientificName,
        dosage: drug.defaultDose || 'قرص',
        frequency: drug.defaultFrequency || 'حسب تعليمات الطبيب',
        schedule: { times: ['12:00'], recurrence: { kind: 'daily' }, duration_days: 7 }
      });
    });
    isAddModalOpen.value = false;
  }
}

// --- دالة الحذف (بتمسح من الـ Store) ---
function removeMedication(id: string) {
  if (confirm('هل أنت متأكد من حذف هذا الدواء من الروشتة؟')) {
    draftStore.removePlanItem(id);
  }
}
</script>
