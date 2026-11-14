import { DoctorUser } from './auth';
// src/types/doctor.ts
export interface TaskData {
    title: string;
    kind: 'medication' | 'exercise' | 'measurement' | 'nutrition' | 'care';
    frequency: string;
    duration: number;
    time: string;
    instructions?: string;
}

// src/types/doctor.ts
export interface PlanItem {
    id: string;
    kind: 'medication' | 'exercise' | 'measurement' | 'nutrition' | 'care';
    title: string;
    schedule: Schedule;
    instructions?: string;
    scientificName?: string;
    dosage?: string;
    frequency?: string;

    // 🚀 الحقول الجديدة
    status: 'draft' | 'active' | 'completed' | 'revoked'; // حالة المهمة
    prescription_id?: string; // لو المهمة تابعة لروشتة مجهزة، بنحط الـ ID هنا
}

export interface PlanItem {
    id: string;
    kind: 'medication' | 'exercise' | 'measurement' | 'nutrition' | 'care';
    title: string;
    schedule: Schedule;
    instructions?: string;
    scientificName?: string;
    dosage?: string;
    frequency?: string;

    // 🚀 الحقول الجديدة لإدارة دورة حياة العنصر
    status: 'draft' | 'active' | 'completed' | 'revoked';
    prescription_id?: string;
}
export interface TaskTemplate {
    id: string;
    title: string;
    type: string;
    frequency: string;
    kind: 'exercise' | 'measurement' | 'nutrition' | 'care';
}
export interface PrescriptionMedication {
    id: string;
    name: string;
    scientific_name: string;
    dosage: string;
    frequency_times_per_day: number;
    schedule_times: string[];
    instructions: string;
    duration_days: number;
    with_food: 'before' | 'after' | 'with' | 'any';
}

export interface PrescriptionDirective {
    id: string;
    title: string;
    type: 'medication' | 'exercise' | 'measurement' | 'nutrition' | 'care';
    short_description: string;
    frequency: 'daily' | 'twice_daily' | 'three_times' | 'weekly';
}

export interface TaskAdherenceState {
    completed: boolean;
    completed_at?: string;
}

export interface Prescription {
    id: string;
    patient_id: string;
    doctor: DoctorUser;
    title: string;
    diagnosis: string;
    icd10_code?: string;
    issued_at: string;
    start_date: string;
    end_date: string;
    status: 'active' | 'completed' | 'revoked';
    notes: string;
    next_followup?: string;
    pharmacy_code?: string;
    medications: PrescriptionMedication[];
    directives: PrescriptionDirective[];
    adherence_logs: Record<string, Record<string, TaskAdherenceState>>;

    // 🚀 الحقول الجديدة المضافة من مسودة الروشتة
    clinical_notes?: string;
    requires_follow_up?: boolean;
    follow_up_date?: string;
    follow_up_time?: string;
    follow_up_clinic?: string;
}

// --- Doctor Workbench Specific Types ---
export type QueueStatus = 'Scheduled' | 'ArrivedWaiting' | 'InConsultation' | 'Emergency' | 'Completed';

export interface QueuePatient {
    id: string;
    code: string;
    name: string;
    age: number;
    gender: 'male' | 'female';
    status: QueueStatus;
    scheduledTime: string;
    allergies: string[];
    chronicConditions: string[];
}

export interface DraftDrug {
    id: string;
    name: string;
    scientificName?: string;
    dosage: string;
    frequency: string;
    hasAllergyConflict?: boolean;
}

export interface DraftTask {
    id: string;
    title: string;
    type: 'medication' | 'exercise' | 'measurement';
    recurrenceMode: 'daily' | 'sequence' | 'advanced';
}
