<template>
  <div class="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300" dir="rtl">

    <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
      <div class="w-12 h-12 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center">
        <Building class="w-6 h-6" />
      </div>
      <div>
        <h1 class="text-xl font-extrabold text-slate-800">إعدادات العيادة والملف الشخصي</h1>
        <p class="text-sm text-slate-500 mt-1">بيانات إدارية فقط — تُحقن تلقائياً في ترويسة كل روشتة مطبوعة وPDF</p>
      </div>
    </div>

    <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="md:col-span-2">
          <label class="block text-sm font-bold text-slate-700 mb-2">اسم العيادة / المستشفى</label>
          <input v-model="form.clinicName" type="text" class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500 bg-slate-50">
        </div>
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-2">اسم الطبيب</label>
          <input v-model="form.doctorName" type="text" class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500 bg-slate-50">
        </div>
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-2">التخصص</label>
          <input v-model="form.specialty" type="text" class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500 bg-slate-50">
        </div>
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-2">رقم الهاتف</label>
          <input v-model="form.phone" type="text" class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500 bg-slate-50">
        </div>
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-2">العنوان</label>
          <input v-model="form.address" type="text" class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500 bg-slate-50">
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-bold text-slate-700 mb-2">رقم الترخيص</label>
          <input v-model="form.licenseNumber" type="text" class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500 bg-slate-50">
        </div>

        <!-- الشعار -->
        <div class="md:col-span-2">
          <label class="block text-sm font-bold text-slate-700 mb-2">شعار العيادة (اختياري)</label>
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
              <img v-if="form.logo" :src="form.logo" class="w-full h-full object-contain" />
              <ImagePlus v-else class="w-6 h-6 text-slate-300" />
            </div>
            <label class="bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer hover:bg-slate-200 transition">
              اختيار صورة
              <input type="file" accept="image/*" class="hidden" @change="onLogo" />
            </label>
            <button v-if="form.logo" @click="form.logo = ''" class="text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition"><Trash2 class="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <div class="pt-4 border-t border-slate-100 flex justify-end items-center gap-3">
        <span v-if="saved" class="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1">
          <CheckCircle2 class="w-3.5 h-3.5" /> تم الحفظ
        </span>
        <button @click="handleSave" class="bg-teal-600 text-white font-bold px-8 py-3 rounded-xl shadow-md hover:bg-teal-700 transition flex items-center gap-2">
          <Save class="w-4 h-4" /> حفظ التغييرات
        </button>
      </div>
    </div>

    <!-- معاينة حية لترويسة الطباعة -->
    <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
      <h3 class="text-sm font-extrabold text-slate-700 mb-3">معاينة ترويسة الروشتة</h3>
      <PrescriptionPrintHeader :preview="form" />
    </div>

  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useClinicProfileStore } from '../../stores/clinicProfileStore';
import { Building, Save, ImagePlus, Trash2, CheckCircle2 } from 'lucide-vue-next';
import PrescriptionPrintHeader from './components/PrescriptionPrintHeader.vue';

const clinicStore = useClinicProfileStore();
const saved = ref(false);

const form = reactive({
  clinicName: clinicStore.clinicName,
  doctorName: clinicStore.doctorName,
  specialty: clinicStore.specialty,
  phone: clinicStore.phone,
  address: clinicStore.address,
  licenseNumber: clinicStore.licenseNumber,
  logo: clinicStore.logo,
});

function onLogo(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => { form.logo = String(reader.result); };
  reader.readAsDataURL(file);
}

function handleSave() {
  clinicStore.updateProfile({ ...form });
  saved.value = true;
  setTimeout(() => (saved.value = false), 2500);
}
</script>
