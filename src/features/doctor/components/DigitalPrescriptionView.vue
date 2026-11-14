<template>
  <div class="space-y-4 animate-in fade-in duration-300">

    <!-- Top Header Actions -->
    <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex justify-between items-center no-print">
      <div class="flex items-center gap-2">
        <button @click="downloadPdf" class="bg-rose-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-rose-700 transition shadow-md">
          <Download class="w-4 h-4" /> تحميل PDF
        </button>
        <span class="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-100 flex items-center gap-1 mr-2">
          <User class="w-4 h-4" /> {{ formData.patientName }}
        </span>
      </div>
      <div class="text-right">
        <h3 class="font-extrabold text-slate-800 flex items-center gap-2">
          <HeartPulse class="w-5 h-5 text-teal-600" /> نظام الروشتة الرقمية
        </h3>
        <p class="text-xs text-slate-500">لوحة الطبيب - إنشاء وإدارة الروشتات والمهام السريرية</p>
      </div>
    </div>

    <!-- Split View -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">

      <!-- LEFT PANEL: The Document (Preview) -->
      <div id="printable-prescription" class="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden relative">
        <!-- Document Header -->
        <div class="bg-slate-50 p-6 border-b border-slate-200">
          <PrescriptionPrintHeader />

          <!-- Patient Info Box -->
          <div class="bg-rose-50 border border-rose-100 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4">
            <div class="col-span-2 md:col-span-1 border-l border-rose-200 pl-2">
              <p class="text-[10px] text-rose-400 font-bold mb-1">اسم المريض</p>
              <p class="font-extrabold text-slate-800">{{ formData.patientName }}</p>
            </div>
            <div class="border-l border-rose-200 pl-2">
              <p class="text-[10px] text-rose-400 font-bold mb-1">العمر</p>
              <p class="font-bold text-slate-800">{{ formData.patientAge }} سنة</p>
            </div>
            <div class="border-l border-rose-200 pl-2">
              <p class="text-[10px] text-rose-400 font-bold mb-1">الملف الطبي (MRN)</p>
              <p class="font-mono text-slate-800">{{ formData.patientMrn }}</p>
            </div>
            <div class="col-span-2 md:col-span-1">
              <p class="text-[10px] text-rose-400 font-bold mb-1">التاريخ</p>
              <p class="font-bold text-slate-800">{{ formData.date }}</p>
            </div>
          </div>

          <!-- Allergies -->
          <div v-if="formData.allergies.length > 0" class="mt-3 flex items-center gap-2 bg-rose-100/50 p-2 rounded-lg border border-rose-200">
            <AlertTriangle class="w-4 h-4 text-rose-600 shrink-0" />
            <p class="text-xs font-bold text-rose-700">حساسية: {{ formData.allergies.join('، ') }}</p>
          </div>
        </div>

      <!-- Diagnosis (Preview) -->
<div class="p-6 pb-2">
  <h3 class="text-sm font-bold text-slate-500 mb-2 flex items-center gap-2">
    <Stethoscope class="w-4 h-4" /> التشخيص (Diagnosis)
  </h3>

  <!-- ✅ عرض التشخيصات -->
  <div v-if="draftStore.diagnoses && draftStore.diagnoses.length > 0" class="space-y-2">
    <div
      v-for="(diag, index) in draftStore.diagnoses"
      :key="diag.icd10 + '-' + index"
      class="bg-slate-50 p-3 rounded-lg border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300"
    >
      <div class="flex items-center justify-between">
        <span class="font-bold text-slate-800 text-sm">{{ diag.title }}</span>
        <span class="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
          ICD-10: {{ diag.icd10 }}
        </span>
      </div>
      <span class="text-[10px] text-slate-400 mt-1 block">{{ diag.date }}</span>
    </div>
  </div>

  <!-- ✅ رسالة عند عدم وجود تشخيصات -->
  <div v-else class="bg-slate-50 p-4 rounded-lg border border-dashed border-slate-200 text-center">
    <Stethoscope class="w-8 h-8 text-slate-300 mx-auto mb-2" />
    <p class="text-sm text-slate-500 font-bold">لم يتم إدخال تشخيص بعد</p>
    <p class="text-xs text-slate-400 mt-1">اختر من سجل المريض أو أضف تشخيص جديد</p>
  </div>
</div>

        <!-- Clinical Notes (Preview) -->
        <div v-if="formData.clinicalNotes" class="px-6 pb-2">
          <h3 class="text-sm font-bold text-slate-500 mb-2 flex items-center gap-2">
            <FileText class="w-4 h-4" /> ملاحظات سريرية
          </h3>
          <div class="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {{ formData.clinicalNotes }}
          </div>
        </div>

        <!-- Medications Table (Preview) -->
        <div class="px-6 pb-6 mt-2">
          <h3 class="text-sm font-bold text-slate-500 mb-2 flex items-center gap-2">
            <Pill class="w-4 h-4" /> الأدوية الموصوفة
          </h3>
          <table class="w-full text-right text-sm border-collapse">
            <thead>
              <tr class="bg-teal-800 text-white">
                <th class="p-2 font-medium rounded-r-lg">اسم الدواء</th>
                <th class="p-2 font-medium">الجرعة</th>
                <th class="p-2 font-medium">طريقة الاستعمال</th>
                <th class="p-2 font-medium rounded-l-lg">التكرار والمدة</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="(med, index) in formData.medications" :key="index" class="hover:bg-slate-50">
                <td class="p-3 font-bold text-slate-800">{{ med.title }} <br><span class="text-[10px] text-slate-500 font-normal">{{ med.scientificName || '' }}</span></td>
                <td class="p-3 text-slate-600 text-xs">{{ med.dosage || '-' }}</td>
                <td class="p-3 text-slate-600 text-xs">{{ med.route || '-' }}</td>
                <td class="p-3 text-slate-600 text-xs">{{ med.frequency || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Care Plan (Preview) -->
        <div v-if="carePlanTasks.length > 0" class="px-6 pb-6">
          <h3 class="text-sm font-bold text-slate-500 mb-2 flex items-center gap-2 border-t border-slate-200 pt-4">
            <ListTodo class="w-4 h-4" /> خطة المهام والتعليمات
          </h3>
          <table class="w-full text-right text-sm border-collapse">
            <thead>
              <tr class="bg-slate-100 text-slate-600">
                <th class="p-2 font-medium rounded-r-lg">المهمة</th>
                <th class="p-2 font-medium">التكرار</th>
                <th class="p-2 font-medium rounded-l-lg">المدة</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="(task, index) in carePlanTasks" :key="index">
                <td class="p-3 font-bold text-slate-800">
                  {{ task.title }}
                  <span v-if="task.instructions" class="block text-[10px] text-slate-500 font-normal mt-0.5">{{ task.instructions }}</span>
                </td>
                <td class="p-3 text-slate-600 text-xs">{{ task.frequency || 'يومياً' }}</td>
                <td class="p-3 text-slate-600 text-xs">{{ task.schedule?.duration_days || 7 }} أيام</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Follow Up (Preview) -->
        <div v-if="formData.requiresFollowUp" class="px-6 pb-6">
          <div class="bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-center gap-4">
            <Calendar class="w-8 h-8 text-purple-600 shrink-0" />
            <div>
              <p class="text-xs font-bold text-purple-800">موعد المتابعة الموصى به</p>
              <p class="text-sm font-bold text-purple-900 mt-1">
                {{ formData.followUpDate }}
                <span v-if="formData.followUpTime">الساعة {{ formData.followUpTime }}</span>
                <span v-if="formData.followUpClinic">- {{ formData.followUpClinic }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Footer (QR & Advice) -->
        <div class="bg-slate-50 p-6 border-t border-slate-200">
          <div class="flex justify-between items-end">
            <div>
              <h3 class="text-sm font-bold text-slate-500 mb-1">توصيات عامة</h3>
              <p class="text-xs text-slate-700 leading-relaxed max-w-sm whitespace-pre-wrap">{{ formData.advice }}</p>
            </div>
            <div class="text-center">
              <img :src="qrCodeUrl" class="w-20 h-20 mx-auto mb-1 border border-slate-300 rounded-lg p-1 bg-white" />
              <p class="text-[9px] text-slate-400">Digital Signature Verified</p>
              <p class="text-xs font-bold text-slate-800 mt-1">{{ formData.doctorName }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT PANEL: The Form (Editor) -->
      <div class="space-y-4">
        <!-- Clinic & Patient Info (Read-Only Context) -->
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <h3 class="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Building class="w-4 h-4 text-teal-600" /> بيانات العيادة والمريض (للمراجعة فقط)
          </h3>
          <div class="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label class="block text-slate-500 mb-1">اسم المريض</label>
              <input :value="formData.patientName" disabled class="w-full p-2 border rounded-lg bg-slate-100 text-slate-500 font-bold cursor-not-allowed">
            </div>
            <div>
              <label class="block text-slate-500 mb-1">العمر</label>
              <input :value="formData.patientAge" disabled class="w-full p-2 border rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed">
            </div>
            <div>
              <label class="block text-slate-500 mb-1">رقم الملف (MRN)</label>
              <input :value="formData.patientMrn" disabled class="w-full p-2 border rounded-lg bg-slate-100 text-slate-500 font-mono cursor-not-allowed">
            </div>
            <div>
              <label class="block text-slate-500 mb-1">تاريخ الزيارة</label>
              <input :value="formData.date" disabled class="w-full p-2 border rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed">
            </div>
          </div>
        </div>

        <!-- ✅ بيانات الروشتة الأساسية -->
        <BasicClinicalInfoSection />

        <!-- ✅ بناء المهام -->
        <TasksBuilderSection />

        <!-- ✅ بناء الأدوية -->
        <DrugsBuilderSection />

        <!-- ✅ الإعدادات المتقدمة -->
        <AdvancedSettingsSection />

        <!-- Footer Warning & Actions -->
        <div class="space-y-3 pt-4">
          <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2">
            <Lock class="w-5 h-5 text-amber-600 shrink-0" />
            <p class="text-xs text-amber-800 font-bold">
              تنبيه الحماية: بمجرد التوقيع والإصدار يتم إنشاء بصمة تشفيرية نهائية (SHA-256) وتصبح الروشتة غير قابلة للتعديل.
            </p>
          </div>

          <div class="flex gap-2">
            <button @click="draftStore.resetDraft()" class="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-200 transition flex items-center justify-center gap-2">
              <RotateCcw class="w-4 h-4" /> إلغاء المسودة
            </button>

            <button class="flex-1 py-3 bg-blue-50 text-blue-700 font-bold rounded-xl text-sm hover:bg-blue-100 border border-blue-200 transition">
              معاينة صفحة الصيدلية (P.1)
            </button>

            <button class="flex-1 py-3 bg-purple-50 text-purple-700 font-bold rounded-xl text-sm hover:bg-purple-100 border border-purple-200 transition">
              معاينة خطة المريض (P.2)
            </button>

            <button @click="handleSave" class="flex-[2] py-3 bg-teal-800 text-white font-bold rounded-xl text-sm hover:bg-teal-900 shadow-md transition flex items-center justify-center gap-2">
              <CheckCircle2 class="w-4 h-4" /> توقيع وإصدار الروشتة
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRefs } from 'vue';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

import {
  Download, User, HeartPulse, AlertTriangle, Stethoscope,
  Pill, FileText, RotateCcw, CheckCircle2, Building, ListTodo, Calendar, Lock
} from 'lucide-vue-next';

import { usePrescriptionDraftStore } from '../../../stores/prescriptionDraftStore';
import { useClinicProfileStore } from '../../../stores/clinicProfileStore';
import { useDoctorQueueStore } from '../../../stores/doctorQueueStore';

import BasicClinicalInfoSection from './BasicClinicalInfoSection.vue';
import TasksBuilderSection from './TasksBuilderSection.vue';
import DrugsBuilderSection from './DrugsBuilderSection.vue';
import AdvancedSettingsSection from './AdvancedSettingsSection.vue';
import PrescriptionPrintHeader from './PrescriptionPrintHeader.vue';

const draftStore = usePrescriptionDraftStore();
const clinicStore = useClinicProfileStore();
const doctorStore = useDoctorQueueStore();

const qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PrescriptionVerify123ABC';

const formData = computed(() => {
  const activePatient = doctorStore.activePatient || doctorStore.selectedPatient;

  return {
    clinicName: clinicStore.clinicName || 'مستشفى الشفاء التخصصي',
    doctorName: clinicStore.doctorName || 'د. أحمد عبدالله',
    specialty: clinicStore.specialty || 'استشاري الباطنة والقلب',
    clinicPhone: clinicStore.phone || '966+ 123 50 4567',
    clinicAddress: clinicStore.address || 'الرياض، حي العليا',
    licenseNumber: clinicStore.licenseNumber || '1010203030',
    patientName: activePatient?.name || 'مريض تجريبي',
    patientAge: activePatient?.age || '35',
    patientMrn: activePatient?.mrn || 'MRN-0000',
    date: new Date().toLocaleDateString('ar-EG'),
    allergies: activePatient?.allergies || [],
    diagnoses: draftStore.diagnoses,
    clinicalNotes: draftStore.clinicalNotes || '',
    advice: draftStore.generalInstructions || 'يرجى الالتزام بالتعليمات الطبية',
    requiresFollowUp: draftStore.requiresFollowUp,
    followUpDate: draftStore.followUpDate || '',
    followUpTime: draftStore.followUpTime || '',
    followUpClinic: draftStore.followUpClinic || '',
    medications: draftStore.planItems.filter((i: any) => i.kind === 'medication'),
  };
});
const carePlanTasks = computed(() => {
  return draftStore.planItems.filter((i: any) => i.kind !== 'medication');
});

async function downloadPdf() {
  const element = document.getElementById('printable-prescription');
  if (!element) return;
  try {
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidth, imgHeight);
    pdf.save(`Prescription-${formData.value.patientName}.pdf`);
  } catch (error) {
    console.error('خطأ في إنشاء ملف PDF:', error);
    alert('حدث خطأ أثناء تحميل الملف.');
  }
}

function handleSave() {
  if (draftStore.diagnoses.length === 0) {
    alert('يرجى إدخال التشخيص أولاً.');
    return;
  }
  draftStore.issuePrescription();
  alert('تم حفظ الروشتة وإرسالها للمريض بنجاح!');
}
</script>

<style>
@media print {
  .no-print { display: none !important; }
}
</style>
