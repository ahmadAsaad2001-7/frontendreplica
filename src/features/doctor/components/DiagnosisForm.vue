<template>
  <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
    <!-- Decorative Top Line -->
    <div class="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-l from-blue-500 to-teal-500"></div>

    <div class="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
      <h2 class="text-lg font-extrabold text-slate-800 flex items-center gap-2">
        <Activity class="w-5 h-5 text-blue-600" /> بيانات التشخيص الحالية
      </h2>
      <span class="text-xs bg-slate-100 text-slate-500 font-bold px-2 py-1 rounded-lg">رقم الجلسة: ENC-2026</span>
    </div>

    <div class="space-y-4">
      <!-- ICD-10 Search -->
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1">التشخيص (ICD-10) <span class="text-rose-500">*</span></label>
        <div class="relative">
          <input
            v-model="form.icd10"
            type="text"
            placeholder="ابحث عن التشخيص أو الكود..."
            class="w-full p-3 pl-10 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-slate-50 transition font-medium"
          >
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
        </div>
      </div>

      <!-- Notes & AI -->
      <div>
        <div class="flex justify-between items-center mb-1">
          <label class="block text-xs font-bold text-slate-700">الملاحظات السريرية</label>
          <button class="text-xs font-bold text-purple-600 flex items-center gap-1 hover:bg-purple-50 px-2 py-1 rounded transition">
            <Sparkles class="w-3.5 h-3.5" /> مساعدة الذكاء الاصطناعي
          </button>
        </div>
        <textarea
          v-model="form.notes"
          rows="3"
          placeholder="اكتب تفاصيل الأعراض، الفحص السريري، والملاحظات..."
          class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-slate-50 resize-none"
        ></textarea>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-2 pt-2">
        <button type="button" class="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition">
          مسح
        </button>
        <button @click="handleSave" class="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl text-sm shadow-md hover:bg-blue-700 transition flex items-center gap-2">
          <Save class="w-4 h-4" /> حفظ التشخيص
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { Activity, Search, Sparkles, Save } from 'lucide-vue-next';

const emit = defineEmits(['save']);

const form = reactive({
  icd10: '',
  notes: ''
});

function handleSave() {
  if (!form.icd10) return;
  emit('save', { ...form });
  form.icd10 = '';
  form.notes = '';
}
</script>
