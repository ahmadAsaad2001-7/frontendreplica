import { computed } from 'vue';
import { useAuthStore } from '../../../stores/authStore';
import { useAppointmentStore } from '../../../stores/appointmentStore';
import { useDoctorQueueStore } from '../../../stores/doctorQueueStore';
import { useMedicalRecordStore } from '../../../stores/medicalRecordStore';
import {
    normalizeDoctorId,
    normalizePatientId,
    usePatientResolver,
} from './usePatientResolver';
import type { PatientRecord } from '../../../types/patient';

/**
 * مجموعة "مرضى الدكتور الحالي" = اتحاد:
 * (حجوزات عنده) ∪ (طابوره الحي) ∪ (تشخيصات سجّلها)
 */
export function useDoctorPatients() {
    const authStore = useAuthStore();
    const appointmentStore = useAppointmentStore();
    const queueStore = useDoctorQueueStore();
    const recordStore = useMedicalRecordStore();
    const { resolvePatient } = usePatientResolver();

    const doctorId = computed(() =>
    normalizeDoctorId(authStore.currentUser?.id ?? 'doc_001')
    );

    const doctorPatientIds = computed<string[]>(() => {
        const ids = new Set<string>();
        const did = doctorId.value;

        // ① حجوزات مع الدكتور الحالي
        appointmentStore.appointments
        .filter(a => normalizeDoctorId(a.doctorId) === did)
        .forEach(a => ids.add(normalizePatientId(a.patientProfileId)));

        // ② الطابور الحي
        queueStore.queue.forEach(p => ids.add(normalizePatientId(p.id)));

        // ③ تشخيصات سجّلها (✅ تم التصحيح: استخدام doctor_id)
        recordStore.diagnoses
        .filter(d => normalizeDoctorId(d.doctor_id) === did)
        .forEach(d => ids.add(normalizePatientId(d.patient_id)));

        return Array.from(ids);
    });

    const doctorPatients = computed<PatientRecord[]>(() =>
    doctorPatientIds.value
    .map(id => resolvePatient(id))
    .filter((p): p is PatientRecord => p !== null)
    );

    return { doctorId, doctorPatientIds, doctorPatients };
}
