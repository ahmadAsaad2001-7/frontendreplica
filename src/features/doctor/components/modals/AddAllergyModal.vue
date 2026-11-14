<template>
  <div v-if="isOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95" dir="rtl">

      <!-- Header -->
      <div class="p-5 flex justify-between items-center border-b border-slate-100">
        <h2 class="font-bold text-rose-600 text-lg flex items-center gap-2">
          <AlertTriangle class="w-5 h-5" /> إضافة حساسية دوائية جديدة لملف المريض
        </h2>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-700 transition">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-2">اسم العقار أو مسبب الحساسية:</label>
          <input
            v-model="form.substance"
            type="text"
            placeholder="مثال: أسبرين، سلفا، بنسلين، سيفالوسبورين..."
            class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-rose-500 bg-slate-50"
          >
        </div>

        <div>
          <label class="block text-sm font-bold text-slate-700 mb-2">درجة الخطورة السريرية:</label>
          <select
            v-model="form.severity"
            class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-rose-500 bg-slate-50 font-bold text-slate-700"
          >
            <option value="Anaphylaxis">شديدة / مهددة للحياة (Anaphylaxis Risk)</option>
            <option value="Moderate">متوسطة (طفح جلدي / وذمة)</option>
            <option value="Mild">خفيفة (حكة / اضطراب هضمي)</option>
          </select>
        </div>

        <div class="bg-rose-50 border border-rose-100 p-3 rounded-xl">
          <p class="text-xs text-rose-700 font-bold leading-relaxed text-center">
            🔒 توقيع سريري: سيتم تحديث ملف المريض فوراً وتفعيل محرك الأمان التناقضي.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 bg-slate-50 flex justify-end gap-2">
        <button @click="$emit('close')" class="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition">إلغاء</button>
        <button
          @click="handleSave"
          :disabled="!form.substance"
          class="px-6 py-2.5 bg-rose-600 text-white font-bold rounded-xl text-sm shadow-md hover:bg-rose-700 disabled:opacity-50 transition"
        >
          حفظ الحساسية في السجل
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { AlertTriangle, X } from 'lucide-vue-next';
import type { AllergySeverity } from '../../../../types/patient';

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['close', 'save']);

const form = reactive({
  substance: '',
  severity: 'Anaphylaxis' as AllergySeverity
});

function handleSave() {
  if (!form.substance) return;
  emit('save', { substance: form.substance, severity: form.severity });
  form.substance = ''; // تصفير
  emit('close');
}
</script>
