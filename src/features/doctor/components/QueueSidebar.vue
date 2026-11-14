<template>
  <aside class="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">

    <!-- Header & Stats -->
    <div class="p-4 border-b border-slate-100 bg-slate-50/50">
      <div class="flex justify-between items-center mb-4">
        <h2 class="font-extrabold text-slate-800 flex items-center gap-2 text-lg">
          <ListOrdered class="w-5 h-5 text-teal-600" /> طابور اليوم
        </h2>
      </div>

      <div class="grid grid-cols-3 gap-2 mb-2">
        <div class="bg-white border border-slate-200 rounded-xl p-2 text-center">
          <p class="text-[10px] text-slate-500 font-bold">إجمالي الكشف</p>
          <p class="text-lg font-extrabold text-slate-800">{{ queue.length }}</p>
        </div>
        <div class="bg-rose-50 border border-rose-200 rounded-xl p-2 text-center">
          <p class="text-[10px] text-rose-600 font-bold">طوارئ</p>
          <p class="text-lg font-extrabold text-rose-600">{{ emergencyPatients.length }}</p>
        </div>
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-2 text-center">
          <p class="text-[10px] text-amber-600 font-bold">انتظار</p>
          <p class="text-lg font-extrabold text-amber-600">{{ waitingPatients.length }}</p>
        </div>
      </div>
    </div>

    <!-- 🔴 1. PINNED EMERGENCY SECTION (Always on top) -->
    <div v-if="emergencyPatients.length > 0" class="p-3 bg-rose-50 border-b border-rose-200">
      <h3 class="text-xs font-bold text-rose-700 mb-2 flex items-center gap-1 animate-pulse">
        <AlertTriangle class="w-4 h-4" /> حالات طوارئ حرجة (يجب التدخل الفوري)
      </h3>
      <div class="space-y-2">
        <div
          v-for="patient in emergencyPatients"
          :key="patient.id"
          @click="startConsultation(patient.id)"
          class="bg-white border-2 border-rose-400 p-3 rounded-xl flex gap-3 cursor-pointer hover:shadow-md transition relative overflow-hidden group"
        >
          <div class="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-lg shrink-0">
            {{ patient.name.charAt(0) }}
          </div>
          <div class="flex-1">
            <div class="flex justify-between items-start">
              <h4 class="font-bold text-slate-800 text-sm">{{ patient.name }}</h4>
              <div class="flex items-center gap-1">
                <!-- زر فتح الملف للحالات الحرجة -->
                <button
                  type="button"
                  @click.stop="openPatientFile(patient.id)"
                  title="فتح الملف"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition"
                >
                  <FolderOpen class="w-3.5 h-3.5" />
                </button>
                <span class="bg-rose-100 text-rose-700 text-[9px] font-bold px-1.5 py-0.5 rounded">حرج</span>
              </div>
            </div>
            <p class="text-[10px] text-slate-500 mt-0.5">{{ patient.age }} سنة • {{ patient.reason }}</p>
            <button class="mt-2 text-[10px] bg-rose-500 text-white font-bold px-3 py-1 rounded-lg w-full group-hover:bg-rose-600 transition">
              بدء الكشف فوراً
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. NORMAL QUEUE SECTION -->
    <div class="flex border-b border-slate-100 px-2 pt-2 bg-white">
      <button
        @click="activeFilter = 'all'"
        :class="['flex-1 py-2 text-xs font-bold border-b-2 transition-colors', activeFilter === 'all' ? 'text-teal-600 border-teal-600' : 'text-slate-500 border-transparent hover:text-slate-800']"
      >
        الكل
      </button>
      <button
        @click="activeFilter = 'waiting'"
        :class="['flex-1 py-2 text-xs font-bold border-b-2 transition-colors', activeFilter === 'waiting' ? 'text-amber-600 border-amber-600' : 'text-slate-500 border-transparent hover:text-slate-800']"
      >
        انتظار ({{ waitingPatients.length }})
      </button>
      <button
        @click="activeFilter = 'completed'"
        :class="['flex-1 py-2 text-xs font-bold border-b-2 transition-colors', activeFilter === 'completed' ? 'text-slate-800 border-slate-800' : 'text-slate-500 border-transparent hover:text-slate-800']"
      >
        منتهي ({{ completedPatients.length }})
      </button>
    </div>

    <!-- Patient List (Normal) -->
    <div class="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/30">

      <div v-if="filteredNormalPatients.length === 0" class="text-center text-slate-400 py-10 text-sm">
        لا يوجد مرضى في هذه القائمة.
      </div>

      <div
        v-for="patient in filteredNormalPatients"
        :key="patient.id"
        @click="doctorStore.selectPatient(patient.id)"
        :class="[
          'p-3 rounded-xl flex gap-3 relative overflow-hidden transition-all border cursor-pointer',
          patient.id === selectedPatientId ? 'bg-blue-50 border-blue-400 shadow-sm ring-1 ring-blue-400' :
          patient.status === 'Completed' ? 'bg-white border-slate-100 opacity-60 hover:opacity-100' :
          'bg-white border-slate-200 hover:border-teal-400 hover:shadow-sm'
        ]"
      >
        <!-- Active Indicator Line -->
        <div v-if="patient.id === activePatientId" class="absolute right-0 top-0 bottom-0 w-1 bg-teal-500"></div>
        <div v-else-if="patient.id === selectedPatientId" class="absolute right-0 top-0 bottom-0 w-1 bg-blue-500"></div>

        <!-- Avatar -->
        <div :class="[
          'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0',
          patient.id === activePatientId ? 'bg-teal-500 text-white' :
          patient.status === 'Completed' ? 'bg-slate-100 text-slate-400' :
          'bg-amber-100 text-amber-700'
        ]">
          {{ patient.name.charAt(0) }}
        </div>

        <!-- Info -->
        <div class="flex-1">
          <div class="flex justify-between items-start">
            <h4 :class="['font-bold text-sm', patient.status === 'Completed' ? 'text-slate-500 line-through' : 'text-slate-800']">{{ patient.name }}</h4>
            <div class="flex items-center gap-1">
              <!-- زر فتح الملف للقائمة العادية -->
              <button
                type="button"
                @click.stop="openPatientFile(patient.id)"
                title="فتح الملف"
                class="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition"
              >
                <FolderOpen class="w-3.5 h-3.5" />
              </button>
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{{ patient.scheduledTime }}</span>
            </div>
          </div>
          <p class="text-[10px] text-slate-500 mt-1">{{ patient.gender === 'male' ? 'ذكر' : 'أنثى' }} • {{ patient.age }} سنة</p>

          <div v-if="patient.id === activePatientId" class="mt-2 text-[10px] font-bold text-teal-700 bg-white border border-teal-200 px-2 py-1 rounded-md inline-block">
            جاري الكشف الآن
          </div>
          <div v-else-if="patient.status === 'Completed'" class="mt-2 text-[10px] font-bold text-slate-400">
            تم إنهاء الجلسة
          </div>
          <div v-else class="mt-2 flex items-center gap-2">
            <span class="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">في الانتظار</span>
          </div>
        </div>
      </div>
    </div>

  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDoctorQueueStore } from '../../../stores/doctorQueueStore';
import { storeToRefs } from 'pinia';
import { ListOrdered, AlertTriangle, FolderOpen, Archive, Pill } from 'lucide-vue-next';
import { useOpenPatientFile } from '../composables/useOpenPatientFile';

const { openPatientFile } = useOpenPatientFile();
const doctorStore = useDoctorQueueStore();
const {
  queue, activePatientId, emergencyPatients, waitingPatients, completedPatients,
  startConsultation, selectedPatientId
} = storeToRefs(doctorStore);

// حالة الفلترة (الافتراضي الكل)
const activeFilter = ref<'all' | 'waiting' | 'completed'>('all');

// فلترة المرضى (باستثناء الطوارئ)
const filteredNormalPatients = computed(() => {
  let list = queue.value.filter(p => p.status !== 'Emergency');
  if (activeFilter.value === 'waiting') return list.filter(p => p.status === 'ArrivedWaiting' || p.status === 'InConsultation');
  if (activeFilter.value === 'completed') return list.filter(p => p.status === 'Completed');
  return list;
});
</script>
