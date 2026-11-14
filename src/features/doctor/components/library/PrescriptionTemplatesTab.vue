<template>
  <div class="space-y-4 animate-in fade-in duration-300">

    <!-- الترويسة وزر الإضافة -->
    <div class="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      <div>
        <h3 class="font-bold text-slate-800 text-lg">قوالب الروشتات الجاهزة</h3>
        <p class="text-xs text-slate-500 mt-1">تطبيق روشتة كاملة (تشخيص + أدوية + مهام) بضغطة واحدة.</p>
      </div>
      <button @click="createNew" class="bg-teal-600 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-md hover:bg-teal-700 transition flex items-center gap-2">
        <Plus class="w-4 h-4" /> إنشاء قالب جديد
      </button>
    </div>

    <!-- القائمة (Grid) -->
    <div v-if="tplStore.templates.length === 0" class="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
      <FileText class="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <p class="text-sm text-slate-500 font-bold">لا توجد قوالب روشتات حتى الآن.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="tpl in tplStore.templates" :key="tpl.id" class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition group relative overflow-hidden">
        <div class="absolute top-0 right-0 left-0 h-1 bg-teal-500"></div>

        <div class="flex justify-between items-start mb-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <FileText class="w-4 h-4" />
            </div>
            <div>
              <h4 class="font-bold text-slate-800">{{ tpl.name }}</h4>
              <p class="text-[10px] font-mono text-slate-400 mt-0.5">استخدام: {{ tpl.usageCount }} مرة</p>
            </div>
          </div>
          <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition">
            <button @click="load(tpl)" class="p-1.5 text-slate-400 hover:text-teal-600 bg-slate-50 rounded-lg"><Edit3 class="w-3.5 h-3.5" /></button>
            <button @click="tplStore.deleteTemplate(tpl.id)" class="p-1.5 text-slate-400 hover:text-rose-600 bg-slate-50 rounded-lg"><Trash2 class="w-3.5 h-3.5" /></button>
          </div>
        </div>

        <div class="space-y-1.5 bg-slate-50 p-3 rounded-xl mb-3 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-500">الأدوية:</span>
            <span class="font-bold text-slate-700">{{ tpl.drugs?.length || 0 }} دواء</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">المهام:</span>
            <span class="font-bold text-slate-700">{{ tpl.tasks?.length || 0 }} مهمة</span>
          </div>
        </div>
      </div>
    </div>

    <!-- مودال التعديل/الإنشاء -->
    <div v-if="isEditOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95" dir="rtl">
        <div class="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 class="font-bold text-slate-800 text-lg">{{ editing?.id ? 'تعديل القالب' : 'إنشاء قالب جديد' }}</h2>
          <button @click="isEditOpen = false" class="text-slate-400 hover:text-slate-700"><X class="w-5 h-5" /></button>
        </div>
        <div class="p-6 space-y-4" v-if="editing">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">اسم القالب</label>
            <input v-model="editing.name" type="text" placeholder="مثال: علاج التهاب الحلق" class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500 bg-slate-50">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">التشخيص (ICD-10)</label>
            <input v-model="editing.diagnoses[0].title" type="text" placeholder="مثال: التهاب الجيوب الأنفية" class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500 bg-slate-50">
          </div>
        </div>
        <div class="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
          <button @click="isEditOpen = false" class="px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl">إلغاء</button>
          <button @click="save" :disabled="!editing?.name" class="px-6 py-2 bg-teal-600 text-white font-bold rounded-xl text-sm shadow-md hover:bg-teal-700 disabled:opacity-50">حفظ</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Plus, FileText, Edit3, Trash2, X } from 'lucide-vue-next';
import { usePrescriptionTemplatesStore, type PrescriptionTemplate } from '../../../../stores/prescriptionTemplatesStore';
// ✅ 1. استيراد deepClone
import { deepClone } from '../../../../utils/clone';

const tplStore = usePrescriptionTemplatesStore();
const isEditOpen = ref(false);
const editing = ref<PrescriptionTemplate | null>(null);

function createNew() {
  editing.value = {
    id: '', name: '', description: '', specialty: '', tags: [],
    diagnoses: [{ icd10: '', title: '' }], drugs: [], tasks: [],
    version: 1, usageCount: 0, createdAt: '', updatedAt: ''
  };
  isEditOpen.value = true;
}

// ✅ 2. دالة التحميل تستخدم deepClone
function load(tpl: PrescriptionTemplate) {
  editing.value = deepClone(tpl);
  isEditOpen.value = true;
}

// ✅ 3. دالة الحفظ تستخدم deepClone
function save() {
  if (!editing.value) return;

  const payload = { ...editing.value };
  // إزالة الحقول التي لا يجب إرسالها في التحديث
  delete (payload as any).id;
  delete (payload as any).createdAt;
  delete (payload as any).updatedAt;
  delete (payload as any).usageCount;
  delete (payload as any).version;

  if (editing.value.id) {
    // تحديث قالب موجود
    tplStore.updateTemplate(editing.value.id, payload);
  } else {
    // إضافة قالب جديد
    const created = tplStore.addTemplate(payload as any);
    editing.value = deepClone(created);
  }

  isEditOpen.value = false;
}
</script>
