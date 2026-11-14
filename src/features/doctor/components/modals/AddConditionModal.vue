<template>
  <div v-if="isOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95" dir="rtl">

      <div class="p-5 flex justify-between items-center border-b border-slate-100">
        <h2 class="font-bold text-blue-600 text-lg flex items-center gap-2">
          <HeartPulse class="w-5 h-5" /> إضافة مرض مزمن لملف المريض
        </h2>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-700 transition">
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-2">اسم المرض المزمن:</label>
          <input
            v-model="diseaseName"
            type="text"
            placeholder="مثال: ارتفاع ضغط الدم، السكري، الربو..."
            class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-slate-50"
          >
        </div>
      </div>

      <div class="p-4 bg-slate-50 flex justify-end gap-2">
        <button @click="$emit('close')" class="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition">إلغاء</button>
        <button
          @click="handleSave"
          :disabled="!diseaseName"
          class="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm shadow-md hover:bg-blue-700 disabled:opacity-50 transition"
        >
          حفظ في السجل
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { HeartPulse, X } from 'lucide-vue-next';

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['close', 'save']);
const diseaseName = ref('');

function handleSave() {
  if (!diseaseName.value) return;
  emit('save', { name: diseaseName.value });
  diseaseName.value = '';
  emit('close');
}
</script>
