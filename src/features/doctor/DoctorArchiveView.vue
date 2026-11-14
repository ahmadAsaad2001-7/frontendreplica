<template>
  <div class="min-h-screen bg-[#F8FAFC] pb-10" dir="rtl">
    <div class="max-w-[1400px] mx-auto px-6 py-6 space-y-6">

      <!-- 1. Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-800">أرشيف المرضى</h1>
          <p class="text-sm text-slate-500 mt-1">إدارة السجلات الطبية والزيارات والملفات الشخصية</p>
        </div>
        <div class="flex gap-2">
          <button class="bg-white border border-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm hover:bg-slate-50 transition flex items-center gap-2">
            <Download class="w-4 h-4" /> تصدير
          </button>
          <button class="bg-teal-600 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-md hover:bg-teal-700 transition flex items-center gap-2">
            <UserPlus class="w-4 h-4" /> مريض جديد
          </button>
        </div>
      </div>

      <!-- 2. Stats Cards -->
      <div class="grid grid-cols-4 gap-4">
        <!-- كارت 1 -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Users class="w-6 h-6" />
          </div>
          <div>
            <p class="text-xs text-slate-400 font-medium mb-1">إجمالي المرضى</p>
            <h3 class="text-xl font-extrabold text-slate-800">{{ archiveStore.archivedPatients.length }}</h3>
          </div>
        </div>
        <!-- كارت 2 -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <CalendarDays class="w-6 h-6" />
          </div>
          <div>
            <p class="text-xs text-slate-400 font-medium mb-1">زيارات هذا الشهر</p>
            <h3 class="text-xl font-extrabold text-slate-800">{{ stats.visitsThisMonth }}</h3>
          </div>
        </div>
        <!-- كارت 3 -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
            <HeartPulse class="w-6 h-6" />
          </div>
          <div>
            <p class="text-xs text-slate-400 font-medium mb-1">حالات مزمنة</p>
            <h3 class="text-xl font-extrabold text-slate-800">{{ stats.chronicCount }}</h3>
          </div>
        </div>
        <!-- كارت 4 -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <CreditCard class="w-6 h-6" />
          </div>
          <div>
            <p class="text-xs text-slate-400 font-medium mb-1">أرصدة مستحقة</p>
            <h3 class="text-xl font-extrabold text-rose-600">{{ stats.dueBalance }}</h3>
          </div>
        </div>
      </div>

      <!-- 3. Main Layout (Filters Sidebar + Patients Content) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <!-- Left Sidebar: Filters -->
        <div class="lg:col-span-3">
          <ArchiveSidebarFilters
            :filters="filters"
            :counts="filterCounts"
            @update:filters="updateFilters"
          />
        </div>

        <!-- Right Content: Patients Grid -->
        <div class="lg:col-span-9">
          <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">

            <!-- Toolbar (View Toggle & Sort) -->
            <div class="flex justify-between items-center mb-5 border-b border-slate-100 pb-4">
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-slate-800 text-lg">قائمة المرضى</h3>
                <span class="bg-teal-50 text-teal-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                  {{ filteredPatients.length }} مريض
                </span>
              </div>

              <div class="flex items-center gap-3">
                <select class="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-xl px-3 py-2 outline-none cursor-pointer">
                  <option>ترتيب: الأحدث</option>
                  <option>ترتيب: الأقدم</option>
                </select>
                <div class="flex bg-slate-100 p-1 rounded-xl">
                  <button @click="viewMode = 'grid'" :class="['p-1.5 rounded-lg transition', viewMode === 'grid' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-400']">
                    <LayoutGrid class="w-4 h-4" />
                  </button>
                  <button @click="viewMode = 'list'" :class="['p-1.5 rounded-lg transition', viewMode === 'list' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-400']">
                    <List class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Patients Grid View -->
            <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PatientArchiveCard
                v-for="patient in filteredPatients"
                :key="patient.id"
                :patient="patient"
                @open="openPatientDetails"
              />
            </div>

            <!-- Patients List View (Table) -->
            <div v-else class="overflow-x-auto">
              <table class="w-full text-right text-sm">
                <thead class="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th class="p-3 font-bold rounded-r-xl">رقم الملف</th>
                    <th class="p-3 font-bold">المريض</th>
                    <th class="p-3 font-bold">العمر</th>
                    <th class="p-3 font-bold">فصيلة الدم</th>
                    <th class="p-3 font-bold">آخر زيارة</th>
                    <th class="p-3 font-bold">الزيارات</th>
                    <th class="p-3 font-bold rounded-l-xl">الرصيد</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-for="p in filteredPatients" :key="p.id" @click="openPatientDetails(p)" class="hover:bg-slate-50 cursor-pointer transition">
                    <td class="p-3 font-mono text-xs font-bold text-teal-600">{{ p.mrn }}</td>
                    <td class="p-3 font-bold text-slate-800">{{ p.name }}</td>
                    <td class="p-3 text-slate-600">{{ p.age ?? '—' }} سنة</td>
                    <td class="p-3"><span class="bg-rose-50 text-rose-600 px-2 py-0.5 rounded text-xs font-bold">{{ p.bloodType }}</span></td>
                    <td class="p-3 text-slate-500 text-xs">{{ p.lastVisitDate }}</td>
                    <td class="p-3 text-teal-600 font-bold">{{ p.totalVisits }}</td>
                    <td class="p-3 font-bold" :class="p.balance > 0 ? 'text-amber-600' : 'text-emerald-600'">
                      {{ p.balance > 0 ? p.balance : 'مسدد' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Download, UserPlus, Users, CalendarDays, HeartPulse, CreditCard, LayoutGrid, List } from 'lucide-vue-next';
import { usePatientArchiveStore } from '../../stores/patientArchiveStore';
import { useAppointmentStore } from '../../stores/appointmentStore';
import type { PatientArchiveItem } from '../../types/archive';
import PatientArchiveCard from './components/archive/PatientArchiveCard.vue';
import ArchiveSidebarFilters from './components/archive/ArchiveSidebarFilters.vue';

const archiveStore = usePatientArchiveStore();
const appointmentStore = useAppointmentStore();
const router = useRouter();

const viewMode = ref<'grid' | 'list'>('grid');
const filters = ref({ search: '', gender: 'all', status: 'all' });

function updateFilters(newFilters: any) { filters.value = newFilters; }

const filterCounts = computed(() => {
  const patients = archiveStore.archivedPatients;
  return {
    total: patients.length,
    male: patients.filter(p => p.gender === 'male').length,
    female: patients.filter(p => p.gender === 'female').length,
    balance: patients.filter(p => p.balance > 0).length,
  };
});

const filteredPatients = computed(() =>
  archiveStore.archivedPatients.filter(p => {
    const matchSearch = !filters.value.search || p.name.includes(filters.value.search) || p.mrn.includes(filters.value.search);
    const matchGender = filters.value.gender === 'all' || p.gender === filters.value.gender;
    let matchStatus = true;
    if (filters.value.status === 'balance') matchStatus = p.balance > 0;
    if (filters.value.status === 'chronic') matchStatus = p.hasChronic;
    return matchSearch && matchGender && matchStatus;
  })
);

// ✅ إحصائيات محسوبة بدل الأرقام الثابتة
const stats = computed(() => {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const ids = new Set(archiveStore.archivedPatients.map(p => p.id));
  return {
    visitsThisMonth: appointmentStore.appointments.filter(
      a => ids.has(a.patientProfileId) && a.date.startsWith(monthKey) && a.status !== 'Cancelled'
    ).length,
    chronicCount: archiveStore.archivedPatients.filter(p => p.hasChronic).length,
    dueBalance: archiveStore.archivedPatients.reduce((s, p) => s + p.balance, 0),
  };
});

// ✅ التنقّل الحقيقي
function openPatientDetails(patient: PatientArchiveItem) {
  router.push({ name: 'doctor-patient-detail', params: { id: patient.id } });
}
</script>
