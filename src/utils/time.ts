// src/utils/time.ts

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * يحوّل وقت بصيغة المريض إلى 24 ساعة 'HH:mm'.
 * يدعم: '05:30 م' و'9:00 ص' و'05:30 PM' و'17:30' والأرقام العربية '٠٥:٣٠ م'.
 * يرجّع null لو الصيغة غير مفهومة.
 */
export function parseTime12h(input: string): string | null {
    const s = input
    .trim()
    .replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));

    const m = s.match(/^(\d{1,2}):(\d{2})\s*(ص|م|AM|PM)?$/i);
    if (!m) return null;

    let hours = Number(m[1]);
    const minutes = Number(m[2]);
    const meridiem = m[3];
    if (minutes > 59) return null;

    if (meridiem) {
        if (hours < 1 || hours > 12) return null;
        const isPm = meridiem === 'م' || meridiem.toUpperCase() === 'PM';
        if (isPm && hours < 12) hours += 12;
        if (!isPm && hours === 12) hours = 0;
    } else if (hours > 23) {
        return null;
    }

    return `${pad(hours)}:${pad(minutes)}`;
}

/** يضيف دقائق لوقت 'HH:mm' (بدون تجاوز منتصف الليل: يقف عند 23:59). */
export function addMinutes(time: string, mins: number): string {
    const [h, m] = time.split(':').map(Number);
    const total = Math.min(h * 60 + m + mins, 23 * 60 + 59);
    return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}
