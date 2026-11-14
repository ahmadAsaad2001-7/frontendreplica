<template>
  <div v-if="isOpen && drug" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95" dir="rtl">

      <!-- Header -->
      <div class="bg-amber-50 p-4 border-b border-amber-100 flex justify-between items-center">
        <h3 class="font-bold text-amber-900 flex items-center gap-2">
          <Package class="w-5 h-5 text-amber-600" />
          إضافة إلى حاوية
        </h3>
        <button @click="$emit('close')" class="text-amber-400 hover:text-amber-700 transition">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Drug Info -->
      <div class="p-4 border-b border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center">
            <Pill class="w-6 h-6 text-slate-400" />
          </div>
          <div>
            <h4 class="font-bold text-slate-800 text-sm">{{ drug.name }}</h4>
            <p class="text-xs text-slate-500">{{ drug.scientificName }}</p>
          </div>
        </div>
      </div>

      <!-- Existing Containers -->
      <div class="p-4">
        <h4 class="text-xs font-bold text-slate-500 mb-3">الحاويات المتاحة:</h4>

        <div v-if="containers.length === 0" class="text-center py-6 text-slate-400 text-sm">
          <Package class="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p>لا توجد حاويات محفوظة</p>
        </div>

        <div class="space-y-2">
          <button
            v-for="container in containers"
            :key="container.id"
            @click="selectContainer(container)"
            class="w-full p-3 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition text-right group"
          >
            <div class="flex items-center justify-between">
              <div>
                <h5 class="font-bold text-slate-800 text-sm group-hover:text-amber-900">{{ container.name }}</h5>
                <p class="text-xs text-slate-500 mt-0.5">{{ container.description }}</p>
                <p class="text-[10px] text-amber-600 mt-1">{{ container.drugs.length }} أدوية</p>
              </div>
              <ChevronLeft class="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
            </div>
          </button>
        </div>
      </div>

      <!-- Create New Container -->
      <div class="p-4 border-t border-slate-100 bg-slate-50">
        <button
          @click="showCreateForm = true"
          class="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 font-bold text-sm hover:border-amber-400 hover:text-amber-600 transition flex items-center justify-center gap-2"
        >
          <Plus class="w-4 h-4" /> إنشاء حاوية جديدة
        </button>
      </div>

      <!-- Create Form (يظهر عند الضغط على إنشاء جديد) -->
      <div v-if="showCreateForm" class="p-4 border-t border-slate-200 bg-white animate-in slide-in-from-top-2">
        <h4 class="text-xs font-bold text-slate-700 mb-3">بيانات الحاوية الجديدة:</h4>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">اسم الحاوية:</label>
            <input
              v-model="newContainer.name"
              type="text"
              placeholder="مثال: أدوية ما بعد الجراحة"
              class="w-full p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-500 bg-slate-50"
            >
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">الوصف:</label>
            <textarea
              v-model="newContainer.description"
              rows="2"
              placeholder="وصف مختصر للحاوية..."
              class="w-full p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-500 bg-slate-50 resize-none"
            ></textarea>
          </div>

          <div class="flex gap-2">
            <button
              @click="createNewContainer"
              :disabled="!newContainer.name"
              class="flex-1 py-2.5 bg-amber-600 text-white font-bold rounded-xl text-sm hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              إنشاء وإضافة
            </button>
            <button
              @click="showCreateForm = false"
              class="px-4 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-200 transition"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Package, X, Plus, ChevronLeft, Pill } from 'lucide-vue-next';
import { useCatalogStore, type CatalogDrug, type DrugContainer } from '../../../../stores/catalogStore';

const props = defineProps<{
  isOpen: boolean;
  drug: CatalogDrug | null
}>();

const emit = defineEmits(['close', 'added']);

const catalogStore = useCatalogStore();
const containers = ref<DrugContainer[]>([]);
const showCreateForm = ref(false);

const newContainer = ref({
  name: '',
  description: ''
});

// جلب الحاويات عند فتح المودال
watch(() => props.isOpen, (val) => {
  if (val) {
    containers.value = catalogStore.containers;
    showCreateForm.value = false;
    newContainer.value = { name: '', description: '' };
  }
});

function selectContainer(container: DrugContainer) {
  if (props.drug) {
    catalogStore.addDrugToContainer(container.id, props.drug);
    emit('added', container);
    emit('close');
  }
}

function createNewContainer() {
  if (props.drug && newContainer.value.name) {
    catalogStore.addContainer(newContainer.value.name, newContainer.value.description, props.drug);
    emit('added', null);
    emit('close');
  }
}
</script>
