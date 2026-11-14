<template>
  <div class="p-5 hover:bg-slate-50/50 transition" :class="{ 'opacity-50': !day.isActive }">

    <!-- Top Row: Day Name + Toggle + Actions -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <input
          type="checkbox"
          :checked="day.isActive"
          @change="$emit('toggle')"
          class="w-5 h-5 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
        >
        <span :class="day.isActive ? 'font-extrabold text-slate-800' : 'font-bold text-slate-400'" class="text-base">
          {{ day.day }}
        </span>
        <span v-if="day.isActive" class="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-bold">
          {{ day.shifts.length }} فترة
        </span>
      </div>

      <div class="flex items-center gap-1" v-if="day.isActive">
        <!-- Presets Dropdown -->
        <div class="relative">
          <button
            @click="showPresets = !showPresets"
            class="text-xs bg-slate-100 text-slate-600 font-bold px-3 py-1.5 rounded-lg hover:bg-slate-200 transition flex items-center gap-1"
          >
            <Zap class="w-3 h-3" /> قوالب جاهزة
          </button>

          <div v-if="showPresets" class="absolute left-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 w-48 overflow-hidden">
            <button
              v-for="(preset, key) in presets"
              :key="key"
              @click="handlePreset(key)"
              class="w-full text-right px-3 py-2 text-xs hover:bg-slate-50 transition font-semibold text-slate-700"
            >
              {{ preset.name }}
            </button>
          </div>
        </div>

        <button
          v-if="canCopy"
          @click="$emit('copy')"
          class="text-xs bg-slate-100 text-slate-600 font-bold p-1.5 rounded-lg hover:bg-slate-200 transition"
          title="نسخ من اليوم السابق"
        >
          <Copy class="w-3.5 h-3.5" />
        </button>

        <button
          @click="$emit('clear')"
          class="text-xs bg-slate-100 text-slate-600 font-bold p-1.5 rounded-lg hover:bg-rose-100 hover:text-rose-600 transition"
          title="مسح اليوم"
        >
          <Trash2 class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Shifts List -->
    <div v-if="day.isActive" class="space-y-2">
      <div
        v-for="(shift, idx) in day.shifts"
        :key="idx"
        class="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3 group"
      >
        <div class="flex items-center gap-2 flex-1">
          <div class="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex-1">
            <span class="text-xs text-slate-500 font-bold shrink-0">من</span>
            <input
              type="time"
              :value="shift.from"
              @input="$emit('update-shift', idx, 'from', ($event.target as HTMLInputElement).value)"
              class="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer flex-1"
            >
          </div>

          <div class="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex-1">
            <span class="text-xs text-slate-500 font-bold shrink-0">إلى</span>
            <input
              type="time"
              :value="shift.to"
              @input="$emit('update-shift', idx, 'to', ($event.target as HTMLInputElement).value)"
              class="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer flex-1"
            >
          </div>
        </div>

        <button
          @click="$emit('remove-shift', idx)"
          :disabled="day.shifts.length === 1"
          class="opacity-0 group-hover:opacity-100 text-rose-500 hover:bg-rose-50 p-1.5 rounded transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Add Shift Button -->
      <button
        @click="$emit('add-shift')"
        class="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50/50 transition flex items-center justify-center gap-1.5"
      >
        <Plus class="w-3.5 h-3.5" /> إضافة فترة جديدة
      </button>
    </div>

    <!-- Inactive State -->
    <div v-else class="py-6 text-center">
      <p class="text-xs text-slate-400 italic">يوم إجازة - لا توجد فترات عمل</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Zap, Copy, Trash2, Plus, X } from 'lucide-vue-next';
import type { DaySchedule } from '../../../stores/doctorScheduleStore';
import { PRESETS } from '../../../stores/doctorScheduleStore';

defineProps<{
  day: DaySchedule;
  index: number;
  canCopy: boolean;
}>();

const emit = defineEmits<{
  toggle: [];
  'add-shift': [];
  'remove-shift': [index: number];
  'update-shift': [index: number, field: 'from' | 'to', value: string];
  'apply-preset': [preset: keyof typeof PRESETS];
  clear: [];
  copy: [];
}>();

const presets = PRESETS;
const showPresets = ref(false);

function handlePreset(key: keyof typeof PRESETS) {
  emit('apply-preset', key);
  showPresets.value = false;
}
</script>
