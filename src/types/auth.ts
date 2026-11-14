export type UserRole = 'patient' | 'doctor' | 'assistant' | 'admin';
export type UserStatus = 'active' | 'pending' | 'suspended';
export type Gender = 'male' | 'female';

export interface BaseUser {
    id: string;
    email: string;
    phone: string;
    name: string;
    avatar: string;
    role: UserRole;
    status: UserStatus;
    gender: Gender;
    createdAt: string;
}

// Discriminated Unions based on Role
export interface PatientUser extends BaseUser {
    role: 'patient';
    // Patient-specific auth data
    primaryAccountId?: string; // If this is a family member, link to the main account
}

export interface DoctorUser extends BaseUser {
    role: 'doctor';
    licenseNumber: string;
    specialty: string;
    subSpecialty?: string;
    hospitalClinic: string;
    governorate: string;
    city: string;
    street: string;
    rating: number;
    price: number;
    experienceYears?: number;
}

export interface AssistantUser extends BaseUser {
    role: 'assistant';
    boundDoctorIds: string[]; // Max 3 doctors
}

export interface AdminUser extends BaseUser {
    role: 'admin';
}

export type User = PatientUser | DoctorUser | AssistantUser | AdminUser;
