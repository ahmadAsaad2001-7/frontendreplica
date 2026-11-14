import assert from 'node:assert/strict';
import { normalizePatientId, normalizeDoctorId } from '../src/features/doctor/composables/usePatientResolver';
import { allergyNames, chronicNames } from '../src/types/patient';

assert.equal(normalizePatientId('P-2048'), 'pat_001');
assert.equal(normalizePatientId('P-2047'), 'pat_002');
assert.equal(normalizePatientId('pat_101'), 'pat_101');
assert.equal(normalizeDoctorId('doc_1'), 'doc_001');
assert.equal(normalizeDoctorId('doc_2'), 'doc_002');
assert.deepEqual(
    allergyNames(['بنسلين', { id: 'a1', substance: 'سلفا', severity: 'Mild', addedAt: '2026-01-01' }]),
                 ['بنسلين', 'سلفا']
);
assert.deepEqual(
    chronicNames(['سكري', { id: 'c1', name: 'ضغط', addedAt: '2026-01-01' }]),
                 ['سكري', 'ضغط']
);
console.log('✅ patientIdentity tests passed');
