<template>
  <div class="space-y-5 animate-in fade-in duration-300">

    <!-- 1. Header -->
    <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex justify-between items-center">
      <div>
        <h3 class="font-extrabold text-slate-800 flex items-center gap-2">
          <ClipboardList class="w-5 h-5 text-teal-600" />
          المهام والأدوية الموصوفة
        </h3>
        <p class="text-xs text-slate-500 mt-1">
          {{ isViewingPastDay ? 'استعراض سجل تاريخي (للقراءة فقط)' : 'بناء الخطة العلاجية للجلسة الحالية (مسودة)' }}
        </p>
      </div>

      <!-- زرار الإضافة: يظهر فقط في وضع المسودة -->
      <button
        v-if="!isViewingPastDay"
        @click="isAddTaskModalOpen = true"
        class="bg-purple-600 text-white font-bold px-4 py-2 rounded-xl shadow-md hover:bg-purple-700 transition flex items-center gap-2 text-sm"
      >
        <Plus class="w-4 h-4" /> إضافة مهمة
      </button>
    </div>

    <!-- 2. Habit Tracker Strip -->
    <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div class="flex justify-between items-center mb-6">
        <h4 class="text-sm font-bold text-slate-700">متتبع الالتزام بالأدوية والمهام</h4>
      </div>

      <div class="flex gap-5 overflow-x-auto py-4 px-4">
        <div
          v-for="day in mockDays"
          :key="day.date"
          @click="selectedDate = day.date"
          :class="[
            'min-w-[110px] p-5 rounded-2xl flex flex-col items-center cursor-pointer transition-all duration-200 border',
            selectedDate === day.date
              ? 'border-blue-500 ring-2 ring-blue-200 shadow-md bg-white'
              : 'border-slate-200 hover:border-blue-300',
            day.isToday ? 'bg-amber-50' :
            day.rate === 100 ? 'bg-emerald-50' :
            day.rate === 0 ? 'bg-rose-50' : 'bg-slate-50'
          ]"
        >
          <span class="text-xs font-bold mb-2 text-slate-600">{{ day.dayName }}</span>
          <span class="text-2xl font-extrabold mb-3 text-slate-800">{{ day.dateNum }}</span>
          <span class="text-xs font-extrabold" :class="day.rate === 100 ? 'text-emerald-600' : day.rate === 0 ? 'text-rose-600' : 'text-amber-600'">
            {{ day.rate }}%
          </span>
        </div>
      </div>
    </div>

    <!-- 3. المهام (تتغير حسب اليوم المختار) -->

    <!-- إذا كان اليوم السابق (أرشيف) -->
    <div v-if="isViewingPastDay" class="bg-slate-50 rounded-2xl border border-slate-200 shadow-sm overflow-hidden opacity-90">
      <div class="bg-slate-100 p-3 border-b border-slate-200 flex justify-between items-center">
        <h4 class="font-bold text-slate-700 text-sm flex items-center gap-2">
          <Lock class="w-4 h-4 text-slate-500" /> سجل يوم {{ selectedDate }} (مؤرشف - لا يمكن التعديل)
        </h4>
        <span class="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">Past</span>
      </div>

      <div v-if="pastTasks.length === 0" class="p-8 text-center text-slate-400">
        لا توجد مهام مسجلة في هذا اليوم.
      </div>
      <div v-else class="divide-y divide-slate-100 p-2">
        <div v-for="task in pastTasks" :key="task.id" class="p-3 flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-slate-200 text-slate-500 flex items-center justify-center">
              <Lock class="w-4 h-4" />
            </div>
            <div>
              <p class="text-sm font-bold text-slate-700">{{ task.title }}</p>
              <p class="text-[11px] text-slate-500">من روشتة: {{ task.prescription_id }}</p>
            </div>
          </div>
          <span class="text-xs bg-slate-200 text-slate-500 px-2 py-1 rounded">مؤرشف</span>
        </div>
      </div>
    </div>

    <!-- إذا كان اليوم الحالي (المسودة) -->
    <div v-else>
      <div v-if="currentTasks.length > 0" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="bg-purple-50 p-3 border-b border-purple-100 flex justify-between items-center">
          <h4 class="font-bold text-purple-800 text-sm flex items-center gap-2">
            <ListTodo class="w-4 h-4" /> المسودة الحالية (قابلة للتعديل)
          </h4>
          <span class="bg-purple-200 text-purple-800 text-xs font-bold px-2 py-0.5 rounded-full">{{ currentTasks.length }} بنود</span>
        </div>

        <div class="divide-y divide-slate-100 p-2">
          <div v-for="task in currentTasks" :key="task.id" class="p-3 flex justify-between items-center hover:bg-slate-50 rounded-xl group transition">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <CheckCircle2 class="w-4 h-4" />
              </div>
              <div>
                <p class="text-sm font-bold text-slate-800">{{ task.title }}</p>
                <p class="text-[11px] text-slate-500 mt-0.5">{{ task.instructions || 'بدون تعليمات' }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">لمدة {{ task.schedule?.duration_days || 7 }} أيام</span>
              <button @click="removeTask(task.id)" class="text-slate-300 hover:text-rose-500 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
        <ListTodo class="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <p class="text-sm text-slate-500 font-bold">لا توجد مهام في المسودة الحالية.</p>
      </div>
    </div>

    <!-- Modal -->
    <AddTaskModal
      :is-open="isAddTaskModalOpen"
      @close="isAddTaskModalOpen = false"
      @add-task="handleAddTask"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ClipboardList, Plus, ListTodo, CheckCircle2, Trash2, Lock } from 'lucide-vue-next';
import AddTaskModal from './modals/AddTaskModal.vue';
import { usePrescriptionDraftStore } from '../../../stores/prescriptionDraftStore';
import { usePrescriptionStore } from '../../../stores/prescriptionStore';
import { useDoctorQueueStore } from '../../../stores/doctorQueueStore';
import type { TaskData } from '../../../types/doctor';

const draftStore = usePrescriptionDraftStore();
const rxStore = usePrescriptionStore();
const queueStore = useDoctorQueueStore();

const isAddTaskModalOpen = ref(false);

// التواريخ (تجريبية - النهاردة 29 أكتوبر 2026)
const mockDays = ref([
  { date: '2026-10-23', dayName: 'الجمعة', dateNum: '3', rate: 100, isToday: false },
  { date: '2026-10-24', dayName: 'الخميس', dateNum: '2', rate: 60, isToday: false },
  { date: '2026-10-25', dayName: 'الأربعاء', dateNum: '1', rate: 0, isToday: false },
  { date: '2026-10-26', dayName: 'الثلاثاء', dateNum: '31', rate: 100, isToday: false },
  { date: '2026-10-27', dayName: 'الإثنين', dateNum: '30', rate: 100, isToday: false },
  { date: '2026-10-28', dayName: 'الأحد', dateNum: '29', rate: 60, isToday: true }, // النهاردة
]);

const selectedDate = ref<string>('2026-10-28');

// هل بنبص على يوم فات؟
const isViewingPastDay = computed(() => {
  return selectedDate.value < '2026-10-28';
});

// 1. المهام الخاصة بالمسودة الحالية (من الـ Draft Store)
const currentTasks = computed(() => {
  return draftStore.planItems.filter((item) => item.kind !== 'medication');
});

// 2. المهام الخاصة بالماضي (من الـ Prescription Store)
const pastTasks = computed(() => {
  if (!queueStore.selectedPatient) return [];

  // بنجيب كل الروشتات الخاصة بالمريض
  const patientRx = rxStore.prescriptions.filter(p => p.patient_id === queueStore.selectedPatient?.id);

  // بنفلترها عشان نجيب الروشتة اللي تاريخ بدايتها أو نهايتها بيغطي اليوم المختار
  const activeRxForDate = patientRx.filter(rx =>
    selectedDate.value >= rx.starts_on && selectedDate.value <= rx.ends_on
  );

  // بنجمع كل المهام من الروشتات دي
  return activeRxForDate.flatMap(rx =>
    rx.plan_items.filter(item => item.kind !== 'medication')
  );
});

function removeTask(id: string) {
  draftStore.removePlanItem(id);
}

function handleAddTask(taskData: TaskData) {
  draftStore.addPlanItem({
    kind: taskData.kind,
    title: taskData.title,
    instructions: taskData.instructions,
    schedule: {
      times: taskData.time ? [taskData.time] : [],
      recurrence: { kind: 'daily' },
      duration_days: taskData.duration
    }
  });
}
</script>
