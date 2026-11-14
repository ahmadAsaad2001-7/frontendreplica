import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type UserRole = 'patient' | 'doctor' | 'assistant' | 'admin';

export interface BaseUser {
    id: string;
    name: string;
    role: UserRole;
    avatar: string;
}

export const useAuthStore = defineStore('auth', () => {
    // State
    const currentUser = ref<BaseUser | null>(null);

    // Getters
    const isAuthenticated = computed(() => currentUser.value !== null);
    const isPatient = computed(() => currentUser.value?.role === 'patient');
    const isDoctor = computed(() => currentUser.value?.role === 'doctor');
    const isAdmin = computed(() => currentUser.value?.role === 'admin');

    // Actions
    function loginAsPatient() {
        currentUser.value = {
            id: 'pat_001',
            name: 'أحمد أسعد',
            role: 'patient',
            avatar: 'https://i.pravatar.cc/150?img=11'
        };
    }

    function loginAsDoctor() {
        currentUser.value = {
            id: 'doc_001',
            name: 'د. طارق الحكيم',
            role: 'doctor',
            avatar: 'https://i.pravatar.cc/150?img=60'
        };
    }

    function loginAsAdmin() {
        currentUser.value = {
            id: 'admin_001',
            name: 'م. أحمد (مدير النظام)',
                                        role: 'admin',
                                        avatar: 'https://i.pravatar.cc/150?img=68'
        };
    }

    function logout() {
        currentUser.value = null;
    }

    return {
        currentUser,
        isAuthenticated,
        isPatient,
        isDoctor,
        isAdmin,
        loginAsPatient,
        loginAsDoctor,
        loginAsAdmin,
        logout
    };
});
