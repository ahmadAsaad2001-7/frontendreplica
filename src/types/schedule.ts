import { DoctorUser } from './auth';

export type PaymentMethod = 'InstaPay' | 'Cash' | 'E-Wallet';
export type PaymentStatus = 'Paid' | 'Pending' | 'Revoked';
export type AppointmentType = 'in_person' | 'online_consultation' | 'follow_up' | 'urgent';
export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';

export interface Appointment {
    id: string;
    patient_id: string;
    patient_name: string;
    patient_relation: string;
    doctor_id: string;
    doctor: DoctorUser; // Changed from Doctor to DoctorUser
    date: string;
    time: string;
    type: AppointmentType;
    reason: string;
    status: AppointmentStatus;
    amount: number;
    currency: string;
    payment_method: PaymentMethod;
    payment_status: PaymentStatus;
    payment_reference?: string;
    receipt_number?: string;
    revoked_reason?: string;
    clinic_address: string;
    clinic_phone: string;
    clinic_whatsapp: string;
    notes?: string;
}
