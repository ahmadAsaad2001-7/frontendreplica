<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
    <!-- 1. Red Alert: Severe Allergy -->
    <div
      @click="$emit('allergy-click')"
      class="bg-rose-50 border border-rose-100 rounded-2xl p-3.5 md:p-4 flex items-center justify-between shadow-sm hover:border-rose-300 transition-all cursor-pointer group"
    >
      <div class="space-y-0.5">
        <p class="text-[11px] md:text-xs font-semibold text-rose-500">تنبيه طبي</p>
        <p class="text-xs md:text-sm font-bold text-slate-900 group-hover:text-rose-950 transition-colors">حساسية شديدة للبنسلين</p>
      </div>
      <div class="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
        <AlertTriangle class="w-5 h-5 fill-white/15" />
      </div>
    </div>

    <!-- 2. Amber Alert: Upcoming Procedure -->
    <div
      @click="$emit('procedure-click')"
      class="bg-amber-50 border border-amber-100 rounded-2xl p-3.5 md:p-4 flex items-center justify-between shadow-sm hover:border-amber-300 transition-all cursor-pointer group"
    >
      <div class="space-y-0.5">
        <p class="text-[11px] md:text-xs font-semibold text-amber-600">إجراء قادم</p>
        <p class="text-xs md:text-sm font-bold text-slate-900 group-hover:text-amber-950 transition-colors">عملية جراحية (02:00 م)</p>
      </div>
      <div class="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
        <Clock class="w-5 h-5" />
      </div>
    </div>

    <!-- 3. Blue Alert: Note / Fasting -->
    <div
      @click="$emit('fasting-click')"
      class="bg-blue-50 border border-blue-100 rounded-2xl p-3.5 md:p-4 flex items-center justify-between shadow-sm hover:border-blue-300 transition-all cursor-pointer group"
    >
      <div class="space-y-0.5">
        <p class="text-[11px] md:text-xs font-semibold text-blue-500">ملاحظة</p>
        <p class="text-xs md:text-sm font-bold text-slate-900 group-hover:text-blue-950 transition-colors">المريض صائم منذ 8 ساعات</p>
      </div>
      <div class="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
        <Info class="w-5 h-5" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertTriangle, Clock, Info } from 'lucide-vue-next';

defineEmits(['allergy-click', 'procedure-click', 'fasting-click']);
</script>
