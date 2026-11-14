<template>
  <!-- الغلاف الأساسي اللي كان ناقص -->
  <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6" dir="rtl">

    <!-- Filters Sidebar (Right) -->
    <div class="w-full lg:w-[340px] shrink-0 space-y-4">
      <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">

        <!-- Header -->
        <div class="flex justify-between items-center mb-1">
          <h3 class="font-extrabold text-slate-800 text-lg">فلتر البحث المتقدم</h3>
          <div class="flex items-center gap-2">
            <button @click="resetFilters" class="text-slate-400 hover:text-slate-700 transition">
              <RotateCcw class="w-5 h-5" />
            </button>
            <div class="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Filter class="w-4 h-4" />
            </div>
          </div>
        </div>
        <p class="text-xs text-slate-400 mb-6">تخصيص نتائج البحث</p>

        <div class="space-y-5">

          <!-- Name Search -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5">الاسم (Name):</label>
            <div class="relative">
              <input
                v-model="filters.name"
                type="text"
                placeholder="ابحث باسم الطبيب..."
                class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-700"
              >
              <Search class="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <!-- Governorate -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5">المحافظة (Governorate):</label>
            <select v-model="filters.governorate" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-emerald-500 text-slate-700 appearance-none cursor-pointer">
              <option value="">كافة المحافظات (جميع الأطباء)</option>
              <option value="القاهرة">القاهرة</option>
              <option value="الجيزة">الجيزة</option>
              <option value="الإسكندرية">الإسكندرية</option>
            </select>
          </div>

          <!-- Specialty -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5">التخصص الطبي (Specialty):</label>
            <select v-model="filters.specialty" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-emerald-500 text-slate-700 appearance-none cursor-pointer">
              <option value="">كافة التخصصات الطبية</option>
              <option value="عظام">جراحة العظام</option>
              <option value="قلب">أمراض القلب</option>
              <option value="جلدية">الجلدية والتجميل</option>
            </select>
          </div>

          <!-- City -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5">المدينة / الحي (City):</label>
            <select v-model="filters.city" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-emerald-500 text-slate-700 appearance-none cursor-pointer">
              <option value="">كافة المدن والأحياء</option>
              <option value="المعادي">المعادي</option>
              <option value="الدقي">الدقي</option>
              <option value="مدينة نصر">مدينة نصر</option>
            </select>
          </div>

          <!-- Rating -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-2">التقييم الأدنى (Rate):</label>
            <div class="flex gap-2">
              <button
                @click="filters.rating = 0"
                :class="filters.rating === 0 ? 'bg-amber-500 text-white border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'"
                class="flex-1 py-1.5 rounded-lg border text-xs font-bold transition-colors"
              >
                الكل
              </button>
              <button
                v-for="rate in [4.5, 4.8, 4.9]" :key="rate"
                @click="filters.rating = rate"
                :class="filters.rating === rate ? 'bg-amber-500 text-white border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'"
                class="flex-1 py-1.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-1 transition-colors"
              >
                {{ rate }} <Star class="w-3 h-3 fill-current" />
              </button>
            </div>
          </div>

          <!-- Price Range -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-2">أقصى سعر للكشف (Price):</label>
            <input
              type="range"
              min="250"
              max="1000"
              step="50"
              v-model="filters.maxPrice"
              class="w-full accent-emerald-500 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            >
            <div class="flex justify-between text-[11px] text-slate-400 mt-2 font-bold">
              <span>250 ج.م</span>
              <span>500 ج.م</span>
              <span>{{ filters.maxPrice >= 1000 ? '1000+' : filters.maxPrice }} ج.م</span>
            </div>
          </div>

        </div>

        <!-- Apply Button -->
        <div class="mt-6 pt-5 border-t border-slate-100">
          <button class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2">
            <CheckCircle2 class="w-5 h-5" />
            تطبيق الفلتر ({{ filteredDoctors.length }} طبيب)
          </button>

          <button @click="resetFilters" class="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-700 mt-4 transition-colors">
            إعادة الضبط لعرض جميع الأطباء
          </button>
        </div>

      </div>
    </div>

    <!-- Doctors Grid (Left) -->
    <div class="flex-1">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

        <!-- لو مفيش أطباء مطابقة للفلتر -->
        <div v-if="filteredDoctors.length === 0" class="col-span-full text-center py-12 bg-white rounded-3xl border border-slate-100">
          <User class="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 class="text-lg font-bold text-slate-700">لا يوجد أطباء يطابقون بحثك</h3>
          <p class="text-sm text-slate-500 mt-1">جرب تغيير معايير البحث أو إعادة ضبط الفلتر.</p>
        </div>

        <div v-for="doctor in filteredDoctors" :key="doctor.id" class="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition">
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center gap-3">
              <img :src="doctor.avatar" class="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-50" />
              <div>
                <h3 class="font-bold text-slate-800">{{ doctor.name }}</h3>
                <p class="text-xs text-slate-500">{{ doctor.specialty }}</p>
                <div class="flex items-center gap-1 mt-1 text-amber-500 text-xs font-bold">
                  <Star class="w-3.5 h-3.5 fill-current" /> {{ doctor.rating }}
                </div>
              </div>
            </div>
            <div class="bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded-lg text-xs">
              {{ doctor.price }} ج.م
            </div>
          </div>

          <div class="bg-slate-50 p-3 rounded-xl flex items-start gap-2 mb-4">
            <MapPin class="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p class="text-xs text-slate-600">{{ doctor.governorate }}، {{ doctor.city }} - {{ doctor.address }}</p>
          </div>

          <div class="flex gap-2">
            <button class="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-2 rounded-xl text-sm hover:bg-slate-50 transition flex items-center justify-center gap-1">
              <User class="w-4 h-4" /> الملف الشخصي
            </button>
            <button @click="openBooking(doctor)" class="flex-1 bg-emerald-600 text-white font-bold py-2 rounded-xl text-sm hover:bg-emerald-700 transition flex items-center justify-center gap-1 shadow-md">
              <Calendar class="w-4 h-4" /> حجز موعد
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- Booking Modal -->
    <BookingModal
      v-if="selectedDoctor"
      :doctor="selectedDoctor"
      @close="selectedDoctor = null"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
// استوردنا كل الأيقونات اللي استخدمناها في الـ HTML
import { Search, Star, RotateCcw, CheckCircle2, Filter, MapPin, User, Calendar } from 'lucide-vue-next';

// استوردنا الـ Store والمكونات
import { useAppointmentStore, type Doctor } from '../../stores/appointmentStore';
import BookingModal from './components/BookingModal.vue';

const appointmentStore = useAppointmentStore();

// 1. حالة الفلاتر
const filters = ref({
  name: '',
  governorate: '',
  specialty: '',
  city: '',
  rating: 0,
  maxPrice: 1000
});

// 2. فلترة الأطباء
const filteredDoctors = computed(() => {
  return appointmentStore.doctors.filter(doc => {
    const matchName = doc.name.includes(filters.value.name);
    const matchGov = !filters.value.governorate || doc.governorate === filters.value.governorate;
    const matchSpec = !filters.value.specialty || doc.specialty.includes(filters.value.specialty);
    const matchCity = !filters.value.city || doc.city === filters.value.city;
    const matchRate = doc.rating >= filters.value.rating;
    const matchPrice = doc.price <= filters.value.maxPrice;

    return matchName && matchGov && matchSpec && matchCity && matchRate && matchPrice;
  });
});

// 3. دالة إعادة الضبط
const resetFilters = () => {
  filters.value = {
    name: '',
    governorate: '',
    specialty: '',
    city: '',
    rating: 0,
    maxPrice: 1000
  };
};

// 4. إدارة نافذة الحجز (اللي كانت ناقصة)
const selectedDoctor = ref<Doctor | null>(null);
function openBooking(doc: Doctor) {
  selectedDoctor.value = doc;
}
</script>
