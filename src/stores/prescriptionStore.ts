import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Schedule } from '../core/contracts/common';

export interface PlanItem {
    id: string;
    kind: 'medication' | 'exercise' | 'measurement' | 'nutrition' | 'care';
    title: string;
    schedule: Schedule;
    instructions?: string;
    scientificName?: string;
    dosage?: string;
    frequency?: string;
    route?: 'oral' | 'topical' | 'iv' | 'im' | 'inhalation' | 'sublingual'; // ✅ حقل جديد

    status: 'draft' | 'active' | 'completed' | 'revoked';
    prescription_id?: string;
}

export interface Prescription {
    id: string;
    patient_id: string;
    doctor_id: string;
    title: string;
    starts_on: string; // IsoDate
    ends_on: string;   // IsoDate
    status: 'active' | 'completed' | 'revoked';
    plan_items: PlanItem[];
    verification_code?: string;
    qr_code?: string;
    general_instructions?: string;
    emergency_warning?: string;
    dispenseStatus?: 'ready' | 'dispensed';

    // ✅ الحقول الجديدة المضافة من مسودة الروشتة
    clinical_notes?: string;
    requires_follow_up?: boolean;
    follow_up_date?: string;
    follow_up_time?: string;
    follow_up_clinic?: string;
    day_exceptions?: any[]; // يمكن استبدال any بـ DayException interface لاحقاً
}

export const usePrescriptionStore = defineStore('prescription', () => {
    const prescriptions = ref<Prescription[]>([
        {
            id: 'RX-SPINE-2026-01',
            patient_id: 'pat_001',
            doctor_id: 'doc_001',
            title: 'خطة علاج انزلاق غضروفي قطني',
            starts_on: '2026-01-15T00:00:00Z',
            ends_on: '2026-02-05T00:00:00Z',
            status: 'active',

            verification_code: 'RX-026-01-E6',
            qr_code: 'https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=RX-026-01-E6',
            general_instructions: 'ينصح برفع الأشغال وحمل أوزان ثقيلة لمدة 5 أيام. الالتزام بتمارين الإطالة وجلسة الكمادات الساخنة قبل النوم جداً لتخفيف ضغط العصب.',
            emergency_warning: 'في حال ظهور أي أعراض تحسسية مفاجئة (طفح جلدي، تورم بالوجه أو الشفاه، ضيق تنفس)، يرجى التوقف الفوري عن تناول الدواء والتوجه إلى أقرب قسم طوارئ أو الاتصال بالإسعاف (123).',

                                              plan_items: [
                                                  {
                                                      id: 'med_1',
                                                      kind: 'medication',
                                                      title: 'سيلبركس (Celebrex 200mg)',
                                              schedule: { times: ['12:00'], recurrence: { kind: 'daily' }, duration_days: 14 },
                                              instructions: 'تؤخذ الكبسولة بعد وجبة الغداء مباشرة مع كوب ماء كبير لتقليل تهيج المعدة.',
                                              status: 'active'
                                                  },
                                                  {
                                                      id: 'med_2',
                                                      kind: 'medication',
                                                      title: 'ميدوكالم (Mydocalm 150mg)',
                                              schedule: { times: ['09:00', '21:00'], recurrence: { kind: 'daily' }, duration_days: 21 },
                                              instructions: 'قرص بعد الإفطار وقرص بعد العشاء بانتظام لتخفيف تشنجات أسفل الظهر.',
                                              status: 'active'
                                                  },
                                                  {
                                                      id: 'ex_1',
                                                      kind: 'exercise',
                                                      title: 'تمرين ماكنزي لإطالة العضلات',
                                                      schedule: {
                                                          times: [],
                                                          recurrence: { kind: 'daily' },
                                                          duration_days: 14
                                                      },
                                                      instructions: 'يتم أداء التمرين ببطء، 10 تكرارات في كل جلسة.',
                                                      status: 'active'
                                                  }
                                              ]
        }
    ]);

    // --- Getters ---
    function getPrescriptionsForPatient(patientId: string) {
        return prescriptions.value.filter(p => p.patient_id === patientId);
    }

    // ✅ دالة جديدة: جلب كل روشتات طبيب معين
    function getPrescriptionsByDoctor(doctorId: string) {
        return prescriptions.value.filter(rx => rx.doctor_id === doctorId);
    }

    // --- Actions ---
    function addPrescription(rx: Prescription) {
        prescriptions.value.push(rx);
    }

    // Immutability: We only update the status, we never mutate the plan_items directly here
    function revokePrescription(id: string) {
        const rx = prescriptions.value.find(p => p.id === id);
        if (rx) {
            rx.status = 'revoked';
        }
    }

    function dispensePrescription(id: string) {
        const rx = prescriptions.value.find(p => p.id === id);
        if (rx) {
            rx.dispenseStatus = 'dispensed';
        }
    }

    // --- Return ---
    return {
        prescriptions,
        getPrescriptionsForPatient,
        getPrescriptionsByDoctor, // ✅ تمت الإضافة هنا
        addPrescription,
        revokePrescription,
        dispensePrescription
    };
});
