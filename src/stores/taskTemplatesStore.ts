import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface TaskTemplate {
    id: string;
    title: string;
    instructions: string;
    frequency: string;
    kind: 'exercise' | 'measurement' | 'nutrition' | 'care' | 'medication';
    isCustom: boolean;
    isPublic: boolean;
    createdBy: string;
}

export const useTaskTemplatesStore = defineStore('taskTemplates', () => {
    // 1. القوالب الجاهزة (النظام)
    const defaultTemplates = ref<TaskTemplate[]>([
        { id: 't1', title: 'تمارين إطالة الفقرات القطنية', instructions: '10 تكرارات، بلطف، مع التنفس العميق', frequency: 'daily', kind: 'exercise', isCustom: false, isPublic: true, createdBy: 'النظام' },
        { id: 't2', title: 'كمادات دافئة على أسفل الظهر', instructions: 'لمدة 15-20 دقيقة، 3 مرات يومياً', frequency: 'daily', kind: 'care', isCustom: false, isPublic: true, createdBy: 'النظام' },
        { id: 't3', title: 'المشي الخفيف', instructions: '15-20 دقيقة يومياً', frequency: 'daily', kind: 'exercise', isCustom: false, isPublic: true, createdBy: 'النظام' },
        { id: 't4', title: 'قياس ضغط الدم', instructions: 'في وضع الجلوس، بعد الراحة 5 دقائق', frequency: 'daily', kind: 'measurement', isCustom: false, isPublic: true, createdBy: 'النظام' },
        { id: 't5', title: 'فحص السكر العشوائي', instructions: 'قبل الغذاء، تسجيل القراءة', frequency: 'daily', kind: 'measurement', isCustom: false, isPublic: true, createdBy: 'النظام' },
        { id: 't6', title: 'شرب 2 لتر ماء يومياً', instructions: 'توزيع الكمية على مدار اليوم', frequency: 'daily', kind: 'nutrition', isCustom: false, isPublic: true, createdBy: 'النظام' },
    ]);

    // 2. القوالب المخصصة (اللي الطبيب بيحفظها)
    const customTemplates = ref<TaskTemplate[]>([]);

    // 3. Computed Properties للتقسيم الذكي
    const publicTemplates = computed(() =>
    customTemplates.value.filter(t => t.isPublic)
    );

    const privateTemplates = computed(() =>
    customTemplates.value.filter(t => !t.isPublic)
    );

    const allTemplates = computed(() => [
        ...customTemplates.value,
        ...defaultTemplates.value,
    ]);

    // 4. Actions (الدوال)
    function addCustomTemplate(template: Omit<TaskTemplate, 'id' | 'isCustom'>) {
        const newTemplate: TaskTemplate = {
            ...template,
            id: `custom_${Date.now()}`,
                                                 isCustom: true,
        };
        customTemplates.value.push(newTemplate);
    }

    function removeCustomTemplate(id: string) {
        customTemplates.value = customTemplates.value.filter(t => t.id !== id);
    }

    function updateCustomTemplate(id: string, updates: Partial<TaskTemplate>) {
        const index = customTemplates.value.findIndex(t => t.id === id);
        if (index !== -1) {
            customTemplates.value[index] = { ...customTemplates.value[index], ...updates };
        }
    }

    function togglePublic(id: string) {
        const template = customTemplates.value.find(t => t.id === id);
        if (template) {
            template.isPublic = !template.isPublic;
        }
    }

    // 5. Return
    return {
        defaultTemplates,
        customTemplates,
        publicTemplates,
        privateTemplates,
        allTemplates,
        addCustomTemplate,
        removeCustomTemplate,
        updateCustomTemplate,
        togglePublic,
    };
});
