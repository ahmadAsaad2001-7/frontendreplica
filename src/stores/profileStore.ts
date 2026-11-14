import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface Profile {
    id: string;
    name: string;
    relation: string;
    age: number;
    gender: 'male' | 'female';
    bloodType: string;
    mrn: string; // معرف المريض
    allergies: string[];
  chronicConditions: ChronicCondition[]; // تحديث النوع

}

export const useProfileStore = defineStore('profile', () => {
    const profiles = ref<Profile[]>([
        {
            id: 'pat_001',
            name: 'أحمد أسعد',
            relation: 'أنا',
            age: 34,
            gender: 'male',
            bloodType: 'O+',
            mrn: 'MRN-SELF-2026',
            allergies: ['حساسية من مركبات السلفا (Sulfonamides)', 'حساسية موسمية من غبار الطلع'],
                                    chronicConditions: ['انزلاق غضروفي قطني L4-L5 مع التهاب العصب الوركي', 'ارتفاع ضغط دم شرياني أولي (Stage 1 HTN)']
        }, // 👈 FIX 1: Added the missing comma here
        {
            id: 'pat_002',
            name: 'سارة أسعد',
            relation: 'الزوجة',
            age: 31,
            gender: 'female',
            bloodType: 'A+',
            mrn: 'MRN-WIFE-2026', // 👈 FIX 2: Added missing required properties to satisfy the interface
            allergies: [],
            chronicConditions: []
        }
    ]);

    const activeProfileId = ref<string>('pat_001');

    const activeProfile = computed(() =>
    profiles.value.find(p => p.id === activeProfileId.value) || profiles.value[0]
    );

    function setActiveProfile(id: string) {
        activeProfileId.value = id;
    }

    function addProfile(profile: Omit<Profile, 'id'>) {
        const newProfile = { ...profile, id: `pat_${Date.now()}` };
        profiles.value.push(newProfile);
        setActiveProfile(newProfile.id);
    }

    // دالة إضافة حساسية جديدة
    function addAllergy(allergyData: Omit<Allergy, 'id' | 'addedAt'>) {
        if (!activeProfile.value) return;
        activeProfile.value.allergies.push({
            ...allergyData,
            id: `alg_${Date.now()}`,
                                           addedAt: new Date().toISOString().split('T')[0]
        });
    }

    // دالة إضافة مرض مزمن جديد
    function addChronicCondition(conditionData: Omit<ChronicCondition, 'id' | 'addedAt'>) {
        if (!activeProfile.value) return;
        activeProfile.value.chronicConditions.push({
            ...conditionData,
            id: `cond_${Date.now()}`,
                                                   addedAt: new Date().toISOString().split('T')[0]
        });
    }
    return {
        profiles,
        activeProfileId,
        activeProfile,
        setActiveProfile,
        addProfile,
        addAllergy,
        addChronicCondition
    };
});
