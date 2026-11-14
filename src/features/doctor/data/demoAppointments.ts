// src/features/doctor/data/demoAppointments.ts
// بيانات تجريبية لاختبار الأجندة (حجوزات كتير في يوم واحد لاختبار الـ pagination). للتطوير فقط.
import type { Appointment } from '../../../stores/appointmentStore';

const NAMES: Array<[string, string]> = [
    ['أحمد أسعد', 'أنا'], ['سارة محمود', 'الزوجة'], ['يوسف علي', 'الابن'],
['منى حسن', 'الأم'], ['خالد إبراهيم', 'أنا'], ['ليلى سمير', 'الابنة'],
['عمر فتحي', 'أنا'], ['هدى كامل', 'الأخت'],
];
const TIMES = ['09:00 ص', '09:20 ص', '09:40 ص', '10:00 ص', '10:20 ص', '04:00 م', '04:20 م', '04:40 م'];

/** حجوزات للطبيب doc_001 (د. طارق في authStore) في تاريخ معيّن (YYYY-MM-DD). */
export function buildDemoAppointments(date: string, doctorId = 'doc_001'): Appointment[] {
    return NAMES.map(([name, relation], i) => ({
        id: `demo_apt_${date}_${i}`,
        doctorId,
        doctorName: 'د. تجريبي',
        doctorAvatar: '',
        specialty: 'عام',
        patientProfileId: `demo_${i}`,
        patientName: name,
        patientRelation: relation,
        date,
        time: TIMES[i],
        reason: i % 2 ? 'متابعة' : 'كشف',
        amount: 300,
        paymentMethod: 'Card',
        paymentStatus: 'Paid',
        status: i % 3 === 0 ? 'Pending' : 'Confirmed',
    }));
}
