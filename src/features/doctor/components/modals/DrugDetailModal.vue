<template>
  <div v-if="isOpen && drug" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200" dir="rtl">

      <!-- Left Side (Visual & Info) -->
      <div class="w-full md:w-1/2 bg-slate-50 p-8 border-l border-slate-200 flex flex-col items-center">
        <div class="w-40 h-40 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden bg-white shadow-sm">
           <div v-if="drug.formType === 'tablet'" class="tablet scale-150" :style="{ background: `linear-gradient(135deg, ${drug.formColor || '#cbd5e1'}, ${shadeColor(drug.formColor || '#cbd5e1', -20)})` }"></div>
           <div v-else-if="drug.formType === 'capsule'" class="capsule scale-150" :style="{ background: `linear-gradient(to right, ${drug.formColor || '#cbd5e1'} 50%, ${shadeColor(drug.formColor || '#cbd5e1', -20)} 50%)` }"></div>
           <div v-else-if="drug.formType === 'syrup'" class="syrup-bottle scale-150" :style="{ background: `linear-gradient(135deg, ${drug.formColor || '#cbd5e1'}, ${shadeColor(drug.formColor || '#cbd5e1', -20)})` }"></div>
           <div v-else-if="drug.formType === 'ampoule'" class="ampoule scale-150" :style="{ background: `linear-gradient(135deg, ${drug.formColor || '#cbd5e1'}, ${shadeColor(drug.formColor || '#cbd5e1', -20)})` }"></div>
           <div v-else-if="drug.formType === 'inhaler'" class="inhaler scale-150" :style="{ background: `linear-gradient(135deg, ${drug.formColor || '#cbd5e1'}, ${shadeColor(drug.formColor || '#cbd5e1', -20)})` }"></div>
        </div>

        <h2 class="text-2xl font-extrabold text-slate-800 text-center">{{ drug.name }}</h2>
        <p class="text-sm text-slate-500 text-center mb-6 font-mono">{{ drug.nameEn }}</p>

        <div class="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3 text-sm">
          <div class="flex justify-between border-b border-slate-100 pb-2">
            <span class="text-slate-500">المادة الفعالة</span>
            <span class="font-bold text-slate-800 text-left">{{ drug.scientificName }}</span>
          </div>
          <div class="flex justify-between border-b border-slate-100 pb-2">
            <span class="text-slate-500">الشركة المصنعة</span>
            <span class="font-bold text-slate-800 text-left">{{ drug.manufacturer }}</span>
          </div>
          <div class="flex justify-between border-b border-slate-100 pb-2">
            <span class="text-slate-500">المخزون المتاح</span>
            <span class="font-bold text-slate-800 text-left">{{ drug.stock || 0 }} وحدة</span>
          </div>
          <div class="flex justify-between pt-1">
            <span class="text-slate-500">السعر</span>
            <span class="font-extrabold text-teal-700 text-xl text-left">{{ drug.price }} ر.س</span>
          </div>
        </div>

        <button @click="$emit('add-to-rx', drug)" class="w-full mt-6 py-3 bg-teal-600 text-white font-bold rounded-xl shadow-md hover:bg-teal-700 transition flex items-center justify-center gap-2">
          <Plus class="w-5 h-5" /> إضافة للروشتة
        </button>
      </div>

      <!-- Right Side (Instructions) -->
      <div class="w-full md:w-1/2 p-8 flex flex-col">
        <div class="flex justify-between items-center mb-6">
          <h3 class="font-bold text-lg text-slate-800 flex items-center gap-2">
            <FileText class="w-5 h-5 text-amber-600" /> التعليمات الطبية
          </h3>
          <button @click="$emit('close')" class="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-full transition">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 flex-1 overflow-y-auto">
          <p class="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">{{ drug.usageInstructions }}</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { FileText, X, Plus } from 'lucide-vue-next';
import type { CatalogDrug } from '../../../../stores/catalogStore';

defineProps<{ isOpen: boolean; drug: CatalogDrug | null }>();
defineEmits(['close', 'add-to-rx']);

function shadeColor(hex: string, percent: number) {
  if (!hex || !hex.startsWith('#')) return '#cbd5e1';
  let R = parseInt(hex.slice(1, 3), 16);
  let G = parseInt(hex.slice(3, 5), 16);
  let B = parseInt(hex.slice(5, 7), 16);
  R = Math.max(0, Math.min(255, R + (R * percent / 100)));
  G = Math.max(0, Math.min(255, G + (G * percent / 100)));
  B = Math.max(0, Math.min(255, B + (B * percent / 100)));
  return '#' + Math.round(R).toString(16).padStart(2, '0') + Math.round(G).toString(16).padStart(2, '0') + Math.round(B).toString(16).padStart(2, '0');
}
</script>
