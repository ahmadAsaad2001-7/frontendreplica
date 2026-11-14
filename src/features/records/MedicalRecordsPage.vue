<template>
  <div class="max-w-7xl mx-auto space-y-4" dir="rtl">

    <!-- 1. Family Bar -->
    <div class="bg-white rounded-2xl p-3 flex items-center gap-3 shadow-sm border border-slate-100 overflow-x-auto">
      <div v-for="profile in profileStore.profiles" :key="profile.id" @click="profileStore.setActiveProfile(profile.id)" :class="['min-w-[140px] flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all border', profileStore.activeProfileId === profile.id ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm' : 'bg-white border-slate-200 hover:bg-slate-50']">
        <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold" :class="profileStore.activeProfileId === profile.id ? 'bg-white/20' : 'bg-slate-100 text-slate-500'">
          {{ profile.name.charAt(0) }}
        </div>
        <div>
          <h4 class="text-sm font-bold">{{ profile.name }}</h4>
          <p :class="profileStore.activeProfileId === profile.id ? 'text-emerald-100' : 'text-slate-500'" class="text-[10px] font-semibold">{{ profile.relation }}</p>
        </div>
      </div>
    </div>

    <!-- 2. Patient Header Card -->
    <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
      <div class="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-l from-emerald-500 to-blue-500"></div>

      <div class="flex justify-between items-start">
        <div class="flex items-center gap-5">
          <img :src="'https://i.pravatar.cc/150?img=11'" class="w-20 h-20 rounded-2xl object-cover ring-4 ring-slate-50" />
          <div>
            <h1 class="text-2xl font-extrabold text-slate-800">{{ activeProfile.name }}</h1>
            <p class="text-sm text-slate-500 mt-1">{{ activeProfile.age }} سنة • {{ activeProfile.gender === 'male' ? 'ذكر' : 'أنثى' }} • معرف السجل: <span class="font-mono font-bold">{{ activeProfile.mrn }}</span></p>
            <div class="flex gap-2 mt-3">
              <span class="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-lg border border-emerald-100">2 كورسات جارية</span>
              <span class="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-lg border border-blue-100">1 مؤرشفة</span>
            </div>
          </div>
        </div>
        <button class="bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-sm shadow-md hover:bg-slate-900 transition flex items-center gap-2">
          <Download class="w-4 h-4" /> تصدير السجل (PDF)
        </button>
      </div>

      <!-- Alerts Boxes -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <!-- Allergies -->
        <div class="bg-rose-50 border border-rose-200 rounded-2xl p-4">
          <h3 class="text-sm font-bold text-rose-800 flex items-center gap-2 mb-3">
            <AlertTriangle class="w-4 h-4" /> الحساسية الطبية الموثقة (Allergies):
          </h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="allergy in activeProfile.allergies" :key="allergy" class="bg-white text-rose-700 border border-rose-200 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
              <AlertTriangle class="w-3 h-3 inline mr-1 text-rose-400" /> {{ allergy }}
            </span>
          </div>
        </div>

        <!-- Chronic Conditions -->
        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <h3 class="text-sm font-bold text-amber-800 flex items-center gap-2 mb-3">
            <Activity class="w-4 h-4" /> الحالات المرضية والمزمنة (Chronic Conditions):
          </h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="cond in activeProfile.chronicConditions" :key="cond" class="bg-white text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
              <Activity class="w-3 h-3 inline mr-1 text-amber-400" /> {{ cond }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Tabs Navigation -->
    <div class="bg-slate-100 p-1.5 rounded-2xl flex items-center justify-between">
      <div class="flex gap-1 w-full">
        <!-- Tab 1: Diagnoses -->
        <button @click="activeTab = 'diagnoses'" :class="activeTab === 'diagnoses' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-600 hover:bg-white'" class="flex-1 font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
          <Stethoscope class="w-4 h-4" /> التشخيصات ({{ diagnoses.length }})
        </button>

        <!-- Tab 2: Prescriptions -->
        <button @click="activeTab = 'prescriptions'" :class="activeTab === 'prescriptions' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-600 hover:bg-white'" class="flex-1 font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
          <FileText class="w-4 h-4" /> الروشتات ({{ prescriptions.length }})
        </button>

        <!-- Tab 3: Vitals -->
        <button @click="activeTab = 'vitals'" :class="activeTab === 'vitals' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-600 hover:bg-white'" class="flex-1 font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
          <HeartPulse class="w-4 h-4" /> القياسات ({{ vitals.length }})
        </button>

        <!-- Tab 4: Medications (التاب الناقص) -->
        <button @click="activeTab = 'medications'" :class="activeTab === 'medications' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-600 hover:bg-white'" class="flex-1 font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
          <Pill class="w-4 h-4" /> الأدوية ({{ allMedicationsCount }})
        </button>
      </div>
    </div>

    <!-- 4. Tab Content -->
    <div class="mt-4">
      <DiagnosesTab v-if="activeTab === 'diagnoses'" />
      <PrescriptionsTab v-if="activeTab === 'prescriptions'" />
      <VitalsTab v-if="activeTab === 'vitals'" />
      <MedicationsTab v-if="activeTab === 'medications'" />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useProfileStore } from '../../stores/profileStore';
import { useMedicalRecordStore } from '../../stores/medicalRecordStore';
import { usePrescriptionStore } from '../../stores/prescriptionStore';
import { Download, AlertTriangle, Activity, Stethoscope, FileText, HeartPulse, Pill } from 'lucide-vue-next';

// استدعاء التابات الأربعة
import DiagnosesTab from './components/DiagnosesTab.vue';
import PrescriptionsTab from './components/PrescriptionsTab.vue';
import VitalsTab from './components/VitalsTab.vue';
import MedicationsTab from './components/MedicationsTab.vue';

const profileStore = useProfileStore();
const recordStore = useMedicalRecordStore();
const rxStore = usePrescriptionStore();

// إضافة 'medications' للأنواع المسموحة للتاب
const activeTab = ref<'diagnoses' | 'prescriptions' | 'vitals' | 'medications'>('diagnoses');

const activeProfile = computed(() => profileStore.activeProfile);

const diagnoses = computed(() => recordStore.diagnoses.filter(d => d.patient_id === profileStore.activeProfileId));
const vitals = computed(() => recordStore.vitals.filter(v => v.patient_id === profileStore.activeProfileId));
const prescriptions = computed(() => rxStore.getPrescriptionsForPatient(profileStore.activeProfileId));

// حساب عدد الأدوية لعرضه في التاب
const allMedicationsCount = computed(() => {
  const patientRx = rxStore.prescriptions.filter(p => p.patient_id === profileStore.activeProfileId);
  return patientRx.flatMap(rx => rx.plan_items.filter(item => item.kind === 'medication')).length;
});
</script>
