<template>
  <div class="bg-white rounded-2xl border border-slate-200 p-5">
    <h3 class="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
      <Stethoscope class="w-4 h-4 text-teal-600" /> سجل التشخيصات ({{ diagnoses.length }})
    </h3>
    <div v-if="diagnoses.length === 0" class="text-center py-8 text-slate-400 text-xs">لا توجد تشخيصات مسجلة</div>
    <div v-else class="space-y-3">
      <div v-for="d in diagnoses" :key="d.id" class="p-4 bg-slate-50 rounded-xl border border-slate-100">
        <div class="flex items-start justify-between gap-3 mb-2">
          <p class="text-sm font-bold text-slate-800">{{ d.title }}</p>
          <span class="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded shrink-0">ICD-10: {{ d.icd10 }}</span>
        </div>
        <p class="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mb-2">{{ d.notes }}</p>
        <div class="flex items-center gap-2 text-[10px] text-slate-400">
          <span>{{ d.date }}</span><span>·</span><span>{{ d.doctor_name }}</span>
          <span v-if="d.attachments?.length" class="flex items-center gap-1"><Paperclip class="w-3 h-3" /> {{ d.attachments.length }} مرفق</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Stethoscope, Paperclip } from 'lucide-vue-next';
import { useMedicalRecordStore } from '../../../../stores/medicalRecordStore';
import type { PatientRecord } from '../../../../types/patient';

const props = defineProps<{ patient: PatientRecord }>();
const recordStore = useMedicalRecordStore();
const diagnoses = computed(() => recordStore.getDiagnosesByPatient(props.patient.id));
</script>
