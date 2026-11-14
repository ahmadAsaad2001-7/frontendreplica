// src/types/appointment.ts
// نموذج الأجندة (جانب الطبيب). مشتق من appointmentStore الأصلي (جانب المريض) عبر utils/agendaAdapter.

export type AppointmentStatus =
| 'pending'            // بانتظار التأكيد
| 'confirmed'          // مؤكد
| 'completed'          // تم الكشف
| 'cancelled'          // ملغي
| 'no_show'            // لم يحضر
| 'needs_reschedule';  // يحتاج إعادة جدولة (الإتاحة اتغيّرت بعد الحجز)

/** بيانات المريض المتاحة وقت العرض. معظمها اختياري لأن الحجز نفسه ما فيهوش غير الاسم والعلاقة. */
export interface PatientSnapshot {
    id: string;
    name: string;
    /** العلاقة بصاحب الحساب: أنا / الابن / الزوجة ... */
    relation?: string;
    gender?: 'male' | 'female';
    age?: number;
    phone?: string;
    bloodType?: string;
    allergies: string[];
    chronicConditions: string[];
}

export interface Appointment {
    id: string;
    date: string;   // 'YYYY-MM-DD'
    time: string;   // 'HH:mm' (24 ساعة)
    end: string;    // 'HH:mm'
    status: AppointmentStatus;
    /** سبب الزيارة (من الحجز) */
    reason: string;
    patient: PatientSnapshot;
}
