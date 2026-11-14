 <template>
  <div class="space-y-5">

    <!-- ═══ التقويم ═══ -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <MonthCalendar
        mode="agenda"
        :year="year"
        :month="month"
        :selected="selectedDate"
        :day-info="dayInfo"
        @change="onChangeMonth"
        @select="selectedDate = $event"
      />

      <div class="mt-5 flex items-center justify-center gap-4 flex-wrap text-[11px] text-slate-500">
        <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-teal-50 border border-teal-200"></span> متاح</span>
        <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-white border border-slate-200"></span> غير متاح</span>
        <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-rose-50 border border-rose-300"></span> محجوز بالكامل</span>
        <span class="flex items-center gap-1.5"><span class="min-w-[14px] px-1 rounded-full bg-teal-600 text-white text-[9px] leading-[14px] text-center font-bold">3</span> عدد المواعيد</span>
      </div>
    </div>

    <!-- ═══ ملخص اليوم ═══ -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex items-center justify-between gap-4 flex-wrap">
      <div class="min-w-0">
        <div class="text-xs text-slate-400 mb-0.5">اليوم المختار</div>
        <div class="font-extrabold text-slate-800">{{ selectedLabel }}</div>

        <div class="mt-2 flex flex-wrap gap-1.5">
          <template v-if="availability.active">
            <span
              v-for="s in availability.shifts"
              :key="s.from + s.to"
              class="text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-100 px-2 py-1 rounded-lg"
            >
              {{ s.from }} - {{ s.to }}
            </span>
            <span v-if="availability.isException" class="text-[11px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-lg">استثناء</span>
          </template>
          <span v-else class="text-[11px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">غير متاح للحجز</span>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="text-center bg-teal-50 border border-teal-100 rounded-2xl px-6 py-3">
          <div class="text-[11px] text-teal-700 font-bold">عدد المرضى</div>
          <div class="text-2xl font-extrabold text-teal-800 leading-tight">{{ bookedCount }}</div>
          <div v-if="slotsTotal > 0" class="text-[10px] text-slate-500">من {{ slotsTotal }} خانة</div>
        </div>

        <button
          type="button"
          @click="editor.openDay(selectedDate)"
          :disabled="isPast"
          :title="isPast ? 'لا يمكن تعديل إتاحة يوم ماضٍ' : undefined"
          class="text-xs bg-slate-100 text-slate-700 font-bold px-4 py-2.5 rounded-xl hover:bg-slate-200 transition flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Settings2 class="w-4 h-4" /> تعديل إتاحة اليوم
        </button>
      </div>
    </div>

    <!-- ═══ قائمة المرضى + معلومات المريض ═══ -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <!-- RTL: أول عنصر على اليمين (معلومات المريض)، والقائمة على الشمال زي الواير فريم -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div class="bg-slate-50/60 border border-slate-100 rounded-2xl p-4">
          <PatientInfoPanel :appointment="selectedAppointment" @set-status="onSetStatus" />
        </div>

        <div class="flex flex-col">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Users class="w-4 h-4 text-teal-600" /> مرضى اليوم
            </h3>
            <span v-if="total > 0" class="text-[11px] text-slate-400">
              {{ from }}–{{ to }} من {{ total }}
            </span>
          </div>

          <DayPatientsList :items="pageItems" :selected-id="selectedId" @select="selectedId = $event" />

          <div class="mt-4 pt-4 border-t border-slate-100">
            <PaginationBar v-model:page="page" :total-pages="totalPages" />
          </div>
        </div>
      </div>
    </div>

    <!-- مودالات -->
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Users, Settings2 } from 'lucide-vue-next';
import MonthCalendar from './MonthCalendar.vue';
import DayPatientList from './DayPatientList.vue';
import PatientInfoPanel from './PatientInfoPanel.vue';
import PaginationBar from './PaginationBar.vue';
import DayStatusModal from '../modals/DayStatusModal.vue';
import ConflictWarningModal from '../modals/ConflictWarningModal.vue';
import { useDoctorScheduleStore } from '../../../../stores/doctorScheduleStore';
import { useDoctorAgendaStore } from '../../../../stores/doctorAgendaStore';
import { usePagination } from '../../../../composables/usePagination';
import { useDayExceptionEditor } from '../../composables/useDayExceptionEditor';
import { parseLocalDate, toDateStr } from '../../../../utils/date';
import type { DayCellInfo } from '../../../../utils/calendar';
import type { AppointmentStatus } from '../../../../types/appointment';

const PAGE_SIZE = 5;

const scheduleStore = useDoctorScheduleStore();
const appointmentStore = useDoctorAgendaStore();
const editor = useDayExceptionEditor();

// ─── التقويم ───
const now = new Date();
const todayStr = toDateStr(now);
const year = ref(now.getFullYear());
const month = ref(now.getMonth());
const selectedDate = ref(todayStr);

function onChangeMonth(v: { year: number; month: number }) {
  year.value = v.year;
  month.value = v.month;
}

function dayInfo(dateStr: string): DayCellInfo {
  const availability = scheduleStore.getAvailability(dateStr);
  const count = appointmentStore.countsByDate[dateStr] ?? 0;
  const slots = availability.active ? scheduleStore.expandShiftsToSlots(availability.shifts).length : 0;

  return {
    available: availability.active,
    isException: availability.isException,
    count,
    full: slots > 0 && count >= slots,
  };
}

// ─── اليوم المختار ───
const availability = computed(() => scheduleStore.getAvailability(selectedDate.value));
const slotsTotal = computed(() =>
  availability.value.active ? scheduleStore.expandShiftsToSlots(availability.value.shifts).length : 0
);
const bookedCount = computed(() => appointmentStore.countsByDate[selectedDate.value] ?? 0);
const isPast = computed(() => selectedDate.value < todayStr);

const selectedLabel = computed(() =>
  parseLocalDate(selectedDate.value).toLocaleDateString('ar-EG', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
);

// ─── المرضى + الـ pagination (5 في الصفحة) ───
const dayAppointments = computed(() => appointmentStore.byDate(selectedDate.value));
const { page, totalPages, pageItems, total, from, to, reset } = usePagination(dayAppointments, PAGE_SIZE);

const selectedId = ref<string | null>(null);
const selectedAppointment = computed(() =>
  dayAppointments.value.find(a => a.id === selectedId.value) ?? null
);

// عند تغيير اليوم: ارجع للصفحة 1 واختر أول مريض
watch(selectedDate, () => {
  reset();
  selectedId.value = dayAppointments.value[0]?.id ?? null;
}, { immediate: true });

function onSetStatus(id: string, status: AppointmentStatus) {
  appointmentStore.setStatus(id, status);
}
</script>
