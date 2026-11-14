<template>
  <div class="space-y-5">
    <!-- الزيارات (الحجوزات) -->
    <div class="bg-white rounded-2xl border border-slate-200 p-5">
      <h3 class="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
        <CalendarCheck class="w-4 h-4 text-teal-600" /> الزيارات ({{ visits.length }})
      </h3>
      <div v-if="visits.length === 0" class="text-center py-6 text-slate-400 text-xs">لا توجد زيارات مسجلة</div>
      <div v-else class="space-y-2">
        <div v-for="v in visits" :key="v.id" class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div class="min-w-0">
            <p class="text-sm font-bold text-slate-800 truncate">{{ v.reason }}</p>
            <p class="text-[11px] text-slate-400 mt-0.5">{{ v.date }} · {{ v.time }}</p>
          </div>
          <span class="text-[10px] font-bold px-2 py-1 rounded-lg shrink-0" :class="statusClass(v.status)">{{ statusLabel(v.status) }}</span>
        </div>
      </div>
    </div>

    <!-- الروشتات -->
    <div class="bg-white rounded-2xl border border-slate-200 p-5">
      <h3 class="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
        <Pill class="w-4 h-4 text-teal-600" /> الروشتات ({{ prescriptions.length }})
      </h3>
      <div v-if="prescriptions.length === 0" class="text-center py-6 text-slate-400 text-xs">لا توجد روشتات لهذا المريض</div>
      <div v-else class="space-y-2">
        <div v-for="rx in prescriptions" :key="rx.id" class="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div class="flex items-center justify-between mb-1">
            <p class="text-sm font-bold text-slate-800">{{ rx.title }}</p>
            <span class="text-[10px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded">{{ rx.id }}</span>
          </div>
          <p class="text-[11px] text-slate-400">
            {{ rx.starts_on }} → {{ rx.ends_on }} · {{ rx.plan_items?.length ?? 0 }} عنصر
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CalendarCheck, Pill } from 'lucide-vue-next';
import { useAppointmentStore } from '../../../../stores/appointmentStore';
import { usePrescriptionStore } from '../../../../stores/prescriptionStore';
import type { PatientRecord } from '../../../../types/patient';

const props = defineProps<{ patient: PatientRecord }>();
const appointmentStore = useAppointmentStore();
const prescriptionStore = usePrescriptionStore();

const visits = computed(() =>
  appointmentStore.getAppointmentsByPatient(props.patient.id)
    .slice()
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))
);

const prescriptions = computed(() =>
  prescriptionStore.prescriptions
    .filter(rx => rx.patient_id === props.patient.id)
    .slice()
    .sort((a, b) => (b.starts_on ?? '').localeCompare(a.starts_on ?? ''))
);

function statusLabel(s: string): string {
  return { Confirmed: 'مؤكد', Pending: 'بانتظار', Completed: 'مكتمل', Cancelled: 'ملغي', NoShow: 'لم يحضر', NeedsReschedule: 'يحتاج إعادة جدولة' }[s] ?? s;
}
function statusClass(s: string): string {
  if (s === 'Confirmed' || s === 'Completed') return 'bg-emerald-50 text-emerald-700';
  if (s === 'Cancelled' || s === 'NoShow') return 'bg-rose-50 text-rose-700';
  return 'bg-amber-50 text-amber-700';
}
</script>
