// src/stores/doctorAgendaStore.ts
// مخزن مشتق: يعرض حجوزات الطبيب الحالي من appointmentStore (جانب المريض) بنموذج الأجندة.
// لا يحتفظ ببيانات خاصة بيه؛ أي تعديل بيكتب على الحجز الأصلي.
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAppointmentStore, type Appointment as SourceAppointment } from './appointmentStore';
import { useProfileStore } from './profileStore';
import { useDoctorScheduleStore, type Shift } from './doctorScheduleStore';
import type { Appointment, AppointmentStatus } from '../types/appointment';
import { toAgendaAppointment, toSourceStatus, type ProfileLike } from '../utils/agendaAdapter';
import { sortByTime, isCounted, findConflicts as findConflictsIn } from '../utils/appointments';

export const useDoctorAgendaStore = defineStore('doctorAgenda', () => {
    const source = useAppointmentStore();
    const profiles = useProfileStore();
    const schedule = useDoctorScheduleStore();

    /**
     * الطبيب الحالي. لازم يتحدد (DoctorSchedulePage بيعمل ده)، وإلا القائمة فاضية
     * علشان ما نعرضش حجوزات أطباء تانيين بالغلط.
     */
    const doctorId = ref<string | null>(null);
    function setDoctorId(id: string | null) {
        doctorId.value = id;
    }

    const appointments = computed<Appointment[]>(() => {
        if (!doctorId.value) return [];

        const result: Appointment[] = [];
        for (const src of source.appointments as SourceAppointment[]) {
            if (src.doctorId !== doctorId.value) continue;

            const profile = profiles.profiles.find(p => p.id === src.patientProfileId) as ProfileLike | undefined;
            const apt = toAgendaAppointment(src, profile, schedule.slotDuration);

            if (apt) result.push(apt);
            else console.warn(`[doctorAgenda] تجاهل حجز بوقت غير مفهوم: ${src.id} (${src.time})`);
        }
        return result;
    });

    /** مواعيد يوم محدد مرتبة بالوقت (تشمل الملغي، والعرض يقرر). */
    function byDate(dateStr: string): Appointment[] {
        return sortByTime(appointments.value.filter(a => a.date === dateStr));
    }

    /** عدد مرضى كل يوم (بدون الملغي) لنقط التقويم. */
    const countsByDate = computed<Record<string, number>>(() => {
        const map: Record<string, number> = {};
        for (const a of appointments.value) {
            if (isCounted(a)) map[a.date] = (map[a.date] ?? 0) + 1;
        }
        return map;
    });

    function setStatus(id: string, status: AppointmentStatus) {
        const src = source.appointments.find(a => a.id === id);
        if (src) (src as { status: string }).status = toSourceStatus(status);
    }

    /** مواعيد قائمة (بانتظار/مؤكد) خرجت عن الفترات المعطاة. */
    function findConflicts(dateStr: string, shifts: readonly Shift[]): Appointment[] {
        return findConflictsIn(byDate(dateStr), shifts);
    }

    function markNeedsReschedule(ids: string[]) {
        ids.forEach(id => setStatus(id, 'needs_reschedule'));
    }

    return {
        doctorId,
        setDoctorId,
        appointments,
        countsByDate,
        byDate,
        setStatus,
        findConflicts,
        markNeedsReschedule,
    };
});
