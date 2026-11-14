<template>
  <div class="space-y-4">
<!-- Header with Add Button -->
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-bold text-slate-800">سجل القياسات الحيوية</h2>
      <button @click="isModalOpen = true" class="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-md hover:bg-emerald-700 transition flex items-center gap-2">
        <Plus class="w-4 h-4" /> إضافة قياس جديد
      </button>
    </div>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div v-for="vital in patientVitals" :key="vital.id" class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">

      <div class="flex justify-between items-start mb-4">
        <div class="flex items-center gap-3">
          <div :class="getIconBg(vital.type)" class="w-10 h-10 rounded-xl flex items-center justify-center">
            <component :is="getIcon(vital.type)" class="w-5 h-5" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-500">{{ getVitalName(vital.type) }}</h4>
            <div class="flex items-baseline gap-1 mt-1">
              <span class="text-2xl font-extrabold text-slate-800">{{ vital.value }}</span>
              <span class="text-xs font-bold text-slate-400">{{ vital.unit }}</span>
            </div>
          </div>
        </div>
        <span :class="getStatusColor(vital.status)" class="text-[10px] font-bold px-2 py-1 rounded-md">
          {{ getStatusText(vital.status) }}
        </span>
      </div>

      <div class="flex justify-between items-center text-xs text-slate-400 border-t border-slate-50 pt-3">
        <span class="flex items-center gap-1"><User class="w-3.5 h-3.5" /> {{ vital.recorded_by }}</span>
        <span class="flex items-center gap-1"><Calendar class="w-3.5 h-3.5" /> {{ vital.date }}</span>
      </div>
    </div>
  </div>

     <!-- Add Modal -->
    <AddVitalModal v-if="isModalOpen" @close="isModalOpen = false" @saved="handleSaved" />

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMedicalRecordStore } from '../../../stores/medicalRecordStore';
import { useProfileStore } from '../../../stores/profileStore';
import { Activity, HeartPulse, Droplet, Weight, User, Calendar, Plus } from 'lucide-vue-next';
import AddVitalModal from './AddVitalModal.vue'; // استورد المكون

const recordStore = useMedicalRecordStore();
const profileStore = useProfileStore();

const isModalOpen = ref(false);

const patientVitals = computed(() =>
  recordStore.vitals.filter(v => v.patient_id === profileStore.activeProfileId)
);
function handleSaved(){
}
// Helpers
const getVitalName = (type: string) => {
  const map: Record<string, string> = { bp: 'ضغط الدم', hr: 'نبضات القلب', weight: 'الوزن', glucose: 'سكر الدم' };
  return map[type] || type;
};

const getIcon = (type: string) => {
  const map: Record<string, any> = { bp: Activity, hr: HeartPulse, weight: Weight, glucose: Droplet };
  return map[type] || Activity;
};

const getIconBg = (type: string) => {
  const map: Record<string, string> = {
    bp: 'bg-rose-50 text-rose-600',
    hr: 'bg-amber-50 text-amber-600',
    weight: 'bg-blue-50 text-blue-600',
    glucose: 'bg-emerald-50 text-emerald-600'
  };
  return map[type] || 'bg-slate-50 text-slate-600';
};

const getStatusColor = (status: string) => {
  if (status === 'normal') return 'bg-emerald-100 text-emerald-700';
  if (status === 'warning') return 'bg-amber-100 text-amber-700';
  return 'bg-rose-100 text-rose-700';
};

const getStatusText = (status: string) => {
  if (status === 'normal') return 'طبيعي';
  if (status === 'warning') return 'يحتاج مراجعة';
  return 'حرج';
};
</script>
