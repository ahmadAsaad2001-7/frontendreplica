<template>
  <div class="space-y-6 animate-in fade-in duration-300">

    <!-- 1. Header & Actions -->
    <div class="flex items-center justify-between border-b border-slate-100 pb-4">
      <button @click="isFormOpen = true" class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 text-sm">
        <Plus class="w-4 h-4" /> تشخيص جديد (New Diagnosis)
      </button>
    </div> <!-- ✅ تم إضافة وسم الإغلاق المفقود هنا -->

    <!-- 2. Horizontal History Scroller -->
    <div>
      <h3 class="font-bold text-slate-800 mb-3 flex items-center justify-between">
        <span>سجل التشخيصات (Append-Only)</span>
        <span class="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">{{ patientDiagnoses.length }} تشخيصات مسجلة</span>
      </h3>

      <div class="flex gap-3 overflow-x-auto pb-3 snap-x">
        <div
          v-for="diag in patientDiagnoses"
          :key="diag.id"
          @click="selectDiagnosis(diag)"
          :class="[
            'min-w-[240px] p-3 rounded-xl border cursor-pointer snap-start transition-all relative',
            // ✅ مؤشر بصري إذا كان هذا التشخيص هو المرتبط بالروشتة الحالية
            draftStore.icd10 === diag.icd10
              ? 'bg-blue-50 border-blue-500 shadow-sm ring-1 ring-blue-500'
              : 'bg-white border-slate-200 hover:border-blue-300'
          ]"
        >
          <div class="flex items-center gap-2 mb-2">
            <span :class="getStatusColor(diag.status)" class="text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDot(diag.status)"></span>
              {{ diag.status === 'updated' ? 'محدث' : diag.status === 'active' ? 'نشط' : 'تحت العلاج' }}
            </span>
            <span class="text-xs font-mono font-bold text-slate-500">{{ diag.date }}</span>
            <!-- ✅ علامة صح إذا كان مرتبطاً بالروشتة -->
            <CheckCircle2 v-if="draftStore.icd10 === diag.icd10" class="w-4 h-4 text-blue-600 mr-auto" />
          </div>
          <h4 class="font-bold text-sm text-slate-800 truncate">{{ diag.title }}</h4>
          <p class="text-[10px] text-blue-600 font-mono font-bold mt-1">ICD-10: {{ diag.icd10 }}</p>
        </div>
      </div>
    </div>

    <!-- 3. Selected Diagnosis Details Card -->
    <div v-if="selectedDiagnosis" class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
      <div class="absolute right-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>

      <div class="flex justify-between items-start mb-4">
        <div class="flex items-center gap-3">
          <span class="text-sm font-bold text-slate-500 flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
            <Calendar class="w-4 h-4" /> {{ selectedDiagnosis.date }}
          </span>
          <span :class="getStatusColor(selectedDiagnosis.status)" class="text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1">
            <span class="w-2 h-2 rounded-full" :class="getStatusDot(selectedDiagnosis.status)"></span>
            {{ selectedDiagnosis.status === 'updated' ? 'محدث (UPDATED)' : 'نشط' }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <!-- ✅ زر لربط التشخيص بالروشتة إذا لم يكن مربوطاً -->
          <button
            v-if="draftStore.icd10 !== selectedDiagnosis.icd10"
            @click="selectDiagnosis(selectedDiagnosis)"
            class="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-100 transition flex items-center gap-1"
          >
            <Link class="w-3.5 h-3.5" /> ربط بالروشتة الحالية
          </button>
          <span v-else class="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
            <CheckCircle2 class="w-4 h-4" /> مربوط بالروشتة الحالية
          </span>

          <div class="bg-blue-50 text-blue-700 font-mono text-sm font-bold px-4 py-1.5 rounded-lg border border-blue-100">
            ICD-10: {{ selectedDiagnosis.icd10 }}
          </div>
        </div>
      </div>

      <h2 class="text-xl font-extrabold text-slate-800 mb-2">{{ selectedDiagnosis.title }}</h2>
      <p class="text-xs text-slate-500 font-bold mb-5 flex items-center gap-2">
        <Stethoscope class="w-4 h-4 text-slate-400" />
        {{ selectedDiagnosis.doctor_name }} <span class="text-slate-300">•</span> {{ selectedDiagnosis.specialty }}
      </p>

      <div class="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 leading-relaxed mb-6 border border-slate-100">
        {{ selectedDiagnosis.notes || 'لا توجد ملاحظات سريرية مسجلة.' }}
      </div>

      <!-- المرفقات -->
      <div v-if="selectedDiagnosis.attachments && selectedDiagnosis.attachments.length > 0" class="mb-6">
        <h4 class="text-xs font-bold text-slate-400 mb-3 flex items-center gap-1">
          <Paperclip class="w-3.5 h-3.5" /> المرفقات الطبية:
        </h4>
        <div class="flex flex-wrap gap-3">
          <div v-for="att in selectedDiagnosis.attachments" :key="att.name" class="flex items-center justify-between bg-white border border-slate-200 p-2.5 rounded-xl min-w-[200px] hover:border-blue-300 transition group">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FileText class="w-4 h-4" />
              </div>
              <div>
                <p class="text-xs font-bold text-slate-800 truncate max-w-[100px]">{{ att.name }}</p>
                <p class="text-[9px] text-slate-400 font-mono">تم الرفع</p>
              </div>
            </div>
            <button
              @click="openAttachment(att)"
              class="text-xs text-blue-600 font-bold px-2 py-1 bg-blue-50 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-100"
            >
              عرض
            </button>
          </div>
        </div>
      </div>

      <!-- زر فتح الروشتة المرتبطة -->
      <div v-if="selectedDiagnosis.linked_prescription_id" class="flex items-center justify-between border-t border-slate-100 pt-4">
        <span class="text-xs text-slate-500">مرتبط بالروشتة: <strong class="font-mono text-slate-800">{{ selectedDiagnosis.linked_prescription_id }}</strong></span>
        <button
          @click="emit('open-prescription')"
          class="text-xs text-blue-600 font-bold flex items-center gap-1 hover:underline cursor-pointer"
        >
          فتح الروشتة <ChevronLeft class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- 4. NEW COMPREHENSIVE FORM MODAL -->
    <div v-if="isFormOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95" dir="rtl">

        <div class="bg-blue-600 p-5 flex justify-between items-center text-white">
          <div class="flex items-center gap-3">
            <div class="bg-white/20 p-2 rounded-xl"><FileText class="w-6 h-6" /></div>
            <div>
              <h2 class="font-bold text-lg">تسجيل تشخيص سريري جديد</h2>
              <p class="text-blue-100 text-xs mt-0.5">سيتم ربطه تلقائياً بالروشتة الحالية</p>
            </div>
          </div>
          <button @click="isFormOpen = false" class="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-lg transition"><X class="w-5 h-5" /></button>
        </div>

        <div class="p-6 space-y-5">
          <!-- ICD-10 Search -->
          <div class="relative">
            <label class="block text-xs font-bold text-slate-700 mb-1.5">كود التشخيص الدولي (ICD-10 Code):</label>
            <div class="relative">
              <input v-model="icdSearchQuery" @focus="showDropdown = true" type="text" placeholder="ابحث بكود أو اسم المرض..." class="w-full p-3 pl-10 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-slate-50 transition">
              <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
            <div v-if="showDropdown && icdSearchQuery" class="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
              <div v-for="icd in filteredICD10" :key="icd.code" @mousedown.prevent="selectICD(icd)" class="p-3 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-0 transition flex justify-between items-center">
                <span class="text-sm font-bold text-slate-800">{{ icd.desc }}</span>
                <span class="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{{ icd.code }}</span>
              </div>
            </div>
          </div>

          <!-- Selected ICD-10 -->
          <div v-if="newDiag.selectedICD" class="bg-blue-50 border border-blue-200 p-3 rounded-xl flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-blue-800">التشخيص المعتمد:</span>
              <span class="text-sm font-bold text-blue-900">{{ newDiag.selectedICD.code }} - {{ newDiag.selectedICD.desc }}</span>
            </div>
            <button @click="clearICD" class="text-blue-600 hover:text-rose-600 transition" title="تغيير التشخيص"><X class="w-4 h-4" /></button>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">درجة الخطورة:</label>
              <select v-model="newDiag.severity" class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-slate-50 text-slate-700">
                <option value="mild">خفيفة (Mild)</option>
                <option value="moderate">متوسطة (Moderate)</option>
                <option value="severe">شديدة (Severe)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">مرفقات (أشعة/تحاليل):</label>
              <div class="relative">
                <input type="file" multiple @change="handleFileUpload" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                <div class="w-full p-3 pl-8 border border-slate-200 rounded-xl text-sm bg-slate-50 flex items-center gap-2 text-slate-400 hover:border-blue-400 transition">
                  <Paperclip class="w-4 h-4" />
                  <span>إضافة ملفات...</span>
                </div>
              </div>
            </div>
          </div>

          <!-- List of Attached Files -->
          <div v-if="newDiag.attachments.length > 0" class="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
            <p class="text-xs font-bold text-slate-500 mb-2">الملفات المرفقة ({{ newDiag.attachments.length }}):</p>
            <div v-for="(file, index) in newDiag.attachments" :key="index" class="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100">
              <div class="flex items-center gap-2">
                <FileText class="w-4 h-4 text-blue-500" />
                <span class="text-xs font-bold text-slate-700 truncate">{{ file.name }}</span>
              </div>
              <button @click="removeAttachment(index)" class="text-rose-500 hover:bg-rose-50 p-1 rounded">
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5">الملاحظات السريرية:</label>
            <textarea v-model="newDiag.notes" rows="3" placeholder="وصف الأعراض، نتائج الفحص..." class="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-slate-50 resize-none"></textarea>
          </div>
        </div>

        <div class="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
          <button @click="isFormOpen = false" class="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition">إلغاء</button>
          <button @click="saveNewDiagnosis" :disabled="!newDiag.selectedICD" class="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm shadow-md hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2">
            <CheckCircle2 class="w-4 h-4" /> إدراج وربط بالروشتة
          </button>
        </div>
      </div>
    </div>

    <!-- 5. ATTACHMENT VIEWER MODAL -->
    <div v-if="activeAttachment" class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl w-full max-w-5xl h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
        <div class="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 class="font-bold text-slate-800 flex items-center gap-2">
            <Paperclip class="w-5 h-5 text-blue-600" />
            {{ activeAttachment.name }}
          </h3>
          <button @click="activeAttachment = null" class="p-2 bg-white hover:bg-slate-200 rounded-lg transition border border-slate-200">
            <X class="w-5 h-5 text-slate-600" />
          </button>
        </div>
        <div class="flex-1 bg-slate-200 flex items-center justify-center p-4 relative overflow-auto">
          <div v-if="!activeAttachment.url || activeAttachment.url === '#'" class="text-center text-slate-500 bg-white p-8 rounded-2xl shadow-sm border border-slate-300">
            <FileText class="w-24 h-24 mx-auto mb-4 text-blue-200" />
            <p class="font-bold text-lg text-slate-700">عرض المرفق التجريبي (Demo File)</p>
            <p class="text-sm mt-2 text-slate-500">هنا يظهر محتوى الملف الحقيقي (صورة أشعة أو PDF) في النظام الفعلي.</p>
          </div>
          <img v-else-if="activeAttachment.type.includes('image') || activeAttachment.url.startsWith('blob:') && !activeAttachment.name.endsWith('.pdf')" :src="activeAttachment.url" class="max-w-full max-h-full object-contain rounded-lg shadow-lg" />
          <iframe v-else-if="activeAttachment.url" :src="activeAttachment.url" class="w-full h-full rounded-lg shadow-lg border-0 bg-white"></iframe>
        </div>
      </div>
    </div> <!-- ✅ تم إزالة وسم الإغلاق الزائد الذي كان هنا -->

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useMedicalRecordStore, type DiagnosisRecord } from '../../../stores/medicalRecordStore';
import { useDoctorQueueStore } from '../../../stores/doctorQueueStore';
import { usePrescriptionDraftStore } from '../../../stores/prescriptionDraftStore';
import {
  Plus, Calendar, Stethoscope, Paperclip, FileText, ChevronLeft, Link,
  X, Search, CheckCircle2, Trash2
} from 'lucide-vue-next';

const recordStore = useMedicalRecordStore();
const queueStore = useDoctorQueueStore();
const draftStore = usePrescriptionDraftStore();

const emit = defineEmits(['open-prescription']);

// --- بيانات وهمية لكتالوج ICD-10 ---
const icd10Database = [
  { code: 'M54.5', desc: 'ألم أسفل الظهر (عرق النسا)' },
  { code: 'M17.9', desc: 'خشونة والتهاب مفصل الركبة' },
  { code: 'M75.1', desc: 'التهاب أوتار الكفة المدورة للكتف' },
  { code: 'K21.9', desc: 'ارتجاع المريء المعدي والمحموضة' },
  { code: 'I10', desc: 'ارتفاع ضغط الدم الأساسي' },
  { code: 'E11.9', desc: 'داء السكري من النوع 2' },
  { code: 'J01.90', desc: 'التهاب الجيوب الأنفية الحاد' },
];

// --- حالة الاختيار ---
const selectedDiagId = ref<string>('');
const isFormOpen = ref(false);
const activeAttachment = ref<any>(null);

// --- حالة الفورم الجديد ---
const icdSearchQuery = ref('');
const showDropdown = ref(false);
const newDiag = reactive({
  selectedICD: null as { code: string, desc: string } | null,
  severity: 'moderate',
  attachments: [] as { name: string, url: string, type: string }[],
  notes: ''
});

// فلترة كتالوج ICD-10
const filteredICD10 = computed(() => {
  if (!icdSearchQuery.value) return icd10Database;
  const q = icdSearchQuery.value.toLowerCase();
  return icd10Database.filter(i => i.code.toLowerCase().includes(q) || i.desc.includes(q));
});

function selectICD(icd: { code: string, desc: string }) {
  newDiag.selectedICD = icd;
  icdSearchQuery.value = '';
  showDropdown.value = false;
}

function clearICD() {
  newDiag.selectedICD = null;
  icdSearchQuery.value = '';
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      newDiag.attachments.push({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type
      });
    }
  }
  target.value = '';
}

function removeAttachment(index: number) {
  newDiag.attachments.splice(index, 1);
}

function openAttachment(att: any) {
  activeAttachment.value = att;
}

// --- دوال جلب التشخيصات ---
const patientDiagnoses = computed(() => {
  if (!queueStore.selectedPatient) return [];
  return recordStore.diagnoses.filter(d => d.patient_id === queueStore.selectedPatient?.id);
});

const selectedDiagnosis = computed(() => {
  return patientDiagnoses.value.find(d => d.id === selectedDiagId.value) || patientDiagnoses.value[0];
});

onMounted(() => {
  // ✅ لو فيه تشخيص مختار في الروشتة، نختاره في القائمة تلقائياً
  const activeDiag = patientDiagnoses.value.find(d => d.icd10 === draftStore.icd10);
  if (activeDiag) {
    selectedDiagId.value = activeDiag.id;
  } else if (patientDiagnoses.value.length > 0) {
    selectedDiagId.value = patientDiagnoses.value[0].id;
  }
});

// ✅ دالة اختيار تشخيص قديم وربطه بالروشتة
function selectDiagnosis(diag: any) {
  selectedDiagId.value = diag.id;
  // بنمرر التشخيص للـ draft store عشان يظهر في الروشتة
  draftStore.setDiagnosis(diag.icd10, diag.title);
}

// ✅ دالة حفظ تشخيص جديد وربطه بالروشتة
function saveNewDiagnosis() {
  if (!queueStore.selectedPatient || !newDiag.selectedICD) return;

  const record: DiagnosisRecord = {
    id: `diag_${Date.now()}`,
    patient_id: queueStore.selectedPatient.id,
    doctor_name: 'د. طارق الحكيم',
    specialty: 'استشاري',
    title: newDiag.selectedICD.desc,
    icd10: newDiag.selectedICD.code,
    date: new Date().toISOString().split('T')[0],
    status: 'active',
    notes: newDiag.notes,
    attachments: newDiag.attachments
  };

  // 1. إضافة للسجل الطبي (Append-Only)
  recordStore.addDiagnosis(record);

  // 2. اختياره فوراً وربطه بالروشتة الحالية
  selectedDiagId.value = record.id;
  draftStore.setDiagnosis(record.icd10, record.title);

  // تصفير الفورم
  isFormOpen.value = false;
  newDiag.selectedICD = null;
  newDiag.attachments = [];
  newDiag.notes = '';
  icdSearchQuery.value = '';
}

// --- مساعدات الألوان ---
function getStatusColor(status: string) {
  if (status === 'updated') return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  if (status === 'active') return 'bg-rose-50 text-rose-700 border border-rose-200';
  return 'bg-amber-50 text-amber-700 border border-amber-200';
}

function getStatusDot(status: string) {
  if (status === 'updated') return 'bg-emerald-500';
  if (status === 'active') return 'bg-rose-500';
  return 'bg-amber-500';
}
</script>
