// تشغيل: npx tsx tests/helpers.test.ts   (الـ imports بدون امتداد زي مشروع Vite)
import assert from 'node:assert/strict';
import { hoursToShifts, shiftsToHours } from '../src/utils/hours';
import { buildMonthGrid, firstDayOffset, shiftMonth, WEEK_HEADERS } from '../src/utils/calendar';
import { parseLocalDate, toDateStr, getDayName } from '../src/utils/date';
import { resolveInitialState, buildException } from '../src/utils/dayStatus';
import { paginate, pageNumbers } from '../src/utils/pagination';
import { parseTime12h, addMinutes } from '../src/utils/time';
import { toAgendaAppointment, toAgendaStatus, toSourceStatus } from '../src/utils/agendaAdapter';
import { findScheduleConflicts, findConflicts, sortByTime, initials, isCounted } from '../src/utils/appointments';

let passed = 0;
const test = (name: string, fn: () => void) => {
    fn();
    passed++;
    console.log(`✓ ${name}`);
};

// ─── hoursToShifts ───
test('دمج الساعات المتجاورة', () => {
    assert.deepEqual(hoursToShifts([9, 10, 11, 14, 15]), [
        { from: '09:00', to: '12:00' },
        { from: '14:00', to: '16:00' },
    ]);
});
test('ترتيب وتكرار غير مرتب', () => {
    assert.deepEqual(hoursToShifts([15, 9, 10, 10, 14]), [
        { from: '09:00', to: '11:00' },
        { from: '14:00', to: '16:00' },
    ]);
});
test('مدخل فاضي', () => assert.deepEqual(hoursToShifts([]), []));
test('ساعة واحدة', () => assert.deepEqual(hoursToShifts([0]), [{ from: '00:00', to: '01:00' }]));
test('الساعة 23 تنتهي 23:59', () => {
    assert.deepEqual(hoursToShifts([22, 23]), [{ from: '22:00', to: '23:59' }]);
});
test('قيم خارج النطاق تتجاهل', () => {
    assert.deepEqual(hoursToShifts([-1, 24, 9.5, 10]), [{ from: '10:00', to: '11:00' }]);
});

// ─── shiftsToHours ───
test('فترات على الساعة → ساعات exact', () => {
    const r = shiftsToHours([{ from: '09:00', to: '12:00' }, { from: '16:00', to: '18:00' }]);
    assert.deepEqual(r.hours, [9, 10, 11, 16, 17]);
    assert.equal(r.exact, true);
});
test('فترة فيها نص ساعة → exact=false وساعات مغطاة بالكامل فقط', () => {
    const r = shiftsToHours([{ from: '09:30', to: '12:00' }]);
    assert.deepEqual(r.hours, [10, 11]);
    assert.equal(r.exact, false);
});
test('فترة تنتهي 23:59', () => {
    const r = shiftsToHours([{ from: '22:00', to: '23:59' }]);
    assert.deepEqual(r.hours, [22, 23]);
    assert.equal(r.exact, true);
});
test('فترة غير صالحة تتجاهل', () => {
    assert.deepEqual(shiftsToHours([{ from: '12:00', to: '09:00' }]).hours, []);
});
test('round-trip على قوالب الـ store', () => {
    const presets = [
        [{ from: '09:00', to: '12:00' }, { from: '16:00', to: '21:00' }],
        [{ from: '09:00', to: '13:00' }],
        [{ from: '09:00', to: '17:00' }],
    ];
    for (const shifts of presets) {
        const { hours, exact } = shiftsToHours(shifts);
        assert.equal(exact, true);
        assert.deepEqual(hoursToShifts(hours), shifts);
    }
});

// ─── calendar ───
test('نوفمبر 2026 يبدأ الأحد → إزاحة 1 (السبت أول عمود)', () => {
    assert.equal(firstDayOffset(2026, 10), 1);
    assert.equal(getDayName(new Date(2026, 10, 1)), 'الأحد');
});
test('إزاحة كل أيام الأسبوع', () => {
    // 2026-11-07 سبت، 2026-05-01 جمعة
    assert.equal(firstDayOffset(2026, 10), 1);
    assert.equal(firstDayOffset(2026, 4), 6); // 1 مايو 2026 جمعة
    assert.equal(firstDayOffset(2026, 7), 0); // 1 أغسطس 2026 سبت
});
test('شبكة نوفمبر 2026', () => {
    const grid = buildMonthGrid(2026, 10);
    assert.equal(grid.length % 7, 0);
    assert.equal(grid.length, 35);
    assert.equal(grid[0], null);
    assert.equal(grid[1], '2026-11-01');
    assert.equal(grid.filter(Boolean).length, 30);
    assert.equal(grid[30], '2026-11-30');
});
test('عمود الجمعة هو الأخير', () => {
    const grid = buildMonthGrid(2026, 10);
    grid.forEach((cell, i) => {
        if (!cell) return;
        assert.equal(WEEK_HEADERS[i % 7], getDayName(parseLocalDate(cell)));
    });
});
test('فبراير 2028 (كبيسة) = 29 يوم', () => {
    assert.equal(buildMonthGrid(2028, 1).filter(Boolean).length, 29);
});
test('تغيّر السنة عند التنقل', () => {
    assert.deepEqual(shiftMonth(2026, 11, 1), { year: 2027, month: 0 });
    assert.deepEqual(shiftMonth(2026, 0, -1), { year: 2025, month: 11 });
});
test('date round-trip', () => {
    assert.equal(toDateStr(parseLocalDate('2026-11-25')), '2026-11-25');
});

// ─── dayStatus ───
test('بدون استثناء ويوم نشط → weekly مع ساعات الأسبوعي', () => {
    const r = resolveInitialState({
        exception: undefined,
        effectiveShifts: [{ from: '09:00', to: '12:00' }],
        weeklyActive: true,
    });
    assert.equal(r.choice, 'weekly');
    assert.deepEqual(r.hours, [9, 10, 11]);
    assert.equal(r.inexact, false);
});
test('بدون استثناء ويوم غير نشط → off', () => {
    const r = resolveInitialState({ effectiveShifts: [], weeklyActive: false });
    assert.equal(r.choice, 'off');
    assert.deepEqual(r.hours, []);
});
test('استثناء custom يقرأ ساعاته من shifts الاستثناء', () => {
    const r = resolveInitialState({
        exception: { date: '2026-11-25', type: 'custom', shifts: [{ from: '14:00', to: '16:00' }], note: 'عمليات' },
        effectiveShifts: [{ from: '09:00', to: '12:00' }],
        weeklyActive: true,
    });
    assert.equal(r.choice, 'custom');
    assert.deepEqual(r.hours, [14, 15]);
    assert.equal(r.note, 'عمليات');
});
test('فترات فيها دقائق → inexact', () => {
    const r = resolveInitialState({ effectiveShifts: [{ from: '09:30', to: '12:00' }], weeklyActive: true });
    assert.equal(r.inexact, true);
});
test('buildException: weekly → reset', () => {
    assert.deepEqual(buildException('2026-11-25', 'weekly', [], ''), { kind: 'reset' });
});
test('buildException: off مع ملاحظة', () => {
    assert.deepEqual(buildException('2026-11-25', 'off', [9], '  إجازة  '), {
        kind: 'save', exception: { date: '2026-11-25', type: 'off', note: 'إجازة' },
    });
});
test('buildException: custom يبني shifts', () => {
    assert.deepEqual(buildException('2026-11-25', 'custom', [9, 10, 14], ''), {
        kind: 'save',
        exception: { date: '2026-11-25', type: 'custom', shifts: [{ from: '09:00', to: '11:00' }, { from: '14:00', to: '15:00' }] },
    });
});
test('buildException: custom بدون ساعات → invalid', () => {
    assert.equal(buildException('2026-11-25', 'custom', [], '').kind, 'invalid');
});
test('buildException: preset بدون shifts', () => {
    const r = buildException('2026-11-25', 'preset_morning', [], '');
    assert.deepEqual(r, { kind: 'save', exception: { date: '2026-11-25', type: 'preset_morning' } });
});

// ─── pagination ───
test('paginate: 8 عناصر، صفحة 1 و 2', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8];
    const p1 = paginate(items, 1, 5);
    assert.deepEqual(p1.items, [1, 2, 3, 4, 5]);
    assert.equal(p1.totalPages, 2);
    assert.equal(p1.from, 1);
    assert.equal(p1.to, 5);
    const p2 = paginate(items, 2, 5);
    assert.deepEqual(p2.items, [6, 7, 8]);
    assert.equal(p2.to, 8);
});
test('paginate: تصحيح صفحة خارج النطاق', () => {
    assert.equal(paginate([1, 2, 3], 9, 5).page, 1);
    assert.equal(paginate(Array(11).fill(0), 99, 5).page, 3);
    assert.equal(paginate([1], 0, 5).page, 1);
});
test('paginate: قائمة فاضية', () => {
    const p = paginate([], 1, 5);
    assert.equal(p.totalPages, 1);
    assert.equal(p.from, 0);
    assert.equal(p.to, 0);
});
test('pageNumbers', () => {
    assert.deepEqual(pageNumbers(1, 1), [1]);
    assert.deepEqual(pageNumbers(3, 5), [1, 2, 3, 4, 5]);
    assert.deepEqual(pageNumbers(1, 12), [1, 2, '…', 12]);
    assert.deepEqual(pageNumbers(6, 12), [1, '…', 5, 6, 7, '…', 12]);
    assert.deepEqual(pageNumbers(12, 12), [1, '…', 11, 12]);
});

// ─── appointments ───
const mkApt = (time: string, end: string, status: any = 'confirmed') => ({
    id: time, date: '2026-11-12', time, end, status, reason: 'كشف',
    patient: { id: 'p', name: 'س', allergies: [], chronicConditions: [] },
});
const SHIFTS = [{ from: '09:00', to: '12:00' }, { from: '16:00', to: '21:00' }];

test('findConflicts: داخل الفترات = لا تعارض', () => {
    assert.deepEqual(findConflicts([mkApt('09:00', '09:20'), mkApt('11:40', '12:00'), mkApt('16:00', '16:20')], SHIFTS), []);
});
test('findConflicts: موعد خرج عن الفترات', () => {
    const r = findConflicts([mkApt('12:00', '12:20'), mkApt('11:50', '12:10'), mkApt('09:00', '09:20')], SHIFTS);
    assert.deepEqual(r.map(a => a.id), ['12:00', '11:50']);
});
test('findConflicts: إجازة (بدون فترات) = كل القائم يتعارض', () => {
    assert.equal(findConflicts([mkApt('09:00', '09:20'), mkApt('16:00', '16:20')], []).length, 2);
});
test('findConflicts: يتجاهل الملغي/المنتهي/المعلّم من قبل', () => {
    const list = [
        mkApt('12:00', '12:20', 'cancelled'),
     mkApt('12:20', '12:40', 'completed'),
     mkApt('12:40', '13:00', 'no_show'),
     mkApt('13:00', '13:20', 'needs_reschedule'),
    ];
    assert.deepEqual(findConflicts(list, SHIFTS), []);
});
test('sortByTime و isCounted و initials', () => {
    assert.deepEqual(sortByTime([mkApt('16:00', '16:20'), mkApt('09:20', '09:40'), mkApt('09:00', '09:20')]).map(a => a.time),
                     ['09:00', '09:20', '16:00']);
    assert.equal(isCounted({ status: 'cancelled' }), false);
    assert.equal(isCounted({ status: 'no_show' }), true);
    assert.equal(initials('أحمد أسعد'), 'أأ');
    assert.equal(initials('  سارة  '), 'س');
});

// ─── time ───
test('parseTime12h', () => {
    assert.equal(parseTime12h('05:30 م'), '17:30');
    assert.equal(parseTime12h('9:00 ص'), '09:00');
    assert.equal(parseTime12h('12:00 م'), '12:00');
    assert.equal(parseTime12h('12:15 ص'), '00:15');
    assert.equal(parseTime12h('٠٥:٣٠ م'), '17:30');
    assert.equal(parseTime12h('05:30 PM'), '17:30');
    assert.equal(parseTime12h('17:30'), '17:30');
    assert.equal(parseTime12h('13:00 م'), null);
    assert.equal(parseTime12h('abc'), null);
});
test('addMinutes', () => {
    assert.equal(addMinutes('09:40', 20), '10:00');
    assert.equal(addMinutes('23:50', 30), '23:59');
});

// ─── adapter ───
const src = { id: 'a1', doctorId: 'doc_1', patientProfileId: 'p1', patientName: 'أحمد', patientRelation: 'أنا',
    date: '2026-11-25', time: '05:30 م', reason: 'كشف', status: 'Confirmed' as const };
    test('adapter: تحويل حجز', () => {
        const a = toAgendaAppointment(src, undefined, 20)!;
        assert.equal(a.time, '17:30');
        assert.equal(a.end, '17:50');
        assert.equal(a.status, 'confirmed');
        assert.deepEqual(a.patient.allergies, []);
    });
    test('adapter: durationMin وبروفايل بحساسية كائنات', () => {
        const a = toAgendaAppointment({ ...src, durationMin: 30 }, { id: 'p1', age: 30, allergies: [{ substance: 'بنسلين' }, 'غبار'] }, 20)!;
        assert.equal(a.end, '18:00');
        assert.equal(a.patient.age, 30);
        assert.deepEqual(a.patient.allergies, ['بنسلين', 'غبار']);
    });
    test('adapter: وقت غير مفهوم → null', () => {
        assert.equal(toAgendaAppointment({ ...src, time: 'بكرة' }, undefined, 20), null);
    });
    test('adapter: round-trip الحالات', () => {
        for (const s of ['Pending','Confirmed','Completed','Cancelled','NoShow','NeedsReschedule'] as const)
            assert.equal(toSourceStatus(toAgendaStatus(s)), s);
    });

    // ─── findScheduleConflicts ───
    test('findScheduleConflicts: يتجاهل الماضي ويرتب بالتاريخ', () => {
        const mk = (date: string, time: string, end: string) => ({ ...mkApt(time, end), id: date + time, date });
        const list = [mk('2026-11-10', '09:00', '09:20'), mk('2026-11-26', '09:00', '09:20'), mk('2026-11-25', '09:00', '09:20')];
        const r = findScheduleConflicts(list, '2026-11-12', () => []);
        assert.deepEqual(r.map(a => a.date), ['2026-11-25', '2026-11-26']);
    });
    test('findScheduleConflicts: يعتمد فترات كل يوم', () => {
        const mk = (date: string) => ({ ...mkApt('09:00', '09:20'), id: date, date });
        const r = findScheduleConflicts([mk('2026-11-25'), mk('2026-11-26')], '2026-11-12',
                                        d => (d === '2026-11-25' ? [{ from: '09:00', to: '12:00' }] : []));
        assert.deepEqual(r.map(a => a.date), ['2026-11-26']);
    });

    console.log(`\n${passed} tests passed`);
