<template>
  <div class="h-full">
    <div v-if="!appointment" class="h-full min-h-[200px] flex flex-col items-center justify-center text-center text-slate-400 py-10">
      <UserRound class="w-10 h-10 mb-2 opacity-40" />
      <p class="text-sm font-medium">اختر مريضاً لعرض بياناته</p>
    </div>

    <div v-else class="space-y-4">
      <!-- Header -->
      <div class="flex items-center gap-3">
        <div
          :class="[
            'w-14 h-14 rounded-2xl flex items-center justify-center text-base font-bold shrink-0',
            appointment.patient.gender === 'female' ? 'bg-pink-100 text-pink-700' : 'bg-sky-100 text-sky-700',
          ]"
        >
          {{ initials(appointment.patient.name) }}
        </div>
        <div class="min-w-0">
          <h4 class="font-extrabold text-slate-800 truncate">{{ appointment.patient.name }}</h4>
          <span :class="['inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full', STATUS_META[appointment.status].badgeClass]">
            {{ STATUS_META[appointment.status].label }}
          </span>
        </div>
      </div>

      <!-- الموعد -->
      <div class="grid grid-cols-2 gap-3 text-xs">
        <div class="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <div class="text-slate-400 mb-0.5">الوقت</div>
          <div class="font-bold text-slate-800">{{ appointment.time }} - {{ appointment.end }}</div>
        </div>
        <div class="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <div class="text-slate-400 mb-0.5">سبب الزيارة</div>
          <div class="font-bold text-slate-800">{{ appointment.reason }}</div>
        </div>
      </div>

      <!-- بيانات المريض -->
      <div class="grid grid-cols-2 gap-y-2.5 gap-x-3 text-xs text-slate-600">
        <div v-if="appointment.patient.relation" class="flex items-center gap-2"><UserRound class="w-4 h-4 text-teal-600" /> {{ appointment.patient.relation }}</div>
        <div v-if="appointment.patient.age != null" class="flex items-center gap-2"><Cake class="w-4 h-4 text-teal-600" /> {{ appointment.patient.age }} سنة</div>
        <div v-if="appointment.patient.phone" class="flex items-center gap-2"><Phone class="w-4 h-4 text-teal-600" /> <span dir="ltr">{{ appointment.patient.phone }}</span></div>
        <div v-if="appointment.patient.bloodType" class="flex items-center gap-2">
          <Droplet class="w-4 h-4 text-rose-500" /> {{ appointment.patient.bloodType }}
        </div>
      </div>

      <div v-if="appointment.patient.allergies.length" class="space-y-1.5">
        <div class="text-[11px] font-bold text-slate-500">الحساسية</div>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="al in appointment.patient.allergies"
            :key="al"
            class="text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-1 rounded-lg"
          >{{ al }}</span>
        </div>
      </div>

      <div v-if="appointment.patient.chronicConditions.length" class="space-y-1.5">
        <div class="text-[11px] font-bold text-slate-500">أمراض مزمنة</div>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="c in appointment.patient.chronicConditions"
            :key="c"
            class="text-[11px] font-bold bg-orange-100 text-orange-800 px-2 py-1 rounded-lg"
          >{{ c }}</span>
        </div>
      </div>

      <!-- زر فتح ملف المريض -->
      <div>
        <button
          type="button"
          @click="openPatientFile(appointment.patientProfileId)"
          class="w-full py-2 bg-teal-50 text-teal-700 font-bold text-xs rounded-xl hover:bg-teal-100 transition flex items-center justify-center gap-1.5"
        >
          <FolderOpen class="w-3.5 h-3.5" /> فتح ملف المريض
        </button>
      </div>

      <!-- إجراءات -->
      <div v-if="canConfirm || canCancel" class="flex gap-2 pt-3 border-t border-slate-100">
        <button
          v-if="canConfirm"
          type="button"
          @click="emit('set-status', appointment.id, 'confirmed')"
          class="flex-1 py-2.5 bg-teal-600 text-white font-bold text-xs rounded-xl hover:bg-teal-700 transition"
        >
          تأكيد الموعد
        </button>
        <button
          v-if="canCancel"
          type="button"
          @click="emit('set-status', appointment.id, 'cancelled')"
          class="flex-1 py-2.5 bg-rose-50 text-rose-700 font-bold text-xs rounded-xl hover:bg-rose-100 transition"
        >
          إلغاء الموعد
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { UserRound, Cake, Phone, Droplet, FolderOpen } from 'lucide-vue-next';
import type { Appointment, AppointmentStatus } from '../../../../types/appointment';
import { STATUS_META, initials } from '../../../../utils/appointments';
import { useOpenPatientFile } from '../../composables/useOpenPatientFile';

const { openPatientFile } = useOpenPatientFile();

const props = defineProps<{
  appointment: Appointment | null;
}>();

const emit = defineEmits<{
  'set-status': [id: string, status: AppointmentStatus];
}>();

const canConfirm = computed(() =>
  props.appointment?.status === 'pending' || props.appointment?.status === 'needs_reschedule'
);
const canCancel = computed(() =>
  !!props.appointment && !['cancelled', 'completed', 'no_show'].includes(props.appointment.status)
);
</script>
