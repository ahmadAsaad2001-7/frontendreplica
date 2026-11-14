<template>
  <header class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col gap-6 relative overflow-hidden">

    <!-- الصف العلوي: معلومات المريض والإجراءات -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 z-10">

      <!-- الجانب الأيمن: هوية المريض -->
      <div class="flex items-center gap-5 w-full md:w-auto">
        <!-- Avatar -->
        <div class="relative shrink-0">
          <img
            :src="patient.avatar || `https://i.pravatar.cc/150?u=${patient.name}`"
            class="w-20 h-20 rounded-2xl object-cover shadow-md border-2 border-white"
          />
          <span class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-[10px]">✓</span>
        </div>

        <!-- الاسم والبيانات الديموغرافية -->
        <div class="space-y-1.5">
          <div class="flex flex-wrap items-center gap-3">
            <h1 class="text-2xl font-extrabold text-slate-800 tracking-tight">{{ patient.name }}</h1>
            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-500 font-mono tracking-wider">
              {{ patient.mrn || 'MRN-2041' }}
            </span>
          </div>

          <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
            <span class="inline-flex items-center gap-1 font-medium">
              <User class="w-4 h-4 text-slate-400" />
              {{ patient.gender === 'male' ? 'ذكر' : patient.gender === 'female' ? 'أنثى' : '—' }} • {{ patient.age ?? 'غير متوفر' }} سنة
            </span>
            <span class="inline-flex items-center gap-1 font-medium bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md">
              <Droplet class="w-4 h-4" />
              فصيلة الدم: <strong class="font-mono">{{ patient.bloodType || 'O+' }}</strong>
            </span>
            <span class="inline-flex items-center gap-1 font-medium">
              <ShieldCheck class="w-4 h-4 text-emerald-500" />
              تأمين شامل
            </span>
          </div>
        </div>
      </div>

      <!-- الجانب الأيسر: المؤقت وأزرار الإجراءات -->
      <div class="flex items-center gap-4 w-full md:w-auto justify-end">
        <!-- Consultation Timer -->
        <div v-if="showTimer" class="bg-[#0b1220] rounded-2xl px-6 py-3 text-center shadow-lg border border-slate-800 flex flex-col items-center min-w-[140px]">
          <span class="text-[10px] text-slate-400 font-bold tracking-wider mb-1">CONSULTATION TIME</span>
          <span class="text-2xl font-mono font-bold text-emerald-400 leading-none">{{ timer }}</span>
          <span class="text-[9px] text-emerald-500 mt-1 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live
          </span>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col gap-2">
          <button @click="$emit('view-full-record')" class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 px-6 rounded-xl shadow-md transition flex items-center justify-center gap-2">
            <FileSpreadsheet class="w-4 h-4" /> السجل الكامل
          </button>
          <button @click="$emit('edit-patient')" class="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold py-2 px-6 rounded-xl transition flex items-center justify-center gap-2">
            <Edit3 class="w-4 h-4" /> تعديل
          </button>
        </div>
      </div>
    </div>

    <!-- الصف السفلي: الحساسية والأمراض المزمنة -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 z-10">

      <!-- قسم الحساسية -->
      <div class="bg-rose-50/50 rounded-2xl p-4 border border-rose-100">
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-sm font-bold text-rose-800 flex items-center gap-2">
            <AlertTriangle class="w-4 h-4" /> الحساسية المعروفة
          </h3>
        <button
  v-if="authStore.isDoctor && clinicalEditable"
  @click="$emit('add-allergy')"
  class="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-lg font-bold hover:bg-rose-200 transition flex items-center gap-1"
>
  <Plus class="w-3 h-3" /> إضافة حساسية
</button>
<span v-else class="text-[10px] text-slate-400 italic flex items-center gap-1">
  <Lock class="w-3 h-3" /> التعديل أثناء الكشف
</span>
        </div>
        <div class="flex flex-wrap gap-2">
          <span v-for="allergy in patient.allergies" :key="allergy" class="bg-white text-rose-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-rose-200 shadow-sm">
            {{ allergy }}
          </span>
          <span v-if="!patient.allergies || patient.allergies.length === 0" class="text-xs text-rose-400 italic">
            لا توجد حساسية مسجلة
          </span>
        </div>
      </div>

      <!-- قسم الأمراض المزمنة -->
      <div class="bg-blue-50/50 rounded-2xl p-4 border border-blue-100">
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-sm font-bold text-blue-800 flex items-center gap-2">
            <Activity class="w-4 h-4" /> الأمراض المزمنة
          </h3>
        <button
  v-if="authStore.isDoctor && clinicalEditable"
  @click="$emit('add-condition')"
  class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg font-bold hover:bg-blue-200 transition flex items-center gap-1"
>
  <Plus class="w-3 h-3" /> إضافة مرض مزمن
</button>
<span v-else class="text-[10px] text-slate-400 italic flex items-center gap-1">
  <Lock class="w-3 h-3" /> التعديل أثناء الكشف
</span>
        </div>
        <div class="flex flex-wrap gap-2">
          <span v-for="condition in patient.chronicConditions" :key="condition" class="bg-white text-blue-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-200 shadow-sm">
            {{ condition }}
          </span>
          <span v-if="!patient.chronicConditions || patient.chronicConditions.length === 0" class="text-xs text-blue-400 italic">
            لا توجد أمراض مزمنة مسجلة
          </span>
        </div>
      </div>

    </div>

  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import {
  User, Droplet, ShieldCheck, FileSpreadsheet, Edit3,
  AlertTriangle, Activity, Plus, Lock, // ✅ Lock كانت ناقصة
} from 'lucide-vue-next';
import { useAuthStore } from '../../../stores/authStore';

const props = withDefaults(defineProps<{
  patient: {
    name: string;
    mrn?: string;
    gender?: string;
    age?: number;
    bloodType?: string;
    avatar?: string;
    allergies?: string[];
    chronicConditions?: string[];
  };
  showTimer?: boolean;        // ✅ prop عليا وليس داخل patient
  clinicalEditable?: boolean; // ✅ prop عليا وليس داخل patient
}>(), {
  showTimer: true,        // محطة العمل تبقى كما كانت
  clinicalEditable: true, // محطة العمل تبقى كما كانت
});

defineEmits(['edit-patient', 'view-full-record', 'add-allergy', 'add-condition']);
const authStore = useAuthStore();

const timer = ref('00:00:00');
let totalSeconds = 0;
let interval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  if (!props.showTimer) return; // ✅ يقرأ الـ prop العليا
  interval = setInterval(() => {
    totalSeconds++;
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    timer.value = `${h}:${m}:${s}`;
  }, 1000);
});

onUnmounted(() => { if (interval) clearInterval(interval); });
</script>
