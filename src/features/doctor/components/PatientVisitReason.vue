<template>
  <div class="space-y-6 animate-in fade-in duration-300">

    <!-- 1. سبب الزيارة الحالية -->
    <div>
      <div class="flex items-center gap-2 text-sm font-bold text-blue-600 mb-2">
        <span class="w-2 h-2 rounded-full bg-blue-600"></span>
        سبب الزيارة الحالية
      </div>

      <div class="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <textarea
          v-model="visitReason"
          rows="2"
          class="w-full bg-transparent outline-none resize-none text-sm text-slate-700 font-medium leading-relaxed"
          placeholder="اكتب شكوى المريض الحالية..."
        ></textarea>
        <div class="flex items-center gap-1.5 text-xs text-slate-400 mt-2 border-t border-slate-200 pt-2">
          <Clock class="w-3.5 h-3.5" />
          <span>تاريخ البدء: {{ visitStartDate }}</span>
        </div>
      </div>
    </div>

    <!-- 2. الأدوية والتداخلات (مربوطة بالـ Store) -->
    <div>
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center gap-2 text-sm font-bold text-emerald-600">
          <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
          الأدوية التي يتناولها المريض (حالياً)
        </div>

        <button
          @click="isAddModalOpen = true"
          class="bg-blue-50 text-blue-600 font-bold px-3 py-1.5 rounded-lg hover:bg-blue-100 transition flex items-center gap-1 text-xs"
        >
          <Plus class="w-3.5 h-3.5" /> إضافة دواء
        </button>
      </div>

      <!-- Interaction Warnings Banner (مؤقتاً ثابت للتوضيح) -->
      <div class="bg-rose-50 border border-rose-200 rounded-xl p-3 mb-4 space-y-2">
        <h4 class="text-xs font-extrabold text-rose-800 flex items-center gap-1.5">
          <AlertTriangle class="w-4 h-4" /> تنبيهات التداخلات الدوائية (نموذج توضيحي):
        </h4>
        <div class="bg-white border border-rose-100 rounded-lg p-2 flex items-center justify-between text-xs">
          <div class="flex items-center gap-1">
            <span class="bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded">Celebrex 200mg</span>
            <span class="text-slate-400">↔</span>
            <span class="bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded">Myo-Fen 50mg</span>
          </div>
          <span class="text-rose-600 font-bold">تداخل خطير - يرجى المراجعة</span>
        </div>
      </div>

      <!-- Medications Grid (بيقرأ من الـ Store) -->
      <div v-if="currentMeds.length === 0" class="text-center py-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
        لا توجد أدوية مضافة حالياً. اضغط على "إضافة دواء" للبدء.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div
          v-for="med in currentMeds"
          :key="med.id"
          class="bg-white rounded-xl p-3 border shadow-sm relative group transition-all border-slate-200 hover:border-teal-300"
        >
          <div class="flex justify-between items-start mb-2">
            <div class="flex items-center gap-2">
              <div class="bg-teal-50 text-teal-600 w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                <Pill class="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 class="text-xs font-bold text-slate-800">{{ med.title }}</h4>
                <p class="text-[9px] font-mono text-slate-500">{{ med.scientificName || 'مادة فعالة' }}</p>
              </div>
            </div>

            <button @click="removeMed(med.id)" class="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>

          <div class="bg-slate-50 p-2 rounded-lg text-[10px] text-slate-600 mb-2 flex justify-between">
            <span>{{ med.dosage || 'قرص' }}</span>
            <span>{{ med.frequency || 'حسب التعليمات' }}</span>
          </div>

          <!-- Status -->
          <div class="bg-emerald-50 text-emerald-700 text-[10px] font-bold p-1.5 rounded flex items-center gap-1">
            <CheckCircle2 class="w-3 h-3" /> آمن - لا يوجد تعارض
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Add Medication Modal -->
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
import { Clock, Pill, Trash2, Plus, AlertTriangle, CheckCircle2 } from 'lucide-vue-next';
import AddDrugModal from './modals/AddDrugModal.vue';
// 1. استيراد الـ Store
import { usePrescriptionDraftStore } from '../../../stores/prescriptionDraftStore';

// 2. تفعيل الـ Store
const draftStore = usePrescriptionDraftStore();

// بيانات سبب الزيارة
const visitReason = ref('ألم حاد في الجانب الأيمن السفلي من البطن مع غثيان مستمر. بدأ العرض منذ 3 ساعات تقريباً.');
const visitStartDate = '4 نوفمبر الساعة 11:00 (تقديرياً)';

// حالة المودال
const isAddModalOpen = ref(false);

// 3. السحر هنا: بنقرأ الأدوية مباشرة من الـ Store
const currentMeds = computed(() => {
  return draftStore.planItems.filter(item => item.kind === 'medication');
});

// 4. دوال الإضافة بتروح للـ Store
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

// 5. دالة الحذف بتمسح من الـ Store
function removeMed(id: string) {
  draftStore.removePlanItem(id);
}
</script>
