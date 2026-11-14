<template>
  <div class="p-5">
    <MonthCalendar
      mode="availability"
      :year="year"
      :month="month"
      :selected="selected"
      :day-info="dayInfo"
      :disabled-before="todayStr"
      @change="onChangeMonth"
      @select="(d) => emit('edit-day', d)"
    />

    <!-- Legend -->
    <div class="mt-5 flex items-center justify-center gap-4 flex-wrap text-[11px] text-slate-500">
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded bg-teal-50 border border-teal-200"></span> متاح
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded bg-white border border-slate-200"></span> غير متاح
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> استثناء
      </span>
    </div>

    <p class="text-center text-xs text-slate-400 mt-3">
      اضغط على أي يوم لتعيين حالته (متاح / غير متاح) وساعات عمله
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MonthCalendar from './MonthCalendar.vue';
import { useDoctorScheduleStore } from '../../../../stores/doctorScheduleStore';
import { toDateStr } from '../../../../utils/date';
import type { DayCellInfo } from '../../../../utils/calendar';

defineProps<{
  /** اليوم المفتوح في المودال (للتمييز) */
  selected?: string | null;
}>();

const emit = defineEmits<{
  'edit-day': [dateStr: string];
}>();

const store = useDoctorScheduleStore();

const now = new Date();
const todayStr = toDateStr(now);
const year = ref(now.getFullYear());
const month = ref(now.getMonth());

function onChangeMonth(v: { year: number; month: number }) {
  year.value = v.year;
  month.value = v.month;
}

function dayInfo(dateStr: string): DayCellInfo {
  const availability = store.getAvailability(dateStr);
  return { available: availability.active, isException: availability.isException };
}
</script>
