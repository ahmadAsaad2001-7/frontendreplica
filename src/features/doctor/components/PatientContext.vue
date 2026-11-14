//patintContext
<template>
  <div v-if="selectedPatient" class="space-y-4 animate-in fade-in duration-300">

    <!-- 0. Smart Banner -->
    <div v-if="selectedPatient.id !== activePatientId" class="bg-blue-600 text-white p-4 rounded-2xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 animate-in fade-in slide-in-from-top-2">
      <div class="flex items-center gap-3">
        <Info class="w-6 h-6 shrink-0" />
        <div>
          <p class="font-bold text-sm">أنت تستعرض ملف: {{ selectedPatient.name }}</p>
          <p class="text-xs text-blue-200 mt-0.5">
            {{ selectedPatient.status === 'Completed' ? 'هذه الجلسة منتهية (وضع القراءة فقط).' : 'هذا المريض في الانتظار. يمكنك مراجعة ملفه أو بدء الكشف.' }}
          </p>
        </div>
      </div>

      <button
        v-if="selectedPatient.status !== 'Completed'"
        @click="doctorStore.startConsultation(selectedPatient.id)"
        class="bg-white text-blue-700 font-bold px-6 py-2.5 rounded-xl shadow-sm hover:bg-blue-50 transition flex items-center gap-2 shrink-0 w-full sm:w-auto justify-center"
      >
        <Play class="w-4 h-4" /> بدء الكشف الآن
      </button>
    </div>

<!-- 1. Patient Header (محدث مع التنقل السليم لملف المريض) -->
    <PatientHeader
      :patient="selectedPatient"
      @edit-patient="console.log('edit')"
      @view-full-record="openPatientFile(selectedPatient?.id ?? '')"
      @add-allergy="isAddAllergyOpen = true"
      @add-condition="isAddConditionOpen = true"
    />

    <!-- 2. Alert Banners -->
    <AlertBanners
      :patient="selectedPatient"
      @allergy-click="console.log('allergy')"
      @procedure-click="console.log('procedure')"
      @fasting-click="console.log('fasting')"
    />

    <!-- 3. Main Content Area -->
    <div class="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm">

      <!-- Action Bar (شبكة الكروت الأربعة) -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-3 px-1">
          <div class="flex items-center gap-2 text-slate-800 font-bold">
            <LayoutGrid class="w-5 h-5 text-blue-600" />
            أقسام الملف الطبي
          </div>
          <button @click="toggleAllSections" class="text-sm font-bold text-blue-600 hover:underline">
            {{ anySectionOpen ? 'إغلاق كل الأقسام' : 'فتح كل الأقسام' }}
          </button>
        </div>

        <!-- شبكة الكروت -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">

          <!-- 1. قسم الأدوية وسبب الزيارة -->
          <button
            @click="toggleSection('visit')"
            :class="[
              'relative overflow-hidden p-4 rounded-2xl border-2 transition-all flex flex-col text-right group',
              openSections.visit ? 'bg-orange-50 border-orange-500 shadow-sm' : 'bg-white border-slate-100 hover:border-orange-200'
            ]"
          >
            <div class="flex justify-between items-start w-full mb-3 relative z-10">
              <div :class="openSections.visit ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-600'" class="w-10 h-10 rounded-xl flex items-center justify-center transition-colors">
                <Pill class="w-5 h-5" />
              </div>
              <span v-if="openSections.visit" class="bg-white text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded border border-orange-200">نشط</span>
            </div>
            <h3 :class="openSections.visit ? 'text-orange-900' : 'text-slate-800'" class="font-bold text-sm relative z-10 mb-1">الأدوية وسبب الزيارة</h3>
            <p class="text-xs text-slate-500 relative z-10">2 أدوية حالية</p>
            <svg class="absolute -left-4 -bottom-6 w-32 h-32 opacity-10 text-orange-500 transition-transform group-hover:scale-110" viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="12" y="34" width="72" height="28" rx="14"/><path d="M48 34v28"/><path d="M26 34h22v28H26a14 14 0 0 1 0-28z" fill="currentColor" fill-opacity=".3" stroke="none"/><g transform="rotate(25 84 88)"><rect x="56" y="76" width="56" height="24" rx="12"/><path d="M84 76v24"/></g><circle cx="96" cy="30" r="16"/><path d="M85 41l22-22"/>
            </svg>
          </button>

          <!-- 2. قسم التشخيصات (الكارت) -->
          <button
            @click="toggleSection('diagnoses')"
            :class="[
              'relative overflow-hidden p-4 rounded-2xl border-2 transition-all flex flex-col text-right group',
              openSections.diagnoses ? 'bg-blue-50 border-blue-500 shadow-sm' : 'bg-white border-slate-100 hover:border-blue-200'
            ]"
          >
            <div class="flex justify-between items-start w-full mb-3 relative z-10">
              <div :class="openSections.diagnoses ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'" class="w-10 h-10 rounded-xl flex items-center justify-center transition-colors">
                <FileText class="w-5 h-5" />
              </div>
              <span v-if="openSections.diagnoses" class="bg-white text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">نشط</span>
            </div>
            <h3 :class="openSections.diagnoses ? 'text-blue-900' : 'text-slate-800'" class="font-bold text-sm relative z-10 mb-1">السجل الطبي والتشخيصات</h3>
            <p class="text-xs text-slate-500 relative z-10">{{ patientDiagnoses.length }} تشخيصات مسجلة</p>
            <svg class="absolute -left-4 -bottom-6 w-32 h-32 opacity-10 text-blue-600" viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="20" y="10" width="70" height="96" rx="10"/><path d="M36 30h28M36 44h38"/><path d="M8 82h26l8-18 12 34 10-24 8 8h40"/><path d="M76 24v12M70 30h12"/>
            </svg>
          </button>

          <!-- 3. قسم الروشتة الرقمية -->
          <button
            @click="toggleSection('prescription')"
            :class="[
              'relative overflow-hidden p-4 rounded-2xl border-2 transition-all flex flex-col text-right group',
              openSections.prescription ? 'bg-emerald-50 border-emerald-500 shadow-sm' : 'bg-white border-slate-100 hover:border-emerald-200'
            ]"
          >
            <div class="flex justify-between items-start w-full mb-3 relative z-10">
              <div :class="openSections.prescription ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600'" class="w-10 h-10 rounded-xl flex items-center justify-center transition-colors">
                <FileSignature class="w-5 h-5" />
              </div>
              <span v-if="openSections.prescription" class="bg-white text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">نشط</span>
            </div>
            <h3 :class="openSections.prescription ? 'text-emerald-900' : 'text-slate-800'" class="font-bold text-sm relative z-10 mb-1">إنشاء وصفة طبية</h3>
            <p class="text-xs text-slate-500 relative z-10">بدون أدوية معلقة</p>
            <svg class="absolute -left-4 -bottom-6 w-32 h-32 opacity-10 text-emerald-600" viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="18" y="10" width="68" height="96" rx="10"/><path d="M34 56V28h14a9 9 0 0 1 0 18H34M44 46l14 14M54 34l10 12M64 34L54 46"/><path d="M34 74h36M34 88h26"/><path d="M92 68l14-14 8 8-14 14-10 2z"/>
            </svg>
          </button>

          <!-- 4. قسم الكورس والمهام -->
          <button
            @click="toggleSection('tasks')"
            :class="[
              'relative overflow-hidden p-4 rounded-2xl border-2 transition-all flex flex-col text-right group',
              openSections.tasks ? 'bg-purple-50 border-purple-500 shadow-sm' : 'bg-white border-slate-100 hover:border-purple-200'
            ]"
          >
            <div class="flex justify-between items-start w-full mb-3 relative z-10">
              <div :class="openSections.tasks ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-600'" class="w-10 h-10 rounded-xl flex items-center justify-center transition-colors">
                <ListTodo class="w-5 h-5" />
              </div>
              <span v-if="openSections.tasks" class="bg-white text-purple-600 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-200">نشط</span>
            </div>
            <h3 :class="openSections.tasks ? 'text-purple-900' : 'text-slate-800'" class="font-bold text-sm relative z-10 mb-1">الكورس العلاجي والمهام</h3>
            <p class="text-xs text-slate-500 relative z-10">60% مكتمل</p>
            <svg class="absolute -left-4 -bottom-6 w-32 h-32 opacity-10 text-purple-600" viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="14" y="12" width="76" height="96" rx="10"/><path d="M28 36l5 5 9-10M50 36h28M28 60l5 5 9-10M50 60h28"/><rect x="28" y="78" width="14" height="14" rx="3"/><path d="M50 85h20"/><circle cx="92" cy="88" r="18" opacity=".35"/><circle cx="92" cy="88" r="18" stroke-dasharray="70 120" transform="rotate(-90 92 88)"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Sections Content (المحتوى يظهر هنا تحت الكروت) -->
      <div class="space-y-6">

        <!-- ✅ قسم التشخيصات (تم إضافة مستمع الحدث هنا) -->
        <div v-if="openSections.diagnoses" class="animate-in fade-in duration-200 border-t border-slate-100 pt-4">
          <DiagnosesSection @open-prescription="goToPrescription" />
        </div>

        <!-- قسم المهام -->
        <div v-if="openSections.tasks" class="animate-in fade-in duration-200 border-t border-slate-100 pt-4">
          <PatientAdherenceTracker />
        </div>

        <!-- قسم الروشتة -->
        <div v-if="openSections.prescription" class="animate-in fade-in duration-200 border-t border-slate-100 pt-4">
          <DigitalPrescriptionView />
        </div>

        <!-- قسم الزيارة -->
        <div v-if="openSections.visit" class="animate-in fade-in duration-200 border-t border-slate-100 pt-4">
          <PatientVisitReason />
        </div>
      </div>
    </div>

    <!-- Right Sidebar Widgets -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      <ProceduresSidebar
        :procedures="mockProcedures"
        @add-procedure="console.log('add')"
        @patient-prep="console.log('prep')"
        @reschedule="console.log('reschedule')"
        @view-full-calendar="console.log('calendar')"
      />

      <QuickActionsSidebar
        @order-labs="isLabsModalOpen = true"
        @prescribe-medication="$router.push('/doctor/prescribe')"
        @referral="console.log('referral')"
        @order-radiology="isRadiologyModalOpen = true"
        @end-session="handleEndSession"
      />

      <VitalsSidebar :vitals="mockVitals" @select-vital="console.log('vital')" />

      <AllergiesSidebar
        :allergies="mockAllergies"
        @add-allergy="isAddAllergyOpen = true"
        @select-allergy="console.log('allergy')"
      />
    </div>

    <!-- Modals -->
    <OrderLabsModal :is-open="isLabsModalOpen" @close="isLabsModalOpen = false" @confirm="handleLabsConfirm" />
    <EndSessionModal :is-open="isEndSessionModalOpen" :patient-name="selectedPatient?.name || 'المريض'" @close="isEndSessionModalOpen = false" @confirm="handleEndSessionConfirm" />
    <DiagnosticRequestModal :is-open="isRequestModalOpen" :type="requestType" :patient-name="selectedPatient?.name || ''" :patient-mrn="selectedPatient?.mrn || 'MRN-0000'" :doctor-name="'د. طارق الحكيم'" @close="isRequestModalOpen = false" @generate="handleRequestGenerated" />
    <RadiologyRequestModal :is-open="isRadiologyModalOpen" :patient-name="selectedPatient?.name || ''" :patient-mrn="selectedPatient?.mrn || 'MRN-0000'" :doctor-name="'د. طارق الحكيم'" @close="isRadiologyModalOpen = false" @generate="handleRadiologyGenerated" />
    <DiagnosticDocument :request="activeDocument" :patient-name="selectedPatient?.name || ''" @close="activeDocument = null" />
    <RadiologyDocument :request="activeRadiologyDoc" :patient-name="selectedPatient?.name || ''" @close="activeRadiologyDoc = null" />

    <!-- ✅ نوافذ الحساسية والأمراض المزمنة الجديدة -->
    <AddAllergyModal
      :is-open="isAddAllergyOpen"
      @close="isAddAllergyOpen = false"
      @save="handleSaveAllergy"
    />
    <AddConditionModal
      :is-open="isAddConditionOpen"
      @close="isAddConditionOpen = false"
      @save="handleSaveCondition"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

// الأيقونات
import { LayoutGrid, Pill, FileText, FileSignature, ListTodo, Info, Play } from 'lucide-vue-next';

// استدعاء المكونات
import PatientHeader from './PatientHeader.vue';
import AlertBanners from './AlertBanners.vue';
import ProceduresSidebar from './ProceduresSidebar.vue';
import QuickActionsSidebar from './QuickActionsSidebar.vue';
import VitalsSidebar from './VitalsSidebar.vue';
import AllergiesSidebar from './AllergiesSidebar.vue';
import PatientAdherenceTracker from './PatientAdherenceTracker.vue';
import DigitalPrescriptionView from './DigitalPrescriptionView.vue';
import PatientVisitReason from './PatientVisitReason.vue';

// ✅ المكون الجديد الخاص بالتشخيصات
import DiagnosesSection from './DiagnosesSection.vue';

// استدعاء المودالات
import OrderLabsModal from './modals/OrderLabsModal.vue';
import EndSessionModal from './modals/EndSessionModal.vue';
import DiagnosticRequestModal from './modals/DiagnosticRequestModal.vue';
import RadiologyRequestModal from './modals/RadiologyRequestModal.vue';
import DiagnosticDocument from './modals/DiagnosticDocument.vue';
import RadiologyDocument from './modals/RadiologyDocument.vue';

// ✅ استيراد النوافذ الجديدة
import AddAllergyModal from './modals/AddAllergyModal.vue';
import AddConditionModal from './modals/AddConditionModal.vue';

// استدعاء الـ Stores
import { useDoctorQueueStore } from '../../../stores/doctorQueueStore';
import { useMedicalRecordStore } from '../../../stores/medicalRecordStore';
import { useProfileStore } from '../../../stores/profileStore'; // ✅ تمت الإضافة
import type { DiagnosticRequest } from '../../../stores/medicalRecordStore';
import { useOpenPatientFile } from '../composables/useOpenPatientFile';

const { openPatientFile } = useOpenPatientFile();

const doctorStore = useDoctorQueueStore();
const recordStore = useMedicalRecordStore();
const profileStore = useProfileStore(); // ✅ تهيئة المتجر
const router = useRouter();

const { selectedPatient, activePatientId } = storeToRefs(doctorStore);

// --- إدارة حالة الأقسام ---
const openSections = ref({
  visit: false,
  diagnoses: true,
  prescription: false,
  tasks: false
});

const anySectionOpen = computed(() => Object.values(openSections.value).some(val => val));

function toggleSection(section: keyof typeof openSections.value) {
  openSections.value[section] = !openSections.value[section];
}

function toggleAllSections() {
  const allOpen = anySectionOpen.value;
  Object.keys(openSections.value).forEach(key => {
    openSections.value[key as keyof typeof openSections.value] = !allOpen;
  });
}

// ✅ دالة الانتقال من التشخيص إلى الروشتة
function goToPrescription() {
  openSections.value.diagnoses = false;
  openSections.value.prescription = true;
}

// --- حالات المودالات ---
const isLabsModalOpen = ref(false);
const isEndSessionModalOpen = ref(false);
const isRequestModalOpen = ref(false);
const isRadiologyModalOpen = ref(false);
const requestType = ref<'lab' | 'radiology'>('lab');

// ✅ حالات النوافذ الجديدة
const isAddAllergyOpen = ref(false);
const isAddConditionOpen = ref(false);

const activeDocument = ref<DiagnosticRequest | null>(null);
const activeRadiologyDoc = ref<DiagnosticRequest | null>(null);

// --- دوال التشخيص (محدثة) ---
const patientDiagnoses = computed(() => {
  if (!selectedPatient.value) return [];
  return recordStore.diagnoses.filter(d => d.patient_id === selectedPatient.value?.id);
});

// --- دوال المودالات ---
function handleLabsConfirm(data: any) {
  console.log('تم طلب التحاليل:', data);
  alert(`تم إرسال طلب تحليل: ${data.testName} إلى المختبر بنجاح.`);
}

function handleEndSession() {
  if (confirm('هل أنت متأكد من إنهاء الجلسة واستدعاء المريض التالي؟')) {
    doctorStore.callNextPatient();
  }
}

function handleEndSessionConfirm() {
  isEndSessionModalOpen.value = false;
  doctorStore.callNextPatient();
}

function handleRequestGenerated(data: { testName: string, notes: string }) {
  if (!selectedPatient.value) return;
  const newRequest: DiagnosticRequest = {
    id: `req_${Date.now()}`,
    patient_id: selectedPatient.value.id,
    patient_mrn: selectedPatient.value.mrn || 'MRN-0000',
    doctor_name: 'د. طارق الحكيم',
    type: requestType.value,
    test_name: data.testName,
    notes: data.notes,
    date: new Date().toLocaleDateString('ar-EG'),
    qr_code: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=REQ-${Date.now()}`
  };
  recordStore.addDiagnosticRequest(newRequest);
  activeDocument.value = newRequest;
}

function handleRadiologyGenerated(data: { testName: string, notes: string }) {
  if (!selectedPatient.value) return;
  const newRequest: DiagnosticRequest = {
    id: `rad_${Date.now()}`,
    patient_id: selectedPatient.value.id,
    patient_mrn: selectedPatient.value.mrn || 'MRN-0000',
    doctor_name: 'د. طارق الحكيم',
    type: 'radiology',
    test_name: data.testName,
    notes: data.notes,
    date: new Date().toLocaleDateString('ar-EG'),
    qr_code: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=RAD-${Date.now()}`
  };
  recordStore.addDiagnosticRequest(newRequest);
  activeRadiologyDoc.value = newRequest;
}

// ✅ دوال حفظ الحساسية والأمراض المزمنة
function handleSaveAllergy(data: any) {
  profileStore.addAllergy({
    patientId: selectedPatient.value?.id || '',
    ...data
  });
  isAddAllergyOpen.value = false;
}

function handleSaveCondition(data: any) {
  profileStore.addChronicCondition({
    patientId: selectedPatient.value?.id || '',
    ...data
  });
  isAddConditionOpen.value = false;
}

// --- بيانات تجريبية ---
const mockProcedures = [
  { id: '1', type: 'urgent', typeLabel: 'إجراء عاجل اليوم', title: 'عملية استئصال الزائدة الدودية', time: '02:00 م', location: 'غرفة العمليات 3' }
];

const mockVitals = [
  { id: 'hr1', type: 'heart_rate', title: 'نبضات القلب', value: '72', unit: 'نبضة/دقيقة', changeRate: '2%' },
  { id: 'bp1', type: 'blood_pressure', title: 'ضغط الدم', value: '120/80', unit: 'mmHg', subtext: 'مستقر' }
];

const mockAllergies = [
  { id: 'alg1', substance: 'بنسلين', severity: 'شديدة', reaction: 'طفح جلدي وضيق تنفس' },
  { id: 'alg2', substance: 'سلفا', severity: 'متوسطة', reaction: 'حكة جلدية' }
];
</script>
