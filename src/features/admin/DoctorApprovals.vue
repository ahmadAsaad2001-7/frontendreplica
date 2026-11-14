<template>
  <div class="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300" dir="rtl">

    <!-- Header -->
    <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
          <UserCheck class="w-6 h-6 text-slate-800" /> اعتماد الأطباء الجدد
        </h1>
        <p class="text-sm text-slate-500 mt-1">مراجعة المستندات والموافقة على تفعيل عيادات الأطباء.</p>
      </div>
      <div class="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl border border-amber-200 text-sm font-bold flex items-center gap-2">
        <Clock class="w-4 h-4" /> {{ pendingDoctors.length }} طلبات قيد الانتظار
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="pendingDoctors.length === 0" class="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
      <CheckCircle2 class="w-16 h-16 mx-auto text-emerald-400 mb-4" />
      <h3 class="text-xl font-bold text-slate-800">كل شيء تمام!</h3>
      <p class="text-slate-500 mt-2">لا توجد طلبات اعتماد جديدة في الوقت الحالي.</p>
    </div>

    <!-- Pending Doctors List -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div v-for="doc in pendingDoctors" :key="doc.id" class="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition relative overflow-hidden">

        <!-- Top Status Line -->
        <div class="absolute top-0 right-0 left-0 h-1.5 bg-amber-400"></div>

        <div class="flex items-start gap-4 mt-2">
          <img :src="doc.avatar" class="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100" />
          <div class="flex-1">
            <h3 class="font-extrabold text-slate-800 text-lg">{{ doc.name }}</h3>
            <p class="text-sm text-slate-500">{{ doc.specialty }}</p>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">ترخيص: {{ doc.licenseNumber }}</span>
              <span class="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">بانتظار الاعتماد</span>
            </div>
          </div>
        </div>

        <div class="mt-4 bg-slate-50 rounded-xl p-3 text-sm text-slate-600 space-y-1">
          <p><strong class="text-slate-400">العيادة:</strong> {{ doc.clinicName }}</p>
          <p><strong class="text-slate-400">العنوان:</strong> {{ doc.city }}، {{ doc.governorate }}</p>
          <p><strong class="text-slate-400">تاريخ التقديم:</strong> {{ doc.appliedDate }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2 mt-5">
          <button @click="handleApprove(doc.id)" class="flex-1 bg-emerald-600 text-white font-bold py-2.5 rounded-xl shadow-sm hover:bg-emerald-700 transition flex items-center justify-center gap-2 text-sm">
            <Check class="w-4 h-4" /> اعتماد وتفعيل
          </button>
          <button @click="handleReject(doc.id)" class="flex-1 bg-rose-50 text-rose-600 border border-rose-200 font-bold py-2.5 rounded-xl hover:bg-rose-100 transition flex items-center justify-center gap-2 text-sm">
            <X class="w-4 h-4" /> رفض الطلب
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UserCheck, Clock, CheckCircle2, Check, X } from 'lucide-vue-next';

// Mock Data للأطباء اللي بانتظار الاعتماد
const pendingDoctors = ref([
  {
    id: 'doc_pending_1',
    name: 'د. سارة مصطفى',
    specialty: 'أخصائي طب الأطفال',
    licenseNumber: 'EGY-PED-9921',
    clinicName: 'عيادة الأطفال المشرقة',
    city: 'المعادي',
    governorate: 'القاهرة',
    appliedDate: 'منذ يومين',
    avatar: 'https://i.pravatar.cc/150?img=32'
  },
  {
    id: 'doc_pending_2',
    name: 'د. خالد عبد العزيز',
    specialty: 'استشاري جراحة القلب',
    licenseNumber: 'EGY-CAR-4412',
    clinicName: 'مركز القلب التخصصي',
    city: 'الدقي',
    governorate: 'الجيزة',
    appliedDate: 'منذ 5 ساعات',
    avatar: 'https://i.pravatar.cc/150?img=53'
  }
]);

function handleApprove(id: string) {
  if (confirm('هل أنت متأكد من اعتماد هذا الطبيب وتفعيل عيادته؟')) {
    pendingDoctors.value = pendingDoctors.value.filter(d => d.id !== id);
    alert('تم اعتماد الطبيب بنجاح! يمكنه الآن استقبال المرضى.');
  }
}

function handleReject(id: string) {
  const reason = prompt('يرجى كتابة سبب الرفض (سيتم إرساله للطبيب):');
  if (reason) {
    pendingDoctors.value = pendingDoctors.value.filter(d => d.id !== id);
    alert('تم رفض الطلب وإرسال الإشعار للطبيب.');
  }
}
</script>
