<template>
  <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5 animate-in fade-in duration-300">

    <!-- Header -->
    <div class="flex items-center gap-2 border-b border-slate-100 pb-3">
      <div class="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-xs">2</div>
      <h3 class="font-extrabold text-slate-800 text-sm">بيانات الروشتة الأساسية (BASIC CLINICAL INFO)</h3>
    </div>

    <!-- 1. Diagnosis Selection (محدث لدعم التعدد) -->
    <div>
      <div class="flex justify-between items-center mb-1.5">
        <label class="block text-xs font-bold text-slate-700">
          التشخيصات الطبية (ICD-10) <span class="text-rose-500">*</span>
        </label>
        <button
          @click="openAddDiagnosisModal"
          class="text-xs text-blue-600 font-bold hover:text-blue-800 hover:underline flex items-center gap-1 transition"
        >
          <Plus class="w-3.5 h-3.5" /> إضافة تشخيص جديد
        </button>
      </div>

      <!-- ✅ عرض التشخيصات المختارة كبطاقات (Tags) -->
      <div v-if="draftStore.diagnoses.length > 0" class="flex flex-wrap gap-2 mb-3">
        <div
          v-for="diag in draftStore.diagnoses"
          :key="diag.icd10"
          class="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-800 px-3 py-1.5 rounded-lg text-xs font-bold group transition hover:bg-blue-100"
        >
          <span class="font-mono text-blue-600">{{ diag.icd10 }}</span>
          <span class="truncate max-w-[150px]">{{ diag.title }}</span>
          <button
            @click="removeDiagnosis(diag.icd10)"
            class="ml-1 text-blue-400 hover:text-rose-600 hover:bg-rose-50 rounded-full p-0.5 transition"
            title="إزالة التشخيص"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- Dropdown للبحث عن تشخيصات إضافية -->
      <div class="relative">
        <button
          @click="showDropdown = !showDropdown"
          class="w-full p-3 border border-dashed border-slate-300 rounded-xl text-sm text-slate-500 flex justify-between items-center transition hover:border-teal-500 hover:bg-slate-50"
        >
          <span class="flex items-center gap-1">
            <Plus class="w-4 h-4" />
            {{ draftStore.diagnoses.length > 0 ? 'إضافة تشخيص آخر...' : 'اختر التشخيص من سجل المريض أو ابحث...' }}
          </span>
          <ChevronDown class="w-4 h-4 text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': showDropdown }" />
        </button>

        <!-- القائمة المنسدلة -->
        <div v-if="showDropdown" class="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-64 overflow-hidden flex flex-col">
          <div class="p-2 border-b border-slate-100 bg-slate-50/50">
            <div class="relative">
              <Search class="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="ابحث باسم المرض أو الكود..."
                class="w-full p-2 pr-8 text-xs border border-slate-200 rounded-lg outline-none focus:border-teal-500 bg-white"
                autofocus
                @keydown.escape="showDropdown = false"
              >
            </div>
          </div>

          <div class="overflow-y-auto flex-1 custom-scrollbar">
            <div
              v-for="diag in filteredPatientDiagnoses"
              :key="diag.id"
              @click="selectDiagnosis(diag)"
              class="p-3 hover:bg-teal-50 cursor-pointer border-b border-slate-50 last:border-0 transition flex flex-col group"
            >
              <span class="text-sm font-bold text-slate-800 group-hover:text-teal-800">{{ diag.title }}</span>
              <span class="text-[10px] font-mono text-blue-600 mt-0.5 flex items-center gap-2">
                ICD-10: {{ diag.icd10 }}
                <span class="text-slate-400">•</span>
                {{ diag.date }}
              </span>
            </div>

            <div v-if="filteredPatientDiagnoses.length === 0" class="p-6 text-center text-slate-400 text-xs">
              <Search class="w-6 h-6 mx-auto mb-2 opacity-30" />
              لا توجد تشخيصات مطابقة في سجل هذا المريض.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Treatment Duration -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1.5">تاريخ بداية العلاج</label>
        <input v-model="draftStore.startDate" type="date" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition">
      </div>
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1.5">إلى تاريخ النهاية</label>
        <input v-model="draftStore.endDate" type="date" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition">
      </div>
      <div class="flex items-end">
        <div
          class="w-full border p-2.5 rounded-lg text-sm font-bold text-center flex items-center justify-center gap-1 transition"
          :class="hasDateError ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'"
        >
          <Clock class="w-4 h-4" />
          المدة: {{ courseDuration }} يوم
        </div>
      </div>
    </div>

    <!-- 3. General Instructions -->
    <div>
      <label class="block text-xs font-bold text-slate-700 mb-1.5">تعليمات عامة وتوجيهات سريرية للمريض</label>
      <textarea
        v-model="draftStore.clinicalNotes"
        rows="3"
        placeholder="الراحة التامة أول 3 أيام، تجنب رفع الأشياء الثقيلة، شرب سوائل كثيرة..."
        class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 bg-slate-50 resize-none transition"
      ></textarea>
    </div>

    <!-- 4. Follow-up Required (المتابعة) -->
    <div class="border border-slate-200 rounded-xl overflow-hidden">
      <div class="bg-slate-50 p-3 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition" @click="draftStore.requiresFollowUp = !draftStore.requiresFollowUp">
        <label class="text-sm font-bold text-slate-800 cursor-pointer flex items-center gap-2 select-none">
          <input
            type="checkbox"
            v-model="draftStore.requiresFollowUp"
            class="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
          >
          يحتاج موعد متابعة سريرية (Follow-up Required)
        </label>
        <ChevronDown class="w-4 h-4 text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': draftStore.requiresFollowUp }" />
      </div>

      <!-- Conditional Fields -->
      <div v-if="draftStore.requiresFollowUp" class="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white animate-in slide-in-from-top-2 border-t border-slate-100">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">تاريخ الحجز المقترح</label>
          <input v-model="draftStore.followUpDate" type="date" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none focus:border-teal-500 transition">
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">الساعة المقترحة</label>
          <input v-model="draftStore.followUpTime" type="time" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none focus:border-teal-500 transition">
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">العيادة المعنية</label>
          <select v-model="draftStore.followUpClinic" class="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none focus:border-teal-500 transition">
            <option value="">اختر العيادة...</option>
            <option value="عيادة العظام">عيادة العظام</option>
            <option value="عيادة الباطنة">عيادة الباطنة</option>
            <option value="عيادة الجراحة">عيادة الجراحة</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Validation Warning -->
    <div v-if="hasValidationError" class="bg-rose-50 border border-rose-200 p-3 rounded-xl text-rose-700 text-xs font-bold flex items-start gap-2 animate-in fade-in">
      <AlertCircle class="w-4 h-4 shrink-0 mt-0.5" />
      <span>{{ validationErrorMessage }}</span>
    </div>

    <!-- Add Diagnosis Modal Overlay -->
    <div v-if="isAddDiagnosisOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div class="w-full h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col">
        <div class="p-3 border-b border-slate-100 flex justify-end bg-slate-50">
          <button @click="isAddDiagnosisOpen = false" class="text-slate-500 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="flex-1 overflow-y-auto">
          <DiagnosesSection
            @close="isAddDiagnosisOpen = false"
            @open-prescription="handleOpenPrescriptionFromDiagnosis"
          />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ChevronDown, AlertCircle, Plus, Search, Clock, X } from 'lucide-vue-next';
import { usePrescriptionDraftStore } from '../../../stores/prescriptionDraftStore';
import { useMedicalRecordStore } from '../../../stores/medicalRecordStore';
import { useDoctorQueueStore } from '../../../stores/doctorQueueStore';
import DiagnosesSection from './DiagnosesSection.vue';

const draftStore = usePrescriptionDraftStore();
const recordStore = useMedicalRecordStore();
const queueStore = useDoctorQueueStore();

// --- حالة القائمة المنسدلة ---
const showDropdown = ref(false);
const searchQuery = ref('');
const isAddDiagnosisOpen = ref(false);

// جلب تشخيصات المريض الحالي
const patientDiagnoses = computed(() => {
  if (!queueStore.selectedPatient && !queueStore.activePatient) return [];
  const currentPatient = queueStore.activePatient || queueStore.selectedPatient;
  return recordStore.diagnoses.filter(d => d.patient_id === currentPatient?.id);
});

// فلترة التشخيصات بناءً على البحث
const filteredPatientDiagnoses = computed(() => {
  if (!searchQuery.value) return patientDiagnoses.value;
  const q = searchQuery.value.toLowerCase();
  return patientDiagnoses.value.filter(d =>
    (d.title?.toLowerCase() || '').includes(q) ||
    (d.icd10?.toLowerCase() || '').includes(q)
  );
});

// ✅ دالة اختيار التشخيص (تضيف للمصفوفة بدلاً من الاستبدال)
function selectDiagnosis(diag: any) {
  draftStore.addDiagnosis(diag.icd10, diag.title);
  showDropdown.value = false;
  searchQuery.value = '';
}

// ✅ دالة إزالة تشخيص محدد
function removeDiagnosis(icd10: string) {
  draftStore.removeDiagnosis(icd10);
}

// دالة فتح نافذة إضافة تشخيص جديد
function openAddDiagnosisModal() {
  isAddDiagnosisOpen.value = true;
  showDropdown.value = false;
}

// دالة معالجة العودة من قسم التشخيصات إلى الروشتة
function handleOpenPrescriptionFromDiagnosis() {
  isAddDiagnosisOpen.value = false;
}

// --- حسابات المدة والتحقق من التواريخ ---
const hasDateError = computed(() => {
  if (draftStore.startDate && draftStore.endDate) {
    return new Date(draftStore.endDate) < new Date(draftStore.startDate);
  }
  return false;
});

const courseDuration = computed(() => {
  if (!draftStore.startDate || !draftStore.endDate) return 0;
  const start = new Date(draftStore.startDate);
  const end = new Date(draftStore.endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return 0;
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
});

// --- التحقق من صحة البيانات ---
const hasValidationError = computed(() => {
  return hasDateError.value || (draftStore.requiresFollowUp && !draftStore.followUpDate);
});

const validationErrorMessage = computed(() => {
  if (hasDateError.value) return 'تاريخ النهاية لا يمكن أن يكون قبل تاريخ البداية.';
  if (draftStore.requiresFollowUp && !draftStore.followUpDate) return 'يرجى تحديد تاريخ المتابعة المقترح عند تفعيل خيار المتابعة.';
  return '';
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
</style>
