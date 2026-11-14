<template>
  <div
    v-if="isOpen && date"
    class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    @click.self="emit('close')"
  >
    <div class="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden" role="dialog" aria-modal="true">

      <!-- Header -->
      <div class="p-5 border-b border-slate-100 flex justify-between items-center">
        <h3 class="font-bold text-slate-800 flex items-center gap-2">
          <CalendarX class="w-5 h-5 text-amber-500" />
          تحديد حالة يوم {{ dateLabel }}
        </h3>
        <button
          type="button"
          @click="emit('close')"
          class="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition"
          aria-label="إغلاق"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-5 space-y-5 max-h-[70vh] overflow-y-auto">

        <!-- متاح / غير متاح -->
        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            @click="setAvailable"
            :class="[
              'py-3 rounded-xl border-2 text-sm font-bold transition-all',
              isAvailable
                ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300',
            ]"
          >
            متاح
          </button>
          <button
            type="button"
            @click="choice = 'off'"
            :class="[
              'py-3 rounded-xl border-2 text-sm font-bold transition-all',
              !isAvailable
                ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-rose-300',
            ]"
          >
            غير متاح
          </button>
        </div>

        <!-- خيارات الإتاحة -->
        <div v-if="isAvailable" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-2">نوع اليوم</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="opt in options"
                :key="opt.value"
                type="button"
                @click="choice = opt.value"
                :class="[
                  'px-3 py-2 rounded-lg border text-xs font-bold transition-all',
                  choice === opt.value
                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100',
                ]"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <!-- شبكة الساعات (مخصص) -->
          <div v-if="choice === 'custom'" class="pt-3 border-t border-slate-100">
            <label class="block text-xs font-bold text-slate-700 mb-2">اختر ساعات العمل المتاحة لهذا اليوم:</label>
            <HoursGrid v-model="customHours" />
            <p v-if="inexact" class="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
              الفترات الحالية لهذا اليوم فيها دقائق (مثل 09:30) ولا يمكن عرضها بدقة في الشبكة.
              الساعات الظاهرة هي المغطاة بالكامل فقط، وحفظ المخصص هيستبدل الفترات بساعات كاملة.
            </p>
          </div>
        </div>

        <!-- عدد الخانات -->
        <p class="text-xs text-slate-500 bg-slate-50 rounded-lg p-3 border border-slate-100">
          <template v-if="isAvailable">
            الخانات المتاحة بعد الحفظ:
            <strong class="text-teal-700">{{ slotsCount }}</strong>
            (مدة الكشف {{ store.slotDuration }} دقيقة)
          </template>
          <template v-else>اليوم هيكون إجازة ولن تتاح فيه أي خانات.</template>
        </p>

        <!-- ملاحظة -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">ملاحظة (اختياري)</label>
          <input
            v-model="note"
            type="text"
            placeholder="مثال: يوم عمليات، مؤتمر..."
            class="w-full p-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 outline-none focus:border-teal-500 transition"
          >
        </div>

        <p v-if="errorMsg" class="text-xs text-rose-600 font-bold">{{ errorMsg }}</p>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-2">
        <button
          type="button"
          @click="handleSave"
          class="px-6 py-2.5 bg-teal-600 text-white font-bold text-sm rounded-xl hover:bg-teal-700 transition flex items-center gap-1.5"
        >
          <Save class="w-4 h-4" /> تم
        </button>
        <button
          type="button"
          @click="emit('close')"
          class="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition"
        >
          إلغاء
        </button>

        <button
          v-if="hasException"
          type="button"
          @click="emit('reset', date)"
          class="mr-auto text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-lg transition flex items-center gap-1.5"
        >
          <RotateCcw class="w-3.5 h-3.5" /> إرجاع للجدول الأسبوعي
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { CalendarX, X, Save, RotateCcw } from 'lucide-vue-next';
import HoursGrid from '../schedule/HoursGrid.vue';
import {
  useDoctorScheduleStore, PRESETS, type DayException, type Shift,
} from '../../../../stores/doctorScheduleStore';
import { parseLocalDate, getDayName } from '../../../../utils/date';
import { hoursToShifts } from '../../../../utils/hours';
import { resolveInitialState, buildException } from "../../../../utils/dayStatus";
const props = defineProps<{
  isOpen: boolean;
  /** 'YYYY-MM-DD' */
  date: string | null;
}>();

const emit = defineEmits<{
  close: [];
  save: [exception: DayException];
  /** حذف الاستثناء والرجوع للجدول الأسبوعي */
  reset: [date: string];
}>();

const store = useDoctorScheduleStore();

// ─── State ───
const choice = ref<DayChoice>('off');
const customHours = ref<number[]>([]);
const inexact = ref(false);
const note = ref('');
const errorMsg = ref('');

// ─── Derived ───
const dateLabel = computed(() =>
  props.date
    ? parseLocalDate(props.date).toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : ''
);

const weeklyShifts = computed<Shift[]>(() => {
  if (!props.date) return [];
  const day = store.weeklySchedule.find(d => d.day === getDayName(parseLocalDate(props.date as string)));
  return day?.isActive ? day.shifts : [];
});
const weeklyActive = computed(() => weeklyShifts.value.length > 0);

const hasException = computed(() => !!props.date && !!store.getException(props.date));
const isAvailable = computed(() => choice.value !== 'off');

const options = computed(() => {
  const list: { value: DayChoice; label: string }[] = [];
  if (weeklyActive.value) list.push({ value: 'weekly', label: 'حسب الجدول الأسبوعي' });
  list.push(
    { value: 'preset_morning', label: 'صباحي فقط' },
    { value: 'preset_evening', label: 'مسائي فقط' },
    { value: 'preset_full', label: 'يوم كامل' },
    { value: 'custom', label: 'مخصص (ساعات)' },
  );
  return list;
});

const resultingShifts = computed<Shift[]>(() => {
  switch (choice.value) {
    case 'off': return [];
    case 'weekly': return weeklyShifts.value;
    case 'preset_morning': return [...PRESETS.morning.shifts];
    case 'preset_evening': return [...PRESETS.evening.shifts];
    case 'preset_full': return [...PRESETS.full_day.shifts];
    case 'custom': return hoursToShifts(customHours.value);
  }
});
const slotsCount = computed(() => store.expandShiftsToSlots(resultingShifts.value).length);

// ─── Init عند الفتح ───
function init() {
  if (!props.date) return;
  const state = resolveInitialState({
    exception: store.getException(props.date),
    effectiveShifts: store.getAvailability(props.date).shifts,
    weeklyActive: weeklyActive.value,
  });
  choice.value = state.choice;
  customHours.value = state.hours;
  inexact.value = state.inexact;
  note.value = state.note;
  errorMsg.value = '';
}

watch(() => [props.isOpen, props.date] as const, ([open]) => { if (open) init(); }, { immediate: true });

// ─── Actions ───
function setAvailable() {
  if (choice.value !== 'off') return;
  choice.value = weeklyActive.value ? 'weekly' : 'preset_full';
}

function handleSave() {
  if (!props.date) return;
  const result = buildException(props.date, choice.value, customHours.value, note.value);

  if (result.kind === 'invalid') {
    errorMsg.value = result.reason;
    return;
  }
  errorMsg.value = '';

  if (result.kind === 'reset') emit('reset', props.date);
  else emit('save', result.exception);
}
</script>
