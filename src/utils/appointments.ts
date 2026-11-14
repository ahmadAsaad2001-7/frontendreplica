// src/utils/appointments.ts
// منطق نقي للمواعيد (بدون Vue/Pinia) علشان يتختبر بسهولة.

import type { Appointment, AppointmentStatus } from '../types/appointment';
import type { Shift } from '../stores/doctorScheduleStore';

export const STATUS_META: Record<AppointmentStatus, { label: string; badgeClass: string }> = {
    pending:          { label: 'بانتظار التأكيد',   badgeClass: 'bg-amber-100 text-amber-700' },
    confirmed:        { label: 'مؤكد',              badgeClass: 'bg-emerald-100 text-emerald-700' },
    completed:        { label: 'تم الكشف',          badgeClass: 'bg-blue-100 text-blue-700' },
    cancelled:        { label: 'ملغي',              badgeClass: 'bg-slate-100 text-slate-500' },
    no_show:          { label: 'لم يحضر',           badgeClass: 'bg-rose-100 text-rose-700' },
    needs_reschedule: { label: 'يحتاج إعادة جدولة', badgeClass: 'bg-orange-100 text-orange-700' },
};

const toMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
};

export function sortByTime<T extends Pick<Appointment, 'time'>>(list: readonly T[]): T[] {
    return [...list].sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
}

/** المواعيد اللي تُحسب كمرضى في اليوم (كل الحالات ما عدا الملغي). */
export const isCounted = (a: Pick<Appointment, 'status'>) => a.status !== 'cancelled';

/** حالات الحجز اللي نفحصها عند تغيير الإتاحة (ما زالت قائمة ومنتظرة). */
const CHECKED_STATUSES: AppointmentStatus[] = ['pending', 'confirmed'];

/** المواعيد القائمة اللي وقتها (من → إلى) خرج عن كل الفترات المعطاة. */
export function findConflicts(appointments: readonly Appointment[], shifts: readonly Shift[]): Appointment[] {
    return appointments.filter(a => {
        if (!CHECKED_STATUSES.includes(a.status)) return false;
        const start = toMinutes(a.time);
        const end = toMinutes(a.end);
        return !shifts.some(s => start >= toMinutes(s.from) && end <= toMinutes(s.to));
    });
}

/** الحرفين الأولين من أول كلمتين في الاسم، للأفاتار. */
export function initials(name: string): string {
    return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0] ?? '')
    .join('');
}

/**
 * تعارضات الجدول الأسبوعي الجديد: كل موعد قائم من تاريخ `fromDate` فصاعدًا
 * يخرج عن فترات يومه (بعد تطبيق الاستثناءات) — `shiftsFor` هي من تحدد فترات اليوم.
 */
export function findScheduleConflicts(
    appointments: readonly Appointment[],
    fromDate: string,
    shiftsFor: (date: string) => readonly Shift[],
): Appointment[] {
    const byDate = new Map<string, Appointment[]>();
    for (const a of appointments) {
        if (a.date < fromDate) continue;
        const list = byDate.get(a.date) ?? [];
        list.push(a);
        byDate.set(a.date, list);
    }
    const result: Appointment[] = [];
    for (const [date, list] of byDate) result.push(...findConflicts(list, shiftsFor(date)));
    return sortByDateTime(result);
}

const sortByDateTime = (list: Appointment[]) =>
[...list].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
