<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-5" dir="rtl">
    <div class="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
      <div class="flex gap-2">
        <input v-model="newName" placeholder="اسم الحاوية" class="flex-1 p-2 border border-slate-200 rounded-lg text-sm" />
        <button @click="createKit" :disabled="!newName.trim()" class="bg-teal-600 text-white px-3 rounded-lg text-sm font-bold disabled:opacity-40">إنشاء</button>
      </div>
      <input v-model="newDesc" placeholder="وصف مختصر" class="w-full p-2 border border-slate-200 rounded-lg text-sm" />
      <div class="space-y-2 max-h-[420px] overflow-y-auto">
        <button v-for="c in catalog.containers" :key="c.id" type="button" @click="selectedId = c.id"
          :class="['w-full text-right p-3 rounded-xl border transition', selectedId === c.id ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:bg-slate-50']">
          <div class="flex justify-between items-center">
            <span class="font-bold text-sm text-slate-800">{{ c.name }}</span>
            <span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">{{ c.drugs.length }} دواء</span>
          </div>
          <p class="text-[11px] text-slate-400 mt-1 truncate">{{ c.description }}</p>
        </button>
        <p v-if="catalog.containers.length === 0" class="text-center text-xs text-slate-400 py-6">لا توجد حاويات بعد</p>
      </div>
    </div>

    <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5">
      <div v-if="!selected" class="text-center py-16 text-slate-400 text-sm">اختر حاوية من القائمة أو أنشئ واحدة جديدة</div>
      <template v-else>
        <div class="flex justify-between items-start gap-3 mb-4">
          <div class="flex-1 space-y-2">
            <input :value="selected.name" @input="catalog.updateContainer(selected.id, { name: ($event.target as HTMLInputElement).value })" class="w-full p-2 border border-slate-200 rounded-lg font-bold text-sm" />
            <input :value="selected.description" @input="catalog.updateContainer(selected.id, { description: ($event.target as HTMLInputElement).value })" class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
          </div>
          <div class="flex gap-2">
            <button @click="isAddOpen = true" class="bg-teal-50 text-teal-700 border border-teal-200 px-3 py-2 rounded-lg text-xs font-bold">+ إضافة دواء</button>
            <button @click="deleteKit" class="bg-rose-50 text-rose-600 border border-rose-200 px-3 py-2 rounded-lg text-xs font-bold">حذف الحاوية</button>
          </div>
        </div>
        <div v-if="selected.drugs.length === 0" class="text-center py-10 border border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">الحاوية فارغة — أضف أدوية من الكتالوج</div>
        <div v-else class="space-y-2">
          <div v-for="d in selected.drugs" :key="d.id" class="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <p class="text-sm font-bold text-slate-800">{{ d.name }}</p>
              <p class="text-[10px] text-slate-500 font-mono">{{ d.scientificName }} · {{ d.defaultDose }} · {{ d.defaultFrequency }}</p>
            </div>
            <button @click="catalog.removeDrugFromContainer(selected.id, d.id)" class="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg"><Trash2 class="w-4 h-4" /></button>
          </div>
        </div>
      </template>
    </div>

    <AddDrugModal :is-open="isAddOpen" @close="isAddOpen = false" @add-drug="onAddDrug" @add-container="onAddContainer" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Trash2 } from 'lucide-vue-next';
import { useCatalogStore, type CatalogDrug } from '../../../../stores/catalogStore';
import AddDrugModal from '../modals/AddDrugModal.vue';

const catalog = useCatalogStore();
const selectedId = ref<string | null>(catalog.containers[0]?.id ?? null);
const selected = computed(() => catalog.containers.find(c => c.id === selectedId.value) ?? null);
const newName = ref(''); const newDesc = ref(''); const isAddOpen = ref(false);

function createKit() {
  if (!newName.value.trim()) return;
  const c = catalog.createContainer(newName.value.trim(), newDesc.value.trim());
  selectedId.value = c.id; newName.value = ''; newDesc.value = '';
}
function deleteKit() {
  if (!selected.value) return;
  catalog.removeContainer(selected.value.id);
  selectedId.value = catalog.containers[0]?.id ?? null;
}
function onAddDrug(drug: CatalogDrug) { if (selected.value) catalog.addDrugToContainer(selected.value.id, drug); isAddOpen.value = false; }
function onAddContainer(drugs: CatalogDrug[]) { if (selected.value) drugs.forEach(d => catalog.addDrugToContainer(selected.value!.id, d)); isAddOpen.value = false; }
</script>
