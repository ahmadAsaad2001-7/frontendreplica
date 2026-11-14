<template>
  <div class="bg-white rounded-2xl md:rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-sm md:text-base font-bold text-slate-900">
        الإجراءات والعمليات
      </h3>
      <button
        @click="$emit('add-procedure')"
        type="button"
        title="جدولة عملية أو إجراء جديد"
        class="w-7 h-7 rounded-lg text-teal-700 hover:bg-teal-50 flex items-center justify-center font-bold text-lg transition-colors"
      >
        <Plus class="w-4 h-4 text-[#0f8b80]" />
      </button>
    </div>

    <!-- Urgent Upcoming Procedure -->
    <div v-if="urgentProc" class="space-y-3 pb-3 border-b border-slate-100">
      <div>
        <div class="flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 mb-1">
          <span class="w-2 h-2 rounded-sm bg-rose-500 inline-block" />
          <span>{{ urgentProc.typeLabel }}</span>
        </div>
        <h4 class="text-xs md:text-sm font-bold text-slate-900 leading-snug">
          {{ urgentProc.title }}
        </h4>

        <div class="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5 font-medium">
          <span v-if="urgentProc.time" class="inline-flex items-center gap-1">
            <Clock class="w-3 h-3 text-slate-400" />
            {{ urgentProc.time }}
          </span>
          <span class="inline-flex items-center gap-1">
            <DoorOpen class="w-3 h-3 text-slate-400" />
            {{ urgentProc.location }}
          </span>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex items-center gap-2 pt-1">
        <button
          @click="$emit('patient-prep', urgentProc)"
          type="button"
          class="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 active:scale-95 transition-colors text-center"
        >
          تحضير المريض
        </button>
        <button
          @click="$emit('reschedule', urgentProc)"
          type="button"
          class="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 active:scale-95 transition-colors text-center"
        >
          تعديل الموعد
        </button>
      </div>
    </div>

    <!-- Follow-up Procedure -->
    <div v-if="followupProc" class="space-y-1.5 pt-1">
      <div class="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
        <span class="w-2 h-2 rounded-sm bg-slate-300 inline-block" />
        <span>{{ followupProc.typeLabel }}</span>
      </div>
      <h4 class="text-xs md:text-sm font-bold text-slate-700 leading-snug">
        {{ followupProc.title }}
      </h4>

      <div class="flex items-center gap-3 text-[11px] text-slate-400 mt-1 font-medium">
        <span class="inline-flex items-center gap-1">
          <Calendar class="w-3 h-3 text-slate-400" />
          {{ followupProc.date }}
        </span>
        <span class="inline-flex items-center gap-1">
          <MapPin class="w-3 h-3 text-slate-400" />
          {{ followupProc.location }}
        </span>
      </div>
    </div>

    <!-- View Full Surgery Calendar Button -->
    <button
      @click="$emit('view-full-calendar')"
      type="button"
      class="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70 transition-all text-center"
    >
      عرض تقويم العمليات الكامل
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Plus, Clock, DoorOpen, Calendar, MapPin } from 'lucide-vue-next';

// تعريف شكل البيانات (Interface)
interface ProcedureItem {
  id: string;
  type: 'urgent' | 'followup';
  typeLabel: string;
  title: string;
  time?: string;
  date?: string;
  location: string;
}

const props = defineProps<{
  procedures: ProcedureItem[];
}>();

defineEmits(['add-procedure', 'patient-prep', 'reschedule', 'view-full-calendar']);

// استخراج الإجراءات العاجلة والمتابعة زي ما كان في React بالظبط
const urgentProc = computed(() =>
  props.procedures.find((p) => p.type === 'urgent') || props.procedures[0]
);

const followupProc = computed(() =>
  props.procedures.find((p) => p.type === 'followup') || props.procedures[1]
);
</script>
