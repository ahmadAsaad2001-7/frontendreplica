import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useDoctorQueueStore } from './doctorQueueStore';
import { buildDemoAppointments } from '../features/doctor/data/demoAppointments';

export interface Appointment {
    id: string;
    doctorId: string;
    doctorName: string;
    doctorAvatar: string;
    specialty: string;
    patientProfileId: string;
    patientName: string;
    patientRelation: string;
    date: string;
    time: string;
    reason: string;
    amount: number;
    paymentMethod: 'InstaPay' | 'Card' | 'E-Wallet';
    paymentStatus: 'Paid' | 'Pending' | 'Cancelled';
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'NoShow' | 'NeedsReschedule';
    durationMin?: number;
}

export const useAppointmentStore = defineStore('appointment', () => {
    const appointments = ref<Appointment[]>([
        {
            id: 'APT-2026-101',
            doctorId: 'doc_001', // ✅ تم التوحيد مع authStore (كان doc_1)
    doctorName: 'د. طارق الحكيم', // ✅ موحد
    doctorAvatar: 'https://i.pravatar.cc/150?img=60',
    specialty: 'جراحة العظام والعمود الفقري',
    patientProfileId: 'pat_001',
    patientName: 'أحمد أسعد',
    patientRelation: 'أنا',
    date: '2026-10-26',
    time: '17:30', // ✅ 24-hour format للتوافق
    reason: 'إعادة تقييم استجابة التزام الفقرات الغضروفي للعلاج الطبيعي وتمارين الاستطالة',
    amount: 450,
    paymentMethod: 'InstaPay',
    paymentStatus: 'Paid',
    status: 'Confirmed',
    durationMin: 20
        },
        {
            id: 'APT-2026-102',
            doctorId: 'doc_002', // ✅ تم التوحيد (كان doc_2)
    doctorName: 'د. خالد النجار',
    doctorAvatar: 'https://i.pravatar.cc/150?img=33',
    specialty: 'استشاري طب وجراحة الأطفال',
    patientProfileId: 'pat_002',
    patientName: 'ياسين أحمد',
    patientRelation: 'الابن',
    date: '2026-10-26',
    time: '19:00', // ✅ 24-hour format
    reason: 'فحص نوبة حساسية صدرية طارئة مع سعال ليلي متكرر',
    amount: 380,
    paymentMethod: 'E-Wallet',
    paymentStatus: 'Cancelled',
    status: 'Cancelled',
    durationMin: 20
        }
    ]);

    if (import.meta.env.DEV) {
        appointments.value.push(...buildDemoAppointments('2026-11-25'));
    }

    // ✅ Helper لحساب end time من time + duration
    function calculateEndTime(time: string, durationMin: number): string {
        const [h, m] = time.split(':').map(Number);
        const totalMins = h * 60 + m + durationMin;
        const endH = Math.floor(totalMins / 60) % 24;
        const endM = totalMins % 60;
        return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
    }

    // ✅ Helper للحصول على مواعيد طبيب معين
    function getAppointmentsByDoctor(doctorId: string): Appointment[] {
        return appointments.value.filter(a => a.doctorId === doctorId);
    }

    // ✅ Helper للحصول على مواعيد مريض معين
    function getAppointmentsByPatient(patientId: string): Appointment[] {
        return appointments.value.filter(a => a.patientProfileId === patientId);
    }

    // ✅ Helper لحساب الرصيد المستحق لمريض معين
    function getPatientBalance(patientId: string): number {
        return appointments.value
        .filter(a => a.patientProfileId === patientId && a.paymentStatus === 'Pending')
        .reduce((sum, a) => sum + a.amount, 0);
    }

    function bookAppointment(appt: Omit<Appointment, 'id' | 'status' | 'paymentStatus' | 'patientRelation'>) {
        const newAppt: Appointment = {
            ...appt,
            id: `apt_${Date.now()}`,
                                               status: 'Confirmed',
                                               paymentStatus: 'Paid',
                                               patientRelation: 'أنا',
        };

        appointments.value.push(newAppt);

        const queueStore = useDoctorQueueStore();
        queueStore.queue.push({
            id: appt.patientProfileId,
            name: appt.patientName,
            age: 30,
            gender: 'male',
            avatar: 'https://i.pravatar.cc/150?img=11',
            status: 'Scheduled',
            reason: appt.reason,
            scheduledTime: appt.time,
            allergies: [],
            chronicConditions: []
        });

        return newAppt;
    }

    return {
        doctors: ref([]),
                                               appointments,
                                               bookAppointment,
                                               calculateEndTime,
                                               getAppointmentsByDoctor,
                                               getAppointmentsByPatient,
                                               getPatientBalance
    };
});
