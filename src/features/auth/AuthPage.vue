<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100 p-4 font-sans" dir="rtl">
    <div class="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md text-center">

      <div class="w-16 h-16 bg-emerald-500 rounded-2xl mx-auto flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-200">
        <Activity class="w-8 h-8" />
      </div>

      <h1 class="text-2xl font-extrabold text-slate-800 mb-2">مرحباً بك في صحتي</h1>
      <p class="text-sm text-slate-500 mb-8">اختر الحساب الذي تريد تجربته للدخول إلى النظام</p>

      <div class="space-y-4">
        <!-- Login as Patient -->
        <button
          @click="loginAsPatient"
          class="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-emerald-500 transition-all group"
        >
          <img src="https://i.pravatar.cc/150?img=11" class="w-12 h-12 rounded-full object-cover">
          <div class="text-right flex-1">
            <h3 class="font-bold text-slate-800 group-hover:text-emerald-600">دخول كـ مريض (أحمد أسعد)</h3>
            <p class="text-xs text-slate-500 mt-1">عرض الكورسات، المهام، والسجل الطبي</p>
          </div>
        </button>

        <!-- Login as Doctor -->
        <button
          @click="loginAsDoctor"
          class="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-blue-500 transition-all group"
        >
          <img src="https://i.pravatar.cc/150?img=60" class="w-12 h-12 rounded-full object-cover">
          <div class="text-right flex-1">
            <h3 class="font-bold text-slate-800 group-hover:text-blue-600">دخول كـ طبيب (د. طارق)</h3>
            <p class="text-xs text-slate-500 mt-1">محطة عمل الطبيب، الطابور، وبناء الروشتات</p>
          </div>
        </button>
         <button
          @click="loginAsAdmin"
          class="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-slate-500 transition-all group mt-4"
        >
          <div class="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center">
            <ShieldCheck class="w-6 h-6" />
          </div>
          <div class="text-right flex-1">
            <h3 class="font-bold text-slate-800 group-hover:text-slate-600">دخول كـ مدير النظام (Admin)</h3>
            <p class="text-xs text-slate-500 mt-1">اعتماد الأطباء، إدارة الكتالوج، والإحصائيات</p>
          </div>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';
import { Activity } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

function loginAsPatient() {
  authStore.loginAsPatient();
  router.push('/courses');
}
function loginAsAdmin() {
  authStore.loginAsAdmin();
  router.push('/admin');
}
function loginAsDoctor() {
  authStore.loginAsDoctor();
  router.push('/doctor/workbench');
}
</script>
