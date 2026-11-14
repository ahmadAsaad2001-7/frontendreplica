import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { usePrescriptionStore, type PlanItem } from './prescriptionStore';
import { useDoctorQueueStore } from './doctorQueueStore';
import { useNotificationStore } from './notificationStore';
import { usePrescriptionTemplatesStore, drugDedupeKey, taskDedupeKey, type ApplyMode, type ApplyResult } from './prescriptionTemplatesStore';
import { useAuthStore } from './authStore'; // ✅ 1. تم تنظيف الاستيراد
import { deepClone } from '../utils/clone';

export interface DayException {
    dayNumber: number;
    type: string;
    note: string;
}

export const usePrescriptionDraftStore = defineStore('prescriptionDraft', () => {
    // 1. بيانات المسودة الأساسية
    const startDate = ref(new Date().toISOString().split('T')[0]);
    const endDate = ref('');
    const generalInstructions = ref('');

    // ✅ التشخيصات (مصفوفة لدعم تعدد التشخيصات)
    const diagnoses = ref<Array<{ icd10: string; title: string; date: string }>>([]);

    // ✅ للتوافق مع الكود القديم (يعرض أول تشخيص فقط)
    const diagnosis = computed(() => diagnoses.value[0]?.title || '');
    const icd10 = computed(() => diagnoses.value[0]?.icd10 || '');

    // ✅ الحقول الجديدة: الملاحظات السريرية والمتابعة
    const clinicalNotes = ref('');
    const requiresFollowUp = ref(false);
    const followUpDate = ref('');
    const followUpTime = ref('');
    const followUpClinic = ref('');

    // ✅ الاستثناءات اليومية
    const dayExceptions = ref<DayException[]>([]);

    const planItems = ref<PlanItem[]>([]);
    const allergyWarning = ref<string | null>(null);

    // ── حالة التطبيق والتراجع ──
    const applyUndoSnapshot = ref<{ diagnoses: Array<{ icd10: string; title: string; date: string }>; planItems: PlanItem[] } | null>(null);
    const appliedTemplates = ref<Array<{ templateId: string; version: number; mode: ApplyMode; appliedAt: string }>>([]);

    // دالة تطبيق القالب
    function applyTemplate(templateId: string, mode: ApplyMode = 'append'): ApplyResult {
        const tplStore = usePrescriptionTemplatesStore();
        const inst = tplStore.instantiateTemplate(templateId);
        if (!inst) return { added: 0, skipped: 0, mode };

        applyUndoSnapshot.value = deepClone({ diagnoses: diagnoses.value, planItems: planItems.value });
        if (mode === 'replace') {
            diagnoses.value = [];
            planItems.value = [];
        }

        let added = 0, skipped = 0;

        // إضافة التشخيصات
        for (const d of inst.diagnoses) {
            if (diagnoses.value.some(x => x.icd10 === d.icd10)) {
                skipped++;
                continue;
            }
            addDiagnosis(d.icd10, d.title);
            added++;
        }

        // إضافة الأدوية والمهام
        const drugKeys = new Set(planItems.value.filter(i => i.kind === 'medication').map(drugDedupeKey));
        const taskKeys = new Set(planItems.value.filter(i => i.kind !== 'medication').map(taskDedupeKey));

        for (const item of inst.items) {
            const isMed = item.kind === 'medication';
            const key = isMed ? drugDedupeKey(item) : taskDedupeKey(item);
            const bucket = isMed ? drugKeys : taskKeys;

            if (bucket.has(key)) {
                skipped++;
                continue;
            }
            bucket.add(key);
            addPlanItem(item); // يمر بنفس فحص الحساسية الحالي
            added++;
        }

        const tpl = tplStore.getById(templateId);
        appliedTemplates.value.push({ templateId, version: tpl?.version ?? 1, mode, appliedAt: new Date().toISOString() });
        tplStore.recordUsage(templateId);
        return { added, skipped, mode };
    }

    // دالة التراجع عن تطبيق القالب
    function undoLastApply(): boolean {
        if (!applyUndoSnapshot.value) return false;
        diagnoses.value = applyUndoSnapshot.value.diagnoses;
        planItems.value = applyUndoSnapshot.value.planItems;
        applyUndoSnapshot.value = null;
        return true;
    }

    // 2. دالة تصفير المسودة
    function resetDraft() {
        startDate.value = new Date().toISOString().split('T')[0];
        endDate.value = '';
        generalInstructions.value = '';
        diagnoses.value = [];
        clinicalNotes.value = '';
        requiresFollowUp.value = false;
        followUpDate.value = '';
        followUpTime.value = '';
        followUpClinic.value = '';
        dayExceptions.value = [];
        planItems.value = [];
        allergyWarning.value = null;
    }

    // ✅ 2. دالة إضافة التشخيص (تم تنظيفها)
    function addDiagnosis(icd10Code: string, title: string) {
        const exists = diagnoses.value.some(d => d.icd10 === icd10Code);
        if (!exists) {
            diagnoses.value.push({
                icd10: icd10Code,
                title: title,
                date: new Date().toISOString().split('T')[0]
            });
        }
    }

    function removeDiagnosis(icd10Code: string) {
        diagnoses.value = diagnoses.value.filter(d => d.icd10 !== icd10Code);
    }

    function setDiagnosis(icd10Code: string, diagnosisTitle: string) {
        diagnoses.value = [{ icd10: icd10Code, title: diagnosisTitle, date: new Date().toISOString().split('T')[0] }];
    }

    // 3. دالة إضافة عنصر (دواء أو مهمة)
    function addPlanItem(item: Omit<PlanItem, 'id' | 'status' | 'prescription_id'>) {
        const queueStore = useDoctorQueueStore();
        const patientAllergies = queueStore.activePatient?.allergies || [];

        const conflict = patientAllergies.find(allergy =>
        item.title.toLowerCase().includes(allergy.toLowerCase()) ||
        (item.kind === 'medication' && allergy.includes(item.title))
        );

        if (conflict) {
            allergyWarning.value = `تحذير: المريض لديه حساسية من (${item.title})!`;
        } else {
            allergyWarning.value = null;
        }

        planItems.value.push({
            ...item,
            id: `item_${Date.now()}`,
                             status: 'draft'
        });
    }

    function removePlanItem(id: string) {
        planItems.value = planItems.value.filter(i => i.id !== id);
    }

    // 4. دوال إدارة الاستثناءات اليومية
    function addException(exception: DayException) {
        const index = dayExceptions.value.findIndex(e => e.dayNumber === exception.dayNumber);
        if (index !== -1) {
            dayExceptions.value[index] = exception;
        } else {
            dayExceptions.value.push(exception);
        }
    }

    function removeException(dayNumber: number) {
        dayExceptions.value = dayExceptions.value.filter(e => e.dayNumber !== dayNumber);
    }

    // 5. دالة إصدار الروشتة النهائية
    function issuePrescription() {
        const queueStore = useDoctorQueueStore();
        const rxStore = usePrescriptionStore();
        const notifStore = useNotificationStore();
        const authStore = useAuthStore(); // ✅ جلب بيانات الطبيب

        if (!queueStore.activePatient) return;

        if (diagnoses.value.length === 0 || planItems.value.length === 0) {
            alert('يجب إدخال التشخيص وإضافة دواء أو مهمة واحدة على الأقل.');
            return;
        }

        const rxId = `RX-${Date.now().toString().slice(-6)}`;
        const finalizedPlanItems = planItems.value.map(item => ({
            ...item,
            status: 'active' as const,
            prescription_id: rxId
        }));

        const mainDiagnosis = diagnoses.value[0].title;

        const newRx: any = {
            id: rxId,
            patient_id: queueStore.activePatient.id,
            // ✅ 3. استخدام doctor_id من الـ AuthStore
            doctor_id: authStore.currentUser?.id ?? 'doc_001',
            title: `علاج: ${mainDiagnosis}`,
            starts_on: startDate.value || new Date().toISOString().split('T')[0],
                                                     ends_on: endDate.value || new Date().toISOString().split('T')[0],
                                                     status: 'active',
                                                     verification_code: `RX-${Date.now().toString().slice(-4)}-EG`,
                                                     qr_code: 'https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=Verified',
                                                     general_instructions: generalInstructions.value,
                                                     clinical_notes: clinicalNotes.value,
                                                     requires_follow_up: requiresFollowUp.value,
                                                     follow_up_date: followUpDate.value,
                                                     follow_up_time: followUpTime.value,
                                                     follow_up_clinic: followUpClinic.value,
                                                     day_exceptions: dayExceptions.value,
                                                     diagnoses: diagnoses.value,
                                                     emergency_warning: 'يرجى التوجه لأقرب طوارئ عند الشعور بأي أعراض تحسسية مفاجئة.',
                                                     plan_items: finalizedPlanItems
        };

        rxStore.addPrescription(newRx);

        notifStore.addNotification({
            id: `notif_${Date.now()}`,
                                   title: 'روشتة طبية جديدة',
                                   // ✅ 4. استخدام اسم الطبيب من الـ AuthStore
                                   message: `تم إصدار روشتة جديدة للمريض ${queueStore.activePatient.name} بواسطة ${authStore.currentUser?.name ?? 'الطبيب'}.`,
                                   type: 'prescription',
                                   time: 'الآن',
                                   isRead: false
        });

        queueStore.endConsultation();
        resetDraft();
    }

    return {
        diagnoses,
        diagnosis,
        icd10,
        startDate,
        endDate,
        generalInstructions,
        clinicalNotes,
        requiresFollowUp,
        followUpDate,
        followUpTime,
        followUpClinic,
        dayExceptions,
        planItems,
        allergyWarning,
        addDiagnosis,
        removeDiagnosis,
        setDiagnosis,
        addPlanItem,
        removePlanItem,
        issuePrescription,
        resetDraft,
        addException,
        removeException,
        appliedTemplates,
        applyTemplate,
        undoLastApply
    };
});
