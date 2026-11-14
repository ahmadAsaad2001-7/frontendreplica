import assert from 'node:assert/strict';
import { createPinia, setActivePinia } from 'pinia';
import { usePrescriptionTemplatesStore, drugDedupeKey, taskDedupeKey } from '../src/stores/prescriptionTemplatesStore';
import { usePrescriptionDraftStore } from '../src/stores/prescriptionDraftStore';

setActivePinia(createPinia());
const tpl = usePrescriptionTemplatesStore();
const draft = usePrescriptionDraftStore();

// ── instantiate: عناصر بلا id وبلا بيانات مريض، ونسخ مستقلة ──
const inst = tpl.instantiateTemplate('tpl_cold_flu')!;
assert.ok(inst);
assert.equal(inst.items.length, 4); // دواءان + مهمتان
assert.ok(inst.items.every(i => !('id' in i) && !('patient_id' in i) && !('status' in i)));
const a = tpl.instantiateTemplate('tpl_cold_flu')!;
const b = tpl.instantiateTemplate('tpl_cold_flu')!;
assert.notStrictEqual(a.items[0].schedule, b.items[0].schedule);

// ── مفاتيح منع التكرار ──
assert.equal(drugDedupeKey({ scientificName: 'Paracetamol', dosage: '500mg' }), drugDedupeKey({ scientificName: ' paracetamol ', dosage: '500mg' }));
assert.notEqual(drugDedupeKey({ scientificName: 'Paracetamol', dosage: '500mg' }), drugDedupeKey({ scientificName: 'Paracetamol', dosage: '1g' }));
assert.equal(taskDedupeKey({ kind: 'measurement', title: 'قياس الحرارة' }), taskDedupeKey({ kind: 'measurement', title: ' قياس الحرارة ' }));

// ── append على مسودة فارغة ──
draft.resetDraft();
let r = draft.applyTemplate('tpl_cold_flu', 'append');
assert.equal(r.added, 5); // تشخيص + 4 عناصر
assert.equal(r.skipped, 0);
assert.equal(draft.planItems.length, 4);
assert.equal(draft.diagnoses.length, 1);

// ── append مكرر → تخطي كامل بلا تغيير ──
r = draft.applyTemplate('tpl_cold_flu', 'append');
assert.equal(r.added, 0);
assert.equal(r.skipped, 5);
assert.equal(draft.planItems.length, 4);

// ── undo يعيد حالة ما قبل آخر تطبيق ──
assert.equal(draft.undoLastApply(), true);
assert.equal(draft.planItems.length, 4);

// ── undo بعد تطبيق وحيد يعيد الفراغ ──
draft.resetDraft();
draft.applyTemplate('tpl_cold_flu', 'append');
assert.equal(draft.undoLastApply(), true);
assert.equal(draft.planItems.length, 0);
assert.equal(draft.diagnoses.length, 0);

// ── replace يستبدل التشخيص والعناصر ──
draft.applyTemplate('tpl_cold_flu', 'append');
r = draft.applyTemplate('tpl_htn_followup', 'replace');
assert.equal(r.mode, 'replace');
assert.equal(draft.diagnoses[0].icd10, 'I10');
assert.equal(draft.planItems.length, 2);
assert.ok(draft.planItems.every(i => i.title !== 'بانادول 500 مجم'));

// ── عدّاد الاستخدام يتقدم ──
assert.ok(tpl.getById('tpl_cold_flu')!.usageCount > 34);

// ── القالب المحفوظ لا يحمل بيانات مريض ──
const created = tpl.addTemplate({ name: 'اختبار', tags: [], diagnoses: draft.diagnoses.map(d => ({ icd10: d.icd10, title: d.title })), drugs: [], tasks: [] });
assert.ok(!('patient_id' in created) && !('doctor_id' in created) && !('verification_code' in created));

console.log('✅ prescriptionTemplates tests passed');
