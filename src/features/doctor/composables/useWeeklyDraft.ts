// src/features/doctor/composables/useWeeklyDraft.ts
// تعديلات الجدول الأسبوعي تتم على الـ store مباشرة (عشان الواجهة تفضل reactive)،
// لكن تعتبر "مسودة" لحد ما المستخدم يحفظ: نأخذ لقطة، نقارن، ونرجّع اللقطة لو تراجع أو غادر الصفحة.
import { ref, computed, onBeforeUnmount } from 'vue';
import { useDoctorScheduleStore, type DaySchedule } from '../../../stores/doctorScheduleStore';
import { useDoctorAgendaStore } from '../../../stores/doctorAgendaStore';
import { findScheduleConflicts } from '../../../utils/appointments';
import { toDateStr } from '../../../utils/date';
import type { Appointment } from '../../../types/appointment';

export function useWeeklyDraft() {
    const schedule = useDoctorScheduleStore();
    const agenda = useDoctorAgendaStore();

    let saved: DaySchedule[] = schedule.getWeeklySnapshot();
    const serialize = (w: DaySchedule[]) => JSON.stringify(w);
    let savedKey = serialize(saved);

    const isDirty = computed(() => serialize(schedule.weeklySchedule) !== savedKey);

    const conflicts = ref<Appointment[]>([]);
    const conflictsOpen = ref(false);
    const justSaved = ref(false);

    function commit() {
        saved = schedule.getWeeklySnapshot();
        savedKey = serialize(saved);
        conflictsOpen.value = false;
        conflicts.value = [];
        justSaved.value = true;
        setTimeout(() => (justSaved.value = false), 2500);
        // هنا يتم استدعاء الـ API الحقيقي لاحقًا
    }

    /** حفظ: لو فيه مواعيد قائمة هتخرج عن الجدول الجديد نعرض التحذير أولًا. */
    function save() {
        if (!isDirty.value) return;
        const found = findScheduleConflicts(agenda.appointments, toDateStr(new Date()), date => {
            const a = schedule.getAvailability(date);
            return a.active ? a.shifts : [];
        });
        if (found.length === 0) return commit();
        conflicts.value = found;
        conflictsOpen.value = true;
    }

    function confirmConflicts() {
        agenda.markNeedsReschedule(conflicts.value.map(a => a.id));
        commit();
    }

    function cancelConflicts() {
        conflictsOpen.value = false;
        conflicts.value = [];
    }

    function discard() {
        schedule.restoreWeekly(saved);
        cancelConflicts();
    }

    // مغادرة الصفحة بتعديلات غير محفوظة = تراجع (ما نسيبش تعديلات شغّالة بالخفاء)
    onBeforeUnmount(() => {
        if (isDirty.value) schedule.restoreWeekly(saved);
    });

        return { isDirty, justSaved, conflicts, conflictsOpen, save, discard, confirmConflicts, cancelConflicts };
}
