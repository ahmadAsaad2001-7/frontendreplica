<template>
  <div
    @click="!isActive ? $emit('start') : null"
    :class="[
      'p-3 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer',
      isActive ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200' :
      patient.status === 'Emergency' ? 'bg-rose-50 border-rose-200 hover:border-rose-400' :
      'bg-white border-slate-200 hover:border-blue-400 hover:shadow-md'
    ]"
  >
    <img :src="patient.avatar" class="w-12 h-12 rounded-xl object-cover" />
    <div class="flex-1 min-w-0">
      <h4 class="font-bold text-slate-800 text-sm truncate">{{ patient.name }}</h4>
      <p class="text-[11px] text-slate-500 truncate mt-0.5">{{ patient.reason }}</p>
      <div class="flex items-center gap-2 mt-1">
        <span class="text-[10px] font-bold text-slate-400">{{ patient.age }} سنة</span>
        <span v-if="patient.status === 'Emergency'" class="text-[10px] bg-rose-200 text-rose-800 px-1.5 rounded font-bold">طوارئ</span>
      </div>
    </div>

    <!-- Start Button for non-active patients -->
    <button v-if="!isActive" class="bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white px-2 py-1 rounded-lg text-[10px] font-bold transition">
      بدء
    </button>
  </div>
</template>

<script setup lang="ts">
import type { QueuePatient } from '../../../stores/doctorQueueStore';
defineProps<{
  patient: QueuePatient;
  isActive?: boolean;
}>();

defineEmits(['start']);
</script>
