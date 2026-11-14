<template>
  <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 relative z-30 no-print">

    <!-- Right: Search -->
    <div class="flex items-center gap-4">
      <div class="relative hidden sm:block w-80">
        <Search class="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
        <input
          type="text"
          placeholder="ابحث عن دواء، مهمة، كورس، أو طبيب..."
          class="pl-4 pr-10 py-2 rounded-xl bg-slate-100 border-none outline-none text-sm w-full focus:ring-2 focus:ring-teal-500 transition-all text-slate-700 placeholder-slate-400"
        />
      </div>
    </div>

    <!-- Left: Actions -->
    <div class="flex items-center gap-3">

      <!-- 1. Notifications Bell (Interactive) -->
      <div class="relative">
        <button
          @click="isNotifOpen = !isNotifOpen"
          class="p-2 rounded-full hover:bg-slate-100 text-slate-500 relative transition-colors"
        >
          <Bell class="w-5 h-5" />
          <span v-if="notifStore.unreadCount > 0" class="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>

        <!-- Notifications Dropdown -->
        <div v-if="isNotifOpen" class="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          <div class="flex justify-between items-center p-3 border-b border-slate-100 bg-slate-50">
            <h3 class="font-bold text-sm text-slate-800">الإشعارات</h3>
            <button @click="notifStore.markAllAsRead" class="text-xs text-teal-600 hover:underline">تحديد الكل كمقروء</button>
          </div>

          <div class="max-h-80 overflow-y-auto">
            <div v-if="notifStore.notifications.length === 0" class="p-6 text-center text-slate-400 text-sm">
              لا توجد إشعارات حالياً.
            </div>

            <div
              v-for="notif in notifStore.notifications"
              :key="notif.id"
              @click="notifStore.markAsRead(notif.id)"
              :class="['p-3 border-b border-slate-50 cursor-pointer transition-colors flex gap-3', notif.isRead ? 'bg-white opacity-60' : 'bg-teal-50/30 hover:bg-teal-50/60']"
            >
              <div :class="getIconColor(notif.type)" class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1">
                <component :is="getIcon(notif.type)" class="w-4 h-4" />
              </div>
              <div class="flex-1">
                <h4 class="text-sm font-bold text-slate-800 flex justify-between items-center">
                  {{ notif.title }}
                  <span class="text-[10px] text-slate-400 font-normal">{{ notif.time }}</span>
                </h4>
                <p class="text-xs text-slate-500 mt-1 leading-relaxed">{{ notif.message }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Profile & Account Switcher -->
      <div class="relative">
        <div
          @click="isSwitcherOpen = !isSwitcherOpen"
          class="flex items-center gap-3 mr-2 border-r border-slate-200 pr-4 cursor-pointer hover:opacity-80 transition"
        >
          <div class="text-left">
            <h4 class="text-sm font-bold text-slate-800 leading-tight">{{ authStore.currentUser?.name || 'زائر' }}</h4>
            <p class="text-[10px] text-slate-400 capitalize">{{ roleAr }}</p>
          </div>
          <div class="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white font-bold shadow-sm">
            {{ authStore.currentUser?.name?.charAt(0) || '؟' }}
          </div>
        </div>

        <!-- Account Switcher Dropdown -->
        <div v-if="isSwitcherOpen" class="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          <div class="p-3 border-b border-slate-100 bg-slate-50">
            <p class="text-xs font-bold text-slate-500">تبديل الحساب (للتجربة)</p>
          </div>
          <div class="p-2 space-y-1">
            <button @click="switchRole('patient')" class="w-full text-right px-3 py-2 rounded-lg text-sm hover:bg-slate-50 flex items-center gap-2 font-bold text-slate-700 transition">
              <User class="w-4 h-4 text-blue-500" /> دخول كـ مريض
            </button>
            <button @click="switchRole('doctor')" class="w-full text-right px-3 py-2 rounded-lg text-sm hover:bg-slate-50 flex items-center gap-2 font-bold text-slate-700 transition">
              <Stethoscope class="w-4 h-4 text-teal-500" /> دخول كـ طبيب
            </button>
            <button @click="switchRole('admin')" class="w-full text-right px-3 py-2 rounded-lg text-sm hover:bg-slate-50 flex items-center gap-2 font-bold text-slate-700 transition">
              <ShieldCheck class="w-4 h-4 text-purple-500" /> دخول كـ أدمن
            </button>
          </div>
          <div class="p-2 border-t border-slate-100">
            <button @click="handleLogout" class="w-full text-right px-3 py-2 rounded-lg text-sm hover:bg-rose-50 flex items-center gap-2 font-bold text-rose-600 transition">
              <LogOut class="w-4 h-4" /> تسجيل الخروج
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- Combined Overlay to close any open dropdown -->
    <div v-if="isNotifOpen || isSwitcherOpen" @click="isNotifOpen = false; isSwitcherOpen = false" class="fixed inset-0 z-20"></div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  Search, Bell, CheckCircle2, AlertTriangle, FileText, Info,
  User, Stethoscope, ShieldCheck, LogOut
} from 'lucide-vue-next';
import { useNotificationStore } from '../../stores/notificationStore';
import { useAuthStore } from '../../stores/authStore';

const notifStore = useNotificationStore();
const authStore = useAuthStore();
const router = useRouter();

const isNotifOpen = ref(false);
const isSwitcherOpen = ref(false);

// دوال مساعدة للإشعارات
function getIcon(type: string) {
  if (type === 'success') return CheckCircle2;
  if (type === 'warning') return AlertTriangle;
  if (type === 'prescription') return FileText;
  return Info;
}

function getIconColor(type: string) {
  if (type === 'success') return 'bg-emerald-100 text-emerald-600';
  if (type === 'warning') return 'bg-amber-100 text-amber-600';
  if (type === 'prescription') return 'bg-blue-100 text-blue-600';
  return 'bg-slate-100 text-slate-600';
}

// حساب اسم الدور بالعربية
const roleAr = computed(() => {
  if (authStore.isPatient) return 'مريض';
  if (authStore.isDoctor) return 'طبيب';
  if (authStore.isAdmin || authStore.currentUser?.role === 'admin') return 'مدير النظام';
  return 'زائر';
});

// دالة تبديل الحساب
function switchRole(role: 'patient' | 'doctor' | 'admin') {
  isSwitcherOpen.value = false;
  isNotifOpen.value = false; // إغلاق أي قوائم أخرى

  if (role === 'patient') {
    authStore.loginAsPatient();
    router.push('/courses');
  } else if (role === 'doctor') {
    authStore.loginAsDoctor();
    router.push('/doctor/workbench');
  } else if (role === 'admin') {
    authStore.loginAsAdmin();
    router.push('/admin');
  }
}

// دالة تسجيل الخروج
function handleLogout() {
  authStore.logout();
  router.push('/auth');
}
</script>
