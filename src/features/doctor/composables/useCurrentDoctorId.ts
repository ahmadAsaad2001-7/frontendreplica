// src/features/doctor/composables/useCurrentDoctorId.ts
import { computed } from 'vue';
import { useAuthStore } from '../../../stores/authStore';

/** id الطبيب المسجّل دخوله، أو null لو المستخدم الحالي مش طبيب. */
export function useCurrentDoctorId() {
    const auth = useAuthStore();
    return computed(() => (auth.currentUser?.role === 'doctor' ? auth.currentUser.id : null));
}
