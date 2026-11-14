// src/utils/pagination.ts

export interface Page<T> {
    items: T[];
    /** رقم الصفحة بعد التصحيح (1..totalPages) */
    page: number;
    totalPages: number;
    total: number;
    /** ترتيب أول وآخر عنصر في الصفحة (1-based)، 0 لو فاضي */
    from: number;
    to: number;
}

export function paginate<T>(items: readonly T[], page: number, pageSize: number): Page<T> {
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(1, Math.floor(page) || 1), totalPages);
    const start = (safePage - 1) * pageSize;
    const slice = items.slice(start, start + pageSize);

    return {
        items: slice,
        page: safePage,
        totalPages,
        total,
        from: total === 0 ? 0 : start + 1,
        to: start + slice.length,
    };
}

export type PageToken = number | '…';

/** أرقام مختصرة: 1 … 5 6 7 … 12 */
export function pageNumbers(current: number, totalPages: number): PageToken[] {
    const wanted = new Set<number>([1, totalPages, current - 1, current, current + 1]);
    const sorted = [...wanted].filter(p => p >= 1 && p <= totalPages).sort((a, b) => a - b);

    const out: PageToken[] = [];
    sorted.forEach((p, i) => {
        if (i > 0 && p - sorted[i - 1] > 1) out.push('…');
        out.push(p);
    });
    return out;
}
