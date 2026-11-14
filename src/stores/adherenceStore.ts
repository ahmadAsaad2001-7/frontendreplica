import { defineStore } from 'pinia';
import { ref } from 'vue';
import { todayIn } from '../core/domain/dates';

export interface AdherenceLog {
    prescription_id: string;
    date: string; // IsoDate (YYYY-MM-DD)
    task_id: string;
    completed: boolean;
    completed_at: string; // ISO UTC Time
    recorded_by_role: 'patient' | 'doctor' | 'assistant';
}

export const useAdherenceStore = defineStore('adherence', () => {
    // State: Flat array of logs.
    const logs = ref<AdherenceLog[]>([
        // Mock data for yesterday to show in Habit Tracker
        {
            prescription_id: 'RX-SPINE-2026-01',
            date: '2026-10-30',
            task_id: 'med_1@12:00',
            completed: true,
            completed_at: '2026-10-30T12:05:00Z',
            recorded_by_role: 'patient'
        }
    ]);

    // Actions
    function toggleTask(
        prescriptionId: string,
        date: string,
        taskId: string,
        completed: boolean,
        actorRole: 'patient' | 'doctor' | 'assistant' = 'patient'
    ) {
        const today = todayIn(new Date(), 'Africa/Cairo');

        // 1. Server Rule: Future Date Locked
        if (date > today) {
            throw new Error('DATE_IN_FUTURE');
        }

        // 2. Server Rule: Past Day Locked (Only doctors can backfill)
        if (date < today && actorRole === 'patient') {
            throw new Error('PAST_DAY_LOCKED');
        }

        // 3. Upsert the log (Idempotent)
        const existing = logs.value.find(
            l => l.prescription_id === prescriptionId && l.date === date && l.task_id === taskId
        );

        if (existing) {
            existing.completed = completed;
            existing.completed_at = new Date().toISOString();
        } else {
            logs.value.push({
                prescription_id: prescriptionId,
                date,
                task_id: taskId,
                completed,
                completed_at: new Date().toISOString(),
                            recorded_by_role: actorRole
            });
        }
    }

    return {
        logs,
        toggleTask
    };
});
