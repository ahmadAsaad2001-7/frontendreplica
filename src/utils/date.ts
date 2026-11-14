// src/utils/date.ts
// التعامل مع تواريخ YYYY-MM-DD بالتوقيت المحلي (بدون تحويل UTC).

/** يحوّل 'YYYY-MM-DD' إلى Date بالتوقيت المحلي (new Date('2026-11-25') بتتفسّر UTC وممكن تطلع يوم سابق). */
export function parseLocalDate(dateStr: string): Date {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
}

/** يحوّل Date إلى 'YYYY-MM-DD' بالتوقيت المحلي. */
export function toDateStr(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

/** أسماء الأيام مرتبة حسب Date.getDay() (الأحد = 0). */
export const DAY_NAMES = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'] as const;

export function getDayName(date: Date): string {
    return DAY_NAMES[date.getDay()];
}
