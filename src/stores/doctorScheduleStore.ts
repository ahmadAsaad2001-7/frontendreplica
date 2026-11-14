// src/stores/doctorScheduleStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { parseLocalDate, getDayName } from '../utils/date';

// ═══════════════════════════════════════════
// 📋 Types & Interfaces
// ═══════════════════════════════════════════

export interface Shift {
  from: string; // '09:00'
  to: string;   // '12:00'
}

export interface DaySchedule {
  day: string;
  isActive: boolean;
  shifts: Shift[]; // فترات متعددة في اليوم
}

export type ExceptionType =
| 'off'             // إجازة
| 'preset_morning'  // صباحي فقط
| 'preset_evening'  // مسائي فقط
| 'preset_full'     // يوم كامل
| 'custom';         // مخصص

export interface DayException {
  date: string;       // '2026-11-25'
  type: ExceptionType;
  shifts?: Shift[];   // للـ custom فقط (المصدر الوحيد للحقيقة؛ حُذف الحقل hours)
  note?: string;
}

export interface TimeSlot {
  time: string; // '09:00'
  end: string;  // '09:20'
  available: boolean;
}

export interface Availability {
  active: boolean;
  shifts: Shift[];
  isException: boolean;
  exceptionType?: ExceptionType;
}

// ═══════════════════════════════════════════
// 🧰 Helpers
// ═══════════════════════════════════════════

/** ينسخ الفترات نسخة عميقة حتى لا تتشارك الأيام (أو القوالب) نفس الكائنات. */
const cloneShifts = (shifts: readonly Shift[]): Shift[] => shifts.map(s => ({ ...s }));

const pad = (n: number) => String(n).padStart(2, '0');
const toMinutes = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};
const toTime = (mins: number) => `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;

// ═══════════════════════════════════════════
// 📚 Presets الجاهزة
// ═══════════════════════════════════════════

export const PRESETS = {
  two_shifts: {
    name: 'فترتين (صباحي + مسائي)',
    shifts: [
      { from: '09:00', to: '12:00' },
      { from: '16:00', to: '21:00' },
    ],
  },
  morning: {
    name: 'صباحي فقط',
    shifts: [{ from: '09:00', to: '13:00' }],
  },
  evening: {
    name: 'مسائي فقط',
    shifts: [{ from: '16:00', to: '21:00' }],
  },
  full_day: {
    name: 'يوم كامل',
    shifts: [{ from: '09:00', to: '17:00' }],
  },
} as const;

type PresetKey = keyof typeof PRESETS;

/** يربط نوع الاستثناء بمفتاح القالب. (preset_full كان بيتحوّل لـ 'full' غير موجود، والمفتاح الصحيح full_day) */
const EXCEPTION_PRESET_MAP: Partial<Record<ExceptionType, PresetKey>> = {
  preset_morning: 'morning',
  preset_evening: 'evening',
  preset_full: 'full_day',
};

// ═══════════════════════════════════════════
// 🏪 Store Definition
// ═══════════════════════════════════════════

export const useDoctorScheduleStore = defineStore('doctorSchedule', () => {

  // ─── State ───────────────────────────────
  const slotDuration = ref<number>(20); // مدة الكشف بالدقائق

  // الجدول الأسبوعي (القالب الدائم)، الأسبوع يبدأ بالسبت
  const weeklySchedule = ref<DaySchedule[]>([
    { day: 'السبت',    isActive: true,  shifts: cloneShifts(PRESETS.two_shifts.shifts) },
                                            { day: 'الأحد',    isActive: true,  shifts: cloneShifts(PRESETS.two_shifts.shifts) },
                                            { day: 'الإثنين',  isActive: true,  shifts: cloneShifts(PRESETS.two_shifts.shifts) },
                                            { day: 'الثلاثاء', isActive: true,  shifts: cloneShifts(PRESETS.two_shifts.shifts) },
                                            { day: 'الأربعاء', isActive: true,  shifts: cloneShifts(PRESETS.two_shifts.shifts) },
                                            { day: 'الخميس',   isActive: true,  shifts: cloneShifts(PRESETS.two_shifts.shifts) },
                                            { day: 'الجمعة',   isActive: false, shifts: [] },
  ]);

  // الاستثناءات اليومية (تواريخ محددة تتجاوز القالب الأسبوعي)
  const exceptions = ref<DayException[]>([]);

  // ─── Draft support (للتراجع عن تعديلات غير محفوظة) ───
  function getWeeklySnapshot(): DaySchedule[] {
    return weeklySchedule.value.map(d => ({ ...d, shifts: cloneShifts(d.shifts) }));
  }

  function restoreWeekly(snapshot: DaySchedule[]) {
    weeklySchedule.value = snapshot.map(d => ({ ...d, shifts: cloneShifts(d.shifts) }));
  }

  // ─── Weekly Schedule Actions ─────────────

  function findDay(dayName: string) {
    return weeklySchedule.value.find(d => d.day === dayName);
  }

  function toggleDay(dayName: string) {
    const day = findDay(dayName);
    if (!day) return;
    day.isActive = !day.isActive;
    // تفعيل يوم بدون فترات كان بيظهر يوم نشط فاضي، فنضيف فترة افتراضية
    if (day.isActive && day.shifts.length === 0) {
      day.shifts = cloneShifts(PRESETS.morning.shifts);
    }
  }

  function addShift(dayName: string, shift: Shift = { from: '09:00', to: '12:00' }) {
    const day = findDay(dayName);
    if (day) {
      day.shifts.push({ ...shift });
      day.isActive = true;
    }
  }

  function removeShift(dayName: string, index: number) {
    const day = findDay(dayName);
    if (day && index >= 0 && index < day.shifts.length) {
      day.shifts.splice(index, 1);
      if (day.shifts.length === 0) day.isActive = false;
    }
  }

  function updateShift(dayName: string, index: number, field: 'from' | 'to', value: string) {
    const day = findDay(dayName);
    if (day && day.shifts[index]) {
      day.shifts[index][field] = value;
    }
  }

  function applyPresetToDay(dayName: string, presetKey: PresetKey) {
    const day = findDay(dayName);
    if (day) {
      day.shifts = cloneShifts(PRESETS[presetKey].shifts);
      day.isActive = true;
    }
  }

  function clearDay(dayName: string) {
    const day = findDay(dayName);
    if (day) {
      day.shifts = [];
      day.isActive = false;
    }
  }

  function copyFromPreviousDay(targetDay: string) {
    const days = weeklySchedule.value;
    const targetIndex = days.findIndex(d => d.day === targetDay);
    if (targetIndex <= 0) return;

    const source = days[targetIndex - 1];
    const target = days[targetIndex];
    target.shifts = cloneShifts(source.shifts);
    target.isActive = source.isActive;
  }

  // تطبيق الجدول الافتراضي (فترتين) على جميع الأيام ما عدا الجمعة
  function applyDefaultSchedule() {
    weeklySchedule.value.forEach(day => {
      if (day.day === 'الجمعة') {
        day.isActive = false;
        day.shifts = [];
      } else {
        day.isActive = true;
        day.shifts = cloneShifts(PRESETS.two_shifts.shifts);
      }
    });
  }

  // ─── Exceptions Actions ──────────────────

  function addException(exception: DayException) {
    const copy: DayException = {
      ...exception,
      shifts: exception.shifts ? cloneShifts(exception.shifts) : undefined,
    };
    const existing = exceptions.value.findIndex(e => e.date === copy.date);
    if (existing !== -1) {
      exceptions.value[existing] = copy;
    } else {
      exceptions.value.push(copy);
    }
  }

  function removeException(date: string) {
    exceptions.value = exceptions.value.filter(e => e.date !== date);
  }

  function getException(date: string): DayException | undefined {
    return exceptions.value.find(e => e.date === date);
  }

  // ─── Resolution Engine ───────────────────
  // القاعدة: exception > weekly

  function getAvailability(dateStr: string): Availability {
    const exception = getException(dateStr);

    if (exception) {
      if (exception.type === 'off') {
        return { active: false, shifts: [], isException: true, exceptionType: 'off' };
      }

      if (exception.type === 'custom') {
        const shifts = cloneShifts(exception.shifts ?? []);
        return { active: shifts.length > 0, shifts, isException: true, exceptionType: 'custom' };
      }

      const presetKey = EXCEPTION_PRESET_MAP[exception.type];
      if (presetKey) {
        return {
          active: true,
          shifts: cloneShifts(PRESETS[presetKey].shifts),
                                                  isException: true,
                                                  exceptionType: exception.type,
        };
      }
    }

    // Fallback: الجدول الأسبوعي (التاريخ بالتوقيت المحلي)
    const weeklyDay = findDay(getDayName(parseLocalDate(dateStr)));

    return {
      active: (weeklyDay?.isActive ?? false) && (weeklyDay?.shifts.length ?? 0) > 0,
                                                  shifts: cloneShifts(weeklyDay?.shifts ?? []),
                                                  isException: false,
    };
  }

  /**
   * الفترات اللي هتطلع لو اتطبّق هذا الاستثناء (أو اتشال لو null) بدون تعديل الـ state.
   * مستخدمة لفحص التعارض مع المواعيد قبل الحفظ.
   */
  function previewShifts(dateStr: string, exception: DayException | null): Shift[] {
    const weekly = () => {
      const day = findDay(getDayName(parseLocalDate(dateStr)));
      return day?.isActive ? cloneShifts(day.shifts) : [];
    };

    if (!exception) return weekly();
    if (exception.type === 'off') return [];
    if (exception.type === 'custom') return cloneShifts(exception.shifts ?? []);

    const presetKey = EXCEPTION_PRESET_MAP[exception.type];
    return presetKey ? cloneShifts(PRESETS[presetKey].shifts) : weekly();
  }

  // ─── Slot Generation ─────────────────────

  function expandShiftsToSlots(shifts: Shift[], duration: number = slotDuration.value): TimeSlot[] {
    const slots: TimeSlot[] = [];

    shifts.forEach(shift => {
      let current = toMinutes(shift.from);
      const end = toMinutes(shift.to);

      while (current + duration <= end) {
        slots.push({
          time: toTime(current),
                   end: toTime(current + duration),
                   available: true,
        });
        current += duration;
      }
    });

    return slots;
  }

  function setSlotDuration(minutes: number) {
    if (minutes >= 15 && minutes <= 120) {
      slotDuration.value = minutes;
    }
  }

  // ─── Computed Stats ──────────────────────

  const weeklyStats = computed(() => {
    const activeDays = weeklySchedule.value.filter(d => d.isActive);
    let totalMinutes = 0;

    activeDays.forEach(day => {
      day.shifts.forEach(shift => {
        const diff = toMinutes(shift.to) - toMinutes(shift.from);
        if (diff > 0) totalMinutes += diff;
      });
    });

    return {
      activeDaysCount: activeDays.length,
      totalMinutes,
      totalHours: Math.round((totalMinutes / 60) * 10) / 10,
                               maxPatientsPerWeek: Math.floor(totalMinutes / slotDuration.value),
                               shiftsCount: activeDays.reduce((acc, d) => acc + d.shifts.length, 0),
    };
  });

  return {
    // State
    slotDuration,
    weeklySchedule,
    exceptions,

    // Weekly Actions
    getWeeklySnapshot,
    restoreWeekly,
    toggleDay,
    addShift,
    removeShift,
    updateShift,
    applyPresetToDay,
    clearDay,
    copyFromPreviousDay,
    applyDefaultSchedule,

    // Exceptions Actions
    addException,
    removeException,
    getException,

    // Resolution
    getAvailability,
    previewShifts,
    expandShiftsToSlots,

    // Settings
    setSlotDuration,

    // Computed
    weeklyStats,
  };
});
