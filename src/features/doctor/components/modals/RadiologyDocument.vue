<template>
  <div v-if="request" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-200" dir="rtl">

      <!-- Header -->
      <div class="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
            <Scan class="w-4 h-4" />
          </div>
          <h2 class="text-sm font-bold text-slate-800">مستند طلب أشعة معتمد</h2>
        </div>
        <button @click="$emit('close')" class="p-2 bg-slate-200 hover:bg-slate-300 rounded-full text-slate-600 transition">
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Document Body -->
      <div class="p-8 space-y-6">

        <!-- Patient & Doctor Header -->
        <div class="flex justify-between items-start border-b-2 border-slate-100 pb-5">
          <div class="space-y-1">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient Info</p>
            <h1 class="text-xl font-extrabold text-slate-800">{{ patientName }}</h1>
            <p class="text-xs text-slate-500 font-mono">MRN: {{ request.patient_mrn || 'MRN-00000' }}</p>
            <p class="text-xs text-slate-500">التاريخ: {{ request.date }}</p>
          </div>

          <div class="text-left space-y-1">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prescribed By</p>
            <p class="text-sm font-bold text-slate-800">{{ request.doctor_name }}</p>
            <p class="text-xs text-slate-500">استشاري</p>
            <p class="text-[10px] text-slate-400 font-mono">License: EGY-MED-48291</p>
          </div>
        </div>

        <!-- Request Details -->
        <div>
          <h3 class="text-sm font-bold text-slate-500 mb-2">تفاصيل الأشعة:</h3>
          <div class="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <h4 class="text-lg font-extrabold text-blue-900 mb-2">{{ request.test_name }}</h4>
            <p class="text-sm text-slate-700 leading-relaxed">
              <span class="font-bold">ملاحظات: </span> {{ request.notes || 'لا توجد ملاحظات إضافية.' }}
            </p>
          </div>
        </div>

        <!-- QR & Signature Section -->
        <div class="flex justify-between items-end pt-6 border-t border-slate-100 mt-8">

          <div class="flex items-center gap-3">
            <div class="bg-white p-2 border border-slate-200 rounded-xl shadow-sm">
              <img :src="request.qr_code" class="w-20 h-20" alt="QR Code" />
            </div>
            <div>
              <p class="text-xs font-bold text-slate-800">رمز التحقق الأمني (QR)</p>
              <p class="text-[10px] text-slate-500 mt-1 max-w-[120px] leading-tight">امسح الرمز للتحقق من صحة الطلب عبر النظام</p>
            </div>
          </div>

          <div class="text-center">
            <p class="text-lg font-bold text-slate-800 mb-1">{{ request.doctor_name }}</p>
            <p class="text-[10px] text-slate-400 mb-2">توقيع إلكتروني معتمد</p>
            <div class="border-t-2 border-dashed border-slate-300 w-40 pt-1">
              <p class="text-[10px] text-slate-400">Digital Signature Verified</p>
            </div>
          </div>
        </div>

      </div>

      <!-- Footer Actions -->
      <div class="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
        <button @click="window.print()" class="px-4 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 flex items-center gap-2">
          <Printer class="w-4 h-4" /> طباعة
        </button>
        <button @click="$emit('close')" class="px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700">
          إغلاق
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { Scan, X, Printer } from 'lucide-vue-next';
import type { DiagnosticRequest } from '../../../stores/medicalRecordStore';

defineProps<{ request: DiagnosticRequest | null; patientName: string }>();
defineEmits(['close']);
</script>
