// src/utils/hours.ts
// تحويل بين شبكة الساعات (0-23) والفترات (Shift) المخزّنة في doctorScheduleStore.
// المصدر الوحيد للحقيقة هو الفترات، والشبكة مجرد طبقة واجهة.

import type { Shift } from '../stores/doctorScheduleStore';

/**
 * نهاية آخر ساعة في اليوم. نستخدم '23:59' بدل '24:00' لأن <input type="time">
 * ما بيقبلش '24:00'. (تأثير ده على التوليد: آخر خانة بعد 23:40 ممكن تضيع، وده حد نادر.)
 */
export const END_OF_DAY = '23:59';
const END_OF_DAY_MINUTES = 23 * 60 + 59;

const pad = (n: number) => String(n).padStart(2, '0');
const toMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
};

/** ساعات مختارة → فترات متجاورة مدموجة. [9,10,11,14,15] → 09:00-12:00 و 14:00-16:00 */
export function hoursToShifts(hours: number[]): Shift[] {
    const sorted = [...new Set(hours)]
    .filter(h => Number.isInteger(h) && h >= 0 && h <= 23)
    .sort((a, b) => a - b);

    const shifts: Shift[] = [];
    let start: number | null = null;
    let prev: number | null = null;

    const close = () => {
        if (start === null || prev === null) return;
        shifts.push({
            from: `${pad(start)}:00`,
                    to: prev === 23 ? END_OF_DAY : `${pad(prev + 1)}:00`,
        });
    };

    for (const h of sorted) {
        if (start === null) {
            start = h;
        } else if (h !== (prev as number) + 1) {
            close();
            start = h;
        }
        prev = h;
    }
    close();

    return shifts;
}

export interface HoursView {
    /** الساعات المغطاة بالكامل بفترة واحدة على الأقل */
    hours: number[];
    /** false لو في فترة حدودها مش على الساعة (مثل 09:30)، فالشبكة مش هتمثلها بدقة */
    exact: boolean;
}

/** فترات → ساعات للعرض. لو الفترات فيها دقائق نرجّع exact=false بدل التقريب الصامت. */
export function shiftsToHours(shifts: readonly Shift[]): HoursView {
    const set = new Set<number>();
    let exact = true;

    for (const shift of shifts) {
        const from = toMinutes(shift.from);
        const to = toMinutes(shift.to);
        if (to <= from) continue; // فترة غير صالحة

        const fromOnHour = from % 60 === 0;
        const toOnHour = to % 60 === 0 || to === END_OF_DAY_MINUTES;
        if (!fromOnHour || !toOnHour) exact = false;

        for (let h = 0; h <= 23; h++) {
            const hourStart = h * 60;
            const hourEnd = h === 23 ? END_OF_DAY_MINUTES : hourStart + 60;
            if (from <= hourStart && to >= hourEnd) set.add(h);
        }
    }

    return { hours: [...set].sort((a, b) => a - b), exact };
}

/** نص الساعة للعرض في الشبكة: 9 → '9:00' */
export function formatHourLabel(h: number): string {
    return `${h}:00`;
}
