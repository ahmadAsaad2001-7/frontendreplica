// src/composables/usePagination.ts
import { computed, ref, type Ref } from 'vue';
import { paginate } from '../utils/pagination';

export function usePagination<T>(items: Ref<readonly T[]>, pageSize = 5) {
    const requested = ref(1);
    const result = computed(() => paginate(items.value, requested.value, pageSize));

    /** قابل للكتابة. القيمة المقروءة دايماً مصححة (لو العناصر قلّت ما نفضلش في صفحة فاضية). */
    const page = computed({
        get: () => result.value.page,
                          set: (v: number) => { requested.value = v; },
    });

    return {
        page,
        pageSize,
        pageItems: computed(() => result.value.items),
        totalPages: computed(() => result.value.totalPages),
        total: computed(() => result.value.total),
        from: computed(() => result.value.from),
        to: computed(() => result.value.to),
        reset: () => { requested.value = 1; },
    };
}
