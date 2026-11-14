<template>
  <div class="max-w-6xl mx-auto space-y-6" dir="rtl">

    <!-- شريط العائلة -->
    <div class="bg-white rounded-2xl p-3 flex items-center gap-3 shadow-sm border border-slate-100 overflow-x-auto">
      <div
        v-for="profile in profileStore.profiles"
        :key="profile.id"
        @click="profileStore.setActiveProfile(profile.id)"
        :class="[
          'min-w-[140px] flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all border',
          profileStore.activeProfileId === profile.id ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm' : 'bg-white border-slate-200 hover:bg-slate-50'
        ]"
      >
        <div class="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
          {{ profile.name.charAt(0) }}
        </div>
        <div>
          <h4 class="text-sm font-bold">{{ profile.relation }}</h4>
          <p :class="profileStore.activeProfileId === profile.id ? 'text-emerald-100' : 'text-slate-500'" class="text-[10px] font-semibold">
            {{ profile.name }}
          </p>
        </div>
      </div>
    </div>

    <!-- لو مفيش كورس متفتح، نعرض قائمة الكورسات -->
    <div v-if="!selectedCourseId" class="space-y-6">

      <!-- التابات -->
      <div class="flex bg-slate-200/60 p-1 rounded-xl w-full max-w-md mx-auto">
        <button @click="activeTab = 'active'" :class="activeTab === 'active' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'" class="flex-1 font-bold py-2.5 rounded-lg text-sm transition">
          الكورسات الجارية ({{ activeCourses.length }})
        </button>
        <button @click="activeTab = 'completed'" :class="activeTab === 'completed' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'" class="flex-1 font-bold py-2.5 rounded-lg text-sm transition">
          الكورسات المنتهية ({{ completedCourses.length }})
        </button>
      </div>

      <!-- عرض الكروت -->
      <div v-if="displayedCourses.length === 0" class="text-center p-12 bg-white rounded-3xl border border-slate-100 text-slate-500">
        <FileText class="w-16 h-16 mx-auto mb-4 opacity-20" />
        <h3 class="text-lg font-bold">لا توجد كورسات هنا</h3>
        <p class="text-sm mt-1">لم يتم إضافة أي روشتات لهذا الفرد في هذا القسم.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="rx in displayedCourses"
          :key="rx.id"
          @click="selectedCourseId = rx.id"
          class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div class="flex justify-between items-start mb-3">
            <div class="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded-lg">
              {{ rx.status === 'active' ? 'نشط الآن' : 'منتهي' }}
            </div>
            <span class="text-xs font-mono text-slate-400">{{ rx.id }}</span>
          </div>
          <h3 class="text-lg font-bold text-slate-800 group-hover:text-emerald-600 transition mb-2">{{ rx.title }}</h3>
          <p class="text-sm text-slate-500 mb-4 line-clamp-2">التشخيص: {{ rx.plan_items.length }} عناصر علاجية</p>

          <div class="flex items-center justify-between border-t border-slate-100 pt-3">
            <span class="text-xs text-slate-400">تاريخ البدء: {{ rx.starts_on }}</span>
            <span class="text-emerald-600 text-sm font-bold flex items-center gap-1">
              عرض التفاصيل <ChevronLeft class="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- لو فيه كورس متفتح، نعرض التفاصيل (المهام والمتتبع) -->
    <div v-else class="space-y-6 animate-in slide-in-from-left-4 duration-300">

      <button @click="selectedCourseId = null" class="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition">
        <ArrowRight class="w-4 h-4" /> العودة لقائمة الكورسات
      </button>

      <!-- هنا بنستخدم الـ Composable اللي عملناه عشان نجيب المهام -->
      <div v-if="prescription" class="space-y-6">

        <!-- Course Header -->
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-2 h-full bg-emerald-500"></div>
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-2xl font-extrabold text-slate-800 mb-2">{{ prescription.title }}</h1>
              <p class="text-sm text-slate-500">تاريخ البداية: {{ prescription.starts_on }}</p>
            </div>
            <div class="text-center bg-slate-50 p-3 rounded-2xl border border-slate-100 min-w-[120px]">
              <span class="block text-xs font-bold text-slate-500 mb-1">الالتزام الكلي</span>
              <span class="text-2xl font-extrabold text-emerald-600">{{ overallAdherence === null ? '0' : overallAdherence }}%</span>
            </div>
          </div>
        </div>

        <!-- Habit Tracker -->
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 class="text-lg font-bold mb-4">متتبع الالتزام</h2>
          <div class="flex gap-2 overflow-x-auto pb-2">
            <div
              v-for="day in habitWindow"
              :key="day.date"
              @click="selectedDate = day.date"
              :class="[
                'min-w-[80px] p-3 rounded-2xl flex flex-col items-center cursor-pointer border transition-all',
                selectedDate === day.date ? 'border-emerald-500 ring-2 ring-emerald-200 bg-emerald-50' : 'border-slate-100 hover:bg-slate-50',
                day.status === 'completed' ? 'bg-emerald-50' : '',
                day.status === 'missed' ? 'bg-rose-50' : ''
              ]"
            >
              <span class="text-xs font-bold text-slate-500">{{ day.date }}</span>
              <span class="text-lg font-extrabold mt-1">{{ day.rate === null ? '-' : `${day.rate}%` }}</span>
            </div>
          </div>
        </div>

        <!-- Task List -->
        <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div class="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h2 class="text-lg font-bold text-slate-800">مهام يوم {{ selectedDate }}</h2>
            <span class="text-sm font-bold text-emerald-600">{{ tasksForSelectedDate.length }} مهام</span>
          </div>

          <div v-if="tasksForSelectedDate.length === 0" class="p-8 text-center text-slate-400">
            لا توجد مهام في هذا اليوم.
          </div>

          <div v-else class="divide-y divide-slate-100">
            <div
              v-for="task in tasksForSelectedDate"
              :key="task.task_id"
              class="p-5 flex items-start gap-4 hover:bg-slate-50/50 transition"
            >
              <input
                type="checkbox"
                :checked="task.completed"
                @change="toggleTask(task.task_id, !task.completed)"
                :disabled="task.readonly"
                class="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 mt-1 cursor-pointer"
              />
              <div>
                <h3 :class="['font-bold text-lg', task.completed ? 'text-slate-400 line-through' : 'text-slate-800']">
                  {{ task.title }}
                </h3>
                <p v-if="task.time" class="text-sm text-slate-500">{{ task.time }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useProfileStore } from '../../stores/profileStore';
import { usePrescriptionStore } from '../../stores/prescriptionStore';
import { useCourseProjection } from '../../core/composables/useCourseProjection';
import { FileText, ChevronLeft, ArrowRight } from 'lucide-vue-next';

const profileStore = useProfileStore();
const rxStore = usePrescriptionStore();

// State
const activeTab = ref<'active' | 'completed'>('active');
const selectedCourseId = ref<string | null>(null);

// 1. الفلترة بناءً على المريض النشط
const patientPrescriptions = computed(() => {
  return rxStore.getPrescriptionsForPatient(profileStore.activeProfileId);
});

const activeCourses = computed(() => patientPrescriptions.value.filter(p => p.status === 'active'));
const completedCourses = computed(() => patientPrescriptions.value.filter(p => p.status === 'completed'));

const displayedCourses = computed(() => {
  return activeTab.value === 'active' ? activeCourses.value : completedCourses.value;
});

// 2. ربط الـ Composable بالكورس المختار
// بنستخدم دالة عشان نمرر الـ ID للـ Composable (بس في Vue Composition API، بنستخدم computed عشان نعمل reactivity)
const selectedCourse = computed(() =>
  patientPrescriptions.value.find(p => p.id === selectedCourseId.value) || null
);

// هنا بنعمل instance من الـ Composable بناءً على الكورس المختار
// ملاحظة: الـ Composable بياخد الـ ID كـ argument، فلو الـ ID اتغير بيتحدث تلقائياً.
// للحفاظ على الـ reactivity، بنستخدم دالة مساعدة جوه الـ setup.
const courseProjection = computed(() => {
  if (!selectedCourseId.value) return null;
  return useCourseProjection(selectedCourseId.value);
});

// نفكك القيم عشان نستخدمها في الـ template
const prescription = computed(() => courseProjection.value?.prescription.value);
const selectedDate = computed({
  get: () => courseProjection.value?.selectedDate.value || '',
  set: (val) => { if(courseProjection.value) courseProjection.value.selectedDate.value = val }
});
const tasksForSelectedDate = computed(() => courseProjection.value?.tasksForSelectedDate.value || []);
const overallAdherence = computed(() => courseProjection.value?.overallAdherence.value);
const habitWindow = computed(() => courseProjection.value?.habitWindow.value || []);
const toggleTask = (taskId: string, completed: boolean) => {
  courseProjection.value?.toggleTask(taskId, completed);
};
</script>
