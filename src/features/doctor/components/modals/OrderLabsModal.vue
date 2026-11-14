<template>
  <div v-if="isOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95" dir="rtl">

      <!-- Header -->
      <div class="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h2 class="font-bold text-slate-800 text-lg flex items-center gap-2">
          <FlaskConical class="w-5 h-5 text-teal-600" /> طلب تحاليل طبية
        </h2>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-700">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">نوع التحليل</label>
          <select v-model="form.testName" class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500 bg-slate-50">
            <option value="">اختر التحليل...</option>
            <option value="صورة دم كاملة (CBC)">صورة دم كاملة (CBC)</option>
            <option value="وظائف كبد (LFT)">وظائف كبد (LFT)</option>
            <option value="وظائف كلى (KFT)">وظائف كلى (KFT)</option>
            <option value="سكر صائم (FBS)">سكر صائم (FBS)</option>
            <option value="تحليل فيتامين د">تحليل فيتامين د</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">ملاحظات للمختبر (اختياري)</label>
          <textarea v-model="form.notes" rows="2" placeholder="مثال: المريض صائم..." class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500 bg-slate-50 resize-none"></textarea>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
        <button @click="$emit('close')" class="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition">إلغاء</button>
        <button
          @click="handleSubmit"
          :disabled="!form.testName"
          class="px-6 py-2 bg-teal-600 text-white font-bold rounded-xl text-sm shadow-md hover:bg-teal-700 transition disabled:opacity-50 flex items-center gap-2"
        >
          <Check class="w-4 h-4" /> تأكيد الطلب
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { FlaskConical, X, Check } from 'lucide-vue-next';

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['close', 'confirm']);

const form = reactive({
  testName: '',
  notes: ''
});

function handleSubmit() {
  emit('confirm', { ...form });
  form.testName = '';
  form.notes = '';
  emit('close');
}
</script>
