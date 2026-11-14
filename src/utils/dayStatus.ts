// src/utils/dayStatus.ts
// منطق نقي لمودال حالة اليوم (بدون Vue/Pinia) علشان يتختبر بسهولة.

import type { DayException, ExceptionType, Shift } from '../stores/doctorScheduleStore';
import { hoursToShifts, shiftsToHours } from './hours';

/** اختيار المودال: أي نوع استثناء، أو 'weekly' = بدون استثناء (حسب الجدول الأسبوعي). */
export type DayChoice = ExceptionType | 'weekly';

export interface InitialDayState {
    choice: DayChoice;
    /** ساعات شبكة "مخصص" */
    hours: number[];
    /** true لو الفترات فيها دقائق والشبكة ما تقدرش تمثلها بدقة */
    inexact: boolean;
    note: string;
}

export function resolveInitialState(args: {
    exception?: DayException;
    /** الفترات الفعلية لليوم (استثناء أو أسبوعي) */
    effectiveShifts: Shift[];
    /** هل اليوم نشط في الجدول الأسبوعي (وفيه فترات)؟ */
    weeklyActive: boolean;
}): InitialDayState {
    const { exception, effectiveShifts, weeklyActive } = args;

    const choice: DayChoice = exception ? exception.type : weeklyActive ? 'weekly' : 'off';
    const source = exception?.type === 'custom' ? exception.shifts ?? [] : effectiveShifts;
    const view = shiftsToHours(source);

    return {
        choice,
        hours: view.hours,
        inexact: !view.exact,
        note: exception?.note ?? '',
    };
}

export type BuildResult =
| { kind: 'reset' }                          // حذف الاستثناء والرجوع للأسبوعي
| { kind: 'save'; exception: DayException }  // حفظ استثناء
| { kind: 'invalid'; reason: string };

export function buildException(
    date: string,
    choice: DayChoice,
    hours: number[],
    note: string,
): BuildResult {
    if (choice === 'weekly') return { kind: 'reset' };

    const trimmed = note.trim();
    const exception: DayException = { date, type: choice };
    if (trimmed) exception.note = trimmed;

    if (choice === 'custom') {
        const shifts = hoursToShifts(hours);
        if (shifts.length === 0) return { kind: 'invalid', reason: 'اختر ساعة واحدة على الأقل' };
        exception.shifts = shifts;
    }

    return { kind: 'save', exception };
}
