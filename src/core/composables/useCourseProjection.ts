import { computed, ref, watch } from 'vue';
import { usePrescriptionStore } from '../../stores/prescriptionStore';
import { useAdherenceStore } from '../../stores/adherenceStore';
import { useAuthStore } from '../../stores/authStore';
import { projectDay, courseAdherence } from '../domain/projection';
import { addDays, todayIn } from '../domain/dates';

export function useCourseProjection(prescriptionId: string) {
    const rxStore = usePrescriptionStore();
    const adherenceStore = useAdherenceStore();
    const authStore = useAuthStore();

    // The UI will bind the currently selected date to this ref
    const today = todayIn(new Date(), 'Africa/Cairo');
    const selectedDate = ref<string>(today);

    // 1. Get the active prescription (reactive)
    const prescription = computed(() =>
    rxStore.prescriptions.find(p => p.id === prescriptionId) || null
    );

    // 2. Get all logs for this prescription (reactive)
    const logs = computed(() =>
    adherenceStore.logs.filter(l => l.prescription_id === prescriptionId)
    );

    // 3. Project Tasks for the selected day
    const tasksForSelectedDate = computed(() => {
        if (!prescription.value) return [];
        return projectDay(prescription.value, logs.value, selectedDate.value);
    });

    // 4. Calculate Overall Adherence (%)
    const overallAdherence = computed(() => {
        if (!prescription.value) return null;
        // Passing new Date() and timezone. Later this comes from user settings.
        return courseAdherence(prescription.value, logs.value, new Date(), 'Africa/Cairo');
    });

    // 5. Generate Habit Tracker Window (14 days)
    const habitWindow = computed(() => {
        if (!prescription.value) return [];

        const windowDays = [];
        // Generate 9 days back, 4 days forward (matching old UI)
        for (let i = -9; i <= 4; i++) {
            const date = addDays(selectedDate.value, i);
            const dayTasks = projectDay(prescription.value, logs.value, date);

            const total = dayTasks.length;
            const completed = dayTasks.filter(t => t.completed).length;
            const rate = total === 0 ? null : Math.round((completed / total) * 100);

            let status = 'future';
            if (date > today) status = 'future';
            else if (total === 0) status = 'no_tasks';
            else if (rate !== null && rate >= 80) status = 'completed';
            else if (rate !== null && rate > 0) status = 'partial';
            else status = 'missed';

    windowDays.push({
        date,
        total,
        completed,
        rate,
        status,
        isToday: date === today
    });
        }
        return windowDays;
    });

    // 6. Action: Toggle a Task (With Error Handling)
    const toggleTask = (taskId: string, isCompleted: boolean) => {
        if (!prescription.value) return;

        try {
            // We call the store. The store acts as the server and enforces rules.
            adherenceStore.toggleTask(
                prescriptionId,
                selectedDate.value,
                taskId,
                isCompleted,
                authStore.currentUser?.role as 'patient' | 'doctor'
            );
        } catch (error: any) {
            if (error.message === 'PAST_DAY_LOCKED') {
                // In a real app, trigger a Toast notification here
                console.warn('⚠️ لا يمكن للمريض تعليم مهام الأيام السابقة كمنجزة.');
            } else if (error.message === 'DATE_IN_FUTURE') {
                console.warn('⚠️ لا يمكن تعليم مهام الأيام القادمة.');
            }
        }
    };

    return {
        selectedDate,
        prescription,
        tasksForSelectedDate,
        overallAdherence,
        habitWindow,
        toggleTask
    };
}
