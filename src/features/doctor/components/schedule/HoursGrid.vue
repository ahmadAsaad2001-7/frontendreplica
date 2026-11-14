<template>
  <div>
    <div
      class="grid grid-cols-6 sm:grid-cols-8 gap-2"
      role="group"
      aria-label="اختيار ساعات العمل"
    >
      <button
        v-for="h in HOURS"
        :key="h"
        type="button"
        :disabled="disabled || isLocked(h)"
        :aria-pressed="isSelected(h)"
        :title="isLocked(h) ? 'ساعة عليها مواعيد محجوزة' : undefined"
        @click="toggle(h)"
        :class="[
          'py-2.5 rounded-lg border text-xs font-bold transition-all select-none',
          isSelected(h)
            ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
            : 'bg-white text-slate-600 border-slate-200 hover:border-teal-400 hover:text-teal-600',
          isLocked(h) ? 'ring-2 ring-amber-300 cursor-not-allowed' : '',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        ]"
      >
        {{ formatHourLabel(h) }}
      </button>
    </div>

    <p v-if="showCount" class="text-xs text-slate-500 mt-3 text-center">
      عدد الساعات المحددة:
      <strong class="text-teal-700">{{ modelValue.length }}</strong>
    </p>
  </div>
</template>

<script setup lang="ts">
import { formatHourLabel } from '../../../../utils/hours';

const props = withDefaults(defineProps<{
  /** الساعات المختارة (0-23) */
  modelValue: number[];
  disabled?: boolean;
  /** ساعات مقفولة (مثلاً عليها حجوزات): تظهر كمختارة ولا يمكن إلغاؤها */
  lockedHours?: number[];
  showCount?: boolean;
}>(), {
  disabled: false,
  lockedHours: () => [],
  showCount: true,
});

const emit = defineEmits<{
  'update:modelValue': [hours: number[]];
}>();

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const isSelected = (h: number) => props.modelValue.includes(h) || props.lockedHours.includes(h);
const isLocked = (h: number) => props.lockedHours.includes(h);

function toggle(h: number) {
  if (props.disabled || isLocked(h)) return;
  const next = props.modelValue.includes(h)
    ? props.modelValue.filter(x => x !== h)
    : [...props.modelValue, h];
  emit('update:modelValue', next.sort((a, b) => a - b));
}
</script>
