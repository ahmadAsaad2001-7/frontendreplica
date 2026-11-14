import type { IsoDate, Schedule } from '../contracts/common';
import { daysBetween, weekdayOf } from './dates';

export function occursOn(
    s: Schedule,
    courseStart: IsoDate,
    courseEnd: IsoDate,
    date: IsoDate
): boolean {
    // 1. Must be within the course range
    if (date < courseStart || date > courseEnd) return false;

    const start = s.starts_on ?? courseStart;
    if (date < start) return false;

    const offset = daysBetween(start, date);

    // 2. Must be within the item's duration (e.g., 5-day antibiotic)
    if (s.duration_days !== undefined && offset >= s.duration_days) return false;

    // 3. Apply recurrence rules
    const r = s.recurrence;
    switch (r.kind) {
        case 'daily':        return true;
        case 'every_n_days': return offset % r.n === 0;
        case 'weekdays':     return r.days.includes(weekdayOf(date));
        case 'course_days':  return r.days.includes(daysBetween(courseStart, date) + 1);
        case 'prn':          return false; // As-needed meds are not scheduled tasks
        default:             return false;
    }
}
