// src/utils/clone.ts — استبدل الملف بالكامل (نسخة نظيفة بلا تكرار)
import { toRaw, isRef } from 'vue';

export function deepClone<T>(value: T): T {
    if (isRef(value)) return deepClone((value as any).value);
    const raw = toRaw(value as any);
    if (raw instanceof Date) return new Date(raw.getTime()) as any;
    if (Array.isArray(raw)) return raw.map((v) => deepClone(v)) as any;
    if (raw && typeof raw === 'object') {
        const out: Record<string, unknown> = {};
        for (const k of Object.keys(raw)) out[k] = deepClone((raw as any)[k]);
        return out as T;
    }
    return raw;
}
