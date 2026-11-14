<template>
  <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5 animate-in fade-in duration-300">

    <!-- Header -->
    <div class="flex justify-between items-center border-b border-slate-100 pb-3">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-xs">3</div>
        <h3 class="font-extrabold text-slate-800 text-sm">بناء المهام والأنشطة العلاجية (TASKS BUILDER)</h3>
      </div>
    </div>

    <!-- Add Task Button -->
    <div class="flex justify-end">
      <button
        @click="isAddTaskModalOpen = true"
        class="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-4 py-2 rounded-xl hover:bg-emerald-100 transition flex items-center gap-2 text-xs"
      >
        <Plus class="w-4 h-4" /> إضافة مهمة جديدة
      </button>
    </div>

    <!-- Tasks List -->
    <div v-if="draftTasks.length === 0" class="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
      <ListTodo class="w-8 h-8 mx-auto mb-2 opacity-50" />
      لا توجد مهام مضافة في الروشتة حتى الآن.
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="(task, index) in draftTasks"
        :key="task.id"
        class="border border-slate-200 rounded-xl p-4 relative bg-slate-50 hover:border-teal-300 transition group"
      >
        <!-- Delete Button -->
        <button
          @click="removeTask(task.id)"
          class="absolute top-3 left-3 text-rose-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition"
          title="حذف المهمة"
        >
          <Trash class="w-4 h-4" />
        </button>

        <div class="flex items-start gap-3">
          <!-- Task Number -->
          <div class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
            {{ index + 1 }}
          </div>

          <!-- Task Details -->
          <div class="flex-1">
            <h4 class="font-bold text-slate-800 text-sm">{{ task.title }}</h4>
            <p v-if="task.instructions" class="text-xs text-slate-500 mt-1 leading-relaxed">{{ task.instructions }}</p>

            <div class="flex items-center gap-4 mt-3 text-[11px] text-slate-500 font-bold">
              <span class="flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded">
                <Clock class="w-3 h-3 text-slate-400" />
                {{ task.frequency || 'يومياً' }}
              </span>
              <span class="flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded">
                <Calendar class="w-3 h-3 text-slate-400" />
                لمدة {{ task.schedule?.duration_days || 7 }} أيام
              </span>
              <span v-if="task.schedule?.times?.length > 0" class="flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded font-mono">
                <Timer class="w-3 h-3 text-slate-400" />
                {{ task.schedule.times.join(' - ') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Task Modal -->
    <AddTaskModal
      :is-open="isAddTaskModalOpen"
      @close="isAddTaskModalOpen = false"
      @add-task="handleAddTask"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Plus, ListTodo, Trash, Clock, Calendar, Timer } from 'lucide-vue-next';
import { usePrescriptionDraftStore } from '../../../stores/prescriptionDraftStore';
import type { TaskData } from '../../../types/doctor';
// استدعاء المودال اللي عملناه قبل كده
import AddTaskModal from './modals/AddTaskModal.vue';

const draftStore = usePrescriptionDraftStore();
const isAddTaskModalOpen = ref(false);

// بنجيب المهام بس (من غير الأدوية) من الـ Store
const draftTasks = computed(() => {
  return draftStore.planItems.filter(item => item.kind !== 'medication');
});

// إضافة مهمة جديدة
function handleAddTask(taskData: TaskData) {
  draftStore.addPlanItem({
    kind: taskData.kind,
    title: taskData.title,
    instructions: taskData.instructions,
    frequency: taskData.frequency, // الحقل الجديد اللي ضفناه
    schedule: {
      times: taskData.time ? [taskData.time] : [],
      recurrence: { kind: 'daily' },
      duration_days: taskData.duration
    }
  });
}

// حذف مهمة
function removeTask(id: string) {
  draftStore.removePlanItem(id);
}
</script>
