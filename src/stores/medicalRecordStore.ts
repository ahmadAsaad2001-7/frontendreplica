import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface DiagnosisRecord {
    id: string;
    patient_id: string;
    doctor_id: string; // ✅ جديد - موحد مع authStore
    doctor_name: string;
    specialty: string;
    title: string;
    icd10: string;
    date: string;
    notes: string;
    status: 'active' | 'managed' | 'updated';
    severity?: 'mild' | 'moderate' | 'severe';
    attachments: { name: string; type: string; url?: string }[];
    linked_prescription_id?: string;
}

export interface DiagnosticRequest {
    id: string;
    patient_id: string;
    patient_mrn?: string;
    doctor_name: string;
    type: 'lab' | 'radiology';
    test_name: string;
    notes: string;
    date: string;
    qr_code: string;
}

export interface VitalRecord {
    id: string;
    patient_id: string;
    type: 'bp' | 'hr' | 'weight' | 'glucose';
    value: string;
    unit: string;
    date: string;
    status: 'normal' | 'warning' | 'critical';
    recorded_by: string;
}

export const useMedicalRecordStore = defineStore('medicalRecord', () => {
    const diagnoses = ref<DiagnosisRecord[]>([
        {
            id: 'diag_1',
            patient_id: 'pat_102',
            doctor_id: 'doc_001', // ✅ جديد - د. طارق الحكيم
            doctor_name: 'أ.د. طارق الحكيم',
            specialty: 'استشاري أول جراحة العظام والعمود الفقري',
            title: 'انزلاق غضروفي قطني L4-L5 مع اعتلال العصب الوركي الحاد (Sciatica)',
                                             icd10: 'M54.32 / M51.26',
                                             date: '2026-10-10',
                                             status: 'updated',
                                             notes: 'يعاني المريض من ألم ممتد من أسفل الظهر إلى باطن الفخذ والساق اليمنى مع خدر متقطع في أصابع القدم. اختبار رفع الساق المستقيمة (SLR Test) إيجابي عند 40 درجة. يوصى بالبروتوكول التحفظي المكثف مع العلاج الطبيعي وتجنب التدخل الجراحي حالياً.',
                                             attachments: [
                                                 { name: 'رنين مغناطيسي MRI Lumbar', type: 'MRI', url: '#' },
                                                 { name: 'تخطيط عضلات وأعصاب EMG / NCV', type: 'EMG', url: '#' }
                                             ],
                                             linked_prescription_id: 'RX-7721-01'
        },
        {
            id: 'diag_2',
            patient_id: 'pat_101',
            doctor_id: 'doc_001', // ✅ جديد - د. طارق الحكيم (افتراضي)
    doctor_name: 'د. منى عبد الرحمن',
    specialty: 'أستشاري أمراض القلب والأوعية الدموية',
    title: 'ارتفاع ضغط الدم الشرياني الأولي من الدرجة الأولى (Primary Essential Hypertension)',
                                             icd10: 'I10',
                                             date: '2026-09-25',
                                             status: 'managed',
                                             notes: 'قراءات متكررة أعلى من 140/90 مل زئبق على مدار 3 أسابيع متتالية. تم فحص قاع العين ورسم القلب الكهربائي وتأكيد عدم وجود اعتلال في وظائف الكلى. البدء في خطة علاجية وقائية مع حمية داش.',
                                             attachments: [],
        },
        {
            id: 'diag_3',
            patient_id: 'pat_103',
            doctor_id: 'doc_002', // ✅ جديد - د. خالد النجار
            doctor_name: 'د. خالد النجار',
            specialty: 'طب الأطفال',
            title: 'التهاب شعبي حاد',
            icd10: 'J20.9',
            date: '2026-10-26',
            status: 'active',
            notes: 'أعراض نزلة برد حادة مع كحة. تم وصف مضاد حيوي وخافض للحرارة.',
            attachments: []
        }
    ]);

    const vitals = ref<VitalRecord[]>([
        {
            id: 'v_1', patient_id: 'pat_101', type: 'bp',
            value: '125/82', unit: 'mmHg', date: '2026-10-26',
            status: 'warning', recorded_by: 'المريض'
        },
        {
            id: 'v_2', patient_id: 'pat_102', type: 'glucose',
            value: '95', unit: 'mg/dL', date: '2026-10-25',
            status: 'normal', recorded_by: 'المساعد الطبي'
        },
        {
            id: 'v_3', patient_id: 'pat_101', type: 'weight',
            value: '84', unit: 'kg', date: '2026-10-20',
            status: 'normal', recorded_by: 'المريض'
        },
        {
            id: 'v_4', patient_id: 'pat_101', type: 'hr',
            value: '102', unit: 'bpm', date: '2026-10-26',
            status: 'critical', recorded_by: 'جهاز ذكي'
        }
    ]);

    const diagnosticRequests = ref<DiagnosticRequest[]>([]);

    function addVital(vitalData: Omit<VitalRecord, 'id' | 'status' | 'recorded_by'>) {
        let status: 'normal' | 'warning' | 'critical' = 'normal';
        const val = parseFloat(vitalData.value.toString());

        if (vitalData.type === 'bp') {
            const [sys, dia] = vitalData.value.split('/').map(Number);
            if (sys >= 140 || dia >= 90) status = 'warning';
            if (sys >= 180 || dia >= 120) status = 'critical';
        } else if (vitalData.type === 'hr') {
            if (val > 100 || val < 60) status = 'warning';
            if (val > 130 || val < 50) status = 'critical';
        } else if (vitalData.type === 'glucose') {
            if (val > 140) status = 'warning';
            if (val > 250) status = 'critical';
        }

        const newVital: VitalRecord = {
            ...vitalData,
            id: `v_${Date.now()}`,
                                                 status,
                                                 recorded_by: 'المريض (تسجيل ذاتي)'
        };

        vitals.value.unshift(newVital);
    }

    function addDiagnosis(newDiag: DiagnosisRecord) {
        diagnoses.value.unshift(newDiag);
    }

    function addDiagnosticRequest(req: DiagnosticRequest) {
        diagnosticRequests.value.unshift(req);
    }

    // ✅ Helper للحصول على تشخيصات طبيب معين
    function getDiagnosesByDoctor(doctorId: string): DiagnosisRecord[] {
        return diagnoses.value.filter(d => d.doctor_id === doctorId);
    }

    // ✅ Helper للحصول على تشخيصات مريض معين
    function getDiagnosesByPatient(patientId: string): DiagnosisRecord[] {
        return diagnoses.value.filter(d => d.patient_id === patientId);
    }

    return {
        diagnoses,
        vitals,
        diagnosticRequests,
        addVital,
        addDiagnosis,
        addDiagnosticRequest,
        getDiagnosesByDoctor,
        getDiagnosesByPatient
    };
});
