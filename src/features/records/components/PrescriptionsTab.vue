<template>
  <div class="space-y-4">

    <!-- Prescription Selector -->
    <div class="flex gap-2 overflow-x-auto pb-2">
      <button
        v-for="rx in patientPrescriptions" :key="rx.id"
        @click="selectedRxId = rx.id"
        :class="[
          'px-4 py-2.5 rounded-xl text-sm font-bold border transition-all shrink-0',
          selectedRxId === rx.id ? 'bg-emerald-500 text-white border-emerald-500 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
        ]"
      >
        {{ rx.title }}
      </button>
    </div>

    <!-- Selected Prescription View -->
    <div v-if="selectedRx" class="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 animate-in fade-in">

      <!-- Header -->
      <div class="flex justify-between items-center border-b border-slate-200 pb-4 mb-6">
        <div class="flex items-center gap-2">
          <div class="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg"><Lock class="w-4 h-4" /></div>
          <span class="text-sm font-bold text-slate-700">مستند غير قابل للتعديل (Signed & Immutable)</span>
        </div>
        <h2 class="text-lg font-extrabold text-slate-800">الروشتة الطبية الإلكترونية الموحدة (E-PRESCRIPTION)</h2>
      </div>

      <!-- Doctor & Patient Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl mb-6">
        <div>
          <p class="text-xs text-slate-400 font-bold mb-1">الطبيب المعالج:</p>
          <div class="flex items-center gap-3">
            <img src="https://i.pravatar.cc/150?img=60" class="w-12 h-12 rounded-xl object-cover" />
            <div>
              <h4 class="font-extrabold text-slate-800">أ.د. طارق الحكيم</h4>
              <p class="text-xs text-slate-500">استشاري جراحة العظام</p>
            </div>
          </div>
        </div>
        <div class="text-sm text-slate-600 space-y-1">
          <p><span class="font-bold text-slate-400">اسم المريض:</span> أحمد أسعد (أنا)</p>
          <p><span class="font-bold text-slate-400">كود الجلسة:</span> ENC-RX-SPINE-2026-01</p>
          <p><span class="font-bold text-slate-400">تاريخ الإصدار:</span> {{ selectedRx.starts_on }}</p>
        </div>
      </div>

      <!-- QR & Verification -->
      <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <div class="bg-emerald-500 text-white p-2 rounded-xl"><CheckCircle2 class="w-6 h-6" /></div>
          <div>
            <p class="text-sm font-bold text-emerald-900">جاهز للصرف الصيدلي</p>
            <p class="text-xs text-emerald-700 mt-1">كود التحقق: <span class="font-mono text-lg font-extrabold">{{ selectedRx.verification_code }}</span></p>
          </div>
        </div>
        <img :src="selectedRx.qr_code" class="w-16 h-16 rounded-lg bg-white p-1" />
      </div>

      <!-- Medications -->
      <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2"><Pill class="w-5 h-5 text-blue-500" /> الأدوية الموصوفة طبياً</h3>

      <div class="space-y-4 mb-6">
        <div v-for="(item, index) in selectedRx.plan_items.filter(i => i.kind === 'medication')" :key="item.id" class="border border-slate-200 rounded-2xl p-4">
          <div class="flex justify-between items-start mb-2">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold">{{ index + 1 }}</span>
              <h4 class="font-bold text-slate-800">{{ item.title }}</h4>
            </div>
            <span class="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">المدة: {{ item.schedule.duration_days }} يوم</span>
          </div>
          <div class="bg-slate-50 p-3 rounded-xl mt-3 text-sm text-slate-600">
            <span class="font-bold text-slate-400">تعليمات التناول: </span> {{ item.instructions }}
          </div>
        </div>
      </div>

      <!-- General Instructions & Warnings -->
      <div class="space-y-3">
        <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm">
          <span class="font-bold text-slate-800 block mb-1">تعليمات الطبيب العامة:</span>
          <p class="text-slate-600">{{ selectedRx.general_instructions }}</p>
        </div>
        <div class="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-sm">
          <span class="font-bold text-rose-800 flex items-center gap-2 mb-1"><AlertCircle class="w-4 h-4" /> تنبيه الطوارئ والآثار الجانبية الحادة:</span>
          <p class="text-rose-700">{{ selectedRx.emergency_warning }}</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePrescriptionStore } from '../../../stores/prescriptionStore';
import { useProfileStore } from '../../../stores/profileStore';
import { Lock, CheckCircle2, Pill, AlertCircle } from 'lucide-vue-next';

const rxStore = usePrescriptionStore();
const profileStore = useProfileStore();

const patientPrescriptions = computed(() =>
  rxStore.getPrescriptionsForPatient(profileStore.activeProfileId)
);

const selectedRxId = ref(patientPrescriptions.value[0]?.id || '');

const selectedRx = computed(() =>
  patientPrescriptions.value.find(p => p.id === selectedRxId.value)
);
</script>
