// src/features/doctor/composables/useDayExceptionEditor.ts
// منطق مشترك بين الأجندة والإتاحة: فتح مودال اليوم، حفظ/حذف الاستثناء،
// وفحص التعارض مع المواعيد قبل التطبيق.
import { ref, computed } from 'vue';
import { useDoctorScheduleStore, type DayException } from '../../../stores/doctorScheduleStore';
import { useDoctorAgendaStore } from '../../../stores/doctorAgendaStore';
import type { Appointment } from '../../../types/appointment';

type PendingChange =
| { kind: 'save'; exception: DayException }
| { kind: 'reset'; date: string };

export function useDayExceptionEditor() {
    const schedule = useDoctorScheduleStore();
    const appointments = useDoctorAgendaStore();

    /** اليوم المفتوح في DayStatusModal (null = مقفول) */
    const modalDate = ref<string | null>(null);

    /** تغيير بانتظار تأكيد المستخدم بسبب تعارض */
    const pending = ref<PendingChange | null>(null);
    const conflicts = ref<Appointment[]>([]);

    const conflictsOpen = computed(() => pending.value !== null);

    function openDay(dateStr: string) {
        modalDate.value = dateStr;
    }

    function closeDay() {
        modalDate.value = null;
    }

    function apply(change: PendingChange) {
        if (change.kind === 'save') schedule.addException(change.exception);
        else schedule.removeException(change.date);

        pending.value = null;
        conflicts.value = [];
        modalDate.value = null;
    }

    function request(change: PendingChange) {
        const date = change.kind === 'save' ? change.exception.date : change.date;
        const shifts = schedule.previewShifts(date, change.kind === 'save' ? change.exception : null);
        const found = appointments.findConflicts(date, shifts);

        if (found.length === 0) {
            apply(change);
        } else {
            pending.value = change;
            conflicts.value = found;
        }
    }

    const onSave = (exception: DayException) => request({ kind: 'save', exception });
    const onReset = (date: string) => request({ kind: 'reset', date });

    /** المستخدم أكّد: نعلّم المواعيد المتأثرة "تحتاج إعادة جدولة" (من غير إلغاء تلقائي) ونطبّق. */
    function confirmConflicts() {
        if (!pending.value) return;
        appointments.markNeedsReschedule(conflicts.value.map(a => a.id));
        apply(pending.value);
    }

    /** المستخدم تراجع: نرجع للمودال بدون تطبيق. */
    function cancelConflicts() {
        pending.value = null;
        conflicts.value = [];
    }

    return {
        modalDate,
        conflicts,
        conflictsOpen,
        openDay,
        closeDay,
        onSave,
        onReset,
        confirmConflicts,
        cancelConflicts,
    };
}
