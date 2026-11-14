<template>
  <div class="bg-white rounded-2xl md:rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3.5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <h3 class="text-sm md:text-base font-bold text-slate-900">
          الحساسية والمخاطر
        </h3>
        <span class="w-5 h-5 rounded-full bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center font-mono">
          {{ allergies.length }}
        </span>
      </div>
    </div>

    <!-- Allergies Badges / Chips -->
    <div class="flex flex-wrap items-center gap-2">
      <button
        v-for="alg in allergies"
        :key="alg.id"
        @click="$emit('select-allergy', alg)"
        type="button"
        :class="[
          'px-3 py-1 rounded-xl text-xs font-semibold transition-all border cursor-pointer',
          isSevere(alg)
            ? 'bg-rose-50 text-rose-600 border-rose-200/90 hover:bg-rose-100'
            : 'bg-amber-50 text-amber-700 border-amber-200/90 hover:bg-amber-100'
        ]"
        :title="`${alg.substance} - درجة الحساسية: ${alg.severity} (${alg.reaction})`"
      >
        {{ alg.substance }}
      </button>

      <!-- Add Allergy Button -->
      <button
        @click="$emit('add-allergy')"
        type="button"
        class="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all cursor-pointer"
      >
        <Plus class="w-3.5 h-3.5 text-slate-500" />
        <span>إضافة</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next';

interface AllergyItem {
  id: string;
  substance: string;
  severity: string;
  reaction: string;
}

const props = defineProps<{
  allergies: AllergyItem[];
}>();

defineEmits(['add-allergy', 'select-allergy']);

// دالة لتحديد إذا كانت الحساسية شديدة (زي كود React)
function isSevere(alg: AllergyItem) {
  return alg.severity === 'شديدة' || alg.substance === 'بنسلين';
}
</script>
