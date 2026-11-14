import { useRouter } from 'vue-router';
import { normalizePatientId } from './usePatientResolver';

/** نقطة دخول واحدة لفتح ملف المريض من أي شاشة (أجندة/طابور/محطة عمل). */
export function useOpenPatientFile() {
    const router = useRouter();
    function openPatientFile(rawId: string) {
        router.push({ name: 'doctor-patient-detail', params: { id: normalizePatientId(rawId) } });
    }
    return { openPatientFile };
}
