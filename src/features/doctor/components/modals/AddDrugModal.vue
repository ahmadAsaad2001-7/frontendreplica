<template>
  <div v-if="isOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-[32px] w-full max-w-4xl h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95" dir="rtl">

      <!-- Header -->
      <div class="p-5 flex justify-between items-center bg-white shrink-0">
        <h2 class="font-extrabold text-slate-800 text-lg flex items-center gap-2">
          <Pill class="w-5 h-5 text-teal-600" /> نافذة اختيار الدواء (Add Drug Modal)
        </h2>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-700 bg-slate-50 rounded-full p-2 border border-slate-100 transition">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Tabs Container -->
      <div class="px-6 pb-4 shrink-0">
        <div class="bg-slate-100 p-1.5 rounded-full w-full max-w-xl mx-auto flex gap-1">
          <button
            @click="activeTab = 'containers'"
            :class="activeTab === 'containers' ? 'bg-white text-slate-800 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-700 font-semibold'"
            class="flex-1 py-2.5 rounded-full text-sm transition-all flex items-center justify-center gap-2"
          >
            <Package class="w-4 h-4" /> حاوياتي المجهزة والجرعات الجاهزة (Click Kits)
          </button>
          <button
            @click="activeTab = 'catalog'"
            :class="activeTab === 'catalog' ? 'bg-white text-slate-800 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-700 font-semibold'"
            class="flex-1 py-2.5 rounded-full text-sm transition-all flex items-center justify-center gap-2"
          >
            <Search class="w-4 h-4" /> دليل كل الأدوية (All Drugs Catalog)
          </button>
        </div>
      </div>

      <!-- Body (Scrollable) -->
      <div class="flex-1 overflow-y-auto px-6 pb-6 bg-white">

        <!-- ========================================== -->
        <!-- TAB 1: CONTAINERS (الحاويات الجاهزة)       -->
        <!-- ========================================== -->
        <div v-if="activeTab === 'containers'" class="space-y-4 max-w-3xl mx-auto">

          <div class="flex justify-between items-center mb-2 mt-2">
            <h3 class="font-bold text-slate-700 text-sm flex items-center gap-2">
              <Package class="w-4 h-4 text-slate-400" /> الحاويات الجاهزة (Click Kits):
            </h3>
            <button class="text-xs text-teal-600 font-bold flex items-center gap-1 hover:underline">
              <Plus class="w-3.5 h-3.5" /> إنشاء حاوية جديدة مخصصة
            </button>
          </div>

          <!-- ✅ تم التعديل هنا: استخدام catalogStore.containers بدلاً من المتغير المحلي -->
          <div v-for="container in catalogStore.containers" :key="container.id" class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

            <!-- Container Header -->
            <div class="p-4 bg-slate-50/50 flex justify-between items-center border-b border-slate-100">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100">
                  <Package class="w-5 h-5" />
                </div>
                <div>
                  <h4 class="font-extrabold text-slate-800 text-sm">{{ container.name }}</h4>
                  <p class="text-[11px] text-slate-500 mt-0.5">{{ container.description }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <span class="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-md">{{ container.drugs.length }} أدوية مشمولة</span>
                <button
                  @click="$emit('add-container', container.drugs)"
                  class="bg-teal-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-teal-700 transition shadow-sm flex items-center gap-1.5"
                >
                  <Check class="w-3.5 h-3.5" /> تطبيق الحاوية بالكامل
                </button>
              </div>
            </div>

            <!-- Container Drugs List -->
            <div class="divide-y divide-slate-100">
              <div v-for="drug in container.drugs" :key="drug.id" class="p-4 flex justify-between items-center hover:bg-slate-50 transition">
                <div class="flex-1 min-w-0 pr-4">
                  <div class="flex items-baseline gap-2 flex-wrap">
                    <h5 class="font-bold text-slate-800 text-sm">{{ drug.name }}</h5>
                    <span class="text-[10px] font-mono text-slate-400">({{ drug.scientificName }})</span>
                  </div>
                  <p class="text-[11px] text-slate-500 mt-1">{{ drug.defaultDose }} • {{ drug.defaultFrequency }}</p>
                </div>

                <button
                  @click="$emit('add-drug', drug)"
                  class="shrink-0 bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1 border border-teal-100"
                >
                  <Plus class="w-3 h-3" /> اختيار هذا الدواء للروشتة
                </button>
              </div>
            </div>

          </div>
        </div>

        <!-- ========================================== -->
        <!-- TAB 2: ALL DRUGS CATALOG (الكتالوج)        -->
        <!-- ========================================== -->
        <div v-if="activeTab === 'catalog'" class="space-y-4 max-w-4xl mx-auto mt-2">

          <!-- Search & Filters -->
          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="اكتب اسم الدواء التجاري أو العلمي (مثل: Amlodipine, Panadol...)"
                class="w-full p-3 pl-10 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500 bg-white"
              >
              <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>

            <div class="flex gap-2 flex-wrap text-xs font-bold">
              <button class="bg-teal-600 text-white px-4 py-1.5 rounded-lg shadow-sm">الكل</button>
              <button class="bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 px-4 py-1.5 rounded-lg transition">مسكنات</button>
              <button class="bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 px-4 py-1.5 rounded-lg transition">مضادات حيوية</button>
              <button class="bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 px-4 py-1.5 rounded-lg transition">ضغط</button>
              <button class="bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 px-4 py-1.5 rounded-lg transition">معدة</button>
            </div>
          </div>

          <!-- Drugs List -->
          <div class="space-y-3">
            <div v-for="drug in filteredCatalog" :key="drug.id" class="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm hover:border-teal-300 transition flex justify-between items-center">

              <div class="flex-1 min-w-0 pr-4">
                <h4 class="font-extrabold text-slate-800 text-sm flex items-baseline gap-2 flex-wrap">
                  {{ drug.name }}
                  <span class="text-[10px] font-normal text-slate-400 font-mono">({{ drug.scientificName }})</span>
                </h4>
                <p class="text-[11px] text-slate-500 mt-1">{{ drug.defaultDose }} • {{ drug.defaultFrequency }}</p>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <button
                  @click="openSaveToKit(drug)"
                  class="bg-slate-100 text-slate-600 font-bold px-3 py-2 rounded-xl text-xs hover:bg-slate-200 transition flex items-center gap-1"
                >
                  <Package class="w-3.5 h-3.5" /> + حاوية
                </button>
                <button
                  @click="$emit('add-drug', drug)"
                  class="bg-teal-600 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-teal-700 transition shadow-sm"
                >
                  إضافة للروشتة
                </button>
              </div>
            </div>

            <div v-if="filteredCatalog.length === 0" class="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <Search class="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p class="text-slate-500 font-bold">لا توجد أدوية مطابقة لبحثك</p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Modal إضافة إلى حاوية -->
    <SaveToKitModal
      :is-open="isSaveToKitOpen"
      :drug="selectedDrugForKit"
      @close="isSaveToKitOpen = false"
      @saved="onDrugSavedToKit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Pill, X, Package, Search, Check, Plus } from 'lucide-vue-next';
import { useCatalogStore, type CatalogDrug } from '../../../../stores/catalogStore';
import SaveToKitModal from './SaveToKitModal.vue';

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['close', 'add-drug', 'add-container']);

const catalogStore = useCatalogStore();

const activeTab = ref<'containers' | 'catalog'>('containers');
const searchQuery = ref('');

// ✅ تم حذف مصفوفة containers المحلية من هنا تماماً

// متغيرات التحكم في نافذة الحفظ
const isSaveToKitOpen = ref(false);
const selectedDrugForKit = ref<CatalogDrug | null>(null);

// فلترة الكتالوج
const filteredCatalog = computed(() => {
  if (!searchQuery.value) return catalogStore.drugs;
  const q = searchQuery.value.toLowerCase();
  return catalogStore.drugs.filter(d =>
    d.name.toLowerCase().includes(q) || d.scientificName.toLowerCase().includes(q)
  );
});

function openSaveToKit(drug: CatalogDrug) {
  selectedDrugForKit.value = drug;
  isSaveToKitOpen.value = true;
}

function onDrugSavedToKit() {
  // الواجهة ستحدث تلقائياً لأننا نقرأ الآن من catalogStore.containers مباشرة
}
</script>
