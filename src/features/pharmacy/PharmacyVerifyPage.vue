<template>
  <div class="min-h-screen bg-slate-100 flex items-center justify-center p-4" dir="rtl">

    <div class="max-w-2xl w-full space-y-6">

      <!-- Header -->
      <div class="text-center">
        <div class="w-16 h-16 bg-teal-600 text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-teal-500/30 mb-4">
          <ShieldCheck class="w-8 h-8" />
        </div>
        <h1 class="text-2xl font-extrabold text-slate-800">بوابة التحقق الصيدلي</h1>
        <p class="text-sm text-slate-500 mt-2">أدخل كود التحقق المكون من 8 خانات أو امسح الـ QR Code</p>
      </div>

      <!-- Search Box -->
      <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div class="flex gap-2">
          <input
            v-model="verificationCode"
            @keyup.enter="handleVerify"
            type="text"
            placeholder="أدخل كود التحقق (مثال: RX-026-01-E6)"
            class="flex-1 p-4 border border-slate-200 rounded-xl text-center font-mono text-lg font-bold tracking-widest outline-none focus:border-teal-500 bg-slate-50"
          >
          <button
            @click="handleVerify"
            class="bg-teal-600 text-white px-8 rounded-xl font-bold hover:bg-teal-700 transition shadow-md flex items-center gap-2"
          >
            <Search class="w-5 h-5" /> تحقق
          </button>
        </div>
        <p v-if="errorMsg" class="text-rose-600 text-sm font-bold mt-3 text-center flex items-center justify-center gap-1">
          <AlertCircle class="w-4 h-4" /> {{ errorMsg }}
        </p>
      </div>

      <!-- Prescription Details (If Found) -->
      <div v-if="foundRx" class="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">

        <!-- Status Banner -->
        <div :class="foundRx.dispenseStatus === 'dispensed' ? 'bg-rose-500' : 'bg-emerald-500'" class="p-3 text-center text-white font-bold text-sm flex items-center justify-center gap-2">
          <component :is="foundRx.dispenseStatus === 'dispensed' ? AlertCircle : CheckCircle2" class="w-5 h-5" />
          {{ foundRx.dispenseStatus === 'dispensed' ? 'تم صرف هذه الروشتة مسبقاً (غير صالحة للاستخدام)' : 'روشتة صالحة وسارية' }}
        </div>

        <div class="p-6 space-y-5">
          <!-- Doctor & Patient Info -->
          <div class="flex justify-between items-start border-b border-slate-100 pb-4">
            <div>
              <h3 class="font-bold text-slate-800 text-lg">{{ foundRx.title }}</h3>
              <p class="text-xs text-slate-500 mt-1">تاريخ الإصدار: {{ foundRx.starts_on }}</p>
              <p class="text-xs text-slate-500 mt-1 font-mono">كود: {{ foundRx.verification_code }}</p>
            </div>
            <div class="text-left">
              <p class="text-sm font-bold text-slate-800">د. طارق الحكيم</p>
              <p class="text-xs text-slate-500">استشاري جراحة العظام</p>
            </div>
          </div>

          <!-- Medications List -->
          <div>
            <h4 class="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Pill class="w-4 h-4 text-blue-500" /> الأدوية الموصوفة
            </h4>
            <div class="space-y-2">
              <div v-for="item in foundRx.plan_items.filter(i => i.kind === 'medication')" :key="item.id" class="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p class="font-bold text-slate-800 text-sm">{{ item.title }}</p>
                <p class="text-xs text-slate-500 mt-1">{{ item.schedule.times.join(' - ') }} | لمدة {{ item.schedule.duration_days }} يوم</p>
              </div>
            </div>
          </div>

          <!-- Action Button -->
          <button
            v-if="foundRx.dispenseStatus !== 'dispensed'"
            @click="handleDispense"
            class="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-md hover:bg-emerald-700 transition flex items-center justify-center gap-2 text-lg"
          >
            <CheckCircle2 class="w-6 h-6" /> تأكيد صرف الروشتة
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ShieldCheck, Search, AlertCircle, CheckCircle2, Pill } from 'lucide-vue-next';
import { usePrescriptionStore, type Prescription } from '../../stores/prescriptionStore';

const rxStore = usePrescriptionStore();

const verificationCode = ref('');
const foundRx = ref<Prescription | null>(null);
const errorMsg = ref('');

function handleVerify() {
  errorMsg.value = '';
  foundRx.value = null;

  const code = verificationCode.value.trim().toUpperCase();
  if (!code) {
    errorMsg.value = 'يرجى إدخال كود التحقق أولاً';
    return;
  }

  // البحث عن الروشتة بالكود
  const rx = rxStore.prescriptions.find(p => p.verification_code === code);

  if (!rx) {
    errorMsg.value = 'كود غير صالح. لم يتم العثور على أي روشتة.';
    return;
  }

  foundRx.value = rx;
}

function handleDispense() {
  if (!foundRx.value) return;

  rxStore.dispensePrescription(foundRx.value.id);

  // تحديث الحالة في الواجهة عشان تظهر "تم الصرف مسبقاً"
  foundRx.value.dispenseStatus = 'dispensed';

  alert('تم صرف الروشتة بنجاح! تم تحديث حالتها في النظام.');
}
</script>
