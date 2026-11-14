<template>
  <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">

    <!-- Header -->
    <div class="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
      <h2 class="text-lg font-extrabold text-slate-800 flex items-center gap-2">
        <FileText class="w-5 h-5 text-emerald-600" />
        سجل التشخيصات (Append-Only)
      </h2>
      <span class="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1 rounded-lg">
        {{ diagnoses.length }} تشخيصات مسجلة
      </span>
    </div>

    <!-- Empty State -->
    <div v-if="diagnoses.length === 0" class="text-center py-10 text-slate-400">
      <FileText class="w-12 h-12 mx-auto mb-3 opacity-20" />
      <p class="text-sm font-bold">لا توجد تشخيصات سابقة</p>
      <p class="text-xs mt-1">قم بإضافة تشخيص جديد من النموذج أعلاه.</p>
    </div>

    <!-- Timeline List -->
    <div v-else class="space-y-4">
      <div
        v-for="diag in diagnoses"
        :key="diag.id"
        class="border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow group"
      >
        <!-- Top Row: Date & Status & ICD -->
        <div class="flex justify-between items-start mb-3">
          <div class="flex items-center gap-3">
            <span class="text-xs font-bold text-slate-500 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
              <Calendar class="w-3.5 h-3.5" /> {{ diag.date }}
            </span>
            <span :class="getStatusColor(diag.status)" class="text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 border">
              <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDot(diag.status)"></span>
              {{ diag.status }}
            </span>
          </div>
          <div class="bg-blue-50 text-blue-700 font-mono text-xs font-bold px-3 py-1 rounded-lg border border-blue-100">
            ICD-10: {{ diag.icd10 }}
          </div>
        </div>

        <!-- Title & Doctor -->
        <h3 class="text-lg font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
          {{ diag.title }}
        </h3>
        <p class="text-xs text-slate-500 font-bold mb-4 flex items-center gap-1.5">
          <Stethoscope class="w-3.5 h-3.5" /> {{ diag.doctorName }} - {{ diag.specialty }}
        </p>

        <!-- Notes -->
        <div class="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 leading-relaxed mb-4">
          {{ diag.notes }}
        </div>

        <!-- Attachments & Actions -->
        <div class="flex justify-between items-center border-t border-slate-100 pt-3">
          <div class="flex gap-2">
            <button
              v-for="att in diag.attachments"
              :key="att.name"
              class="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 transition"
            >
              <Paperclip class="w-3.5 h-3.5 text-blue-500" /> {{ att.name }}
            </button>
          </div>

          <button
            @click="$emit('select-diagnosis', diag)"
            class="text-xs text-blue-600 font-bold flex items-center gap-1 hover:underline"
          >
            عرض التفاصيل الكاملة <ChevronLeft class="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { FileText, Calendar, Stethoscope, Paperclip, ChevronLeft } from 'lucide-vue-next';

// تعريف شكل البيانات
interface Diagnosis {
  id: string;
  date: string;
  status: 'active' | 'managed' | 'resolved';
  icd10: string;
  title: string;
  doctorName: string;
  specialty: string;
  notes: string;
  attachments: { name: string; type: string }[];
}

defineProps<{
  diagnoses: Diagnosis[];
}>();

defineEmits(['select-diagnosis']);

// دوال مساعدة لتحديد الألوان بناءً على الحالة
function getStatusColor(status: string) {
  if (status === 'active') return 'bg-rose-50 text-rose-700 border-rose-200';
  if (status === 'managed') return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-emerald-50 text-emerald-700 border-emerald-200';
}

function getStatusDot(status: string) {
  if (status === 'active') return 'bg-rose-500';
  if (status === 'managed') return 'bg-amber-500';
  return 'bg-emerald-500';
}
</script>
