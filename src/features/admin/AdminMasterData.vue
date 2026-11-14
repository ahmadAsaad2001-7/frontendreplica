<template>
  <div class="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300" dir="rtl">

    <!-- Header -->
    <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
          <Database class="w-6 h-6 text-slate-800" /> إدارة البيانات الأساسية
        </h1>
        <p class="text-sm text-slate-500 mt-1">إدارة كتالوج الأدوية المعتمدة وأكواد التصنيف الدولي للأمراض (ICD-10).</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex bg-slate-200/60 p-1 rounded-xl w-full max-w-md">
      <button @click="activeTab = 'drugs'" :class="activeTab === 'drugs' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'" class="flex-1 font-bold py-2.5 rounded-lg text-sm transition">
        كتالوج الأدوية
      </button>
      <button @click="activeTab = 'icd10'" :class="activeTab === 'icd10' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'" class="flex-1 font-bold py-2.5 rounded-lg text-sm transition">
        أكواد التشخيص (ICD-10)
      </button>
    </div>

    <!-- Drugs Tab -->
    <div v-if="activeTab === 'drugs'" class="space-y-4">
      <!-- Add Form -->
      <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2"><Plus class="w-4 h-4 text-blue-500" /> إضافة دواء جديد للكتالوج</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input v-model="newDrug.name" type="text" placeholder="اسم الدواء التجاري" class="p-2.5 border rounded-xl text-sm bg-slate-50">
          <input v-model="newDrug.scientificName" type="text" placeholder="المادة الفعالة" class="p-2.5 border rounded-xl text-sm bg-slate-50">
          <input v-model="newDrug.category" type="text" placeholder="التصنيف (مضاد حيوي، مسكن...)" class="p-2.5 border rounded-xl text-sm bg-slate-50">
          <button @click="handleAddDrug" class="bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 transition">إضافة</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3">
          <input v-model="newDrug.defaultDose" type="text" placeholder="الجرعة الافتراضية (قرص...)" class="p-2.5 border rounded-xl text-sm bg-slate-50">
          <input v-model="newDrug.defaultFrequency" type="text" placeholder="التكرار الافتراضي (كل 12 ساعة...)" class="p-2.5 border rounded-xl text-sm bg-slate-50">
        </div>
      </div>

      <!-- List -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table class="w-full text-right text-sm">
          <thead class="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th class="p-4 font-bold">الدواء</th>
              <th class="p-4 font-bold">المادة الفعالة</th>
              <th class="p-4 font-bold">التصنيف</th>
              <th class="p-4 font-bold">الجرعة الافتراضية</th>
              <th class="p-4 font-bold">إجراء</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="drug in catalogStore.drugs" :key="drug.id" class="hover:bg-slate-50">
              <td class="p-4 font-bold text-slate-800">{{ drug.name }}</td>
              <td class="p-4 text-slate-600">{{ drug.scientificName }}</td>
              <td class="p-4"><span class="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-bold">{{ drug.category }}</span></td>
              <td class="p-4 text-slate-600">{{ drug.defaultDose }} - {{ drug.defaultFrequency }}</td>
              <td class="p-4">
                <button @click="catalogStore.removeDrug(drug.id)" class="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition">
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ICD-10 Tab -->
    <div v-if="activeTab === 'icd10'" class="space-y-4">
      <!-- Add Form -->
      <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2"><Plus class="w-4 h-4 text-blue-500" /> إضافة كود تشخيص جديد</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input v-model="newICD.code" type="text" placeholder="الكود (مثال: I10)" class="p-2.5 border rounded-xl text-sm bg-slate-50 font-mono uppercase">
          <input v-model="newICD.description" type="text" placeholder="وصف التشخيص" class="p-2.5 border rounded-xl text-sm bg-slate-50 md:col-span-2">
          <button @click="handleAddICD" class="bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 transition">إضافة</button>
        </div>
      </div>

      <!-- List -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table class="w-full text-right text-sm">
          <thead class="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th class="p-4 font-bold">الكود</th>
              <th class="p-4 font-bold">الوصف</th>
              <th class="p-4 font-bold">التصنيف</th>
              <th class="p-4 font-bold">إجراء</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="icd in catalogStore.icd10Codes" :key="icd.code" class="hover:bg-slate-50">
              <td class="p-4 font-mono font-bold text-blue-700">{{ icd.code }}</td>
              <td class="p-4 text-slate-800 font-bold">{{ icd.description }}</td>
              <td class="p-4 text-slate-500">{{ icd.category }}</td>
              <td class="p-4">
                <button @click="catalogStore.removeICD10(icd.code)" class="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition">
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Database, Plus, Trash2 } from 'lucide-vue-next';
import { useCatalogStore } from '../../stores/catalogStore';

const catalogStore = useCatalogStore();
const activeTab = ref<'drugs' | 'icd10'>('drugs');

// Form State
const newDrug = reactive({ name: '', scientificName: '', category: '', defaultDose: '', defaultFrequency: '' });
const newICD = reactive({ code: '', description: '', category: 'عام' });

function handleAddDrug() {
  if (!newDrug.name || !newDrug.scientificName) return;
  catalogStore.addDrug({ ...newDrug });
  Object.assign(newDrug, { name: '', scientificName: '', category: '', defaultDose: '', defaultFrequency: '' });
}

function handleAddICD() {
  if (!newICD.code || !newICD.description) return;
  catalogStore.addICD10({ code: newICD.code.toUpperCase(), description: newICD.description, category: newICD.category });
  Object.assign(newICD, { code: '', description: '', category: 'عام' });
}
</script>
