import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface CatalogDrug {
    id: string;
    name: string;
    nameEn?: string; // ✅ جديد
    scientificName: string;
    category: string;
    defaultDose: string;
    defaultFrequency: string;
    manufacturer: string;
    price: number;
    stock?: number; // ✅ جديد
    stockStatus?: 'ok' | 'low' | 'out'; // ✅ جديد
    tags: string[];
    usageInstructions: string;
    formType?: 'tablet' | 'capsule' | 'syrup' | 'ampoule' | 'inhaler'; // ✅ جديد
    formColor?: string; // ✅ جديد
    imageUrl?: string;
}

export interface DrugContainer {
    id: string;
    name: string;
    description: string;
    drugs: CatalogDrug[];
}

export interface ICD10Code {
    code: string;
    description: string;
    category: string;
}

export const useCatalogStore = defineStore('catalog', () => {
    // 1. كتالوج الأدوية (محدث بالبيانات البصرية والمخزون)
    const drugs = ref<CatalogDrug[]>([
        {
            id: 'd1', name: 'أوجمنتين 1 جم', nameEn: 'Augmentin 1g', scientificName: 'Amoxicillin + Clavulanic Acid',
            category: 'مضاد حيوي', defaultDose: 'قرص واحد', defaultFrequency: 'كل 12 ساعة',
            manufacturer: 'GSK', price: 85, stock: 120, stockStatus: 'ok',
            tags: ['مضاد حيوي', 'عدوى بكتيرية'], formType: 'capsule', formColor: '#D9504A',
            usageInstructions: 'يؤخذ مع الطعام لتقليل اضطرابات المعدة. يجب إكمال الكورس كاملاً حتى لو تحسنت الأعراض.'
        },
        {
            id: 'd2', name: 'بانادول 500 مجم', nameEn: 'Panadol 500mg', scientificName: 'Paracetamol',
            category: 'مسكن', defaultDose: 'قرص واحد', defaultFrequency: 'كل 8 ساعات عند اللزوم',
            manufacturer: 'GSK', price: 25, stock: 340, stockStatus: 'ok',
            tags: ['مسكن', 'خافض حرارة'], formType: 'tablet', formColor: '#E8E0CC',
            usageInstructions: 'لا تتجاوز 4 جرعات في اليوم. يُستخدم بحذر مع مرضى الكبد.'
        },
        {
            id: 'd3', name: 'كونكور 5 مجم', nameEn: 'Concor 5mg', scientificName: 'Bisoprolol',
            category: 'أدوية القلب', defaultDose: 'قرص واحد', defaultFrequency: 'مرة واحدة صباحاً',
            manufacturer: 'Merck', price: 60, stock: 8, stockStatus: 'low',
            tags: ['ضغط الدم', 'قلب'], formType: 'tablet', formColor: '#4A7A8A',
            usageInstructions: 'يُبلع مع كمية كافية من الماء. لا يجب إيقافه فجأة لتجنب ارتفاع ضغط الدم الارتدادي.'
        },
        {
            id: 'd4', name: 'جلوكوفاج 1000 مجم', nameEn: 'Glucophage 1000mg', scientificName: 'Metformin',
            category: 'أدوية السكر', defaultDose: 'قرص واحد', defaultFrequency: 'مرتين يومياً بعد الأكل',
            manufacturer: 'Merck', price: 40, stock: 0, stockStatus: 'out',
            tags: ['سكري', 'ميتفورمين'], formType: 'tablet', formColor: '#FFFFFF',
            usageInstructions: 'يؤخذ مع أو بعد الطعام لتقليل الآثار الجانبية الهضمية.'
        },
        {
            id: 'd5', name: 'شراب دكستروميثورفان', nameEn: 'Dextromethorphan Syrup', scientificName: 'Dextromethorphan HBr',
            category: 'مضاد سعال', defaultDose: '5 مل', defaultFrequency: 'كل 6 ساعات',
            manufacturer: 'GSK', price: 32, stock: 15, stockStatus: 'low',
            tags: ['سعال', 'أطفال'], formType: 'syrup', formColor: '#D84878',
            usageInstructions: 'يُرج الزجاجة جيداً قبل الاستخدام. لا يُستخدم مع مثبطات MAO.'
        }
    ]);

    // 2. الحاويات الجاهزة (Click Kits) - ✅ تم الحفاظ عليها بدون تعارض
    const containers = ref<DrugContainer[]>([
        { id: 'c1', name: 'أدوية زكام', description: 'بروتوكول نزلات البرد والجيوب الأنفية', drugs: [] },
        { id: 'c2', name: 'أدوية بطن', description: 'بروتوكول التهاب المعدة والقولون', drugs: [] },
    ]);

    // 3. أكواد التشخيص ICD-10 - ✅ تم الحفاظ عليها بدون تعارض
    const icd10Codes = ref<ICD10Code[]>([
        { code: 'I10', description: 'ارتفاع ضغط الدم الأساسي', category: 'أمراض القلب' },
        { code: 'E11.9', description: 'داء السكري من النوع 2', category: 'الغدد الصماء' },
        { code: 'M54.5', description: 'ألم أسفل الظهر', category: 'العظام' },
        { code: 'J01.90', description: 'التهاب الجيوب الأنفية الحاد', category: 'الأنف والأذن' },
    ]);

    // --- دوال إدارة الحاويات ---
    function addContainer(name: string, description: string, initialDrug: CatalogDrug) {
        containers.value.push({
            id: `c_${Date.now()}`,
                              name,
                              description,
                              drugs: [initialDrug]
        });
    }

    function addDrugToContainer(containerId: string, drug: CatalogDrug) {
        const container = containers.value.find(c => c.id === containerId);
        if (container && !container.drugs.some(d => d.id === drug.id)) {
            container.drugs.push(drug);
        }
    }

    // --- دوال إدارة الأدوية ---
    function addDrug(drug: Omit<CatalogDrug, 'id'>) {
        drugs.value.unshift({ ...drug, id: `drug_${Date.now()}` });
    }

    function removeDrug(id: string) {
        drugs.value = drugs.value.filter(d => d.id !== id);
    }

    // --- دوال إدارة أكواد ICD-10 ---
    function addICD10(icd: ICD10Code) {
        icd10Codes.value.unshift(icd);
    }

    function removeICD10(code: string) {
        icd10Codes.value = icd10Codes.value.filter(c => c.code !== code);
    }

    function createContainer(name: string, description: string) {
        const c = { id: `c_${Date.now()}`, name, description, drugs: [] as CatalogDrug[] };
        containers.value.unshift(c);
        return c;
    }
    function updateContainer(id: string, patch: Partial<Pick<DrugContainer, 'name' | 'description'>>) {
        const c = containers.value.find(x => x.id === id);
        if (c) Object.assign(c, patch);
    }
    function removeContainer(id: string) { containers.value = containers.value.filter(c => c.id !== id); }
    function removeDrugFromContainer(containerId: string, drugId: string) {
        const c = containers.value.find(x => x.id === containerId);
        if (c) c.drugs = c.drugs.filter(d => d.id !== drugId);
    }
    // return += createContainer, updateContainer, removeContainer, removeDrugFromContainer

    return {
        drugs,
        containers,
        icd10Codes,
        addDrug,
        removeDrug,
        addICD10,
        removeICD10,
        addContainer,
        addDrugToContainer,
        createContainer,
        updateContainer,
        removeContainer,
        removeDrugFromContainer
    };
});
