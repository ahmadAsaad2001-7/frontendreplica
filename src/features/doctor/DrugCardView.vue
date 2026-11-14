<template>
  <div class="min-h-screen bg-slate-50 font-sans pb-10" dir="rtl">
    <div class="max-w-[1400px] mx-auto px-6 py-6 space-y-6">

      <!-- 1. Hero Section -->
      <div class="bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-800 rounded-2xl p-6 text-white relative overflow-hidden shadow-md">
        <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span class="text-[11px] text-teal-100">قاعدة بيانات الصيدلية · تحديث اليوم</span>
            </div>
            <h1 class="text-2xl font-extrabold mb-2">دليل الأدوية المرجعي</h1>
            <p class="text-teal-100 text-sm max-w-lg leading-relaxed">تصفّح الأدوية، راجع المعلومات الدوائية، أضف إلى الوصفة، وتابع المخزون — كل ذلك في مكان واحد.</p>
          </div>
          <div class="flex gap-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div class="text-center">
              <div class="text-3xl font-extrabold">{{ catalogStore.drugs.length }}</div>
              <div class="text-[11px] text-teal-100 mt-1">دواء مسجل</div>
            </div>
            <div class="w-px bg-white/20"></div>
            <div class="text-center">
              <div class="text-3xl font-extrabold text-amber-300">{{ draftStore.planItems.filter(i => i.kind === 'medication').length }}</div>
              <div class="text-[11px] text-teal-100 mt-1">في الوصفة الحالية</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Filters Bar -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div class="flex items-center gap-2 mb-2">
          <Filter class="w-4 h-4 text-teal-600" />
          <span class="text-sm font-bold text-slate-800">تصفية النتائج</span>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <div class="relative flex-1 min-w-[250px]">
            <Search class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input v-model="searchQuery" type="text" placeholder="ابحث باسم الدواء أو المادة الفعالة..." class="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-10 pl-4 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition">
          </div>

          <div class="flex gap-2 overflow-x-auto pb-1">
            <button
              v-for="filter in filters"
              :key="filter.id"
              @click="activeFilter = filter.id"
              :class="[
                'px-4 py-2 rounded-xl text-xs font-bold border transition whitespace-nowrap flex items-center gap-2',
                activeFilter === filter.id ? 'bg-teal-600 text-white border-teal-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:bg-teal-50'
              ]"
            >
              {{ filter.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- 3. Results Info -->
      <div class="flex justify-between items-center text-sm text-slate-600 px-1">
        <span>عرض <strong class="text-slate-900">{{ filteredDrugs.length }}</strong> دواء</span>
        <span class="flex items-center gap-1 text-xs"><Info class="w-3.5 h-3.5" /> اضغط على البطاقة لعرض التفاصيل</span>
      </div>

      <!-- 4. Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
     <DrugCard
  v-for="drug in filteredDrugs"
  :key="drug.id"
  :drug="drug"
  @add-to-rx="addToRx"
  @view-details="openDetails"
  @add-to-container="openContainerModal"
/>
      </div>

      <!-- Empty State -->
      <div v-if="filteredDrugs.length === 0" class="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
        <PackageX class="w-16 h-16 text-slate-300 mx-auto mb-3" />
        <h3 class="text-lg font-bold text-slate-700">لا توجد نتائج مطابقة</h3>
        <p class="text-sm text-slate-500 mt-1">جرّب تعديل الفلاتر أو كلمات البحث</p>
      </div>

    </div>

    <!-- Modal -->
    <DrugDetailModal
      :is-open="isDetailOpen"
      :drug="selectedDrug"
      @close="isDetailOpen = false"
      @add-to-rx="handleAddToRxFromModal"
    />
    <AddToContainerModal
  :is-open="isContainerModalOpen"
  :drug="selectedDrugForContainer"
  @close="isContainerModalOpen = false"
  @added="handleAddedToContainer"
/>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Filter, Search, Info, PackageX } from 'lucide-vue-next';
import { useCatalogStore, type CatalogDrug } from '../../stores/catalogStore';
import { usePrescriptionDraftStore } from '../../stores/prescriptionDraftStore';
import DrugCard from "./components/modals/DrugCard.vue";
import DrugDetailModal from './components/modals/DrugDetailModal.vue';
import AddToContainerModal from './components/modals/AddToContainerModal.vue';

// أضف في الـ State
const isContainerModalOpen = ref(false);
const selectedDrugForContainer = ref<CatalogDrug | null>(null);

const catalogStore = useCatalogStore();
const draftStore = usePrescriptionDraftStore();

const searchQuery = ref('');
const activeFilter = ref('all');
const isDetailOpen = ref(false);
const selectedDrug = ref<CatalogDrug | null>(null);

const filters = [
  { id: 'all', name: 'الكل' },
  { id: 'مسكن', name: 'مسكنات' },
  { id: 'مضاد حيوي', name: 'مضادات حيوية' },
  { id: 'أدوية القلب', name: 'أدوية القلب' },
  { id: 'أدوية السكر', name: 'أدوية السكر' },
  { id: 'مضاد سعال', name: 'مضاد سعال' },
];

const filteredDrugs = computed(() => {
  return catalogStore.drugs.filter(drug => {
    const matchSearch = !searchQuery.value ||
      drug.name.includes(searchQuery.value) ||
      (drug.nameEn && drug.nameEn.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      drug.scientificName.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchFilter = activeFilter.value === 'all' || drug.category === activeFilter.value;

    return matchSearch && matchFilter;
  });
});
function openContainerModal(drug: CatalogDrug) {
  selectedDrugForContainer.value = drug;
  isContainerModalOpen.value = true;
}

function handleAddedToContainer(container: DrugContainer | null) {
  const drugName = selectedDrugForContainer.value?.name;
  const containerName = container?.name || 'حاوية جديدة';
  alert(`تم إضافة ${drugName} إلى ${containerName} بنجاح!`);
}
function addToRx(drug: CatalogDrug) {
  draftStore.addPlanItem({
    kind: 'medication',
    title: drug.name,
    scientificName: drug.scientificName,
    dosage: drug.defaultDose || 'قرص',
    frequency: drug.defaultFrequency || 'حسب تعليمات الطبيب',
    schedule: { times: ['12:00'], recurrence: { kind: 'daily' }, duration_days: 7 }
  });
  // يمكن استبدال alert بـ Toast Notification لاحقاً
  alert(`تمت إضافة ${drug.name} للروشتة.`);
}

function openDetails(drug: CatalogDrug) {
  selectedDrug.value = drug;
  isDetailOpen.value = true;
}

function handleAddToRxFromModal(drug: CatalogDrug) {
  addToRx(drug);
  isDetailOpen.value = false;
}
</script>
