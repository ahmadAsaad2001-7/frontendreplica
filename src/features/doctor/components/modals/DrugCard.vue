<template>
  <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-teal-300 relative flex flex-col group cursor-pointer" @click="$emit('view-details', drug)">

    <!-- شريط علوي ملون يظهر عند الـ Hover -->
    <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-l from-teal-600 to-emerald-500 scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-300"></div>

    <div class="p-5 pb-3">
      <div class="flex items-start justify-between mb-4">
        <!-- الشكل الدوائي -->
        <div class="w-16 h-16 rounded-xl flex items-center justify-center relative overflow-hidden bg-slate-50">
          <div v-if="drug.formType === 'tablet'" class="tablet" :style="{ background: `linear-gradient(135deg, ${drug.formColor || '#cbd5e1'}, ${shadeColor(drug.formColor || '#cbd5e1', -20)})` }"></div>
          <div v-else-if="drug.formType === 'capsule'" class="capsule" :style="{ background: `linear-gradient(to right, ${drug.formColor || '#cbd5e1'} 50%, ${shadeColor(drug.formColor || '#cbd5e1', -20)} 50%)` }"></div>
          <div v-else-if="drug.formType === 'syrup'" class="syrup-bottle" :style="{ background: `linear-gradient(135deg, ${drug.formColor || '#cbd5e1'}, ${shadeColor(drug.formColor || '#cbd5e1', -20)})` }"></div>
          <div v-else-if="drug.formType === 'ampoule'" class="ampoule" :style="{ background: `linear-gradient(135deg, ${drug.formColor || '#cbd5e1'}, ${shadeColor(drug.formColor || '#cbd5e1', -20)})` }"></div>
          <div v-else-if="drug.formType === 'inhaler'" class="inhaler" :style="{ background: `linear-gradient(135deg, ${drug.formColor || '#cbd5e1'}, ${shadeColor(drug.formColor || '#cbd5e1', -20)})` }"></div>
        </div>

        <!-- حالة المخزون -->
        <div class="flex flex-col items-end gap-1.5">
          <span :class="getStockBadge(drug.stockStatus).class" class="px-2.5 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full" :class="getStockBadge(drug.stockStatus).dot"></span>
            {{ getStockBadge(drug.stockStatus).text }}
          </span>
        </div>
      </div>

      <!-- الاسم -->
      <h3 class="text-base font-bold text-slate-800 leading-tight mb-0.5">{{ drug.name }}</h3>
      <p class="text-[11px] text-slate-400 mb-3 font-mono">{{ drug.nameEn }}</p>

      <!-- التفاصيل -->
      <div class="space-y-1.5 mb-3">
        <div class="flex items-center gap-2 text-xs">
          <span class="text-slate-400 shrink-0">المادة الفعالة:</span>
          <span class="font-semibold text-slate-700 truncate">{{ drug.scientificName }}</span>
        </div>
        <div class="flex items-center gap-2 text-xs">
          <span class="text-slate-400 shrink-0">الشركة:</span>
          <span class="font-semibold text-slate-700">{{ drug.manufacturer }}</span>
        </div>
      </div>

      <!-- التصنيفات -->
      <div class="flex flex-wrap gap-1.5 mb-4">
        <span v-for="tag in drug.tags" :key="tag" class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-100">
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- السعر والأزرار -->
    <div class="px-5 pb-4 mt-auto border-t border-slate-100 pt-3">
      <div class="flex items-baseline gap-2 mb-3">
        <span class="text-xl font-bold text-teal-700">{{ drug.price }}</span>
        <span class="text-[12px] text-slate-400">ر.س</span>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <button @click.stop="$emit('add-to-rx', drug)" class="py-2 rounded-xl text-xs font-bold bg-slate-50 text-slate-600 hover:bg-teal-600 hover:text-white transition flex items-center justify-center gap-1.5">
          <Plus class="w-3.5 h-3.5" /> للروشتة
        </button>
          <button @click.stop="$emit('add-to-container', drug)" class="py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white transition flex items-center justify-center gap-1.5">
    <Package class="w-3.5 h-3.5" /> للحاوية
  </button>
        <button @click.stop="$emit('view-details', drug)" class="py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white transition flex items-center justify-center gap-1.5">
          <Info class="w-3.5 h-3.5" /> التفاصيل
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, Info } from 'lucide-vue-next';
import type { CatalogDrug } from '../../../stores/catalogStore';

defineProps<{ drug: CatalogDrug }>();
defineEmits(['add-to-rx', 'view-details', 'add-to-container']);
function shadeColor(hex: string, percent: number) {
  if (!hex || !hex.startsWith('#')) return '#cbd5e1'; // fallback to slate-300
  let R = parseInt(hex.slice(1, 3), 16);
  let G = parseInt(hex.slice(3, 5), 16);
  let B = parseInt(hex.slice(5, 7), 16);
  R = Math.max(0, Math.min(255, R + (R * percent / 100)));
  G = Math.max(0, Math.min(255, G + (G * percent / 100)));
  B = Math.max(0, Math.min(255, B + (B * percent / 100)));
  return '#' + Math.round(R).toString(16).padStart(2, '0') + Math.round(G).toString(16).padStart(2, '0') + Math.round(B).toString(16).padStart(2, '0');
}

function getStockBadge(status?: string) {
  if (status === 'ok') return { class: 'bg-emerald-50 text-emerald-700 border border-emerald-100', dot: 'bg-emerald-500', text: 'متوفر' };
  if (status === 'low') return { class: 'bg-amber-50 text-amber-700 border border-amber-100', dot: 'bg-amber-500', text: 'مخزون منخفض' };
  return { class: 'bg-rose-50 text-rose-700 border border-rose-100', dot: 'bg-rose-500', text: 'غير متوفر' };
}
</script>
