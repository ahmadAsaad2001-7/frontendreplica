<template>
  <div>
    <div v-if="items.length === 0" class="text-center py-10 text-slate-400">
      <CalendarX class="w-9 h-9 mx-auto mb-2 opacity-40" />
      <p class="text-sm font-medium">لا توجد مواعيد في هذا اليوم</p>
    </div>

    <ul v-else class="space-y-2.5">
      <li v-for="a in items" :key="a.id">
        <button
          type="button"
          @click="emit('select', a.id)"
          :aria-pressed="a.id === selectedId"
          :class="[
            'w-full text-right flex items-center gap-3 p-3 rounded-xl border transition-all',
            a.id === selectedId
              ? 'bg-teal-50 border-teal-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50',
            a.status === 'cancelled' ? 'opacity-60' : '',
          ]"
        >
          <div
            :class="[
              'w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0',
              a.patient.gender === 'female' ? 'bg-pink-100 text-pink-700' : 'bg-sky-100 text-sky-700',
            ]"
          >
            {{ initials(a.patient.name) }}
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-slate-800 truncate">{{ a.patient.name }}</span>
              <span :class="['text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0', STATUS_META[a.status].badgeClass]">
                {{ STATUS_META[a.status].label }}
              </span>
            </div>
            <div class="text-[11px] text-slate-500 mt-0.5">{{ a.reason }}</div>
          </div>

          <div class="text-left shrink-0">
            <div class="text-sm font-bold text-teal-700">{{ a.time }}</div>
            <div class="text-[10px] text-slate-400">{{ a.end }}</div>
          </div>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { CalendarX } from 'lucide-vue-next';
import type { Appointment } from '../../../../types/appointment';
import { STATUS_META, initials } from '../../../../utils/appointments';

defineProps<{
  /** مواعيد الصفحة الحالية فقط */
  items: Appointment[];
  selectedId: string | null;
}>();

const emit = defineEmits<{
  select: [id: string];
}>();
</script>
