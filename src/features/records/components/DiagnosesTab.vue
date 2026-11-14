<template>
  <div class="flex flex-col lg:flex-row gap-4">

    <!-- Sidebar: Doctor Info (Left) -->
    <div class="w-full lg:w-80 shrink-0">
      <div class="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 sticky top-4">
        <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Stethoscope class="w-4 h-4 text-emerald-600" /> الطبيب الذي أصدر التشخيص
        </h3>

        <div class="text-center">
          <img src="https://i.pravatar.cc/150?img=60" class="w-24 h-24 rounded-2xl mx-auto object-cover ring-4 ring-emerald-50 mb-3" />
          <h4 class="font-extrabold text-lg text-slate-800">أ.د. طارق الحكيم</h4>
          <p class="text-xs text-slate-500 mt-1">استشاري أول جراحة العظام</p>
          <div class="flex justify-center gap-4 mt-3 text-xs font-bold">
            <span class="text-slate-600">EGY-MED-48291</span>
            <span class="text-amber-500 flex items-center gap-1"><Star class="w-3.5 h-3.5 fill-current" /> 4.9</span>
          </div>
        </div>

        <div class="mt-5 bg-slate-50 rounded-xl p-3 text-xs text-slate-600 space-y-2">
          <p class="flex items-start gap-2"><MapPin class="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" /> مركز العمود الفقري - القاهرة</p>
          <p class="flex items-start gap-2"><Calendar class="w-3.5 h-3.5 text-slate-400 shrink-0" /> مواعيد الكشف: السبت، الإثنين</p>
        </div>

        <button class="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl mt-4 shadow-md hover:bg-emerald-700 transition flex items-center justify-center gap-2">
          <Phone class="w-4 h-4" /> تواصل مع العيادة
        </button>
      </div>
    </div>

    <!-- Timeline: Diagnoses (Right) -->
    <div class="flex-1 space-y-4">
      <div class="bg-slate-50 rounded-2xl p-3 flex justify-between items-center border border-slate-200">
        <h3 class="font-bold text-slate-700 text-sm">سجل التشخيصات الطبية غير القابل للتعديل (Append-Only Audit)</h3>
        <span class="bg-white text-slate-500 text-xs px-2 py-1 rounded-lg border">{{ patientDiagnoses.length }} تشخيصات مسجلة</span>
      </div>

      <div v-for="diag in patientDiagnoses" :key="diag.id" class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition">

        <div class="flex justify-between items-start mb-4 border-b border-slate-100 pb-4">
          <div class="flex items-center gap-3">
            <span class="text-xs font-bold text-slate-400 flex items-center gap-1"><Calendar class="w-3.5 h-3.5" /> {{ diag.date }}</span>
            <span :class="diag.status === 'active' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'" class="text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full" :class="diag.status === 'active' ? 'bg-rose-500' : 'bg-emerald-500'"></span>
              {{ diag.status === 'active' ? 'حالة نشطة' : 'تحت السيطرة والعلاج' }}
            </span>
          </div>
          <div class="text-xs font-mono font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-100">
            ICD-10: {{ diag.icd10 }}
          </div>
        </div>

        <h2 class="text-xl font-extrabold text-slate-800 mb-2">{{ diag.title }}</h2>
        <p class="text-xs text-slate-500 font-bold mb-4">أ.د. طارق الحكيم - استشاري جراحة العظام</p>

        <div class="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 leading-relaxed mb-4">
          {{ diag.notes }}
        </div>

        <div class="flex items-center justify-between">
          <!-- Attachments -->
          <div class="flex gap-2">
            <button v-for="att in diag.attachments" :key="att.name" class="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 transition">
              <Paperclip class="w-4 h-4 text-emerald-500" /> {{ att.name }}
            </button>
          </div>

          <!-- Linked Prescription -->
          <button class="text-xs text-emerald-600 font-bold flex items-center gap-1 hover:underline">
            رابط بالروشتة المعتمدة: RX-SPINE-2026-01 <ChevronLeft class="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMedicalRecordStore } from '../../../stores/medicalRecordStore';
import { useProfileStore } from '../../../stores/profileStore';
import { Stethoscope, Star, MapPin, Calendar, Phone, Paperclip, ChevronLeft } from 'lucide-vue-next';

const recordStore = useMedicalRecordStore();
const profileStore = useProfileStore();

const patientDiagnoses = computed(() =>
  recordStore.diagnoses.filter(d => d.patient_id === profileStore.activeProfileId)
);
</script>
