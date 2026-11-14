<template>
  <div class="max-w-6xl mx-auto p-6 space-y-5" dir="rtl">
    <!-- حالة: غير موجود / ليس من مرضاي -->
    <div v-if="!patient || !isMine" class="bg-white rounded-2xl border border-slate-200 p-12 text-center">
      <UserX class="w-14 h-14 text-slate-300 mx-auto mb-3" />
      <h2 class="text-lg font-bold text-slate-700">{{ !patient ? 'المريض غير موجود' : 'هذا المريض ليس ضمن ملفاتك' }}</h2>
      <p class="text-sm text-slate-400 mt-1 mb-5">تحقق من الرابط أو عد إلى أرشيف المرضى.</p>
      <button @click="router.push('/doctor/archive')" class="bg-teal-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-teal-700 transition text-sm">
        العودة للأرشيف
      </button>
    </div>

    <template v-else>
      <!-- الترويسة بدون مؤقت -->
<PatientHeader
  :patient="patient"
  :show-timer="false"
  :clinical-editable="false"
/>
      <!-- التبويبات -->
      <div class="grid grid-cols-4 gap-2 bg-slate-100 p-1.5 rounded-2xl">
        <button v-for="t in tabs" :key="t.key" type="button" @click="activeTab = t.key"
          :class="['py-2.5 rounded-xl text-sm font-bold transition-all', activeTab === t.key ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 hover:bg-white']">
          {{ t.label }}
        </button>
      </div>

      <PatientOverviewTab v-if="activeTab === 'overview'" :patient="patient" />
      <PatientVisitsTab v-else-if="activeTab === 'visits'" :patient="patient" />
      <PatientDiagnosesTab v-else-if="activeTab === 'diagnoses'" :patient="patient" />
      <PatientPaymentsTab v-else :patient="patient" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { UserX } from 'lucide-vue-next';
import PatientHeader from './components/PatientHeader.vue';
import PatientOverviewTab from './components/patient/PatientOverviewTab.vue';
import PatientVisitsTab from './components/patient/PatientVisitsTab.vue';
import PatientDiagnosesTab from './components/patient/PatientDiagnosesTab.vue';
import PatientPaymentsTab from './components/patient/PatientPaymentsTab.vue';
import { usePatientResolver, normalizePatientId } from './composables/usePatientResolver';
import { useDoctorPatients } from './composables/useDoctorPatients';

const route = useRoute();
const router = useRouter();
const { resolvePatient } = usePatientResolver();
const { doctorPatientIds } = useDoctorPatients();

const patientId = computed(() => normalizePatientId(String(route.params.id)));
const patient = computed(() => resolvePatient(patientId.value));
const isMine = computed(() => doctorPatientIds.value.includes(patientId.value));

const activeTab = ref<'overview' | 'visits' | 'diagnoses' | 'payments'>('overview');
const tabs = [
  { key: 'overview', label: 'نظرة عامة' },
  { key: 'visits', label: 'الزيارات والروشتات' },
  { key: 'diagnoses', label: 'التشخيصات' },
  { key: 'payments', label: 'المدفوعات' },
] as const;
</script>
