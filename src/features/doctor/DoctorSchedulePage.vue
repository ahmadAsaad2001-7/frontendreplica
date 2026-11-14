<template>
  <div class="max-w-6xl mx-auto p-6 space-y-5" dir="rtl">
    <ScheduleModeSwitch v-model="mode" />

    <AgendaView v-if="mode === 'agenda'" />
    <AvailabilityView v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import ScheduleModeSwitch from './components/schedule/ScheduleModeSwitch.vue';
import AgendaView from './components/schedule/AgendaView.vue';
import AvailabilityView from './components/schedule/AvailabilityView.vue';
import { useDoctorAgendaStore } from '../../stores/doctorAgendaStore';
import { useCurrentDoctorId } from './composables/useCurrentDoctorId';

const mode = ref<'agenda' | 'availability'>('agenda');

// بدون تحديد الطبيب، الأجندة بتفضل فاضية (عمدًا)
const agenda = useDoctorAgendaStore();
const doctorId = useCurrentDoctorId();
watch(doctorId, id => agenda.setDoctorId(id), { immediate: true });
</script>
