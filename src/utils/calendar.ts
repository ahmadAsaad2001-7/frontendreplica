// src/utils/calendar.ts
// بناء شبكة الشهر. الأسبوع يبدأ بالسبت (زي weeklySchedule في الـ store).

import { toDateStr } from './date';

/** ترتيب أيام الأسبوع في الأعمدة: السبت أولاً. */
export const WEEK_HEADERS = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'] as const;

/** إزاحة أول يوم في الشهر: السبت = 0 … الجمعة = 6. (getDay: الأحد = 0 … السبت = 6) */
export function firstDayOffset(year: number, month: number): number {
    return (new Date(year, month, 1).getDay() + 1) % 7;
}

/**
 * خلايا الشهر: null للخلايا الفاضية (قبل أول يوم وبعد آخر يوم)، وإلا 'YYYY-MM-DD'.
 * الطول دايماً من مضاعفات 7.
 */
export function buildMonthGrid(year: number, month: number): (string | null)[] {
    const offset = firstDayOffset(year, month);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: (string | null)[] = Array(offset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push(toDateStr(new Date(year, month, d)));
    }
    while (cells.length % 7 !== 0) cells.push(null);

    return cells;
}

/** يزيح (سنة، شهر) بعدد أشهر مع التعامل الصحيح مع تغيّر السنة. */
export function shiftMonth(year: number, month: number, delta: number): { year: number; month: number } {
    const d = new Date(year, month + delta, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
}

/** معلومات تلوين الخلية، يحسبها الأب (من الـ stores) ويمررها للتقويم. */
export interface DayCellInfo {
    /** هل اليوم متاح للحجز؟ */
    available: boolean;
    /** هل الحالة ناتجة عن استثناء (وليس الجدول الأسبوعي)؟ */
    isException?: boolean;
    /** عدد مواعيد اليوم (للأجندة) */
    count?: number;
    /** كل الخانات محجوزة (للأجندة) */
    full?: boolean;
}
