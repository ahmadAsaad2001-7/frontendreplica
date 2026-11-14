<template>
  <div class="grid grid-cols-2 gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm" role="tablist">
    <button
      v-for="m in modes"
      :key="m.value"
      type="button"
      role="tab"
      :aria-selected="modelValue === m.value"
      @click="emit('update:modelValue', m.value)"
      :class="[
        'py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2',
        modelValue === m.value
          ? 'bg-teal-700 text-white shadow-sm'
          : 'text-slate-600 hover:bg-slate-50',
      ]"
    >
      <component :is="m.icon" class="w-4 h-4" />
      {{ m.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { CalendarDays, Clock } from 'lucide-vue-next';

export type ScheduleMode = 'agenda' | 'availability';

defineProps<{ modelValue: ScheduleMode }>();
const emit = defineEmits<{ 'update:modelValue': [mode: ScheduleMode] }>();

const modes = [
  { value: 'agenda' as ScheduleMode, label: 'التقويم والمواعيد', icon: CalendarDays },
  { value: 'availability' as ScheduleMode, label: 'الإتاحة', icon: Clock },
] as const;
</script>
