import { useDoctorQueueStore } from '../../../stores/doctorQueueStore';
import { useAppointmentStore } from '../../../stores/appointmentStore';
import { useMedicalRecordStore } from '../../../stores/medicalRecordStore';
import {
    allergyNames,
    type PatientRecord,
    type PatientSource,
} from '../../../types/patient';

// ============================================
// 🗺️ جداول توحيد المعرفات (مؤقتة)
// ============================================
const PATIENT_ID_ALIASES: Record<string, string> = {
    'P-2048': 'pat_001',
    'P-2047': 'pat_002',
};

const DOCTOR_ID_ALIASES: Record<string, string> = {
    doc_1: 'doc_001',
    doc_2: 'doc_002',
};

export function normalizePatientId(id: string): string {
    return PATIENT_ID_ALIASES[id] ?? id;
}

export function normalizeDoctorId(id: string): string {
    return DOCTOR_ID_ALIASES[id] ?? id;
}

// ============================================
// 🧭 Patient Resolver
// ============================================
export function usePatientResolver() {
    const queueStore = useDoctorQueueStore();
    const appointmentStore = useAppointmentStore();
    const recordStore = useMedicalRecordStore();

    function resolvePatient(rawId: string): PatientRecord | null {
        const id = normalizePatientId(rawId);
        const sources: PatientSource[] = [];

        // ① الطابور الحي
        const queued = queueStore.queue.find(p => normalizePatientId(p.id) === id);
        if (queued) {
            sources.push('queue');
            if (recordStore.diagnoses.some(d => normalizePatientId(d.patient_id) === id)) {
                sources.push('records');
            }
            return {
                id,
                name: queued.name,
                age: queued.age,
                gender: queued.gender,
                avatar: queued.avatar,
                allergies: allergyNames(queued.allergies),
                chronicConditions: queued.chronicConditions,
                sources,
            };
        }

        // ② الحجوزات
        const apt = appointmentStore.appointments.find(
            a => normalizePatientId(a.patientProfileId) === id
        );
        if (apt) {
            sources.push('appointments');
            return {
                id,
                name: apt.patientName,
                allergies: [],
                chronicConditions: [],
                sources,
            };
        }

        return null;
    }

    return { resolvePatient };
}
