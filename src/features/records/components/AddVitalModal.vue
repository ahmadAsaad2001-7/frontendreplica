<template>
  <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden" dir="rtl">

      <div class="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h2 class="font-bold text-slate-800 text-lg flex items-center gap-2">
          <Activity class="w-5 h-5 text-emerald-600" /> تسجيل قياس حيوي جديد
        </h2>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-700">
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-6 space-y-4">
        <!-- Type -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">نوع القياس</label>
          <select v-model="form.type" class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 bg-slate-50">
            <option value="bp">ضغط الدم (BP)</option>
            <option value="hr">نبضات القلب (HR)</option>
            <option value="weight">الوزن (Weight)</option>
            <option value="glucose">سكر الدم (Glucose)</option>
          </select>
        </div>

        <!-- Value (Dynamic based on type) -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">
            القيمة ({{ form.type === 'bp' ? 'مثال: 120/80' : form.type === 'weight' ? 'بالكيلوجرام' : form.type === 'glucose' ? 'mg/dL' : 'نبضة/دقيقة' }})
          </label>
          <input
            v-model="form.value"
            type="text"
            placeholder="أدخل القيمة هنا..."
            class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 bg-slate-50 font-mono font-bold"
          >
        </div>

        <!-- Date -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">تاريخ ووقت القياس</label>
          <input
            v-model="form.date"
            type="date"
            class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 bg-slate-50"
          >
        </div>
      </div>

      <div class="p-4 border-t border-slate-100 bg-slate-50">
        <button
          @click="handleSave"
          :disabled="!form.value"
          class="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-emerald-700 transition disabled:opacity-50"
        >
          حفظ القياس
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { Activity, X } from 'lucide-vue-next';
import { useMedicalRecordStore } from '../../../stores/medicalRecordStore';
import { useProfileStore } from '../../../stores/profileStore';
import { todayIn } from '../../../core/domain/dates';

const emit = defineEmits(['close', 'saved']);
const recordStore = useMedicalRecordStore();
const profileStore = useProfileStore();

const form = reactive({
  type: 'bp' as 'bp' | 'hr' | 'weight' | 'glucose',
  value: '',
  date: todayIn(new Date())
});

function handleSave() {
  let finalValue = form.value;
  let unit = '';

  if (form.type === 'bp') unit = 'mmHg';
  else if (form.type === 'hr') unit = 'bpm';
  else if (form.type === 'weight') unit = 'kg';
  else if (form.type === 'glucose') unit = 'mg/dL';

  recordStore.addVital({
    patient_id: profileStore.activeProfileId,
    type: form.type,
    value: finalValue,
    unit,
    date: form.date
  });

  emit('saved');
  emit('close');
}
</script>
