<template>
  <div class="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300" dir="rtl">

    <!-- Header -->
    <div class="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
          <Users class="w-6 h-6 text-teal-600" /> إدارة ملف العائلة
        </h1>
        <p class="text-sm text-slate-500 mt-1">أضف أفراد عائلتك لمتابعة سجلاتهم الطبية وحجز المواعيد لهم.</p>
      </div>

      <button @click="isModalOpen = true" class="bg-teal-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-md hover:bg-teal-700 transition flex items-center gap-2">
        <Plus class="w-4 h-4" /> إضافة فرد جديد
      </button>
    </div>

    <!-- Profiles Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

      <div
        v-for="profile in profileStore.profiles"
        :key="profile.id"
        @click="setActive(profile.id)"
        :class="[
          'bg-white rounded-3xl p-5 border cursor-pointer transition-all relative overflow-hidden group',
          profileStore.activeProfileId === profile.id ? 'border-teal-500 ring-2 ring-teal-100 shadow-md' : 'border-slate-200 hover:border-teal-300 hover:shadow-sm'
        ]"
      >
        <!-- Active Badge -->
        <div v-if="profileStore.activeProfileId === profile.id" class="absolute top-0 right-0 bg-teal-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
          الملف النشط
        </div>

        <div class="flex items-center gap-4 mt-2">
          <div class="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center text-2xl font-bold">
            {{ profile.name.charAt(0) }}
          </div>
          <div>
            <h3 class="font-extrabold text-slate-800 text-lg">{{ profile.name }}</h3>
            <p class="text-sm text-slate-500">{{ profile.relation }} • {{ profile.age }} سنة</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 mt-5 border-t border-slate-100 pt-4">
          <div class="bg-slate-50 p-2 rounded-lg text-center">
            <p class="text-[10px] text-slate-400">فصيلة الدم</p>
            <p class="text-sm font-bold text-slate-700">{{ profile.bloodType }}</p>
          </div>
          <div class="bg-slate-50 p-2 rounded-lg text-center">
            <p class="text-[10px] text-slate-400">رقم الملف</p>
            <p class="text-xs font-mono font-bold text-slate-700 truncate">{{ profile.mrn || 'MRN-XXXX' }}</p>
          </div>
        </div>
      </div>

    </div>

    <!-- Add Member Modal -->
    <AddFamilyMemberModal
      :is-open="isModalOpen"
      @close="isModalOpen = false"
      @add="handleAddMember"
    />

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Users, Plus } from 'lucide-vue-next';
import { useProfileStore } from '../../stores/profileStore';
import AddFamilyMemberModal from './components/AddFamilyMemberModal.vue';

const profileStore = useProfileStore();
const isModalOpen = ref(false);

function setActive(id: string) {
  profileStore.setActiveProfile(id);
}

function handleAddMember(data: any) {
  profileStore.addProfile({
    name: data.name,
    relation: data.relation,
    age: data.age,
    gender: data.gender,
    bloodType: data.bloodType,
    mrn: `MRN-${Date.now().toString().slice(-6)}`,
    allergies: [],
    chronicConditions: []
  });
  alert('تمت إضافة الفرد بنجاح!');
}
</script>
