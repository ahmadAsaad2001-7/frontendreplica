<template>
  <div v-if="isOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]" dir="rtl">

      <!-- Header -->
      <div class="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
        <h2 class="font-bold text-slate-800 text-lg flex items-center gap-2">
          <ListTodo class="w-5 h-5 text-emerald-600" /> إضافة مهمة جديدة لخطة المريض
        </h2>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-700 bg-white p-1.5 rounded-lg transition">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Scrollable Body -->
      <div class="p-6 overflow-y-auto flex-1 space-y-6">

        <!-- 1. القوالب الجاهزة -->
        <div v-if="templatesStore.defaultTemplates.length > 0">
          <label class="block text-xs font-bold text-slate-700 mb-3">📦 قوالب جاهزة (من النظام):</label>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
            <button
              v-for="template in templatesStore.defaultTemplates"
              :key="template.id"
              @click="selectTemplate(template)"
              class="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-2 rounded-xl transition text-right"
            >
              {{ template.title }}
            </button>
          </div>
        </div>

        <!-- 2. القوالب العامة (من أطباء آخرين) -->
        <div v-if="templatesStore.publicTemplates.length > 0">
          <label class="block text-xs font-bold text-slate-700 mb-3">🌟 قوالب مشتركة (من أطباء آخرين):</label>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
            <div v-for="template in templatesStore.publicTemplates" :key="template.id" class="relative group">
              <button
                @click="selectTemplate(template)"
                class="w-full text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-2 rounded-xl transition text-right"
              >
                {{ template.title }}
                <span class="block text-[9px] text-blue-500 mt-0.5">بواسطة {{ template.createdBy }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 3. القوالب المخصصة (الخاصة بالطبيب) -->
        <div v-if="templatesStore.privateTemplates.length > 0">
          <label class="block text-xs font-bold text-slate-700 mb-3">⭐ قوالبك المخصصة:</label>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
            <div v-for="template in templatesStore.privateTemplates" :key="template.id" class="relative group">
              <button
                @click="selectTemplate(template)"
                class="w-full text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-3 py-2 rounded-xl transition text-right"
              >
                {{ template.title }}
              </button>
              <div class="absolute -top-2 -left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  @click="templatesStore.togglePublic(template.id)"
                  class="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                  title="اجعله عاماً"
                >
                  <Globe class="w-3 h-3 text-white" />
                </button>
                <button
                  @click="deleteTemplate(template.id)"
                  class="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center"
                  title="حذف"
                >
                  <X class="w-3 h-3 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. اسم المهمة -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-2">
            <span class="text-rose-500">*</span> اسم المهمة:
          </label>
          <input
            v-model="formData.title"
            type="text"
            placeholder="تمرين التمدد والإطالة القطنية..."
            class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50"
          >
        </div>

        <!-- 5. تفاصيل المهمة -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-2">
            <span class="text-rose-500">*</span> تفاصيل المهمة وتوجيهات المريض:
          </label>
          <textarea
            v-model="formData.instructions"
            rows="3"
            placeholder="اكتب شرحاً تفصيلياً لطريقة تنفيذ المهمة..."
            class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50 resize-none"
          ></textarea>
        </div>

        <!-- 6. معدل التكرار -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-2">معدل التكرار:</label>
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="freq in frequencyOptions"
              :key="freq.value"
              @click="formData.frequency = freq.value"
              :class="[
                'px-4 py-2 rounded-xl text-xs font-bold transition border',
                formData.frequency === freq.value
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              ]"
            >
              {{ freq.label }}
            </button>
          </div>
        </div>

        <!-- 7. مدة العلاج (تظهر عند اختيار مخصص) -->
        <div v-if="formData.frequency === 'custom'" class="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <label class="block text-xs font-bold text-slate-700 mb-2">مدة العلاج (بالأيام):</label>
          <input
            v-model="treatmentDuration"
            type="number"
            min="1"
            max="365"
            class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 bg-white"
          >
        </div>

        <!-- 8. شبكة أيام فترة العلاج -->
        <div v-if="formData.frequency === 'custom' && treatmentDuration > 0" class="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <label class="block text-xs font-bold text-slate-700 mb-3">اختر أيام التنفيذ من فترة العلاج:</label>
          <div class="grid grid-cols-7 gap-2 max-h-48 overflow-y-auto">
            <button
              v-for="day in treatmentDuration"
              :key="day"
              @click="toggleDay(day)"
              :class="[
                'px-2 py-2 rounded-lg text-xs font-bold transition border',
                selectedDays.includes(day)
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              ]"
            >
              يوم {{ day }}
            </button>
          </div>
        </div>

        <!-- 9. التكرار اليومي والتوقيت -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-2">التكرار اليومي:</label>
            <select
              v-model="formData.dailyFrequency"
              class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 bg-white"
            >
              <option value="1">مرة واحدة باليوم</option>
              <option value="2">مرتين باليوم</option>
              <option value="3">3 مرات باليوم</option>
              <option value="4">4 مرات باليوم</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-2">التوقيت:</label>
            <div class="flex gap-2">
              <button
                @click="formData.timeOfDay = 'morning'"
                :class="[
                  'flex-1 px-3 py-2 rounded-xl text-xs font-bold transition border',
                  formData.timeOfDay === 'morning'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                ]"
              >
                صباحاً
              </button>
              <button
                @click="formData.timeOfDay = 'evening'"
                :class="[
                  'flex-1 px-3 py-2 rounded-xl text-xs font-bold transition border',
                  formData.timeOfDay === 'evening'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                ]"
              >
                مساءً
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
        <button
          @click="saveAsTemplate"
          :disabled="!formData.title"
          class="px-4 py-2 bg-amber-500 text-white font-bold rounded-xl text-sm hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
        >
          <Star class="w-4 h-4" /> حفظ كقالب جديد
        </button>

        <div class="flex gap-2">
          <button @click="$emit('close')" class="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition">
            إلغاء
          </button>
          <button
            @click="handleSave"
            :disabled="!formData.title"
            class="px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            <Check class="w-4 h-4" /> حفظ المهمة في الخطة ✓
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ListTodo, X, Check, Star, Globe } from 'lucide-vue-next';
import { useTaskTemplatesStore } from "../../../../stores/taskTemplatesStore";
import type { TaskData } from '../../../types/doctor';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'add-task', task: TaskData): void;
}>();

const templatesStore = useTaskTemplatesStore();

const frequencyOptions = [
  { value: 'daily', label: 'يومي' },
  { value: 'every_2_days', label: 'كل يومين' },
  { value: 'once', label: 'مرة واحدة' },
  { value: 'custom', label: 'مخصص' },
];

const formData = reactive({
  title: '',
  instructions: '',
  frequency: 'daily',
  dailyFrequency: '1',
  timeOfDay: 'morning',
});

const treatmentDuration = ref(7);
const selectedDays = ref<number[]>([]);

function selectTemplate(template: any) {
  formData.title = template.title;
  formData.instructions = template.instructions;
  formData.frequency = template.frequency || 'daily';
}

function toggleDay(day: number) {
  const index = selectedDays.value.indexOf(day);
  if (index > -1) {
    selectedDays.value.splice(index, 1);
  } else {
    selectedDays.value.push(day);
  }
}

function deleteTemplate(id: string) {
  if (confirm('هل أنت متأكد من حذف هذا القالب؟')) {
    templatesStore.removeCustomTemplate(id);
  }
}

function saveAsTemplate() {
  if (!formData.title) return;

  templatesStore.addCustomTemplate({
    title: formData.title,
    instructions: formData.instructions,
    frequency: formData.frequency,
    kind: 'care',
    isPublic: false,
    createdBy: 'د. أحمد', // يمكن استبداله بـ authStore.currentUser.name
  });

  alert('تم حفظ القالب بنجاح! ✨');
}

function handleSave() {
  if (!formData.title) return;

  const taskData: TaskData = {
    title: formData.title,
    kind: 'care',
    frequency: formData.frequency === 'daily' ? 'يومياً' :
               formData.frequency === 'every_2_days' ? 'كل يومين' :
               formData.frequency === 'once' ? 'مرة واحدة' :
               `أيام: ${selectedDays.value.join(', ')}`,
    duration: treatmentDuration.value,
    time: formData.timeOfDay === 'morning' ? '08:00' : '20:00',
    instructions: formData.instructions,
  };

  emit('add-task', taskData);
  emit('close');

  // تصفير النموذج
  formData.title = '';
  formData.instructions = '';
  formData.frequency = 'daily';
  selectedDays.value = [];
  treatmentDuration.value = 7;
  formData.dailyFrequency = '1';
  formData.timeOfDay = 'morning';
}
</script>
