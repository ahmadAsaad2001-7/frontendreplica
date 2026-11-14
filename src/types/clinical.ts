import { DoctorUser, Gender } from './auth';

export interface DiagnosisAttachment {
    id: string;
    title: string;
    type: 'xray' | 'mri' | 'lab' | 'report' | 'ecg';
    url: string;
    date: string;
    laboratory_or_center: string;
    summary: string;
}

export interface DiagnosisRecord {
    id: string;
    patient_id: string;
    doctor: DoctorUser; // Or just doctor_id, but embedding basic info is fine for UI
    title: string;
    icd10_code: string;
    diagnosed_at: string;
    clinical_details: string;
    severity: 'mild' | 'moderate' | 'severe';
    status: 'active' | 'managed' | 'resolved';
    attachments: DiagnosisAttachment[];
}

export type VitalType = 'bp' | 'hr' | 'spo2' | 'temp' | 'glucose' | 'weight';
export type VitalProvenance = 'patient' | 'assistant' | 'doctor' | 'device';

export interface VitalRecord {
    id: string;
    patient_id: string;
    type: VitalType;
    value: number;
    secondary_value?: number;
    display_value: string;
    unit: string;
    measured_at: string;
    provenance: VitalProvenance;
    measured_by: string;
    is_abnormal: boolean;
    alert_level?: 'normal' | 'needs_review' | 'critical';
}
