<template>
  <div class="h-[calc(100vh-8rem)] flex flex-col overflow-hidden relative" dir="rtl">

    <!-- Main Content Area -->
    <div class="flex-1 flex gap-4 overflow-hidden mb-2">

      <!-- 1. Queue Sidebar (Far Right) -->
      <QueueSidebar class="w-80 shrink-0" />

      <!-- 2. Main Workspace (Center/Left) -->
      <div class="flex-1 overflow-y-auto pr-2">
        <PatientContext v-if="doctorStore.selectedPatient" />

        <div v-else class="h-full bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center text-slate-400">
          <Stethoscope class="w-16 h-16 mb-4 opacity-20" />
          <p class="text-lg font-bold">لم يتم اختيار مريض</p>
          <p class="text-sm mt-1">اختر مريضاً من الطابور لبدء الاستشارة أو مراجعة الملف</p>
        </div>
      </div>

    </div>

    <!-- 3. Sticky Bottom Action Bar (الشريط السفلي الذكي) -->
    <div class="bg-white/90 backdrop-blur-md border border-slate-200 p-3 rounded-2xl shadow-lg flex items-center justify-between shrink-0 z-10">

      <div class="flex items-center gap-2">
        <!-- زرار إنهاء الكشف (يظهر فقط لو فيه مريض جوه الغرفة حالياً) -->
        <button
          v-if="doctorStore.activePatient"
          @click="handleEndSession"
          class="bg-rose-500 hover:bg-rose-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 text-sm"
        >
          <XCircle class="w-4 h-4" /> إنهاء الجلسة وحفظ السجل
        </button>

        <!-- زرار بدء الكشف (يظهر فقط لو الطبيب بيبص على ملف مريض في الانتظار) -->
        <button
          v-else-if="doctorStore.selectedPatient && doctorStore.selectedPatient.status !== 'Completed'"
          @click="doctorStore.startConsultation(doctorStore.selectedPatient.id)"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 text-sm"
        >
          <PlayCircle class="w-4 h-4" /> بدء كشف {{ doctorStore.selectedPatient.name }}
        </button>
      </div>

      <!-- استدعاء التالي -->
      <button
        @click="handleNextPatient"
        :disabled="doctorStore.waitingPatients.length === 0 && !doctorStore.activePatient"
        class="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 text-sm"
      >
        استدعاء المريض التالي <ArrowLeft class="w-4 h-4" />
      </button>

    </div>

  </div>
</template>

<script setup lang="ts">
import { useDoctorQueueStore } from '../../stores/doctorQueueStore';
import { usePrescriptionDraftStore } from '../../stores/prescriptionDraftStore';
import { Stethoscope, XCircle, PlayCircle, ArrowLeft } from 'lucide-vue-next';
import QueueSidebar from './components/QueueSidebar.vue';
import PatientContext from './components/PatientContext.vue';

const doctorStore = useDoctorQueueStore();
const draftStore = usePrescriptionDraftStore();

// ✅ دالة إنهاء الجلسة (بالمنطق الدقيق)
function handleEndSession() {
  if (!doctorStore.activePatient) return;

  // لو الطبيب كتب تشخيص أو أضاف أدوية/مهام
  if (draftStore.diagnosis || draftStore.planItems.length > 0) {
    // دالة الإصدار تقوم داخلياً بـ: حفظ الروشتة، إنهاء الكشف، وتصفير المسودة
    draftStore.issuePrescription();
    alert('تم حفظ الجلسة وتوقيعها بنجاح! تم إرسال الروشتة وخطة المهام للمريض.');
  } else {
    // لو لم يضف أي بيانات، ننهي الكشف فقط
    doctorStore.endConsultation();
    alert('تم إنهاء جلسة الكشف بنجاح.');
  }
}

// ✅ دالة استدعاء المريض التالي
function handleNextPatient() {
  doctorStore.callNextPatient();
}
</script>
