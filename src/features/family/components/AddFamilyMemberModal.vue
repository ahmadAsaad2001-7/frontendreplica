<template>
  <div v-if="isOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95" dir="rtl">

      <!-- Header -->
      <div class="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h2 class="font-bold text-slate-800 text-lg flex items-center gap-2">
          <UserPlus class="w-5 h-5 text-teal-600" /> إضافة فرد جديد للعائلة
        </h2>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-700">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Form Body -->
      <div class="p-6 space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2">
            <label class="block text-xs font-bold text-slate-700 mb-1">الاسم بالكامل</label>
            <input v-model="form.name" type="text" placeholder="مثال: سارة أحمد" class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500 bg-slate-50">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">صلة القرابة</label>
            <select v-model="form.relation" class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500 bg-slate-50">
              <option value="الزوجة">الزوجة</option>
              <option value="الابن">الابن</option>
              <option value="الابنة">الابنة</option>
              <option value="الوالد">الوالد</option>
              <option value="الوالدة">الوالدة</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">العمر</label>
            <input v-model="form.age" type="number" placeholder="مثال: 30" class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500 bg-slate-50">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">الجنس</label>
            <select v-model="form.gender" class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500 bg-slate-50">
              <option value="female">أنثى</option>
              <option value="male">ذكر</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">فصيلة الدم</label>
            <select v-model="form.bloodType" class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500 bg-slate-50">
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
        <button @click="$emit('close')" class="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl">إلغاء</button>
        <button @click="handleSubmit" :disabled="!form.name || !form.age" class="px-6 py-2 bg-teal-600 text-white font-bold rounded-xl text-sm shadow-md hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2">
          <Check class="w-4 h-4" /> حفظ وإضافة
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { UserPlus, X, Check } from 'lucide-vue-next';

defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['close', 'add']);

const form = reactive({
  name: '',
  relation: 'الابن',
  age: '',
  gender: 'male',
  bloodType: 'O+'
});

function handleSubmit() {
  emit('add', { ...form, age: Number(form.age) });
  // تصفير الفورم
  form.name = '';
  form.age = '';
  emit('close');
}
</script>
