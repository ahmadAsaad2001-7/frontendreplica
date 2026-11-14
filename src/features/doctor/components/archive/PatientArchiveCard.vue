<template>
  <div
    class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
    @click="$emit('open', patient)"
  >
    <!-- شريط جانبي يحدد حالة الرصيد -->
    <div
      :class="[
        'absolute right-0 top-0 bottom-0 w-1.5 transition-colors',
        hasBalance ? 'bg-amber-400' : 'bg-teal-500'
      ]"
    ></div>

    <div class="p-5 pr-6">
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="relative">
            <div :class="[
              'w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold',
              patient.gender === 'male' ? 'bg-[#E0F2FE] text-[#0369A1]' : 'bg-[#FCE7F3] text-[#BE185D]'
            ]">
              {{ patient.avatarInitials }}
            </div>
            <div class="absolute -bottom-1 -left-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
              <component :is="patient.gender === 'male' ? Mars : Venus" class="w-3 h-3" :class="patient.gender === 'male' ? 'text-blue-600' : 'text-pink-600'" />
            </div>
          </div>

          <div>
            <h4 class="font-bold text-slate-800 text-base">{{ patient.name }}</h4>
            <p class="text-[11px] text-slate-400 font-mono mt-0.5">{{ patient.mrn }}</p>
          </div>
        </div>
      </div>

      <!-- الوسوم الدلالية (فصيلة الدم، الحساسية، الأمراض المزمنة، التأمين) -->
      <div class="flex flex-wrap gap-1.5 mb-4">
        <span class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-100">
          <Droplet class="w-3 h-3" /> {{ patient.bloodType }}
        </span>
        <span v-if="patient.hasAllergy" class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
          <AlertTriangle class="w-3 h-3" /> حساسية
        </span>
        <span v-if="patient.hasChronic" class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-100">
          <HeartPulse class="w-3 h-3" /> مزمن
        </span>
        <span class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
          <Shield class="w-3 h-3" /> {{ patient.insurance }}
        </span>
      </div>

      <!-- إحصائيات سريعة (العمر، الزيارات، الرصيد) -->
      <div class="grid grid-cols-3 gap-2 bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100">
        <div class="text-center">
          <p class="text-[10px] text-slate-400 mb-1 font-medium">العمر</p>
          <p class="text-sm font-bold text-slate-700">{{ patient.age ?? '—' }}</p>
        </div>
        <div class="text-center border-x border-slate-200">
          <p class="text-[10px] text-slate-400 mb-1 font-medium">الزيارات</p>
          <p class="text-sm font-bold text-teal-600">{{ patient.totalVisits ?? 0 }}</p>
        </div>
        <div class="text-center">
          <p class="text-[10px] text-slate-400 mb-1 font-medium">الرصيد</p>
          <p :class="hasBalance ? 'text-amber-600' : 'text-emerald-600'" class="text-sm font-bold">
            {{ balanceDisplay }}
          </p>
        </div>
      </div>

      <!-- التذييل: آخر زيارة وسهم التوجيه -->
      <div class="flex justify-between items-center text-[11px] text-slate-400 pt-3 border-t border-slate-100 mt-2">
        <span class="flex items-center gap-1.5 font-medium">
          <Clock class="w-3.5 h-3.5" />
          آخر زيارة: {{ patient.lastVisitDate ?? '—' }}
        </span>
        <div class="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-teal-50 transition-colors">
          <ArrowLeft class="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Mars, Venus, Droplet, AlertTriangle, HeartPulse, Shield, Clock, ArrowLeft } from 'lucide-vue-next';
import type { PatientArchiveItem } from '../../../../types/archive';

const props = defineProps<{ patient: PatientArchiveItem }>();
defineEmits<{
  (e: 'open', patient: PatientArchiveItem): void;
}>();

// ✅ Computed properties للتعامل مع البيانات بشكل آمن
const hasBalance = computed(() => {
  const balance = props.patient.balance;
  return typeof balance === 'number' && balance > 0;
});

const balanceDisplay = computed(() => {
  const balance = props.patient.balance;
  if (balance === undefined || balance === null) return '—';
  if (balance === 0) return 'مسدد';
  if (typeof balance === 'number' && balance > 0) return `${balance} ر.س`;
  return 'مسدد';
});
</script>
