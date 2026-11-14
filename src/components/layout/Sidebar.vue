<!-- src/components/layout/Sidebar.vue — استبدل الملف بالكامل: رابط مكتبة واحد + حالة نشاط حقيقية -->
<template>
  <aside class="bg-white border-l border-slate-200 flex flex-col h-full">

    <div class="p-4 border-b border-slate-100">
      <div class="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-200">
        <div class="flex items-center gap-3">
          <img :src="authStore.currentUser?.avatar || 'https://i.pravatar.cc/150?img=11'" class="w-11 h-11 rounded-xl object-cover" />
          <div>
            <h3 class="text-sm font-bold text-slate-800">{{ authStore.currentUser?.name }}</h3>
            <p class="text-[11px] text-slate-500 font-mono mt-0.5">{{ roleLabel }}</p>
          </div>
        </div>
        <ChevronLeft class="w-4 h-4 text-slate-400" />
      </div>
      <button @click="handleLogout" class="w-full mt-2 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition">
        تسجيل الخروج
      </button>
    </div>

    <div class="px-4 py-3">
      <p class="text-xs font-bold text-slate-400 mb-2">التنقل الرئيسي</p>
    </div>

    <nav class="flex-1 overflow-y-auto px-3 space-y-1 pb-4">

      <template v-if="authStore.isPatient">
        <RouterLink v-for="l in patientLinks" :key="l.to" :to="l.to" :class="linkClass(l.to, 'emerald')">
          <div class="flex items-center gap-3">
            <component :is="l.icon" class="w-5 h-5" :class="iconClass(l.to)" />
            <div class="flex flex-col">
              <span>{{ l.label }}</span>
              <span class="text-[10px]" :class="subClass(l.to)">{{ l.sub }}</span>
            </div>
          </div>
        </RouterLink>
      </template>

      <template v-if="authStore.isDoctor">
        <RouterLink v-for="l in doctorLinks" :key="l.to" :to="l.to" :class="linkClass(l.to, 'blue', l.match)">
          <div class="flex items-center gap-3">
            <component :is="l.icon" class="w-5 h-5" :class="iconClass(l.to, l.match)" />
            <div class="flex flex-col">
              <span>{{ l.label }}</span>
              <span class="text-[10px]" :class="subClass(l.to, l.match)">{{ l.sub }}</span>
            </div>
          </div>
        </RouterLink>
      </template>

      <template v-if="authStore.currentUser?.role === 'admin'">
        <RouterLink v-for="l in adminLinks" :key="l.to" :to="l.to" :class="linkClass(l.to, 'slate')">
          <div class="flex items-center gap-3">
            <component :is="l.icon" class="w-5 h-5" :class="iconClass(l.to)" />
            <div class="flex flex-col">
              <span>{{ l.label }}</span>
              <span class="text-[10px]" :class="subClass(l.to)">{{ l.sub }}</span>
            </div>
          </div>
        </RouterLink>
      </template>

    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  Stethoscope, ChevronLeft, Pill, Calendar, FileText, Settings, Users,
  MonitorPlay, LayoutDashboard, UserCheck, Database, Archive, Library
} from 'lucide-vue-next';
import { RouterLink, useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const roleLabel = computed(() =>
  authStore.isDoctor ? 'طبيب' : authStore.currentUser?.role === 'admin' ? 'مدير' : 'مريض'
);

const patientLinks = [
  { to: '/courses', label: 'أدويتي والكورسات العلاجية', sub: 'my medications', icon: Pill },
  { to: '/doctors', label: 'دليل الأطباء', sub: 'doctors directory', icon: Stethoscope },
  { to: '/schedule', label: 'مواعيدي وجدولي', sub: 'my schedule', icon: Calendar },
  { to: '/queue-tracker', label: 'متابعة الطابور', sub: 'live queue', icon: MonitorPlay },
  { to: '/records', label: 'السجل الطبي', sub: 'medical record', icon: FileText },
  { to: '/family', label: 'عائلتي', sub: 'my family', icon: Users },
];

const doctorLinks = [
  { to: '/doctor/workbench', label: 'محطة عمل الطبيب', sub: 'doctor workbench', icon: Stethoscope },
  { to: '/doctor/schedule', label: 'إدارة جدول العيادة', sub: 'clinic schedule', icon: Calendar },
  { to: '/doctor/archive', label: 'أرشيف المرضى والروشتات', sub: 'patient archive', icon: Archive, match: ['/doctor/archive', '/doctor/patients'] },
  { to: '/doctor/library', label: 'المكتبة الطبية', sub: 'medical library', icon: Library },
  { to: '/doctor/prescribe', label: 'كتابة الروشتات', sub: 'prescriptions', icon: FileText },
  { to: '/doctor/drugs', label: 'الأدوية', sub: 'medications', icon: Pill },
  { to: '/doctor/settings', label: 'إعدادات العيادة', sub: 'clinic settings', icon: Settings },
];

const adminLinks = [
  { to: '/admin', label: 'لوحة التحكم', sub: 'admin dashboard', icon: LayoutDashboard },
  { to: '/admin/approvals', label: 'اعتماد الأطباء', sub: 'doctor approvals', icon: UserCheck },
  { to: '/admin/master-data', label: 'البيانات الأساسية', sub: 'master data', icon: Database },
];

function isActive(to: string, match?: string[]) {
  const paths = match ?? [to];
  return paths.some(p => route.path === p || route.path.startsWith(p + '/'));
}

const ACTIVE: Record<string, string> = {
  emerald: 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20',
  blue: 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20',
  slate: 'bg-slate-800 text-white font-bold shadow-md shadow-slate-800/20',
};

function linkClass(to: string, tone: 'emerald' | 'blue' | 'slate', match?: string[]) {
  return [
    'flex items-center justify-between px-4 py-3 rounded-xl transition-all mt-2 first:mt-0',
    isActive(to, match) ? ACTIVE[tone] : 'text-slate-600 hover:bg-slate-50 font-semibold',
  ];
}
function iconClass(to: string, match?: string[]) {
  return isActive(to, match) ? 'text-white' : 'text-slate-400';
}
function subClass(to: string, match?: string[]) {
  return isActive(to, match) ? 'opacity-80' : 'text-slate-400';
}

function handleLogout() {
  authStore.logout();
  router.push('/auth');
}
</script>
