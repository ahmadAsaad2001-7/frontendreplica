<template>
  <div class="space-y-5">
    <!-- لافتة القراءة فقط للأطباء أو الأدوار غير المخولة -->
    <div v-if="!canManagePayments" class="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2">
      <Lock class="w-4 h-4 text-amber-600 shrink-0" />
      <p class="text-xs font-bold text-amber-800">عرض للقراءة فقط — إدارة المدفوعات تتم بواسطة المساعد أو الإدارة.</p>
    </div>

    <!-- لافتة صلاحية الإدارة للمساعد أو الإدارة -->
    <div v-else class="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-2">
      <Lock class="w-4 h-4 text-blue-600 shrink-0" />
      <p class="text-xs font-bold text-blue-800">دورك يملك صلاحية إدارة المدفوعات — إجراءات التعديل تُفعّل في مرحلة لاحقة.</p>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl border border-slate-200 p-4 text-center">
        <p class="text-[11px] text-slate-400 mb-1">إجمالي المدفوع</p>
        <p class="text-xl font-extrabold text-emerald-600">{{ totalPaid }} ر.س</p>
      </div>
      <div class="bg-white rounded-2xl border border-slate-200 p-4 text-center">
        <p class="text-[11px] text-slate-400 mb-1">الرصيد المستحق</p>
        <p class="text-xl font-extrabold" :class="pending > 0 ? 'text-amber-600' : 'text-emerald-600'">{{ pending }} ر.س</p>
      </div>
      <div class="bg-white rounded-2xl border border-slate-200 p-4 text-center">
        <p class="text-[11px] text-slate-400 mb-1">عدد الحجوزات</p>
        <p class="text-xl font-extrabold text-slate-800">{{ rows.length }}</p>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <table class="w-full text-right text-sm">
        <thead class="bg-slate-50 text-[11px] text-slate-500">
          <tr>
            <th class="p-3 font-bold">التاريخ</th>
            <th class="p-3 font-bold">السبب</th>
            <th class="p-3 font-bold">المبلغ</th>
            <th class="p-3 font-bold">طريقة الدفع</th>
            <th class="p-3 font-bold">الحالة</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="a in rows" :key="a.id">
            <td class="p-3 text-slate-600">{{ a.date }}</td>
            <td class="p-3 text-slate-700 max-w-[220px] truncate">{{ a.reason }}</td>
            <td class="p-3 font-bold text-slate-800">{{ a.amount }}</td>
            <td class="p-3 text-slate-600">{{ a.paymentMethod }}</td>
            <td class="p-3">
              <span class="text-[10px] font-bold px-2 py-1 rounded-lg"
                :class="a.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700' : a.paymentStatus === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'">
                {{ a.paymentStatus === 'Paid' ? 'مسدد' : a.paymentStatus === 'Pending' ? 'مستحق' : 'ملغي' }}
              </span>
            </td>
          </tr>
          <tr v-if="rows.length === 0"><td colspan="5" class="p-6 text-center text-slate-400 text-xs">لا توجد مدفوعات مسجلة</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Lock } from 'lucide-vue-next';
import { useAuthStore } from '../../../../stores/authStore';
import { useAppointmentStore } from '../../../../stores/appointmentStore';
import type { PatientRecord } from '../../../../types/patient';

const props = defineProps<{ patient: PatientRecord }>();
const authStore = useAuthStore();
const appointmentStore = useAppointmentStore();

// التحقق من صلاحيات إدارة المدفوعات (مساعد أو إدارة)
const canManagePayments = computed(() =>
  ['assistant', 'admin'].includes(authStore.currentUser?.role ?? '')
);

const rows = computed(() =>
  appointmentStore.getAppointmentsByPatient(props.patient.id)
    .slice().sort((a, b) => b.date.localeCompare(a.date))
);
const totalPaid = computed(() => rows.value.filter(a => a.paymentStatus === 'Paid').reduce((s, a) => s + a.amount, 0));
const pending = computed(() => appointmentStore.getPatientBalance(props.patient.id));
</script>
