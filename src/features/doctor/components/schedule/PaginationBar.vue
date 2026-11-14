<template>
  <nav v-if="totalPages > 1" class="flex items-center justify-center gap-1.5" aria-label="ترقيم الصفحات">
    <!-- RTL: السابق على اليمين -->
    <button
      type="button"
      :disabled="page <= 1"
      @click="emit('update:page', page - 1)"
      class="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      aria-label="الصفحة السابقة"
    >
      <ChevronRight class="w-4 h-4" />
    </button>

    <template v-for="(token, i) in tokens" :key="i">
      <span v-if="token === '…'" class="w-6 text-center text-slate-400 text-sm select-none">…</span>
      <button
        v-else
        type="button"
        @click="emit('update:page', token)"
        :aria-current="token === page ? 'page' : undefined"
        :class="[
          'w-9 h-9 rounded-lg border text-sm font-bold transition',
          token === page
            ? 'bg-teal-600 text-white border-teal-600'
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50',
        ]"
      >
        {{ token }}
      </button>
    </template>

    <button
      type="button"
      :disabled="page >= totalPages"
      @click="emit('update:page', page + 1)"
      class="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      aria-label="الصفحة التالية"
    >
      <ChevronLeft class="w-4 h-4" />
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ChevronRight, ChevronLeft } from 'lucide-vue-next';
import { pageNumbers } from '../../../../utils/pagination';

const props = defineProps<{
  page: number;
  totalPages: number;
}>();

const emit = defineEmits<{
  'update:page': [page: number];
}>();

const tokens = computed(() => pageNumbers(props.page, props.totalPages));
</script>
