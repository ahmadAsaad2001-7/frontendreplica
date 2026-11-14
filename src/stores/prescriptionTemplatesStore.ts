// src/stores/prescriptionTemplatesStore.ts — استبدل الملف بالكامل (يصدّر مفاتيح منع التكرار + deepClone)
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { PlanItem } from './prescriptionStore';
import { deepClone } from '../utils/clone';

export interface TemplateDiagnosis { icd10: string; title: string; }
export interface TemplateDrug {
    id: string; title: string; scientificName?: string;
    dosage: string; frequency: string; instructions?: string;
    durationDays: number; times: string[];
}
export interface TemplateTask {
    id: string; kind: 'exercise' | 'measurement' | 'nutrition' | 'care';
    title: string; instructions?: string; frequency?: string;
    time?: string; durationDays: number;
}
export interface PrescriptionTemplate {
    id: string; name: string; description?: string; specialty?: string; tags: string[];
    diagnoses: TemplateDiagnosis[]; drugs: TemplateDrug[]; tasks: TemplateTask[];
    sourceContainerIds?: string[]; sourceTaskTemplateIds?: string[];
    version: number; usageCount: number; createdAt: string; updatedAt: string;
}
export type DraftPlanItemInput = Omit<PlanItem, 'id' | 'status' | 'prescription_id'>;
export interface InstantiatedTemplate { diagnoses: TemplateDiagnosis[]; items: DraftPlanItemInput[]; }
export type ApplyMode = 'append' | 'replace';
export interface ApplyResult { added: number; skipped: number; mode: ApplyMode; }

export const tplUid = (p: string) => `${p}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
export const drugDedupeKey = (d: { scientificName?: string; title?: string; dosage?: string }) =>
`${(d.scientificName || d.title || '').trim().toLowerCase()}|${(d.dosage ?? '').trim().toLowerCase()}`;
export const taskDedupeKey = (t: { kind?: string; title?: string }) =>
`${t.kind ?? ''}|${(t.title ?? '').trim().toLowerCase()}`;

export const usePrescriptionTemplatesStore = defineStore('prescriptionTemplates', () => {
    const templates = ref<PrescriptionTemplate[]>([
        {
            id: 'tpl_cold_flu', name: 'نزلة برد وحساسية موسمية', specialty: 'باطنة',
            tags: ['برد', 'تنفسي'], description: 'بروتوكول أولي لأعراض الجهاز التنفسي العلوي',
            diagnoses: [{ icd10: 'J01.90', title: 'التهاب الجيوب الأنفية الحاد' }],
            drugs: [
                { id: 'td1', title: 'بانادول 500 مجم', scientificName: 'Paracetamol', dosage: 'قرص واحد', frequency: 'كل 8 ساعات عند اللزوم', durationDays: 5, times: ['08:00', '16:00', '23:00'], instructions: 'بعد الأكل، لا تتجاوز 4 جرعات يومياً' },
                { id: 'td2', title: 'أوجمنتين 1 جم', scientificName: 'Amoxicillin + Clavulanic Acid', dosage: 'قرص واحد', frequency: 'كل 12 ساعة', durationDays: 7, times: ['09:00', '21:00'], instructions: 'مع الطعام، إكمال الكورس كاملاً' },
            ],
            tasks: [
                { id: 'tt1', kind: 'measurement', title: 'قياس الحرارة', instructions: 'صباحاً ومساءً مع التسجيل', frequency: 'مرتين يومياً', time: '08:00', durationDays: 3 },
                { id: 'tt2', kind: 'nutrition', title: 'شرب 2 لتر ماء يومياً', instructions: 'توزيع الكمية على مدار اليوم', frequency: 'يومياً', durationDays: 5 },
            ],
            version: 1, usageCount: 34, createdAt: '2026-01-10T10:00:00Z', updatedAt: '2026-02-01T09:00:00Z',
        },
        {
            id: 'tpl_htn_followup', name: 'متابعة ضغط الدم', specialty: 'قلب',
            tags: ['ضغط', 'مزمن'], description: 'متابعة دورية لضغط غير منضبط',
            diagnoses: [{ icd10: 'I10', title: 'ارتفاع ضغط الدم الأساسي' }],
            drugs: [
                { id: 'td3', title: 'كونكور 5 مجم', scientificName: 'Bisoprolol', dosage: 'قرص واحد', frequency: 'مرة واحدة صباحاً', durationDays: 30, times: ['08:00'], instructions: 'لا يوقف فجأة' },
            ],
            tasks: [
                { id: 'tt3', kind: 'measurement', title: 'قياس ضغط الدم', instructions: 'جلوساً بعد راحة 5 دقائق', frequency: 'مرتين يومياً', time: '08:00', durationDays: 14 },
            ],
            version: 2, usageCount: 61, createdAt: '2025-11-05T08:00:00Z', updatedAt: '2026-01-20T14:00:00Z',
        },
    ]);

    const search = ref('');
    const filteredTemplates = computed(() => {
        const q = search.value.trim().toLowerCase();
        return templates.value
        .filter(t => !q || t.name.toLowerCase().includes(q) || t.tags.some(x => x.toLowerCase().includes(q)) || t.diagnoses.some(d => d.title.toLowerCase().includes(q)))
        .sort((a, b) => b.usageCount - a.usageCount);
    });

    const getById = (id: string) => templates.value.find(t => t.id === id) ?? null;

    function addTemplate(input: Omit<PrescriptionTemplate, 'id' | 'version' | 'usageCount' | 'createdAt' | 'updatedAt'>) {
        const now = new Date().toISOString();
        const tpl: PrescriptionTemplate = { ...input, id: tplUid('tpl'), version: 1, usageCount: 0, createdAt: now, updatedAt: now };
        templates.value.unshift(tpl);
        return tpl;
    }
    function updateTemplate(id: string, patch: Partial<Omit<PrescriptionTemplate, 'id' | 'createdAt' | 'usageCount'>>) {
        const tpl = getById(id);
        if (!tpl) return null;
        Object.assign(tpl, patch, { version: tpl.version + 1, updatedAt: new Date().toISOString() });
        return tpl;
    }
    function deleteTemplate(id: string) { templates.value = templates.value.filter(t => t.id !== id); }
    function duplicateTemplate(id: string) {
        const src = getById(id);
        if (!src) return null;
        const now = new Date().toISOString();
        const copy: PrescriptionTemplate = { ...deepClone(src), id: tplUid('tpl'), name: `${src.name} (نسخة)`, version: 1, usageCount: 0, createdAt: now, updatedAt: now };
        templates.value.unshift(copy);
        return copy;
    }
    function recordUsage(id: string) { const t = getById(id); if (t) t.usageCount++; }

    function instantiateTemplate(id: string): InstantiatedTemplate | null {
        const tpl = getById(id);
        if (!tpl) return null;
        const items: DraftPlanItemInput[] = [
            ...tpl.drugs.map(d => ({
                kind: 'medication' as const, title: d.title, scientificName: d.scientificName,
                dosage: d.dosage, frequency: d.frequency, instructions: d.instructions,
                schedule: { times: [...d.times], recurrence: { kind: 'daily' as const }, duration_days: d.durationDays },
            })),
            ...tpl.tasks.map(t => ({
                kind: t.kind, title: t.title, instructions: t.instructions, frequency: t.frequency,
                schedule: { times: t.time ? [t.time] : [], recurrence: { kind: 'daily' as const }, duration_days: t.durationDays },
            })),
        ];
        return { diagnoses: tpl.diagnoses.map(d => ({ ...d })), items };
    }

    return { templates, search, filteredTemplates, getById, addTemplate, updateTemplate, deleteTemplate, duplicateTemplate, recordUsage, instantiateTemplate };
});
