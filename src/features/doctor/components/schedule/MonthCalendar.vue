<template>
  <div>
    <!-- Header: الشهر + التنقل (RTL: السابق على اليمين) -->
    <div class="flex items-center justify-between mb-4">
      <button
        type="button"
        class="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-teal-600 transition"
        aria-label="الشهر السابق"
        @click="go(-1)"
      >
        <ChevronRight class="w-5 h-5" />
      </button>

      <h3 class="font-bold text-slate-800 text-base">{{ title }}</h3>

      <button
        type="button"
        class="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-teal-600 transition"
        aria-label="الشهر التالي"
        @click="go(1)"
      >
        <ChevronLeft class="w-5 h-5" />
      </button>
    </div>

    <!-- أيام الأسبوع (السبت أولاً) -->
    <div class="grid grid-cols-7 gap-2 mb-2">
      <div
        v-for="name in WEEK_HEADERS"
        :key="name"
        class="text-center text-[11px] font-bold text-slate-400 truncate"
      >
        {{ name }}
      </div>
    </div>

    <!-- الخلايا -->
    <div class="grid grid-cols-7 gap-2">
      <template v-for="(cell, i) in cells" :key="i">
        <div v-if="!cell" class="aspect-square" aria-hidden="true" />

        <button
          v-else
          type="button"
          :disabled="isDisabled(cell)"
          :aria-pressed="cell === selected"
          :aria-label="ariaLabel(cell)"
          :class="cellClasses(cell)"
          @click="emit('select', cell)"
        >
          <span class="text-sm font-semibold">{{ dayNumber(cell) }}</span>

          <!-- أجندة: عدد المواعيد -->
          <span
            v-if="mode === 'agenda' && (infoOf(cell).count ?? 0) > 0"
            :class="[
              'absolute bottom-1 left-1/2 -translate-x-1/2 min-w-[18px] px-1 rounded-full text-[10px] font-bold leading-[18px]',
              cell === selected ? 'bg-white text-teal-700' : 'bg-teal-600 text-white',
            ]"
          >
            {{ infoOf(cell).count }}
          </span>

          <!-- إتاحة: علامة الاستثناء -->
          <span
            v-if="mode === 'availability' && infoOf(cell).isException"
            class="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500"
            title="استثناء"
          />
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ChevronRight, ChevronLeft } from 'lucide-vue-next';
import { toDateStr, parseLocalDate } from '../../../../utils/date';
import {
  buildMonthGrid, shiftMonth, WEEK_HEADERS, type DayCellInfo,
} from '../../../../utils/calendar';

const props = withDefaults(defineProps<{
  year: number;
  /** 0-11 */
  month: number;
  /** 'YYYY-MM-DD' لليوم المختار */
  selected?: string | null;
  /** يرجّع معلومات تلوين اليوم (من الـ stores). لو غير مُمرّر كل الأيام تظهر عادية. */
  dayInfo?: (dateStr: string) => DayCellInfo | undefined;
  /** الأيام قبل هذا التاريخ (YYYY-MM-DD) لا يمكن اختيارها */
  disabledBefore?: string;
  mode?: 'agenda' | 'availability';
}>(), {
  selected: null,
  dayInfo: undefined,
  disabledBefore: undefined,
  mode: 'agenda',
});

const emit = defineEmits<{
  select: [dateStr: string];
  change: [value: { year: number; month: number }];
}>();

const cells = computed(() => buildMonthGrid(props.year, props.month));

const title = computed(() =>
  new Date(props.year, props.month, 1).toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })
);

const todayStr = toDateStr(new Date());

function go(delta: number) {
  emit('change', shiftMonth(props.year, props.month, delta));
}

const infoOf = (dateStr: string): DayCellInfo => props.dayInfo?.(dateStr) ?? { available: false };
const dayNumber = (dateStr: string) => Number(dateStr.slice(8));
const isDisabled = (dateStr: string) => !!props.disabledBefore && dateStr < props.disabledBefore;

function ariaLabel(dateStr: string): string {
  const base = parseLocalDate(dateStr).toLocaleDateString('ar-EG', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
  const info = infoOf(dateStr);
  const status = !info.available ? 'غير متاح' : info.full ? 'محجوز بالكامل' : info.isException ? 'متاح (استثناء)' : 'متاح';
  const count = info.count ? `، ${info.count} مواعيد` : '';
  return `${base}، ${status}${count}`;
}

function cellClasses(dateStr: string): string {
  const info = infoOf(dateStr);
  const isSelected = dateStr === props.selected;

  const classes = [
    'relative aspect-square rounded-xl border flex items-center justify-center transition-all',
  ];

  if (isDisabled(dateStr)) {
    classes.push('bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed');
  } else if (isSelected) {
    classes.push('bg-teal-600 text-white border-teal-600 shadow-md');
  } else if (props.mode === 'agenda' && info.full) {
    classes.push('bg-rose-50 text-rose-700 border-rose-300 hover:border-rose-400');
  } else if (!info.available) {
    classes.push('bg-white text-slate-500 border-slate-200 hover:border-slate-300');
  } else {
    classes.push('bg-teal-50 text-teal-800 border-teal-200 hover:border-teal-400');
  }

  if (dateStr === todayStr && !isSelected) classes.push('ring-2 ring-teal-500 font-extrabold');

  return classes.join(' ');
}
</script>
