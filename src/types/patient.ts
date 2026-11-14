// ============================================
// 🏥 Unified Medical Patient Record (Phase 1)
// الكيان الطبي الموحّد اللي كل الـ stores هتحترمُه
// ============================================

export type PatientSource = 'queue' | 'archive' | 'appointments' | 'records' | 'profile';

export interface PatientVitals {
    bp?: string;      // "120/80"
    hr?: string;      // نبض
    weight?: string;  // كجم
    height?: string;  // سم
    sugar?: string;   // mg/dL
    recordedAt?: string;
}

export interface PatientRecord {
    id: string;                   // المعرف الموحّد (pat_xxx)
    name: string;
    age?: number;                 // اختياري: مش كل المصادر بتعرفه
    gender?: Gender;
    avatar?: string;
    phone?: string;
    city?: string;
    bloodType?: string;
    mrn?: string;
    allergies: string[];          // أسماء للعرض (عبر allergyNames)
    chronicConditions: string[];
    vitals?: PatientVitals;
    sources: PatientSource[];     // للـ debugging: البيانات جت من فين
}

// ✅ Bridge بين string[] و Allergy[] بدون كسر الـ UI الحالي
export function allergyNames(allergies: Array<string | Allergy>): string[] {
    return allergies.map(a => (typeof a === 'string' ? a : a.substance));
}

export function chronicNames(conditions: Array<string | ChronicCondition>): string[] {
    return conditions.map(c => (typeof c === 'string' ? c : c.name));
}
