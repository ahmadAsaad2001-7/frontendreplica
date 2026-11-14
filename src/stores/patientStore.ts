import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { FamilyMember } from '../types/patient';

export const usePatientStore = defineStore('patient', () => {
    // Mock Data
    const familyMembers = ref<FamilyMember[]>([
        { id: 'pat_001', name: 'أحمد أسعد', relationship: 'أنا', isSelf: true, avatar: '', age: 34, gender: 'male', bloodType: 'O+', allergies: ['بنسلين'], chronic_conditions: ['ضغط'] },
        { id: 'pat_002', name: 'سارة أسعد', relationship: 'الزوجة', isSelf: false, avatar: '', age: 31, gender: 'female', bloodType: 'A+', allergies: [], chronic_conditions: [] }
    ]);

    const activeMemberId = ref<string>('pat_001');

    // Computed
    const activeMember = computed(() =>
    familyMembers.value.find(m => m.id === activeMemberId.value) || familyMembers.value[0]
    );

    // Actions
    function setActiveMember(id: string) {
        activeMemberId.value = id;
    }

    function addFamilyMember(member: FamilyMember) {
        familyMembers.value.push(member);
        setActiveMember(member.id);
    }

    return {
        familyMembers,
        activeMemberId,
        activeMember,
        setActiveMember,
        addFamilyMember
    };
});
