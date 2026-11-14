<template>
  <div class="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300" dir="rtl">

    <!-- Header -->
    <div class="text-center space-y-2">
      <div class="w-20 h-20 bg-teal-100 text-teal-600 rounded-3xl mx-auto flex items-center justify-center shadow-inner mb-4">
        <CalendarClock class="w-10 h-10" />
      </div>
      <h1 class="text-3xl font-extrabold text-slate-800">حالة موعدك</h1>
      <p class="text-slate-500">متابعة لحظية لحالة عيادة <strong class="text-teal-700">د. طارق الحكيم</strong></p>
    </div>

    <!-- Emergency Banner (Conditional) -->
    <div v-if="hasEmergency" class="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-center gap-3 animate-pulse shadow-sm">
      <AlertTriangle class="w-6 h-6 text-rose-600 shrink-0" />
      <div>
        <h3 class="font-bold text-rose-800">استشارة طارئة قيد التنفيذ</h3>
        <p class="text-xs text-rose-600 mt-1">نعتذر عن التأخير، الطبيب يتعامل حالياً مع حالة طارئة. سيتم تحديث وقتك المتوقع فوراً.</p>
      </div>
    </div>

    <!-- Main Info Card -->
    <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 relative overflow-hidden">
      <div class="absolute top-0 right-0 left-0 h-2 bg-teal-500"></div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

        <!-- Right: Your Appointment Info -->
        <div class="text-center md:text-right space-y-1">
          <p class="text-sm text-slate-500 font-bold mb-1">موعدك المحجوز</p>
          <h2 class="text-4xl font-extrabold text-slate-800 font-mono">09:00 <span class="text-xl text-slate-400">ص</span></h2>
          <p class="text-sm text-slate-500 mt-2">اليوم، {{ currentDate }}</p>

          <div class="mt-4 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200">
            <CheckCircle2 class="w-4 h-4" />
            <span class="text-xs font-bold">الحجز مؤكد ومدفوع</span>
          </div>
        </div>

        <!-- Left: Live Status -->
        <div class="bg-slate-50 rounded-2xl p-5 border border-slate-100">
          <p class="text-xs text-slate-400 font-bold mb-2">حالة الطبيب الآن</p>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></div>
            <p class="font-bold text-slate-800">{{ clinicStatusText }}</p>
          </div>

          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-slate-500">الوقت المتوقع لدخولك:</span>
              <span class="font-bold text-teal-600 text-lg">{{ expectedTime }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">حالة التأخير:</span>
              <span :class="delayMinutes > 0 ? 'text-amber-600' : 'text-emerald-600'" class="font-bold">
                {{ delayMinutes > 0 ? `تأخير ${delayMinutes} دقيقة` : 'في الموعد' }}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Progress Timeline -->
    <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
      <h3 class="font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Activity class="w-5 h-5 text-teal-600" /> تقدم الطابور (مجهول الهوية)
      </h3>

      <div class="relative border-r-2 border-slate-100 pr-6 space-y-6 mr-3">

        <!-- Doctor Arrived -->
        <div class="relative">
          <div class="absolute -right-[31px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm"></div>
          <p class="text-sm font-bold text-slate-800">الطبيب بدأ العيادة</p>
          <p class="text-xs text-slate-500">08:45 ص</p>
        </div>

        <!-- Current Slot -->
        <div class="relative">
          <div class="absolute -right-[31px] top-1 w-4 h-4 rounded-full bg-amber-500 border-4 border-white shadow-sm ring-2 ring-amber-200"></div>
          <p class="text-sm font-bold text-amber-700">جاري الكشف الآن (الموعد السابق)</p>
          <p class="text-xs text-slate-500">08:45 ص - الآن</p>
        </div>

        <!-- Your Slot -->
        <div class="relative">
          <div class="absolute -right-[31px] top-1 w-4 h-4 rounded-full bg-slate-300 border-4 border-white shadow-sm"></div>
          <p class="text-sm font-bold text-slate-600">موعدك (الدور القادم)</p>
          <p class="text-xs text-slate-500">09:00 ص (متوقع 09:15 ص)</p>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CalendarClock, AlertTriangle, CheckCircle2, Activity } from 'lucide-vue-next';

// بيانات تجريبية للشاشة
const currentDate = ref(new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' }));
const hasEmergency = ref(false);
const delayMinutes = ref(15); // تأخير 15 دقيقة
const clinicStatusText = ref('الطبيب متأخر 15 دقيقة عن الجدول');
const expectedTime = ref('09:15 ص');
</script>
