<template>
  <div class="h-[calc(100vh-8rem)] flex flex-col space-y-4 animate-in fade-in duration-300" dir="rtl">

    <!-- 1. Header & Family Bar -->
    <div class="bg-white rounded-2xl p-3 flex items-center justify-between shadow-sm border border-slate-100 shrink-0">
      <div class="flex gap-2 overflow-x-auto">
        <button
          v-for="profile in profileStore.profiles"
          :key="profile.id"
          @click="profileStore.setActiveProfile(profile.id)"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-xl transition-all border shrink-0',
            profileStore.activeProfileId === profile.id ? 'bg-teal-50 border-teal-500 text-teal-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          ]"
        >
          <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" :class="profileStore.activeProfileId === profile.id ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-500'">
            {{ profile.name.charAt(0) }}
          </div>
          <span class="text-sm font-bold">{{ profile.name }}</span>
        </button>
      </div>
      <button class="bg-teal-600 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-md hover:bg-teal-700 transition flex items-center gap-2 shrink-0">
        <Plus class="w-4 h-4" /> حجز موعد جديد
      </button>
    </div>

    <!-- 2. Main Split View -->
    <div class="flex-1 flex gap-4 overflow-hidden">

      <!-- Left Panel: Appointment Details -->
      <div class="w-80 shrink-0 flex flex-col gap-4 overflow-y-auto">
        <div v-if="selectedAppointment" class="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col h-full relative">

          <div class="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <span class="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">{{ selectedAppointment.id }}</span>
              <span class="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 class="w-3 h-3" /> {{ selectedAppointment.patientName }}
              </span>
            </div>
          </div>

          <h3 class="text-center text-sm font-bold text-slate-800 mb-4 flex items-center justify-center gap-2">
            <Stethoscope class="w-4 h-4 text-teal-600" /> بيانات الطبيب المعالج
          </h3>

          <div class="text-center mb-4">
            <img :src="selectedAppointment.doctorAvatar" class="w-20 h-20 rounded-full mx-auto object-cover border-4 border-slate-50 mb-2" />
            <h4 class="font-extrabold text-slate-800">{{ selectedAppointment.doctorName }}</h4>
            <p class="text-xs text-slate-500 mt-1">{{ selectedAppointment.specialty }}</p>
          </div>

          <div class="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 space-y-2 mb-4">
            <p class="flex items-center gap-2"><MapPin class="w-3.5 h-3.5 text-slate-400" /> مركز العمود الفقري - القاهرة</p>
            <p class="flex items-center gap-2"><Calendar class="w-3.5 h-3.5 text-slate-400" /> {{ selectedAppointment.date }} • {{ selectedAppointment.time }}</p>
          </div>

          <div class="bg-slate-50 rounded-xl p-3 text-xs mb-4">
            <p class="text-slate-500 font-bold mb-1">سبب الزيارة:</p>
            <p class="text-slate-700 leading-relaxed">{{ selectedAppointment.reason || 'متابعة دورية' }}</p>
          </div>

          <div class="mt-auto">
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2">
                <CreditCard class="w-4 h-4 text-teal-600" /> معلومات الدفع
              </h3>
              <span :class="selectedAppointment.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'" class="text-[10px] font-bold px-2 py-1 rounded">
                {{ selectedAppointment.paymentStatus === 'Paid' ? 'مدفوع' : 'ملغي' }}
              </span>
            </div>

            <div class="bg-slate-50 rounded-xl p-3 text-sm mb-3">
              <div class="flex justify-between mb-2">
                <span class="text-slate-500">المبلغ:</span>
                <span class="font-bold text-slate-800">{{ selectedAppointment.amount }} ج.م</span>
              </div>
              <div class="flex justify-between mb-2">
                <span class="text-slate-500">طريقة الدفع:</span>
                <span class="font-bold text-slate-800">{{ selectedAppointment.paymentMethod }}</span>
              </div>
            </div>

            <button class="w-full bg-slate-800 text-white font-bold py-2.5 rounded-xl text-sm shadow-md hover:bg-slate-900 transition flex justify-center items-center gap-2">
              <Download class="w-4 h-4" /> تحميل الإيصال
            </button>
          </div>

        </div>
        <div v-else class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 h-full flex flex-col items-center justify-center text-slate-400">
          <MousePointerClick class="w-12 h-12 mb-3 opacity-20" />
          <p class="text-sm font-bold">اختر موعداً</p>
          <p class="text-xs text-center mt-1">اضغط على أي موعد في التقويم لعرض تفاصيله هنا.</p>
        </div>
      </div>

      <!-- Right Panel: Calendar -->
      <div class="flex-1 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">

        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center gap-2">
            <button class="p-2 bg-slate-50 rounded-lg hover:bg-slate-100"><ChevronRight class="w-5 h-5 text-slate-600" /></button>
            <button class="px-4 py-2 bg-slate-50 rounded-lg text-sm font-bold hover:bg-slate-100">اليوم</button>
            <button class="p-2 bg-slate-50 rounded-lg hover:bg-slate-100"><ChevronLeft class="w-5 h-5 text-slate-600" /></button>
          </div>
          <h2 class="text-xl font-extrabold text-slate-800">أكتوبر 2026</h2>
        </div>

        <!-- Days Header -->
        <div class="grid grid-cols-7 gap-2 text-center mb-2">
          <div class="text-xs font-bold text-slate-400 py-2">السبت</div>
          <div class="text-xs font-bold text-slate-400 py-2">الأحد</div>
          <div class="text-xs font-bold text-slate-400 py-2">الإثنين</div>
          <div class="text-xs font-bold text-slate-400 py-2">الثلاثاء</div>
          <div class="text-xs font-bold text-slate-400 py-2">الأربعاء</div>
          <div class="text-xs font-bold text-slate-400 py-2">الخميس</div>
          <div class="text-xs font-bold text-slate-400 py-2">الجمعة</div>
        </div>

        <!-- Days Grid -->
        <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px;" class="flex-1 overflow-y-auto">
          <!-- Blank days for October 2026 (Starts on Thursday) -->
          <div v-for="n in 5" :key="'blank-'+n" class="rounded-xl bg-slate-50/30"></div>

          <!-- Actual Days -->
          <div
            v-for="day in 31" :key="day"
            @click="selectDate(day)"
            :class="[
              'min-h-[80px] rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all relative',
              selectedDate === day ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-200' : 'border-slate-100 hover:bg-slate-50',
              hasAppointment(day) ? 'bg-teal-50/30' : ''
            ]"
          >
            <span :class="selectedDate === day ? 'text-teal-700 font-extrabold' : 'text-slate-700 font-bold'">{{ day }}</span>

            <!-- Green dots for appointments -->
            <div v-if="getAppointmentCount(day) > 0" class="flex gap-1 mt-2">
              <div v-for="i in getAppointmentCount(day)" :key="i" class="w-2 h-2 rounded-full bg-teal-500"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useProfileStore } from '../../stores/profileStore';
import { useAppointmentStore, type Appointment } from '../../stores/appointmentStore';
import {
  Plus, CheckCircle2, Stethoscope, MapPin, Calendar,
  CreditCard, Download, MousePointerClick, ChevronRight, ChevronLeft
} from 'lucide-vue-next';

const profileStore = useProfileStore();
const appointmentStore = useAppointmentStore();

const selectedDate = ref(26);
const selectedAppointment = ref<Appointment | null>(null);

// جلب مواعيد المريض النشط
const patientAppointments = computed(() => {
  return appointmentStore.appointments.filter(
    appt => appt.patientProfileId === profileStore.activeProfileId
  );
});

// أول ما الصفحة تفتح، نختار أول موعد تلقائياً لو موجود
onMounted(() => {
  if (patientAppointments.value.length > 0) {
    selectedAppointment.value = patientAppointments.value[0];
  }
});

function selectDate(day: number) {
  selectedDate.value = day;
  const dateStr = `2026-10-${day.toString().padStart(2, '0')}`;
  const dailyAppts = patientAppointments.value.filter(a => a.date === dateStr);

  if (dailyAppts.length > 0) {
    selectedAppointment.value = dailyAppts[0]; // اختيار أول موعد في اليوم
  } else {
    selectedAppointment.value = null;
  }
}

function hasAppointment(day: number) {
  const dateStr = `2026-10-${day.toString().padStart(2, '0')}`;
  return patientAppointments.value.some(a => a.date === dateStr);
}

function getAppointmentCount(day: number) {
  const dateStr = `2026-10-${day.toString().padStart(2, '0')}`;
  return patientAppointments.value.filter(a => a.date === dateStr).length;
}
</script>
