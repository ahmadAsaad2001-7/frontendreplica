<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
          <CalendarDays class="w-7 h-7 text-teal-600" />
          إدارة جدول العيادة
        </h1>
        <p class="text-sm text-slate-500 mt-1">حدد أيام العمل، فترات الكشف، والاستثناءات</p>
      </div>
      <div class="flex gap-2">
        <button
          type="button"
          @click="handleApplyDefault"
          class="bg-slate-100 text-slate-700 font-bold px-5 py-2.5 rounded-xl hover:bg-slate-200 transition text-sm"
        >
          <RotateCcw class="w-4 h-4 inline ml-1" />
          استعادة الافتراضي
        </button>
        <button
          v-if="draft.isDirty.value"
          type="button"
          @click="draft.discard"
          class="bg-white text-slate-600 font-bold px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-sm"
        >
          تراجع
        </button>
        <button
          type="button"
          :disabled="!draft.isDirty.value"
          @click="draft.save"
          class="bg-teal-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-md hover:bg-teal-700 transition flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <Save class="w-4 h-4" />
          {{ draft.justSaved.value ? 'تم الحفظ ✓' : draft.isDirty.value ? 'حفظ التغييرات' : 'لا تغييرات' }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- ═══ Settings Sidebar ═══ -->
      <div class="space-y-5">

        <!-- Slot Duration -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <h3 class="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm">
            <Timer class="w-4 h-4 text-blue-500" /> مدة الكشف
          </h3>
          <p class="text-xs text-slate-500 mb-3">المدة الزمنية لكل مريض</p>

          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="duration in [15, 20, 30, 45, 60]" :key="duration"
              type="button"
              @click="scheduleStore.setSlotDuration(duration)"
              :class="[
                'py-2.5 rounded-lg border text-sm font-bold transition-all',
                scheduleStore.slotDuration === duration
                  ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              ]"
            >
              {{ duration }} د
            </button>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-2xl shadow-sm text-white">
          <h3 class="font-bold mb-4 text-slate-200 text-sm flex items-center gap-2">
            <TrendingUp class="w-4 h-4" />
            ملخص السعة الأسبوعية
          </h3>
          <div class="space-y-3 text-sm">
            <StatRow label="أيام العمل" :value="`${scheduleStore.weeklyStats.activeDaysCount} / 7`" />
            <StatRow label="إجمالي الفترات" :value="`${scheduleStore.weeklyStats.shiftsCount} فترة`" />
            <StatRow label="ساعات العمل" :value="`${scheduleStore.weeklyStats.totalHours} ساعة`" />
            <div class="border-t border-slate-700 pt-3 mt-3">
              <div class="flex justify-between items-center">
                <span class="text-slate-400 text-xs">أقصى مرضى / أسبوع</span>
                <span class="font-extrabold text-emerald-400 text-lg">
                  {{ scheduleStore.weeklyStats.maxPatientsPerWeek }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Exceptions Panel -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2">
              <CalendarX class="w-4 h-4 text-amber-500" />
              الاستثناءات اليومية
            </h3>
            <button
              type="button"
              @click="activeTab = 'advanced'"
              class="text-xs bg-amber-50 text-amber-700 font-bold px-3 py-1.5 rounded-lg hover:bg-amber-100 transition flex items-center gap-1"
              title="اختر اليوم من التقويم"
            >
              <Plus class="w-3 h-3" /> إضافة
            </button>
          </div>

          <p class="text-xs text-slate-500 mb-3">
            أيام الإجازات والمواعيد الاستثنائية التي تتجاوز الجدول الأسبوعي. اضغط على استثناء لتعديله.
          </p>

          <div v-if="sortedExceptions.length === 0" class="text-center py-6 text-slate-400">
            <CalendarX class="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p class="text-xs">لا توجد استثناءات</p>
          </div>

          <div v-else class="space-y-2 max-h-64 overflow-y-auto">
            <div
              v-for="exc in sortedExceptions"
              :key="exc.date"
              class="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between group hover:border-teal-300 transition"
            >
              <button
                type="button"
                class="flex-1 min-w-0 text-right"
                @click="editor.openDay(exc.date)"
              >
                <div class="text-xs font-bold text-slate-800">{{ formatDate(exc.date) }}</div>
                <div class="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                  <span :class="getExceptionBadgeClass(exc.type)">{{ getExceptionLabel(exc.type) }}</span>
                  <span v-if="exc.note" class="truncate">· {{ exc.note }}</span>
                </div>
              </button>
              <button
                type="button"
                @click="editor.onReset(exc.date)"
                class="opacity-0 group-hover:opacity-100 focus:opacity-100 text-rose-500 hover:bg-rose-50 p-1.5 rounded transition"
                aria-label="حذف الاستثناء"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- ═══ Main Panel ═══ -->
      <div class="lg:col-span-2 space-y-5">

        <!-- Tabs: أيام متكررة | اختيار متقدم -->
        <div class="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <button
            type="button"
            @click="activeTab = 'recurring'"
            :class="tabClass('recurring')"
          >
            أيام متكررة
          </button>
          <button
            type="button"
            @click="activeTab = 'advanced'"
            :class="tabClass('advanced')"
          >
            اختيار متقدم
          </button>
        </div>

        <!-- ─── Recurring ─── -->
        <template v-if="activeTab === 'recurring'">

          <!-- Quick Actions Bar -->
          <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs font-bold text-slate-500 ml-2">إجراءات سريعة:</span>
              <button
                type="button"
                @click="handleApplyDefault"
                class="text-xs bg-teal-50 text-teal-700 font-bold px-3 py-2 rounded-lg hover:bg-teal-100 transition flex items-center gap-1.5"
              >
                <Zap class="w-3.5 h-3.5" /> تطبيق فترتين (الافتراضي)
              </button>
              <button
                type="button"
                @click="handleClearAll"
                class="text-xs bg-slate-50 text-slate-600 font-bold px-3 py-2 rounded-lg hover:bg-slate-100 transition flex items-center gap-1.5"
              >
                <Trash2 class="w-3.5 h-3.5" /> مسح الكل
              </button>
            </div>
          </div>

          <!-- Weekly Matrix -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 class="font-bold text-slate-800 flex items-center gap-2">
                <CalendarDays class="w-5 h-5 text-teal-600" />
                الجدول الأسبوعي الدائم
              </h3>
              <span class="text-xs text-slate-500 bg-white px-3 py-1 rounded-lg border border-slate-200">
                {{ scheduleStore.weeklyStats.activeDaysCount }} أيام نشطة
              </span>
            </div>

            <div class="divide-y divide-slate-100">
              <DayScheduleRow
                v-for="(day, index) in scheduleStore.weeklySchedule"
                :key="day.day"
                :day="day"
                :index="index"
                :can-copy="index > 0"
                @toggle="scheduleStore.toggleDay(day.day)"
                @add-shift="scheduleStore.addShift(day.day)"
                @remove-shift="(idx) => scheduleStore.removeShift(day.day, idx)"
                @update-shift="(idx, field, val) => scheduleStore.updateShift(day.day, idx, field, val)"
                @apply-preset="(preset) => scheduleStore.applyPresetToDay(day.day, preset)"
                @clear="scheduleStore.clearDay(day.day)"
                @copy="scheduleStore.copyFromPreviousDay(day.day)"
              />
            </div>

            <div class="p-4 bg-gradient-to-l from-teal-50 to-transparent text-xs text-slate-600 flex items-center gap-2 border-t border-slate-100">
              <Info class="w-4 h-4 text-teal-600 shrink-0" />
              <span>
                سيتم توليد الخانات المتاحة للحجز (Slots) تلقائياً بناءً على هذه الفترات ومدة الكشف المحددة.
                يمكنك إضافة أكثر من فترة في اليوم الواحد (مثلاً: صباحي + مسائي).
              </span>
            </div>
          </div>

          <!-- Preview: Generated Slots for Today -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="p-5 border-b border-slate-100 bg-slate-50">
              <h3 class="font-bold text-slate-800 flex items-center gap-2">
                <Clock class="w-5 h-5 text-blue-500" />
                معاينة الخانات المتاحة (اليوم)
              </h3>
              <p class="text-xs text-slate-500 mt-1">{{ todayStr }} · {{ todayDayName }}</p>
            </div>

            <div class="p-5">
              <div v-if="todaySlots.length === 0" class="text-center py-8 text-slate-400">
                <Clock class="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p class="text-sm">لا توجد خانات متاحة اليوم</p>
                <p class="text-xs mt-1">اليوم غير مفعل في الجدول</p>
              </div>

              <div v-else class="flex flex-wrap gap-2">
                <div
                  v-for="slot in todaySlots"
                  :key="slot.time"
                  class="px-3 py-2 bg-teal-50 text-teal-700 rounded-lg text-xs font-bold border border-teal-100"
                >
                  {{ slot.time }} - {{ slot.end }}
                </div>
              </div>

              <div v-if="todaySlots.length > 0" class="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                إجمالي الخانات المتاحة اليوم: <strong class="text-teal-700">{{ todaySlots.length }}</strong>
              </div>
            </div>
          </div>
        </template>

        <!-- ─── Advanced (month calendar) ─── -->
        <div
          v-else
          class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        >
          <AdvancedTab :selected="editor.modalDate.value" @edit-day="editor.openDay" />
        </div>
      </div>
    </div>

    <!-- ═══ Day Status Modal ═══ -->
    <DayStatusModal
      :is-open="editor.modalDate.value !== null"
      :date="editor.modalDate.value"
      @close="editor.closeDay"
      @save="editor.onSave"
      @reset="editor.onReset"
    />
    <ConflictWarningModal
      :is-open="editor.conflictsOpen.value"
      :conflicts="editor.conflicts.value"
      @confirm="editor.confirmConflicts"
      @cancel="editor.cancelConflicts"
    />
    <ConflictWarningModal
      :is-open="draft.conflictsOpen.value"
      :conflicts="draft.conflicts.value"
      @confirm="draft.confirmConflicts"
      @cancel="draft.cancelConflicts"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  CalendarDays, Timer, Save, RotateCcw, CalendarX, Plus, Trash2,
  Zap, Info, Clock, TrendingUp,
} from 'lucide-vue-next';
import {
  useDoctorScheduleStore, type ExceptionType,
} from '../../../../stores/doctorScheduleStore';
import { parseLocalDate, toDateStr, getDayName } from '../../../../utils/date';
import DayScheduleRow from '../DayScheduleRow.vue';
import StatRow from '../StatRow.vue';
import AdvancedTab from './AdvancedTab.vue';
import DayStatusModal from '../modals/DayStatusModal.vue';
import ConflictWarningModal from '../modals/ConflictWarningModal.vue';
import { useDayExceptionEditor } from '../../composables/useDayExceptionEditor';
import { useWeeklyDraft } from '../../composables/useWeeklyDraft';

const scheduleStore = useDoctorScheduleStore();

// ─── Tabs ───
const activeTab = ref<'recurring' | 'advanced'>('recurring');

const tabClass = (tab: 'recurring' | 'advanced') => [
  'py-2.5 rounded-xl text-sm font-bold transition-all',
  activeTab.value === tab
    ? 'bg-teal-700 text-white shadow-sm'
    : 'text-slate-600 hover:bg-white',
];

// ─── Day modal (مشترك مع الأجندة، شاملاً فحص التعارض) ───
const editor = useDayExceptionEditor();
const draft = useWeeklyDraft();

const sortedExceptions = computed(() =>
  [...scheduleStore.exceptions].sort((a, b) => a.date.localeCompare(b.date))
);

// ─── Quick Actions ───
function handleApplyDefault() {
  if (confirm('هل تريد تطبيق الجدول الافتراضي (فترتين: 9-12 و 16-21) على جميع الأيام ما عدا الجمعة؟')) {
    scheduleStore.applyDefaultSchedule();
  }
}

function handleClearAll() {
  if (confirm('هل تريد مسح جميع أيام العمل؟')) {
    scheduleStore.weeklySchedule.forEach(day => scheduleStore.clearDay(day.day));
  }
}

// ─── Today preview ───
const today = new Date();
const todayStr = computed(() =>
  today.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
);
const todayDayName = computed(() => getDayName(today));

const todaySlots = computed(() => {
  const availability = scheduleStore.getAvailability(toDateStr(today));
  if (!availability.active) return [];
  return scheduleStore.expandShiftsToSlots(availability.shifts);
});

// ─── Helpers ───
function formatDate(dateStr: string): string {
  return parseLocalDate(dateStr).toLocaleDateString('ar-EG', { weekday: 'short', month: 'short', day: 'numeric' });
}

function getExceptionLabel(type: ExceptionType): string {
  const labels: Record<ExceptionType, string> = {
    off: 'إجازة',
    preset_morning: 'صباحي فقط',
    preset_evening: 'مسائي فقط',
    preset_full: 'يوم كامل',
    custom: 'مخصص',
  };
  return labels[type];
}

function getExceptionBadgeClass(type: ExceptionType): string {
  const classes: Record<ExceptionType, string> = {
    off: 'bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold',
    preset_morning: 'bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold',
    preset_evening: 'bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold',
    preset_full: 'bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold',
    custom: 'bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold',
  };
  return classes[type];
}
</script>
