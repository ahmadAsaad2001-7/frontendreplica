<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" role="alertdialog" aria-modal="true">

      <div class="p-5 border-b border-slate-100 flex items-center gap-2">
        <AlertTriangle class="w-5 h-5 text-amber-500" />
        <h3 class="font-bold text-slate-800">تعارض مع مواعيد محجوزة</h3>
      </div>

      <div class="p-5 space-y-4">
        <p class="text-sm text-slate-600 leading-relaxed">
          هذا التغيير سيجعل
          <strong class="text-rose-600">{{ conflicts.length }}</strong>
          {{ conflicts.length === 1 ? 'موعداً' : 'مواعيد' }}
          خارج ساعات العمل. لن تُلغى المواعيد تلقائياً، وإنما تُعلَّم
          <span class="font-bold text-orange-700">"يحتاج إعادة جدولة"</span>
          لتتواصل مع المرضى.
        </p>

        <ul class="space-y-2 max-h-56 overflow-y-auto">
          <li
            v-for="a in conflicts"
            :key="a.id"
            class="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm"
          >
            <span class="font-bold text-slate-800">{{ a.patient.name }}</span>
            <span class="text-xs font-bold text-amber-700"><span dir="ltr" class="text-amber-600 font-medium">{{ a.date }}</span> · {{ a.time }} - {{ a.end }}</span>
          </li>
        </ul>
      </div>

      <div class="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
        <button
          type="button"
          @click="emit('confirm')"
          class="flex-1 py-2.5 bg-amber-600 text-white font-bold text-sm rounded-xl hover:bg-amber-700 transition"
        >
          متابعة وتعليم المواعيد
        </button>
        <button
          type="button"
          @click="emit('cancel')"
          class="flex-1 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition"
        >
          تراجع
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next';
import type { Appointment } from '../../../../types/appointment';

defineProps<{
  isOpen: boolean;
  conflicts: Appointment[];
}>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();
</script>
