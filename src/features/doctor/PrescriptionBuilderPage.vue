<template>
  <div class="min-h-screen bg-slate-100 p-6" dir="rtl">
    <div class="max-w-5xl mx-auto space-y-6">

      <!-- Header -->
      <div class="flex justify-between items-center bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
        <div class="flex items-center gap-4">
          <button @click="$router.push('/doctor/workbench')" class="p-2 hover:bg-slate-100 rounded-xl transition">
            <ArrowRight class="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 class="text-xl font-extrabold text-slate-800">بناء الروشتة الطبية</h1>
            <p class="text-xs text-slate-500 mt-1">للمريض: {{ queueStore.activePatient?.name }}</p>
          </div>
        </div>
        <div class="flex gap-2">
          <button @click="draftStore.resetDraft" class="px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition">إلغاء المسودة</button>
        </div>
      </div>

      <!-- Prescription Template Bar -->
      <PrescriptionTemplateBar />

      <!-- 1. Clinical Info -->
      <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
        <h2 class="text-sm font-bold text-emerald-600 border-b border-slate-100 pb-2">1. بيانات الروشتة الأساسية</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-xs font-bold text-slate-700 mb-1">التشخيص (ICD-10)</label>
            <input v-model="draftStore.diagnosis" type="text" placeholder="مثال: التهاب الجيوب الأنفية" class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 bg-slate-50">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">تاريخ البداية</label>
            <input v-model="draftStore.startDate" type="date" class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 bg-slate-50">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">تاريخ النهاية</label>
            <input v-model="draftStore.endDate" type="date" class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 bg-slate-50">
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-bold text-slate-700 mb-1">تعليمات عامة للمريض</label>
            <textarea v-model="draftStore.generalInstructions" rows="2" placeholder="مثال: الإكثار من السوائل..." class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 bg-slate-50 resize-none"></textarea>
          </div>
        </div>
      </div>

      <!-- 2. Builder Area (Tasks & Drugs) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- Tasks Builder -->
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
          <h2 class="text-sm font-bold text-emerald-600 border-b border-slate-100 pb-2 flex justify-between items-center">
            2. المهام والأنشطة العلاجية
            <button class="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded">+ إضافة مهمة</button>
          </h2>

          <div class="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
            <input v-model="newTaskTitle" type="text" placeholder="اسم المهمة (مثال: تمرين إطالة)" class="w-full p-2 border border-slate-200 rounded-lg text-sm">
            <div class="flex gap-2">
              <select v-model="newTaskFreq" class="w-1/2 p-2 border border-slate-200 rounded-lg text-sm bg-white">
                <option value="daily">يومياً</option>
                <option value="weekly">أسبوعياً</option>
              </select>
              <button @click="handleAddTask" class="w-1/2 bg-slate-800 text-white font-bold rounded-lg text-sm hover:bg-slate-900">إضافة</button>
            </div>
          </div>

          <div v-for="item in draftStore.planItems.filter(i => i.kind !== 'medication')" :key="item.id" class="flex justify-between items-center p-3 border border-slate-100 rounded-xl bg-white shadow-sm">
            <span class="text-sm font-bold text-slate-700">{{ item.title }}</span>
            <button @click="draftStore.removePlanItem(item.id)" class="text-rose-500 hover:bg-rose-50 p-1 rounded"><Trash2 class="w-4 h-4" /></button>
          </div>
        </div>

        <!-- Drugs Builder -->
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
          <h2 class="text-sm font-bold text-blue-600 border-b border-slate-100 pb-2 flex justify-between items-center">
            3. الأدوية الموصوفة
            <button class="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">+ إضافة دواء</button>
          </h2>

          <!-- Allergy Warning -->
          <div v-if="draftStore.allergyWarning" class="bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-start gap-2 text-rose-700 text-xs font-bold">
            <AlertTriangle class="w-4 h-4 shrink-0" />
            {{ draftStore.allergyWarning }}
          </div>

          <div class="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
            <input v-model="newDrugTitle" type="text" placeholder="اسم الدواء (مثال: أوجمنتين)" class="w-full p-2 border border-slate-200 rounded-lg text-sm">
            <div class="flex gap-2">
              <input v-model="newDrugDuration" type="number" placeholder="المدة (أيام)" class="w-1/2 p-2 border border-slate-200 rounded-lg text-sm">
              <button @click="handleAddDrug" class="w-1/2 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700">إضافة</button>
            </div>
          </div>

          <div v-for="item in draftStore.planItems.filter(i => i.kind === 'medication')" :key="item.id" class="flex justify-between items-center p-3 border border-slate-100 rounded-xl bg-white shadow-sm">
            <div>
              <p class="text-sm font-bold text-slate-800">{{ item.title }}</p>
              <p class="text-[10px] text-slate-500">المدة: {{ item.schedule.duration_days }} يوم</p>
            </div>
            <button @click="draftStore.removePlanItem(item.id)" class="text-rose-500 hover:bg-rose-50 p-1 rounded"><Trash2 class="w-4 h-4" /></button>
          </div>
        </div>

      </div>

      <!-- Footer Action -->
      <div class="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex justify-between items-center">
        <p class="text-xs text-slate-500 flex items-center gap-2">
          <Lock class="w-4 h-4 text-slate-400" />
          بمجرد التوقيع، تصبح الروشتة مستنداً طبياً غير قابل للتعديل (Immutable).
        </p>
        <button
          @click="handleSign"
          :disabled="draftStore.planItems.length === 0 || !draftStore.diagnosis"
          class="bg-emerald-600 text-white font-extrabold px-8 py-3 rounded-xl shadow-lg hover:bg-emerald-700 transition disabled:opacity-50 flex items-center gap-2"
        >
          <FileSignature class="w-5 h-5" /> توقيع وإصدار الروشتة
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePrescriptionDraftStore } from '../../stores/prescriptionDraftStore';
import { useDoctorQueueStore } from '../../stores/doctorQueueStore';
import PrescriptionTemplateBar from './components/library/PrescriptionTemplateBar.vue';
import { ArrowRight, Trash2, AlertTriangle, Lock, FileSignature } from 'lucide-vue-next';

const router = useRouter();
const draftStore = usePrescriptionDraftStore();
const queueStore = useDoctorQueueStore();

const newTaskTitle = ref('');
const newTaskFreq = ref('daily');

const newDrugTitle = ref('');
const newDrugDuration = ref(7);

function handleAddTask() {
  if (!newTaskTitle.value) return;
  draftStore.addPlanItem({
    kind: 'care',
    title: newTaskTitle.value,
    schedule: { times: ['08:00'], recurrence: { kind: 'daily' } }
  });
  newTaskTitle.value = '';
}

function handleAddDrug() {
  if (!newDrugTitle.value) return;
  draftStore.addPlanItem({
    kind: 'medication',
    title: newDrugTitle.value,
    schedule: { times: ['12:00'], recurrence: { kind: 'daily' }, duration_days: Number(newDrugDuration.value) }
  });
  newDrugTitle.value = '';
}

function handleSign() {
  draftStore.issuePrescription();
  alert('تم التوقيع والإصدار بنجاح! تم تحويل المريض للمريض وإضافة الروشتة لسجله.');
  router.push('/doctor/workbench');
}
</script>
