import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useDoctorPatients } from '../features/doctor/composables/useDoctorPatients';
import { useAppointmentStore } from './appointmentStore';
import type { PatientArchiveItem } from '../types/archive';

function initials(name: string): string {
    const parts = name.trim().split(/\s+/);
    return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).trim() || '؟';
}

/**
 * ✅ لم يعد مخزناً مستقلاً للبيانات:
 * archivedPatients = إسقاط محسوب فوق useDoctorPatients + appointmentStore.
 * لا تكرار، لا عشوائية، ولا مرضى ليسوا للطبيب الحالي.
 */
export const usePatientArchiveStore = defineStore('patientArchive', () => {
    const { doctorPatients } = useDoctorPatients();
    const appointmentStore = useAppointmentStore();

    const archivedPatients = computed<PatientArchiveItem[]>(() =>
    doctorPatients.value.map(p => {
        const apts = appointmentStore.getAppointmentsByPatient(p.id);
        const visits = apts.filter(a => a.status === 'Completed' || a.status === 'Confirmed');
        const lastVisit = apts.map(a => a.date).sort().pop() ?? '';

    return {
        id: p.id,
        name: p.name,
        mrn: p.mrn ?? `MRN-${p.id.replace('pat_', '').toUpperCase()}`,
                             gender: p.gender ?? 'male',
                             age: p.age,
                             bloodType: p.bloodType ?? '—',
                             avatarInitials: initials(p.name),
                             insurance: 'بدون تأمين', // لا مصدر تأمين بعد؛ يُضاف عند توفره
                             hasAllergy: p.allergies.length > 0,
                             hasChronic: p.chronicConditions.length > 0,
                             totalVisits: visits.length,
                             balance: appointmentStore.getPatientBalance(p.id),
                             lastVisitDate: lastVisit || '—',
    };
    })
    );

    return { archivedPatients };
});
