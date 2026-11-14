//route/index
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = createRouter({
    history: createWebHistory(),
                            routes: [
                                {
                                    path: '/auth',
                                    name: 'auth',
                                    component: () => import('../features/auth/AuthPage.vue'),
                                },
                                // ✅ تم نقله للمستوى الجذري ليظهر كصفحة كاملة بدون AppLayout
                                {
                                    path: '/verify',
                            name: 'pharmacy-verify',
                            component: () => import('../features/pharmacy/PharmacyVerifyPage.vue'),
                                },
                                {
                                    path: '/',
                            component: () => import('../components/layout/AppLayout.vue'),
                            children: [
                                {
                                    path: '',
                            redirect: '/courses'
                                },
                            {
                                path: 'courses',
                            name: 'courses',
                            component: () => import('../features/courses/CoursesPage.vue'),
                            meta: { requiresAuth: true, role: 'patient' }
                            },
                            {
                                path: 'doctors',
                                name: 'doctors',
                                component: () => import('../features/doctor/DoctorDirectoryView.vue'),
                            meta: { requiresAuth: true, role: 'patient' }
                            },
                            {
                                path: 'schedule',
                                name: 'schedule',
                                component: () => import('../features/schedule/SchedulePage.vue'),
                            meta: { requiresAuth: true, role: 'patient' }
                            },
                            {
                                path: 'records',
                                name: 'records',
                                component: () => import('../features/records/MedicalRecordsPage.vue'),
                            meta: { requiresAuth: true, role: 'patient' }
                            },
                            {
                                path: 'family',
                                name: 'family',
                                component: () => import('../features/family/FamilyPage.vue'),
                            meta: { requiresAuth: true, role: 'patient' }
                            },
                            {
                                path: 'queue-tracker',
                                name: 'queue-tracker',
                                component: () => import('../features/queue/PatientQueueTracker.vue'),
                            meta: { requiresAuth: true, role: 'patient' }
                            },

                            // --- Doctor Routes ---
                            {
                                path: 'doctor/workbench',
                                name: 'doctor-workbench',
                                component: () => import('../features/doctor/DoctorWorkbench.vue'),
                            meta: { requiresAuth: true, role: 'doctor' }
                            },
                            {
                                path: 'doctor/patients/:id', // ✅ إزالة الشرطة المائلة في البداية لتتطابق مع بقية مسارات الأبناء
                                name: 'doctor-patient-detail',
                                component: () => import('../features/doctor/PatientDetailPage.vue'),
                            meta: { requiresAuth: true, role: 'doctor' }, // ✅ إضافة requiresAuth لضمان التحقق من تسجيل الدخول
                            },
                            {
                                path: 'doctor/schedule',
                                name: 'doctor-schedule',
                                component: () => import('../features/doctor/DoctorSchedulePage.vue'),
                            meta: { requiresAuth: true, role: 'doctor' }
                            },
                            {
                                path: 'doctor/prescribe',
                                name: 'doctor-prescribe',
                                component: () => import('../features/doctor/PrescriptionBuilderPage.vue'),
                            meta: { requiresAuth: true, role: 'doctor' }
                            },
                            {
                                path: 'doctor/archive',
                                name: 'doctor-archive',
                                component: () => import('../features/doctor/DoctorArchiveView.vue'),
                            meta: { requiresAuth: true, role: 'doctor' }
                            },
                            {
                                path: 'doctor/drugs',
                                name: 'doctor-drugs', // ✅ تم تغيير الاسم لتجنب التعارض
                                component: () => import('../features/doctor/DrugCardView.vue'),
                            meta: { requiresAuth: true, role: 'doctor' }
                            },
                            {
                                path: 'doctor/settings',
                                name: 'doctor-settings',
                                component: () => import('../features/doctor/DoctorProfileSettings.vue'),
                            meta: { requiresAuth: true, role: 'doctor' }
                            },
                            { path: 'doctor/library',
                                name: 'doctor-library',
                            component: () => import('../features/doctor/DoctorMedicalLibrary.vue'),
                            meta: { requiresAuth: true, role: 'doctor' } },

                            // --- Admin Routes ---
                            {
                                path: 'admin',
                            name: 'admin',
                            component: () => import('../features/admin/AdminDashboard.vue'),
                            meta: { requiresAuth: true, role: 'admin' }
                            },
                            {
                                path: 'admin/approvals',
                            name: 'admin-approvals',
                            component: () => import('../features/admin/DoctorApprovals.vue'),
                            meta: { requiresAuth: true, role: 'admin' }
                            },
                            {
                                path: 'admin/master-data',
                            name: 'admin-master-data',
                            component: () => import('../features/admin/AdminMasterData.vue'),
                            meta: { requiresAuth: true, role: 'admin' }
                            }
                            ]
                                }
                            ],
});

// Router Guard (حماية الصفحات)
router.beforeEach((to) => {
    const authStore = useAuthStore();

    // 1. التحقق من تسجيل الدخول
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return '/auth';
    }

    // 2. التحقق من صلاحية الدور (Role)
    if (to.meta.role && authStore.currentUser?.role !== to.meta.role) {
        return '/';
    }

    return true;
});

export default router;
