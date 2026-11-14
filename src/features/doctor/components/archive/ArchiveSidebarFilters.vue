<template>
  <div class="space-y-4">

    <!-- Search Box -->
    <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
      <div class="relative">
        <Search class="w-4 h-4 absolute right-3 top-3 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="بحث بالاسم أو رقم الملف..."
          class="w-full pl-3 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500 transition-colors"
        >
      </div>
      <button class="w-full py-2 bg-teal-50 text-teal-700 font-bold rounded-xl text-xs hover:bg-teal-100 transition flex items-center justify-center gap-2">
        <SlidersHorizontal class="w-3.5 h-3.5" /> بحث متقدم
      </button>
    </div>

    <!-- Gender Filter -->
    <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
      <h4 class="text-xs font-bold text-slate-400 mb-3">الجنس</h4>
      <div class="space-y-1">
        <label class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition">
          <div class="flex items-center gap-2">
            <input type="radio" v-model="localFilters.gender" value="all" class="w-4 h-4 accent-teal-600">
            <span class="text-sm text-slate-700 font-medium">الكل</span>
          </div>
          <span class="text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md">{{ counts.total }}</span>
        </label>
        <label class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition">
          <div class="flex items-center gap-2">
            <input type="radio" v-model="localFilters.gender" value="male" class="w-4 h-4 accent-teal-600">
            <span class="text-sm text-slate-700 font-medium">ذكور</span>
          </div>
          <span class="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">{{ counts.male }}</span>
        </label>
        <label class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition">
          <div class="flex items-center gap-2">
            <input type="radio" v-model="localFilters.gender" value="female" class="w-4 h-4 accent-teal-600">
            <span class="text-sm text-slate-700 font-medium">إناث</span>
          </div>
          <span class="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">{{ counts.female }}</span>
        </label>
      </div>
    </div>

    <!-- Status Filter -->
    <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
      <h4 class="text-xs font-bold text-slate-400 mb-3">الحالة</h4>
      <div class="space-y-1">
        <label class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition">
          <div class="flex items-center gap-2">
            <input type="radio" v-model="localFilters.status" value="all" class="w-4 h-4 accent-teal-600">
            <span class="text-sm text-slate-700 font-medium">الكل</span>
          </div>
        </label>
        <label class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition">
          <div class="flex items-center gap-2">
            <input type="radio" v-model="localFilters.status" value="balance" class="w-4 h-4 accent-teal-600">
            <span class="flex items-center gap-2 text-sm text-slate-700 font-medium">
              <span class="w-2 h-2 rounded-full bg-amber-500"></span> رصيد مستحق
            </span>
          </div>
          <span class="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">{{ counts.balance }}</span>
        </label>
        <label class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition">
          <div class="flex items-center gap-2">
            <input type="radio" v-model="localFilters.status" value="chronic" class="w-4 h-4 accent-teal-600">
            <span class="flex items-center gap-2 text-sm text-slate-700 font-medium">
              <span class="w-2 h-2 rounded-full bg-orange-500"></span> حالة مزمنة
            </span>
          </div>
        </label>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { Search, SlidersHorizontal } from 'lucide-vue-next';
import { ref, watch } from 'vue';

const props = defineProps<{
  filters: { search: string, gender: string, status: string };
  counts: { total: number, male: number, female: number, balance: number };
}>();

const emit = defineEmits(['update:filters']);

// بنعمل نسخة محلية عشان نحدث الأب
const localFilters = ref({ ...props.filters });
const searchQuery = ref(props.filters.search);

// نراقب التغييرات ونرسلها للأب
watch(localFilters, (newVal) => {
  emit('update:filters', { ...newVal, search: searchQuery.value });
}, { deep: true });

watch(searchQuery, (newVal) => {
  emit('update:filters', { ...localFilters.value, search: newVal });
});
</script>
