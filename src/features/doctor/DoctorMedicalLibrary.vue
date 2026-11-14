<template>
  <div class="max-w-[1400px] mx-auto p-6 space-y-5" dir="rtl">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
          <Library class="w-7 h-7 text-teal-600" /> المكتبة الطبية
        </h1>
        <p class="text-sm text-slate-500 mt-1">بناء وتجهيز الأدوات الطبية قبل الكشف — تظهر كاختصارات في منشئ الروشتة</p>
      </div>
    </div>
    <div class="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl">
      <button v-for="t in tabs" :key="t.key" type="button" @click="active = t.key"
        :class="['py-2.5 rounded-xl text-sm font-bold transition', active === t.key ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 hover:bg-white']">
        {{ t.label }}
      </button>
    </div>
    <DrugKitsTab v-if="active === 'kits'" />
    <TaskTemplatesTab v-else-if="active === 'tasks'" />
    <PrescriptionTemplatesTab v-else />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Library } from 'lucide-vue-next';
import DrugKitsTab from './components/library/DrugKitsTab.vue';
import TaskTemplatesTab from './components/library/TaskTemplatesTab.vue';
import PrescriptionTemplatesTab from './components/library/PrescriptionTemplatesTab.vue';

const active = ref<'kits' | 'tasks' | 'templates'>('kits');
const tabs = [
  { key: 'kits', label: 'حاويات الأدوية' },
  { key: 'tasks', label: 'قوالب المهام' },
  { key: 'templates', label: 'قوالب الروشتات' },
] as const;
</script>
