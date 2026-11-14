<template>
  <div v-if="isOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95" dir="rtl">

      <!-- Header -->
      <div class="p-5 flex justify-between items-center bg-white border-b border-slate-100">
        <h2 class="font-extrabold text-slate-800 text-base flex items-center gap-2">
          <Package class="w-5 h-5 text-teal-600" /> إضافة دواء إلى حاوية (Save to Kit)
        </h2>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-700 bg-slate-50 p-1.5 rounded-lg transition">
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 space-y-5">

        <!-- Drug Info Banner (Teal Background) -->
        <div class="bg-teal-50 border border-teal-100 rounded-2xl p-4 text-center">
          <p class="text-xs text-slate-500 font-bold mb-1">الدواء المراد إضافته للحاوية:</p>
          <h3 class="text-lg font-extrabold text-teal-900">{{ drug?.name }}</h3>
          <p class="text-xs font-mono text-teal-600 mt-0.5">({{ drug?.scientificName }})</p>
        </div>

        <!-- Toggle Mode -->
        <div class="bg-slate-100 p-1 rounded-xl flex">
          <button
            @click="mode = 'existing'"
            :class="mode === 'existing' ? 'bg-white text-slate-800 shadow-sm font-bold' : 'text-slate-500 font-semibold'"
            class="flex-1 py-2 text-xs rounded-lg transition-all"
          >
            إضافة حاوية موجودة
          </button>
          <button
            @click="mode = 'new'"
            :class="mode === 'new' ? 'bg-white text-teal-700 shadow-sm font-bold' : 'text-slate-500 font-semibold'"
            class="flex-1 py-2 text-xs rounded-lg transition-all flex items-center justify-center gap-1"
          >
            <Plus class="w-3.5 h-3.5" /> إنشاء حاوية جديدة للدواء
          </button>
        </div>

        <!-- Existing Mode Dropdown -->
        <div v-if="mode === 'existing'" class="space-y-2">
          <label class="block text-xs font-bold text-slate-700">اختر الحاوية المستهدفة:</label>
          <select v-model="selectedContainerId" class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500 bg-slate-50">
            <option value="" disabled>-- اختر حاوية --</option>
            <option v-for="c in catalogStore.containers" :key="c.id" :value="c.id">
              {{ c.name }} ({{ c.drugs.length }} أدوية مشمولة)
            </option>
          </select>
        </div>

        <!-- New Mode Inputs -->
        <div v-if="mode === 'new'" class="space-y-4 animate-in fade-in">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5">اسم الحاوية الجديدة:</label>
            <input
              v-model="newContainerName"
              type="text"
              placeholder="مثال: أدوية الضغط والمتابعة الدورية..."
              class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500 bg-slate-50"
            >
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5">الوصف أو التصنيف:</label>
            <input
              v-model="newContainerDesc"
              type="text"
              placeholder="بروتوكول علاجي مخصص..."
              class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500 bg-slate-50"
            >
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="p-4 bg-white border-t border-slate-100 flex justify-end gap-2">
        <button @click="$emit('close')" class="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition">إلغاء</button>
        <button
          @click="handleSave"
          :disabled="mode === 'existing' ? !selectedContainerId : !newContainerName"
          class="px-6 py-2 bg-teal-600 text-white font-bold rounded-xl text-sm shadow-md hover:bg-teal-700 disabled:opacity-50 transition flex items-center gap-2"
        >
          <Check class="w-4 h-4" />
          {{ mode === 'existing' ? 'حفظ الدواء في الحاوية' : 'إنشاء الحاوية وحفظ الدواء فيها' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Package, X, Plus, Check } from 'lucide-vue-next';
import { useCatalogStore, type CatalogDrug } from '../../../../stores/catalogStore';

const props = defineProps<{
  isOpen: boolean;
  drug: CatalogDrug | null;
}>();

const emit = defineEmits(['close', 'saved']);
const catalogStore = useCatalogStore();

const mode = ref<'existing' | 'new'>('existing');
const selectedContainerId = ref('');
const newContainerName = ref('');
const newContainerDesc = ref('');

function handleSave() {
  if (!props.drug) return;

  if (mode.value === 'existing') {
    catalogStore.addDrugToContainer(selectedContainerId.value, props.drug);
    alert('تمت إضافة الدواء للحاوية بنجاح!');
  } else {
    catalogStore.addContainer(newContainerName.value, newContainerDesc.value, props.drug);
    alert('تم إنشاء الحاوية الجديدة وإضافة الدواء بها بنجاح!');
  }

  // تصفير الحقول
  selectedContainerId.value = '';
  newContainerName.value = '';
  newContainerDesc.value = '';

  emit('saved');
  emit('close');
}
</script>
