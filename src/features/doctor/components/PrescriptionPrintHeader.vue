<template>
  <div class="flex items-center justify-between gap-4 border-b-2 border-slate-800 pb-4" dir="rtl">
    <div class="flex items-center gap-3">
      <img v-if="data.logo" :src="data.logo" class="w-14 h-14 object-contain" />
      <div>
        <h2 class="text-lg font-extrabold text-slate-900">{{ data.clinicName }}</h2>
        <p class="text-xs text-slate-600">{{ data.address }} · {{ data.phone }}</p>
      </div>
    </div>
    <div class="text-left">
      <p class="text-sm font-extrabold text-slate-900">{{ data.doctorName }}</p>
      <p class="text-xs text-slate-600">{{ data.specialty }}</p>
      <p class="text-[10px] text-slate-500 font-mono mt-0.5">ترخيص: {{ data.licenseNumber }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useClinicProfileStore, type ClinicProfileData } from '../../../stores/clinicProfileStore';

const props = defineProps<{ preview?: ClinicProfileData }>();
const store = useClinicProfileStore();
// في الطباعة الفعلية يقرأ من الـ store؛ وفي المعاينة يمرر النموذج الحي
const data = computed(() => props.preview ?? {
  clinicName: store.clinicName, doctorName: store.doctorName, specialty: store.specialty,
  phone: store.phone, address: store.address, licenseNumber: store.licenseNumber, logo: store.logo,
});
</script>
