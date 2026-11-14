<template>
  <div class="space-y-5">
    <!-- بيانات التواصل -->
    <div class="bg-white rounded-2xl border border-slate-200 p-5">
      <h3 class="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
        <Phone class="w-4 h-4 text-teal-600" /> بيانات التواصل
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div><p class="text-[11px] text-slate-400 mb-1">الهاتف</p><p class="font-bold text-slate-700" dir="ltr">{{ patient.phone ?? '—' }}</p></div>
        <div><p class="text-[11px] text-slate-400 mb-1">المدينة</p><p class="font-bold text-slate-700">{{ patient.city ?? '—' }}</p></div>
        <div><p class="text-[11px] text-slate-400 mb-1">فصيلة الدم</p><p class="font-bold text-rose-700">{{ patient.bloodType ?? '—' }}</p></div>
        <div><p class="text-[11px] text-slate-400 mb-1">رقم الملف</p><p class="font-bold text-slate-700 font-mono">{{ patient.mrn ?? patient.id }}</p></div>
      </div>
    </div>

    <!-- الحساسية والأمراض المزمنة -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div class="bg-rose-50/50 rounded-2xl border border-rose-100 p-5">
        <h3 class="font-bold text-rose-800 text-sm mb-3 flex items-center gap-2">
          <AlertTriangle class="w-4 h-4" /> الحساسية المعروفة
        </h3>
        <div class="flex flex-wrap gap-2">
          <span v-for="a in patient.allergies" :key="a" class="bg-white text-rose-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-rose-200">{{ a }}</span>
          <span v-if="patient.allergies.length === 0" class="text-xs text-rose-400 italic">لا توجد حساسية مسجلة</span>
        </div>
      </div>
      <div class="bg-blue-50/50 rounded-2xl border border-blue-100 p-5">
        <h3 class="font-bold text-blue-800 text-sm mb-3 flex items-center gap-2">
          <HeartPulse class="w-4 h-4" /> الأمراض المزمنة
        </h3>
        <div class="flex flex-wrap gap-2">
          <span v-for="c in patient.chronicConditions" :key="c" class="bg-white text-blue-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-200">{{ c }}</span>
          <span v-if="patient.chronicConditions.length === 0" class="text-xs text-blue-400 italic">لا توجد أمراض مزمنة مسجلة</span>
        </div>
      </div>
    </div>

    <!-- آخر القياسات الحيوية -->
    <div class="bg-white rounded-2xl border border-slate-200 p-5">
      <h3 class="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
        <Activity class="w-4 h-4 text-teal-600" /> آخر القياسات الحيوية
      </h3>
      <div v-if="latestVitals.length === 0" class="text-center py-6 text-slate-400 text-xs">لا توجد قياسات مسجلة لهذا المريض</div>
      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div v-for="v in latestVitals" :key="v.id" class="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
          <p class="text-lg font-extrabold" :class="vitalColor(v.status)">{{ v.value }}</p>
          <p class="text-[10px] text-slate-400 mt-1">{{ vitalLabel(v.type) }} · {{ v.unit }}</p>
          <p class="text-[9px] text-slate-300 mt-0.5">{{ v.date }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Phone, AlertTriangle, HeartPulse, Activity } from 'lucide-vue-next';
import { useMedicalRecordStore, type VitalRecord } from '../../../../stores/medicalRecordStore';
import type { PatientRecord } from '../../../../types/patient';

const props = defineProps<{ patient: PatientRecord }>();
const recordStore = useMedicalRecordStore();

const latestVitals = computed(() => {
  const map = new Map<string, VitalRecord>();
  for (const v of recordStore.vitals.filter(v => v.patient_id === props.patient.id)) {
    const prev = map.get(v.type);
    if (!prev || v.date > prev.date) map.set(v.type, v);
  }
  return Array.from(map.values());
});

function vitalLabel(type: string): string {
  return { bp: 'الضغط', hr: 'النبض', weight: 'الوزن', glucose: 'السكر' }[type] ?? type;
}
function vitalColor(status: string): string {
  if (status === 'critical') return 'text-rose-600';
  if (status === 'warning') return 'text-amber-600';
  return 'text-slate-800';
}
</script>
