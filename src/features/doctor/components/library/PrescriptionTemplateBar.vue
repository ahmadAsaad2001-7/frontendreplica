<template>
  <div class="flex items-center gap-2 flex-wrap" dir="rtl">
    <button @click="applyOpen = true" class="bg-teal-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 hover:bg-teal-700 transition">
      <ClipboardList class="w-3.5 h-3.5" /> تطبيق قالب
    </button>
    <button @click="saveOpen = true" :disabled="draft.planItems.length === 0" class="bg-white border border-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 hover:bg-slate-50 transition disabled:opacity-40">
      <BookmarkPlus class="w-3.5 h-3.5" /> حفظ كقالب
    </button>
    <span v-if="toast" class="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">{{ toast }}</span>
    <ApplyTemplateModal :is-open="applyOpen" @close="applyOpen = false" />
    <SaveAsTemplateModal :is-open="saveOpen" @close="saveOpen = false" @saved="onSaved" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ClipboardList, BookmarkPlus } from 'lucide-vue-next';
import { usePrescriptionDraftStore } from '../../../../stores/prescriptionDraftStore';
import ApplyTemplateModal from '../modals/ApplyTemplateModal.vue';
import SaveAsTemplateModal from '../modals/SaveAsTemplateModal.vue';

const draft = usePrescriptionDraftStore();
const applyOpen = ref(false); const saveOpen = ref(false); const toast = ref('');
function onSaved(n: string) { toast.value = `حُفظ القالب «${n}» في المكتبة`; setTimeout(() => (toast.value = ''), 3000); }
</script>
