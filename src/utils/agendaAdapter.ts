// src/utils/agendaAdapter.ts
// تحويل حجز جانب المريض (appointmentStore الأصلي) إلى نموذج الأجندة. منطق نقي بدون Pinia.

import type { Appointment, AppointmentStatus, PatientSnapshot } from '../types/appointment';
import { parseTime12h, addMinutes } from './time';

/** نفس قيم status في appointmentStore بعد توسيعها. */
export type SourceStatus =
| 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'NoShow' | 'NeedsReschedule';

/** الحقول المستخدمة فقط من الحجز الأصلي. */
export interface SourceAppointmentLike {
    id: string;
    doctorId: string;
    patientProfileId: string;
    patientName: string;
    patientRelation: string;
    date: string;
    time: string;       // '05:30 م'
    reason: string;
    status: SourceStatus;
    durationMin?: number;
}

/** الحقول المستخدمة فقط من profileStore. ممكن تكون الحساسية نصوص أو كائنات (الأنواع غير موحدة عندك). */
export interface ProfileLike {
    id: string;
    age?: number;
    gender?: 'male' | 'female';
    bloodType?: string;
    allergies?: Array<string | { substance: string }>;
    chronicConditions?: Array<string | { name: string }>;
}

const FROM_SOURCE: Record<SourceStatus, AppointmentStatus> = {
    Pending: 'pending',
    Confirmed: 'confirmed',
    Completed: 'completed',
    Cancelled: 'cancelled',
    NoShow: 'no_show',
    NeedsReschedule: 'needs_reschedule',
};

const TO_SOURCE: Record<AppointmentStatus, SourceStatus> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    no_show: 'NoShow',
    needs_reschedule: 'NeedsReschedule',
};

export const toAgendaStatus = (s: SourceStatus): AppointmentStatus => FROM_SOURCE[s] ?? 'pending';
export const toSourceStatus = (s: AppointmentStatus): SourceStatus => TO_SOURCE[s];

const names = <T extends string | { [k: string]: unknown }>(
    list: T[] | undefined,
    key: string,
): string[] =>
(list ?? [])
.map(item => (typeof item === 'string' ? item : String(item[key] ?? '')))
.filter(Boolean);

/** يرجّع null لو وقت الحجز غير مفهوم (يتجاهله الأب بدل ما يكسر الترتيب). */
export function toAgendaAppointment(
    src: SourceAppointmentLike,
    profile: ProfileLike | undefined,
    defaultDurationMin: number,
): Appointment | null {
    const time = parseTime12h(src.time);
    if (!time) return null;

    const patient: PatientSnapshot = {
        id: src.patientProfileId,
        name: src.patientName,
        relation: src.patientRelation,
        gender: profile?.gender,
        age: profile?.age,
        bloodType: profile?.bloodType,
        allergies: names(profile?.allergies, 'substance'),
        chronicConditions: names(profile?.chronicConditions, 'name'),
    };

    return {
        id: src.id,
        date: src.date,
        time,
        end: addMinutes(time, src.durationMin ?? defaultDurationMin),
        status: toAgendaStatus(src.status),
        reason: src.reason,
        patient,
    };
}
