<template>
  <div class="bg-white rounded-2xl md:rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3.5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-sm md:text-base font-bold text-slate-900">
        المؤشرات الحيوية
      </h3>
      <span class="text-[11px] text-slate-400 font-medium">
        محدثة قبل 15 د
      </span>
    </div>

    <div class="space-y-2.5">
      <!-- Heart Rate Card -->
      <div
        v-if="hr"
        @click="$emit('select-vital', hr)"
        class="bg-rose-50 border border-rose-100 hover:border-rose-300 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all shadow-sm group"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white text-rose-500 flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition-transform">
            <HeartPulse class="w-5 h-5" />
          </div>
          <div class="space-y-0.5">
            <p class="text-[11px] font-semibold text-rose-700">
              {{ hr.title }}
            </p>
            <p class="text-sm md:text-base font-bold text-slate-900 font-mono">
              {{ hr.value }}
              <span class="text-xs font-normal text-slate-500">{{ hr.unit }}</span>
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
            <TrendingUp class="w-2.5 h-2.5" />
            {{ hr.changeRate || '2%' }}
          </span>
          <ChevronLeft class="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:-translate-x-1 transition-all" />
        </div>
      </div>

      <!-- Blood Pressure Card -->
      <div
        v-if="bp"
        @click="$emit('select-vital', bp)"
        class="bg-blue-50 border border-blue-100 hover:border-blue-300 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all shadow-sm group"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white text-blue-500 flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition-transform">
            <Droplet class="w-5 h-5 fill-blue-50" />
          </div>
          <div class="space-y-0.5">
            <p class="text-[11px] font-semibold text-blue-700">
              {{ bp.title }}
            </p>
            <p class="text-sm md:text-base font-bold text-slate-900 font-mono">
              {{ bp.value }}
              <span class="text-xs font-normal text-slate-500">{{ bp.unit }}</span>
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-[11px] text-slate-500 font-medium">
            {{ bp.subtext || 'مستقر' }}
          </span>
          <ChevronLeft class="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:-translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { HeartPulse, Droplet, ChevronLeft, TrendingUp } from 'lucide-vue-next';

// تعريف شكل البيانات
interface VitalSign {
  id: string;
  type: 'heart_rate' | 'blood_pressure';
  title: string;
  value: string;
  unit: string;
  changeRate?: string;
  subtext?: string;
}

const props = defineProps<{
  vitals: VitalSign[];
}>();

defineEmits(['select-vital']);

// استخراج نبضات القلب وضغط الدم (زي كود React)
const hr = computed(() => props.vitals.find((v) => v.type === 'heart_rate') || props.vitals[0]);
const bp = computed(() => props.vitals.find((v) => v.type === 'blood_pressure') || props.vitals[1]);
</script>
