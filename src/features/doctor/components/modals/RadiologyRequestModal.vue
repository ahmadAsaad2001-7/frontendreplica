<template>
  <div v-if="isOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden" dir="rtl">

      <!-- Header -->
      <div class="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h2 class="font-bold text-slate-800 text-lg flex items-center gap-2">
          <Scan class="w-5 h-5 text-blue-600" /> طلب أشعة (Radiology)
        </h2>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-700"><X class="w-5 h-5" /></button>
      </div>

      <!-- بيانات المريض والطبيب -->
      <div class="bg-blue-50/50 p-4 border-b border-blue-100 flex justify-between items-center">
        <div>
          <p class="text-[10px] font-bold text-blue-500 mb-0.5">بيانات المريض</p>
          <h3 class="text-sm font-extrabold text-slate-800">{{ patientName }}</h3>
          <p class="text-xs text-slate-500 font-mono">{{ patientMrn }}</p>
        </div>
        <div class="text-left border-r border-blue-200 pr-4">
          <p class="text-[10px] font-bold text-blue-500 mb-0.5">الطبيب المحول</p>
          <h3 class="text-sm font-extrabold text-slate-800">{{ doctorName }}</h3>
        </div>
      </div>

      <!-- Form Body -->
      <div class="p-6 space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">نوع الأشعة <span class="text-rose-500">*</span></label>
          <select v-model="form.testName" class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-slate-50">
            <option value="">اختر نوع الأشعة...</option>
            <option value="أشعة رنين مغناطيسي (MRI)">أشعة رنين مغناطيسي (MRI)</option>
            <option value="أشعة مقطعية (CT Scan)">أشعة مقطعية (CT Scan)</option>
            <option value="أشعة سينية (X-Ray)">أشعة سينية (X-Ray)</option>
            <option value="أشعة تلفزيونية (Ultrasound)">أشعة تلفزيونية (Ultrasound)</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">المنطقة المراد تصويرها</label>
          <input v-model="form.bodyPart" type="text" placeholder="مثال: الفقرات القطنية، الصدر..." class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-slate-50">
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">ملاحظات وتعليمات لقسم الأشعة</label>
          <textarea v-model="form.notes" rows="2" placeholder="مثال: المريض لديه حساسية من الصبغة..." class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-slate-50 resize-none"></textarea>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
        <button @click="$emit('close')" class="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl">إلغاء</button>
        <button @click="handleGenerate" :disabled="!form.testName" class="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl text-sm shadow-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
          <FileSignature class="w-4 h-4" /> إنشاء طلب الأشعة
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { Scan, X, FileSignature } from 'lucide-vue-next';

const props = defineProps<{
  isOpen: boolean;
  patientName: string;
  patientMrn?: string;
  doctorName: string;
}>();

const emit = defineEmits(['close', 'generate']);

const form = reactive({ testName: '', bodyPart: '', notes: '' });

function handleGenerate() {
  emit('generate', {
    testName: `${form.testName} - ${form.bodyPart}`,
    notes: form.notes
  });
  form.testName = '';
  form.bodyPart = '';
  form.notes = '';
  emit('close');
}
</script>
