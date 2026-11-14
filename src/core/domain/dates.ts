import type { IsoDate } from '../contracts/common';

const MS_PER_DAY = 86_400_000;

export const toUtcMs = (d: IsoDate): number => {
    const [y, m, day] = d.split('-').map(Number);
    return Date.UTC(y, m - 1, day);
};

export const daysBetween = (a: IsoDate, b: IsoDate): number =>
Math.round((toUtcMs(b) - toUtcMs(a)) / MS_PER_DAY);

export const addDays = (d: IsoDate, n: number): IsoDate =>
new Date(toUtcMs(d) + n * MS_PER_DAY).toISOString().slice(0, 10);

// ✅ ADDED: Returns the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
export const weekdayOf = (d: IsoDate): number => {
    return new Date(toUtcMs(d)).getUTCDay();
};

// Safely gets "Today" based on the clinic's timezone, not the user's device.
export const todayIn = (now: Date, tz: string = 'Africa/Cairo'): IsoDate =>
new Intl.DateTimeFormat('en-CA', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
}).format(now);
