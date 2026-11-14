<template>
  <div v-if="isOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95" dir="rtl">

      <div class="p-6 text-center space-y-4">
        <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center mb-2">
          <CheckCircle2 class="w-8 h-8" />
        </div>

        <h2 class="text-xl font-extrabold text-slate-800">إنهاء الجلسة الطبية</h2>
        <p class="text-sm text-slate-500 leading-relaxed">
          هل أنت متأكد من إنهاء جلسة المريض <strong class="text-slate-800">{{ patientName }}</strong>؟<br>
          سيتم توثيق الجلسة بالتوقيع الرقمي وإخراج المريض من الطابور.
        </p>
      </div>

      <div class="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
        <button @click="$emit('close')" class="flex-1 py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition">إلغاء</button>
        <button @click="$emit('confirm')" class="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-md hover:bg-emerald-700 transition flex items-center justify-center gap-2">
          <FileSignature class="w-4 h-4" /> توقيع وإنهاء
        </button>
      </div>
    </div>
      <!-- Modals -->
    <OrderLabsModal
      :is-open="isLabsModalOpen"
      @close="isLabsModalOpen = false"
      @confirm="handleLabsConfirm"
    />

    <EndSessionModal
      :is-open="isEndSessionModalOpen"
      :patient-name="activePatient?.name || ''"
      @close="isEndSessionModalOpen = false"
      @confirm="handleEndSessionConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { CheckCircle2, FileSignature } from 'lucide-vue-next';

defineProps<{
  isOpen: boolean;
  patientName: string;
}>();

defineEmits(['close', 'confirm']);
</script>
