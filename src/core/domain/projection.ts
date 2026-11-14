import type { IsoDate, ClockTime } from '../contracts/common';
import { addDays, todayIn } from './dates';
import { occursOn } from './recurrence';
import type { AdherenceLog } from '../../stores/adherenceStore';

export interface ProjectedTask {
    task_id: string; // e.g., "med_123@08:00"
    item_id: string;
    title: string;
    time: ClockTime | null;
    completed: boolean;
    readonly: boolean;
}

export function projectDay(
    course: any, // Prescription object
    logs: AdherenceLog[],
    date: IsoDate
): ProjectedTask[] {
    const out: ProjectedTask[] = [];

    // Map logs for O(1) lookup
    const dayLogs = new Map(
        logs.filter(l => l.date === date).map(l => [l.task_id, l])
    );

    for (const item of course.plan_items) {
        if (!occursOn(item.schedule, course.starts_on, course.ends_on, date)) continue;

        // If no times specified, it's an untimed task (e.g., "Walk 10 mins")
        const times = item.schedule.times.length ? item.schedule.times : [null];

        for (const time of times) {
            const task_id = `${item.id}@${time ?? 'any'}`;
            const log = dayLogs.get(task_id);

            out.push({
                task_id,
                item_id: item.id,
                title: item.title,
                time,
                completed: log?.completed ?? false,
                readonly: course.status !== 'active', // Revoked/Completed are read-only
            });
        }
    }
    return out;
}

export function courseAdherence(
    course: any,
    logs: AdherenceLog[],
    now: Date,
    tz: string
): number | null {
    const today = todayIn(now, tz);
    const lastDayToCount = today < course.ends_on ? today : course.ends_on;

    let totalDue = 0;
    let totalCompleted = 0;

    // Count every day from start to today
    let currentDate = course.starts_on;
    while (currentDate <= lastDayToCount) {
        // Decision: We EXCLUDE today's incomplete tasks from the denominator to avoid morning dips.
        // We only count today if it's already fully completed.
        if (currentDate === today && course.status === 'active') {
            const todayTasks = projectDay(course, logs, today);
            const allDone = todayTasks.length > 0 && todayTasks.every(t => t.completed);
            if (allDone) {
                totalDue += todayTasks.length;
                totalCompleted += todayTasks.length;
            }
        } else {
            const tasks = projectDay(course, logs, currentDate);
            totalDue += tasks.length;
            totalCompleted += tasks.filter(t => t.completed).length;
        }

        currentDate = addDays(currentDate, 1);
    }

    return totalDue === 0 ? null : Math.round((totalCompleted / totalDue) * 100);
}
