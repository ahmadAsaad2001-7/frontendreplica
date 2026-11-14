//DoctorQueueStore
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type QueueStatus = 'Emergency' | 'InConsultation' | 'ArrivedWaiting' | 'Scheduled' | 'Completed';

export interface QueuePatient {
    id: string;
    name: string;
    age: number;
    gender: 'male' | 'female';
    avatar: string;
    status: QueueStatus;
    reason: string;
    scheduledTime: string;
    allergies: string[];
    chronicConditions: string[];
}

export const useDoctorQueueStore = defineStore('doctorQueue', () => {
    const queue = ref<QueuePatient[]>([
        {
            id: 'pat_101', name: 'يوسف إبراهيم', age: 62, gender: 'male',
            avatar: 'https://i.pravatar.cc/150?img=12',
            status: 'Emergency', reason: 'ألم شديد في الصدر وضيق تنفس',
            scheduledTime: '09:00', allergies: ['بنسلين'], chronicConditions: ['ضغط مرتفع']
        },
        {
            id: 'pat_102', name: 'أحمد عبد الله', age: 45, gender: 'male',
            avatar: 'https://i.pravatar.cc/150?img=11',
            status: 'InConsultation', reason: 'متابعة انزلاق غضروفي',
            scheduledTime: '09:30', allergies: [], chronicConditions: ['سكري نوع 2']
        },
        {
            id: 'pat_103', name: 'منى حسن', age: 28, gender: 'female',
            avatar: 'https://i.pravatar.cc/150?img=9',
            status: 'ArrivedWaiting', reason: 'التهاب في الحلق وحرارة',
            scheduledTime: '10:00', allergies: ['سلفا'], chronicConditions: []
        },
        {
            id: 'pat_104', name: 'خالد مصطفى', age: 50, gender: 'male',
            avatar: 'https://i.pravatar.cc/150?img=13',
            status: 'ArrivedWaiting', reason: 'ألم في الركبة اليمنى',
            scheduledTime: '10:30', allergies: [], chronicConditions: []
        }
    ]);

    // ✅ تم إصلاح التكرار: تعريف واحد فقط، وتهيئته بمريض قيد الكشف لتجربة أفضل
    const activePatientId = ref<string | null>('pat_102');
    const selectedPatientId = ref<string | null>('pat_102');

    // Getters
    const activePatient = computed(() =>
    queue.value.find(p => p.id === activePatientId.value) || null
    );

    const selectedPatient = computed(() =>
    queue.value.find(p => p.id === selectedPatientId.value) || activePatient.value // لو مفيش مختار، نعرض اللي جوه
    );

    const emergencyPatients = computed(() => queue.value.filter(p => p.status === 'Emergency'));
    const waitingPatients = computed(() => queue.value.filter(p => p.status === 'ArrivedWaiting'));
    const completedPatients = computed(() => queue.value.filter(p => p.status === 'Completed'));

    // Actions
    function selectPatient(patientId: string) {
        selectedPatientId.value = patientId;
    }

    function startConsultation(patientId: string) {
        const current = queue.value.find(p => p.id === activePatientId.value);
        if (current && current.status === 'InConsultation') {
            current.status = 'ArrivedWaiting';
        }

        const patient = queue.value.find(p => p.id === patientId);
        if (patient) {
            patient.status = 'InConsultation';
            activePatientId.value = patientId;
            selectedPatientId.value = patientId; // نختاره برضه عشان الشاشة تتحدث
        }
    }

    function callNextPatient() {
        const current = queue.value.find(p => p.id === activePatientId.value);
        if (current) current.status = 'Completed';

        const emergency = queue.value.find(p => p.status === 'Emergency');
        if (emergency) return startConsultation(emergency.id);

        const nextWaiting = queue.value.find(p => p.status === 'ArrivedWaiting');
        if (nextWaiting) return startConsultation(nextWaiting.id);

        activePatientId.value = null;
        selectedPatientId.value = null;
    }

    function endConsultation() {
        if (activePatientId.value) {
            const patient = queue.value.find(p => p.id === activePatientId.value);
            if (patient) patient.status = 'Completed';
            activePatientId.value = null;
            selectedPatientId.value = null; // تصفير الاختيار عند الانتهاء
        }
    }

    return {
        queue,
        activePatientId,
        selectedPatientId,
        activePatient,
        selectedPatient,
        emergencyPatients,
        waitingPatients,
        completedPatients,
        selectPatient,
        startConsultation,
        endConsultation,
        callNextPatient
    };
});
