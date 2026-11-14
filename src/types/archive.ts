// src/types/archive.ts
export interface PatientVisitHistory {
    date: string;
    doctorName: string;
    diagnosis: string;
    prescriptionId: string;
}

export interface PatientArchiveItem {
    id: string;
    name: string;
    mrn: string;
    age?: number;
    gender: 'male' | 'female';
    avatarInitials: string;
    bloodType: string;
    insurance: string;
    hasAllergy: boolean;
    hasChronic: boolean;
    totalVisits: number;
    lastVisitDate: string;
    balance: number; // هنحسبها كـ Mock حالياً
    vitals: {
        bp: string;
        hr: string;
        weight: string;
        glucose: string;
    };
    visitHistory: PatientVisitHistory[];
}
