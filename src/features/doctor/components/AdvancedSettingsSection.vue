<template>
  <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 animate-in fade-in duration-300">

    <!-- Header -->
    <div class="flex justify-between items-center border-b border-slate-100 pb-3">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-xs">5</div>
        <h3 class="font-extrabold text-slate-800 text-sm">تخصيص واستثناءات جدول الأيام (ADVANCED SETTINGS)</h3>
      </div>
    </div>

    <p class="text-xs text-slate-500">اختر يوماً محدداً لتعديل جرعة دواء أو إضافة تعليمات استثنائية له فقط (لن يؤثر على باقي الأيام).</p>

    <!-- Days Strip -->
    <div class="flex gap-2 overflow-x-auto pb-2">
      <button
        v-for="day in totalDays"
        :key="day"
        @click="selectedDay = day"
        :class="[
          'min-w-[60px] py-2 rounded-xl text-xs font-bold border transition-all',
          selectedDay === day ? 'bg-teal-600 text-white border-teal-600 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-teal-300'
        ]"
      >
        اليوم {{ day }}
      </button>
    </div>

    <!-- Exception Editor -->
    <div v-if="selectedDay" class="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 mt-2">

      <!-- Existing Exception View -->
      <div v-if="currentException" class="flex justify-between items-start bg-white p-3 rounded-lg border border-orange-200">
        <div>
          <span class="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded mb-1 inline-block">{{ currentException.type }}</span>
          <p class="text-sm font-bold text-slate-800">{{ currentException.note }}</p>
        </div>
        <button @click="removeCurrentException" class="text-rose-500 hover:bg-rose-50 p-1.5 rounded transition" title="حذف الاستثناء">
          <Trash2 class="w-4 h-4" />
        </button>
      </div>

      <!-- Add/Edit Form -->
      <div v-else class="space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">نوع الاستثناء</label>
            <select v-model="newException.type" class="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-teal-500">
              <option value="تعديل جرعة">تعديل جرعة دواء</option>
              <option value="تعليمة إضافية">تعليمة إضافية</option>
              <option value="إيقاف مؤقت">إيقاف مهمة/دواء</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">ملاحظة أو تفاصيل</label>
            <input v-model="newException.note" type="text" placeholder="مثال: تخفيض جرعة المسكن للنصف..." class="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-teal-500">
          </div>
        </div>
        <button
          @click="saveException"
          :disabled="!newException.note"
          class="bg-orange-500 text-white font-bold px-4 py-2 rounded-lg text-xs hover:bg-orange-600 disabled:opacity-50 transition w-full"
        >
          إضافة استثناء لهذا اليوم
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Trash2 } from 'lucide-vue-next';
import { usePrescriptionDraftStore, type DayException } from '../../../stores/prescriptionDraftStore';

const draftStore = usePrescriptionDraftStore();

// حساب عدد الأيام بناءً على تاريخ البداية والنهاية
const totalDays = computed(() => {
  if (!draftStore.startDate || !draftStore.endDate) return 7; // افتراضي
  const start = new Date(draftStore.startDate);
  const end = new Date(draftStore.endDate);
  const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 7;
});

const selectedDay = ref<number | null>(null);
const newException = ref({ type: 'تعديل جرعة', note: '' });

// هل فيه استثناء موجود لليوم المختار؟
const currentException = computed(() => {
  return draftStore.dayExceptions.find(e => e.dayNumber === selectedDay.value);
});

function saveException() {
  if (!selectedDay.value || !newException.value.note) return;

  draftStore.addException({
    dayNumber: selectedDay.value,
    type: newException.value.type,
    note: newException.value.note
  });

  newException.value.note = ''; // تصفير
}

function removeCurrentException() {
  if (selectedDay.value) {
    draftStore.removeException(selectedDay.value);
  }
}
</script>
