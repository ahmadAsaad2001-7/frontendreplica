<template>
  <div class="bg-[#1e293b] text-white rounded-2xl md:rounded-3xl p-5 shadow-lg border border-slate-700/60 relative overflow-hidden">
    <!-- Glow highlight -->
    <div class="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

    <!-- Header -->
    <div class="flex items-center gap-2 mb-4">
      <Zap class="w-4 h-4 text-amber-400 fill-amber-400" />
      <h3 class="text-sm md:text-base font-bold text-white tracking-tight">
        إجراءات سريعة للطبيب
      </h3>
    </div>

    <!-- 2x2 Action Tiles -->
    <div class="grid grid-cols-2 gap-2.5 md:gap-3">
      <!-- 1. Order Labs -->
      <button
        @click="$emit('order-labs')"
        type="button"
        class="bg-[#283548] hover:bg-[#33445c] active:scale-95 p-3.5 rounded-2xl flex flex-col items-center justify-center gap-2 border border-slate-700/50 hover:border-teal-400/40 transition-all group"
      >
        <div class="w-10 h-10 rounded-xl bg-teal-950/80 text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform">
          <FlaskConical class="w-5 h-5" />
        </div>
        <span class="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">طلب تحاليل</span>
      </button>

      <!-- 2. Prescription -->
      <button
        @click="$emit('prescribe-medication')"
        type="button"
        class="relative bg-[#283548] hover:bg-[#33445c] active:scale-95 p-3.5 rounded-2xl flex flex-col items-center justify-center gap-2 border border-slate-700/50 hover:border-teal-400/50 transition-all group shadow-sm"
      >
        <span class="absolute -top-1.5 -right-1.5 bg-[#0d9488] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-slate-900 shadow-sm">
          25k+ دواء
        </span>
        <div class="w-10 h-10 rounded-xl bg-teal-950/80 text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform">
          <Pill class="w-5 h-5" />
        </div>
        <span class="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">وصفة طبية</span>
      </button>

      <!-- 3. Referral -->
      <button
        @click="$emit('referral')"
        type="button"
        class="bg-[#283548] hover:bg-[#33445c] active:scale-95 p-3.5 rounded-2xl flex flex-col items-center justify-center gap-2 border border-slate-700/50 hover:border-purple-400/40 transition-all group"
      >
        <div class="w-10 h-10 rounded-xl bg-purple-950/80 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
          <UserCheck class="w-5 h-5" />
        </div>
        <span class="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">تحويل تخصص</span>
      </button>

      <!-- 4. Radiology -->
      <button
        @click="$emit('order-radiology')"
        type="button"
        class="bg-[#283548] hover:bg-[#33445c] active:scale-95 p-3.5 rounded-2xl flex flex-col items-center justify-center gap-2 border border-slate-700/50 hover:border-amber-400/40 transition-all group"
      >
        <div class="w-10 h-10 rounded-xl bg-amber-950/80 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
          <Scan class="w-5 h-5" />
        </div>
        <span class="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">طلب أشعة</span>
      </button>
    </div>

    <!-- Bottom Full-Width CTA -->
    <button
      @click="$emit('end-session')"
      type="button"
      class="w-full mt-4 py-3 px-4 rounded-xl font-bold text-xs md:text-sm text-white bg-[#0f8b80] hover:bg-[#0c7269] active:scale-95 shadow-md hover:shadow-teal-900/30 transition-all flex items-center justify-center gap-2"
    >
      <CheckCircle2 class="w-4 h-4 text-teal-200" />
      <span>إنهاء الجلسة وحفظ السجل</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Zap, FlaskConical, Pill, UserCheck, Scan, CheckCircle2 } from 'lucide-vue-next';

defineEmits([
  'order-labs',
  'prescribe-medication',
  'referral',
  'order-radiology',
  'end-session'
]);
</script>
