<template>
  <div class="flex flex-col lg:flex-row gap-6">

    <!-- Left Sidebar: Drug Details (Details of selected drug) -->
    <div class="w-full lg:w-80 shrink-0">
      <div v-if="selectedMed" class="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 sticky top-4">

        <!-- Header -->
        <div class="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
          <span class="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold">{{ selectedMed.rxId }}</span>
          <h3 class="font-bold text-slate-800 text-sm">تفاصيل الوصفة والشرح الصيدلي</h3>
        </div>

        <h4 class="text-xs text-emerald-600 font-bold mb-3">الطبيب الواصف للدواء:</h4>

        <!-- Doctor Info -->
        <div class="text-center mb-4">
          <img src="https://i.pravatar.cc/150?img=60" class="w-16 h-16 rounded-full mx-auto object-cover border-2 border-emerald-100 mb-2" />
          <h4 class="font-extrabold text-slate-800">{{ selectedMed.doctorName }}</h4>
          <p class="text-[11px] text-slate-500 mt-1">{{ selectedMed.specialty }}</p>
          <p class="text-[10px] text-slate-400 mt-1">تاريخ الوصفة: {{ selectedMed.date }}</p>
        </div>

        <!-- Doctor Instructions -->
        <div class="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4">
          <p class="text-xs font-bold text-slate-700 mb-1 text-center">إرشادات الطبيب لتناول {{ selectedMed.name.split(' ')[0] }}:</p>
          <p class="text-xs text-slate-600 text-center leading-relaxed">{{ selectedMed.instructions }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-2 mt-4">
          <button class="w-full bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-slate-900 transition flex items-center justify-center gap-2">
            <FileText class="w-4 h-4" /> إزر عرض الوصفة الأصلية الموثقة
          </button>
          <button class="w-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold py-2.5 rounded-xl text-xs hover:bg-emerald-100 transition flex items-center justify-center gap-2">
            <QrCode class="w-4 h-4" /> إزر عرض رمز الصرف الصيدلي (QR)
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 h-full flex flex-col items-center justify-center text-slate-400 sticky top-4">
        <MousePointerClick class="w-10 h-10 mb-2 opacity-20" />
        <p class="text-sm font-bold">اختر دواءً</p>
        <p class="text-xs text-center mt-1">اضغط على أي دواء من القائمة لعرض تفاصيله وتعليمات الطبيب هنا.</p>
      </div>
    </div>

    <!-- Right Content: Medications List & Filters -->
    <div class="flex-1 space-y-4">

      <!-- Filters Box -->
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
        <!-- Search -->
        <div class="relative">
          <input type="text" v-model="searchQuery" placeholder="ابحث بالاسم التجاري أو العلمي للدواء (مثال: Celebrex, Concor, Amoxicillin)..." class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 text-sm outline-none focus:border-emerald-500 transition text-slate-700 text-center">
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
        </div>

        <!-- Dropdowns -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <select v-model="filterStatus" class="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-600 outline-none">
            <option value="">حالة الدواء</option>
            <option value="active">دواء نشط</option>
            <option value="ended">منتهي</option>
          </select>
          <select v-model="filterForm" class="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-600 outline-none">
            <option value="">الشكل الصيدلاني</option>
            <option value="كبسولة">كبسولة</option>
            <option value="قرص">قرص</option>
            <option value="حقن">حقن</option>
          </select>
          <select v-model="filterDoctor" class="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-600 outline-none">
            <option value="">الطبيب الواصف</option>
            <option value="طارق الحكيم">أ.د. طارق الحكيم</option>
            <option value="منى عبد الرحمن">د. منى عبد الرحمن</option>
          </select>
          <select class="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-600 outline-none">
            <option>كافة الفترات (All Records)</option>
          </select>
        </div>
      </div>

      <!-- List Header -->
      <div class="flex justify-between items-center px-2">
        <span class="text-xs font-bold text-slate-500">مرتبة حسب التاريخ الأحدث</span>
        <span class="text-xs font-bold text-slate-500">إجمالي الأدوية المطابقة {{ filteredMedications.length }}</span>
      </div>

      <!-- Medications Cards List -->
      <div class="space-y-3">
        <div
          v-for="med in filteredMedications"
          :key="med.id"
          @click="selectedMed = med"
          :class="[
            'bg-white rounded-2xl p-4 border cursor-pointer transition-all relative overflow-hidden',
            selectedMed?.id === med.id ? 'border-emerald-500 ring-2 ring-emerald-100 shadow-md' : 'border-slate-200 hover:border-emerald-300 shadow-sm'
          ]"
        >
          <!-- Top Row: Name & Status -->
          <div class="flex justify-between items-start mb-2">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Pill class="w-4 h-4" />
              </div>
              <div>
                <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
                  {{ med.name }}
                  <Link class="w-3.5 h-3.5 text-slate-300" />
                </h3>
                <p class="text-[11px] text-slate-500 mt-0.5">الاسم العلمي: {{ med.scientificName }}</p>
              </div>
            </div>
            <div class="flex flex-col items-end gap-1">
              <span class="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 border border-emerald-100">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> دواء نشط
              </span>
              <span class="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded">{{ med.form }}</span>
            </div>
          </div>

          <!-- Bottom Row: Details -->
          <div class="flex justify-between items-center text-[11px] text-slate-500 border-t border-slate-100 pt-3 mt-3">
            <span>التكرار: {{ med.frequency }}</span>
            <span>المدة: {{ med.duration }}</span>
            <span class="font-mono text-slate-400">الوصفة: {{ med.rxId }}</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePrescriptionStore } from '../../../stores/prescriptionStore';
import { useProfileStore } from '../../../stores/profileStore';
import { Search, Pill, Link, FileText, QrCode, MousePointerClick } from 'lucide-vue-next';

const rxStore = usePrescriptionStore();
const profileStore = useProfileStore();

const searchQuery = ref('');
const filterStatus = ref('');
const filterForm = ref('');
const filterDoctor = ref('');

// دالة لتجميع كل الأدوية من كل الروشتات الخاصة بالمريض النشط
const allAggregatedMeds = computed(() => {
  const patientRx = rxStore.prescriptions.filter(p => p.patient_id === profileStore.activeProfileId);

  return patientRx.flatMap(rx =>
    rx.plan_items
      .filter(item => item.kind === 'medication')
      .map(item => ({
        id: `${rx.id}_${item.id}`,
        rxId: rx.id,
        name: item.title,
        scientificName: 'Celecoxib 200mg Capsule', // بيانات تجريبية للاسم العلمي
        form: 'أقراص',
        frequency: item.schedule.times.join(' - ') + ' م',
        duration: `${item.schedule.duration_days} يوماً`,
        status: rx.status, // active or completed
        instructions: item.instructions || 'لا توجد تعليمات إضافية.',
        doctorName: 'أ.د. طارق الحكيم',
        specialty: 'استشاري جراحة العظام والعمود الفقري',
        date: rx.starts_on,
      }))
  );
});

// فلترة الأدوية
const filteredMedications = computed(() => {
  return allAggregatedMeds.value.filter(med => {
    const matchSearch = med.name.includes(searchQuery.value) || med.scientificName.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchStatus = !filterStatus.value || med.status === filterStatus.value;
    const matchForm = !filterForm.value || med.form === filterForm.value;
    const matchDoctor = !filterDoctor.value || med.doctorName.includes(filterDoctor.value);

    return matchSearch && matchStatus && matchForm && matchDoctor;
  });
});

// الدواء المختار حالياً
const selectedMed = ref(allAggregatedMeds.value[0] || null);
</script>
