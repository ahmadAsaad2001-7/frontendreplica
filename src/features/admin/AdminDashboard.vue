<template>
  <div class="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300" dir="rtl">

    <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
      <h1 class="text-2xl font-extrabold text-slate-800">مرحباً بك في لوحة تحكم النظام</h1>
      <p class="text-sm text-slate-500 mt-1">إليك نظرة سريعة على أداء المنصة اليوم.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Stat 1 -->
      <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
          <Stethoscope class="w-6 h-6" />
        </div>
        <div>
          <p class="text-xs text-slate-500 font-bold mb-1">إجمالي الأطباء</p>
          <h3 class="text-2xl font-extrabold text-slate-800">142</h3>
        </div>
      </div>
      <!-- Stat 2 -->
      <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
          <Users class="w-6 h-6" />
        </div>
        <div>
          <p class="text-xs text-slate-500 font-bold mb-1">المرضى النشطون</p>
          <h3 class="text-2xl font-extrabold text-slate-800">3,491</h3>
        </div>
      </div>
      <!-- Stat 3 -->
      <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
          <Calendar class="w-6 h-6" />
        </div>
        <div>
          <p class="text-xs text-slate-500 font-bold mb-1">حجوزات اليوم</p>
          <h3 class="text-2xl font-extrabold text-slate-800">87</h3>
        </div>
      </div>
      <!-- Stat 4 -->
      <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
          <Banknote class="w-6 h-6" />
        </div>
        <div>
          <p class="text-xs text-slate-500 font-bold mb-1">إيرادات المنصة (اليوم)</p>
          <h3 class="text-2xl font-extrabold text-slate-800">12,450 <span class="text-sm text-slate-400">ج.م</span></h3>
        </div>
      </div>
    </div>

    <!-- Alerts Section -->
    <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
      <h3 class="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">أحدث التنبيهات الإدارية</h3>
      <div class="space-y-3">
        <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div class="w-2 h-2 rounded-full bg-amber-500"></div>
          <p class="text-sm text-slate-700 flex-1">يوجد <strong class="text-amber-600">2 طلبات جديدة</strong> لانضمام أطباء بانتظار المراجعة.</p>
          <RouterLink to="/admin/approvals" class="text-xs font-bold text-blue-600 hover:underline">مراجعة الآن</RouterLink>
        </div>
        <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
          <p class="text-sm text-slate-700 flex-1">تم تحديث كتالوج الأدوية (إضافة 15 دواء جديد) بواسطة مسؤول البيانات.</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { Stethoscope, Users, Calendar, Banknote } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
</script>
