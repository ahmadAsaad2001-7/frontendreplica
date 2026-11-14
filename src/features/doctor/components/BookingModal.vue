<template>
  <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl" dir="rtl">

      <!-- Header -->
      <div class="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div class="flex items-center gap-3">
          <img :src="doctor.avatar" class="w-12 h-12 rounded-xl object-cover" />
          <div>
            <h2 class="font-bold text-slate-800 text-lg">حجز استشارة</h2>
            <p class="text-xs text-slate-500">{{ doctor.name }} - {{ doctor.price }} ج.م/ساعة</p>
          </div>
        </div>
        <button @click="$emit('close')" class="p-2 bg-slate-200 hover:bg-slate-300 rounded-full text-slate-600 transition">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Scrollable Body -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">

        <!-- 1. Date & Time Selection -->
        <div>
          <h3 class="font-bold text-slate-800 mb-3 text-sm">اختر الموعد</h3>
          <!-- Fake Calendar Row -->
          <div class="flex gap-2 overflow-x-auto pb-2">
            <button
              v-for="date in availableDates" :key="date.value"
              @click="selectedDate = date.value"
              :class="[
                'min-w-[70px] p-2 rounded-xl border flex flex-col items-center transition',
                selectedDate === date.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              ]"
            >
              <span class="text-xs">{{ date.day }}</span>
              <span class="text-lg font-bold">{{ date.num }}</span>
            </button>
          </div>

          <!-- Time Slots -->
          <div class="grid grid-cols-4 gap-2 mt-4">
            <button
              v-for="time in availableTimes" :key="time"
              @click="selectedTime = time"
              :class="[
                'py-2 rounded-xl text-sm font-bold border transition',
                selectedTime === time ? 'bg-emerald-500 text-white border-emerald-500 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              ]"
            >
              {{ time }}
            </button>
          </div>
        </div>

        <!-- 2. Patient Selection -->
        <div>
          <h3 class="font-bold text-slate-800 mb-3 text-sm">اختيار فرد العائلة</h3>
          <div class="flex gap-3 overflow-x-auto pb-2">
            <button
              v-for="profile in profileStore.profiles" :key="profile.id"
              @click="selectedProfileId = profile.id"
              :class="[
                'min-w-[120px] p-3 rounded-xl border flex items-center gap-2 transition',
                selectedProfileId === profile.id ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-slate-200 hover:bg-slate-50'
              ]"
            >
              <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs">
                {{ profile.name.charAt(0) }}
              </div>
              <div class="text-right">
                <p class="text-xs font-bold text-slate-800">{{ profile.name }}</p>
                <p class="text-[10px] text-slate-500">{{ profile.relation }}</p>
              </div>
            </button>
          </div>
        </div>

        <!-- 3. Payment Method -->
        <div>
          <h3 class="font-bold text-slate-800 mb-3 text-sm">طريقة الدفع</h3>
          <div class="grid grid-cols-2 gap-3">
            <button
              @click="paymentMethod = 'InstaPay'"
              :class="[
                'p-3 rounded-xl border flex flex-col items-center gap-2 transition',
                paymentMethod === 'InstaPay' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600'
              ]"
            >
              <Smartphone class="w-6 h-6" />
              <span class="text-sm font-bold">محفظة إلكترونية</span>
            </button>
            <button
              @click="paymentMethod = 'Card'"
              :class="[
                'p-3 rounded-xl border flex flex-col items-center gap-2 transition',
                paymentMethod === 'Card' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600'
              ]"
            >
              <CreditCard class="w-6 h-6" />
              <span class="text-sm font-bold">بطاقة بنكية</span>
            </button>
          </div>
        </div>

        <!-- InstaPay Upload (If selected) -->
        <div v-if="paymentMethod === 'InstaPay'" class="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p class="text-xs text-amber-800 font-bold mb-2">يرجى تحويل المبلغ ({{ doctor.price }} ج.م) إلى رقم المحفظة:</p>
          <div class="flex justify-between items-center bg-white border border-amber-200 p-2 rounded-lg mb-3">
            <span class="font-mono font-bold text-slate-800 tracking-wider">01015529940</span>
            <button class="text-xs text-amber-600 font-bold bg-amber-100 px-2 py-1 rounded">نسخ</button>
          </div>
          <div class="border-2 border-dashed border-amber-300 rounded-xl p-4 text-center cursor-pointer hover:bg-amber-100/50 transition">
            <UploadCloud class="w-6 h-6 text-amber-500 mx-auto mb-1" />
            <span class="text-xs text-amber-700 font-bold">ارفع صورة إيصال التحويل</span>
          </div>
        </div>

      </div>

      <!-- Footer Action -->
      <div class="p-4 border-t border-slate-100 bg-white">
        <button
          @click="confirmBooking"
          :disabled="!selectedTime || !selectedProfileId"
          class="w-full bg-blue-600 text-white font-bold py-3.5 rounded-2xl shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
        >
          <CheckCircle2 class="w-5 h-5" />
          تأكيد الحجز يوم {{ selectedDate }} ({{ doctor.price }} ج.م)
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { X, Smartphone, CreditCard, UploadCloud, CheckCircle2 } from 'lucide-vue-next';
import type { Doctor } from '../../../stores/appointmentStore';
import { useAppointmentStore } from '../../../stores/appointmentStore';
import { useProfileStore } from '../../../stores/profileStore';

const props = defineProps<{ doctor: Doctor }>();
const emit = defineEmits(['close']);

const appointmentStore = useAppointmentStore();
const profileStore = useProfileStore();

// State
const selectedDate = ref('29 أكتوبر');
const selectedTime = ref('');
const selectedProfileId = ref(profileStore.activeProfileId);
const paymentMethod = ref<'InstaPay' | 'Card'>('InstaPay');

const availableDates = [
  { day: 'السبت', num: '28', value: '28 أكتوبر' },
  { day: 'الأحد', num: '29', value: '29 أكتوبر' },
  { day: 'الإثنين', num: '30', value: '30 أكتوبر' },
];
const availableTimes = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

function confirmBooking() {
  if (!selectedTime.value || !selectedProfileId.value) return;

  const selectedProfile = profileStore.profiles.find(p => p.id === selectedProfileId.value);

  appointmentStore.bookAppointment({
    doctorId: props.doctor.id,
    doctorName: props.doctor.name,
    patientProfileId: selectedProfileId.value,
    patientName: selectedProfile?.name || 'غير معروف',
    date: selectedDate.value,
    time: selectedTime.value,
    paymentMethod: paymentMethod.value
  });

  alert('تم الحجز بنجاح! (يمكنك مراجعته في صفحة المواعيد)');
  emit('close');
}
</script>
