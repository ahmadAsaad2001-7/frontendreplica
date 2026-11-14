
# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).
🏗️ 1. Infrastructure & Core Engine (The Foundation)

Building the "Backend" logic inside Vue before touching complex UI.

    ☑

    Project Setup: Vite + Vue 3 + TypeScript + Tailwind CSS.
    ☑

    State Management: Pinia installed and configured.
    ☑

    Routing: Vue Router with nested routes and RBAC guards.
    ☑

    Contracts & Types (Zod): Define Recurrence, Schedule, PlanItem, AdherenceLog without fake defaults.
    ☑

    Pure Domain Math: dates.ts (Timezone-safe), recurrence.ts (OccursOn), projection.ts (Task generation).
    ☑

    Core Stores:

        useAuthStore (RBAC).

        useProfileStore (Family members).

        usePrescriptionStore (Immutable data).

        useAdherenceStore (Mutable logs).
    □

    Mock API / Seeder: Create a robust mockData.ts file that perfectly matches the Zod schemas.
    □

    Error Handling: Global Toast notification system (for PAST_DAY_LOCKED, 409 Conflict, etc.).

🧑‍🤝‍🧑 2. General Features (All Users)

The App Shell and shared utilities.

    □

    App Shell (Layout): Navbar, Sidebar (collapsible), Dark/Light mode toggle.
    □

    Authentication:
        □

        AuthPage with tabs (Demo Sandbox / Login / Register).
        □

        Account Switcher Modal (Quickly jump between Patient and Doctor for testing).
    □

    Profile Management: View/Edit personal info, change password, manage contact details.
    □

    Notifications Center: Bell icon with unread count, dropdown list of alerts.
    □

    Global Search: Search across medications, doctors, and diagnoses (Server-query style).

🧑‍🦽 3. Patient Role Features

Focus: Treatment adherence, family management, and medical history.
A. Family & Context

    □

    Family Bar: Horizontal avatars with active state (using useProfileStore).
    □

    Add Profile: Modal to add dependents (Strict validation: no fake blood types, tri-state allergies).

B. Courses & Treatment Plan

    □

    Courses Page: Grid layout with "Active" and "Completed" tabs.
    □

    Course Header: Display title, diagnosis, overall adherence %, and date range.
    □

    Task List: Render projected tasks. One task per dose (e.g., med_1@08:00).
    □

    Task Drawer: Sidebar modal showing detailed instructions, media attachments (videos/diagrams).
    □

    Habit Tracker: 14-day horizontal scroll with color-coded statuses (Green/Yellow/Red).
    □

    Day Review Modal: Click a day in the tracker to see exactly which tasks were missed.
    □

    Undo Toast: 5-second countdown to undo a task toggle.

C. Medical Records

    □

    Records Layout: Tabs for Diagnoses, Medications, Vitals, and Attachments.
    □

    Vitals Charts: Time-series charts for BP, Glucose, etc., with server-side flags (normal/critical).
    □

    Diagnoses Timeline: Append-only list of ICD-10 diagnoses with doctor notes and attachments.
    □

    Prescription View: Read-only view of signed prescriptions with QR code (for pharmacy).

D. Schedule & Booking

    □

    Patient Schedule: Calendar view of upcoming appointments.
    □

    Booking Flow: Select doctor -> select slot -> pay (InstaPay/Cash) -> get receipt.

🩺 4. Doctor Role Features

Focus: Queue management, clinical context, and prescription issuing.
A. Doctor Workbench (The Command Center)

    □

    Queue Sidebar:
        □

        Sections: Emergency (Red), Active (Green), Waiting (Blue), Grace Buffer (Yellow).
        □

        Action: Start Consultation (moves patient to context).
    □

    Patient Context Workspace:
        □

        Show allergies, chronic conditions, and previous vitals.
        □

        Quick view of past prescriptions.
    □

    Emergency Override: Modal with strict reason codes.

B. Prescription Builder (The Core Engine)

    □

    Draft State: Editable form for Diagnosis (ICD-10) and Plan Items.
    □

    Tasks & Drugs Builder:
        □

        Add Medications (Dose, Frequency, Duration).
        □

        Auto-verify allergies (Highlight conflicts in Red).
        □

        Add non-medical tasks (Exercises, Care).
    □

    Advanced Settings: Add day-specific exceptions (e.g., "On Day 3, take double dose").
    □

    Sign & Issue: The Final Step. Locks the prescription (Immutable) and generates the QR token.
    □

    Print/Export: Generate official PDF slip (Pharmacy) and patient plan slip.

C. Doctor Schedule

    □

    Weekly Matrix: Set recurring availability (e.g., Mon/Wed 4 PM - 8 PM).
    □

    Slot Duration: Minimum 20 mins, dynamically updates grid.
    □

    Blackout Periods: Block time for vacations/emergencies.

🧑‍💼 5. Assistant & Admin Role Features

Focus: Operations and Governance.
A. Assistant Hub

    □

    Multi-Doctor Switcher: Max 3 doctors.
    □

    Queue Management: Mark patients as "Arrived" or "Emergency".
    □

    Vitals Entry: Log initial BP/HR before doctor enters.

B. Admin Control Plane

    □

    Credentialing: Approve/Suspend doctor registrations.
    □

    Master Data: CRUD for Drug Catalog and ICD-10 codes.
    □

    Global Analytics: Platform health, active queues, revenue dashboards.

🚀 The Strategy: How we will build this

We will not build this top-to-bottom. We will build it in Vertical Slices.

    Slice 1 (Done): The Patient Course Engine (Data -> Math -> Pinia -> Simple UI).

    Slice 2 (Next): The Auth & App Shell (Router guard, Login, Family context switcher).

    Slice 3: The Doctor Workbench (Queue -> Patient Context -> Build & Issue Prescription).

    Slice 4: Patient Records & Vitals.
    
    
    
    
    🏥 Sehaty (صحتي) - Master Project Plan (Full Stack)
🏗️ 1. Infrastructure & Core (The Foundation)
Backend (.NET Modular Monolith)

    □

    Solution Setup: Create .sln with Api, SharedKernel, and Module projects.
    □

    Database: Setup PostgreSQL + EF Core.
    □

    Shared Kernel (Cross-cutting concerns):
        □

        BaseEntity (Id, CreatedAt, UpdatedAt, Version for OCC).
        □

        Result<T> pattern (to handle PAST_DAY_LOCKED, CONFLICT, etc., without throwing exceptions).
        □

        Outbox Pattern (for reliable event publishing between modules).
        □

        Global Exception Handler & Validation Middleware.
    □

    API Contract Generation: Ensure Swagger/OpenAPI perfectly matches the frontend Zod schemas.

Frontend (Vue 3)

    ☑

    Project Setup: Vite + Vue 3 + TypeScript + Tailwind.
    ☑

    Domain Math: Pure TS functions for projection, recurrence, dates.
    ☑

    Pinia Stores: auth, profile, prescription, adherence.
    □

    API Client: Setup Axios/Fetch wrapper to point to the .NET backend.
    □

    Error Handling: Global Toast system to catch .NET ProblemDetails responses.

🧩 2. Backend Modules (The Modular Monolith)

Each module has its own Domain, Application, and Infrastructure layers, and its own DB schema.
🔐 Module 1: Identity & Access (RBAC)

Handles Users, Roles, and Profiles (Family).

    □

    Domain: User, Role (Patient, Doctor, Admin, Assistant), Account, Profile (Family members).
    □

    Application: Register, Login (JWT), Add Profile, Link Family Member.
    □

    Infrastructure: ASP.NET Core Identity or custom JWT implementation. Password hashing.

🩺 Module 2: Clinical (The Core Engine)

Handles Prescriptions, Adherence, and the Doctor Queue.

    □

    Domain:
        □

        Prescription (Immutable), PlanItem, Schedule.
        □

        AdherenceLog (Separate entity, linked by PrescriptionId).
        □

        QueueEntry (Status, Priority, Version).
    □

    Application:
        □

        IssuePrescriptionCommand (Triggers Allergy Check before saving).
        □

        ToggleAdherenceCommand (Validates PAST_DAY_LOCKED and timezones).
        □

        MoveQueueStateCommand (Handles Emergency Override with OCC).
    □

    Infrastructure: EF Core configurations ensuring 1-to-many relationships between Prescription and AdherenceLogs.

📅 Module 3: Scheduling

Handles Appointments, Doctor Availability, and Payments.

    □

    Domain: Appointment, AvailabilitySlot, Payment (Status: Paid/Pending/Revoked).
    □

    Application: BookAppointmentCommand (OCC check to prevent double booking), CancelAppointment, VerifyPayment.
    □

    Infrastructure: Unique constraints on DoctorId + StartTime to prevent double bookings at the DB level.

📊 Module 4: Medical Records

Handles Vitals and Diagnoses.

    □

    Domain: VitalRecord, DiagnosisRecord (Append-only).
    □

    Application: AddVitalsCommand (Server calculates is_abnormal based on age/type), AddDiagnosisCommand.
    □

    Infrastructure: EF Core append-only configurations (prevent Updates/Deletes).

💊 Module 5: Catalog

Master Data.

    □

    Domain: Medication (Active Ingredient, Forms), ICD10Code.
    □

    Application: Search queries for the Doctor workbench.
    □

    Infrastructure: Seed data via EF Core migrations.

🧑‍🤝‍🧑 3. Frontend General Features (All Users)

(Depends on: Identity Module & App Shell)

    □

    App Shell: Navbar, Sidebar, Theme toggle.
    □

    Auth Flow: Login/Register with JWT storage.
    □

    Account Switcher: (For Demo Sandbox) seamlessly switch roles.
    □

    Notifications: Real-time alerts (SignalR integration).

🧑‍🦽 4. Frontend Patient Features

(Depends on: Clinical, Scheduling, Records)

    □

    Family Management: Add/Edit profiles.
    □

    Course View:
        □

        Fetch GET /api/prescriptions/{id}/projection (Server computes the tasks).
        □

        Toggle tasks (optimistic UI).
    □

    Habit Tracker: UI mapping of the projection.
    □

    Medical Records: Charts for Vitals, Timeline for Diagnoses.
    □

    Booking Flow: Select slot -> Payment -> Confirmation.

🩺 5. Frontend Doctor Features

(Depends on: Clinical, Scheduling, Catalog)

    □

    Doctor Workbench:
        □

        Queue Sidebar (SignalR for real-time updates).
        □

        Patient Context (Fetch active prescriptions and allergies).
    □

    Prescription Builder:
        □

        Search Drugs (from Catalog).
        □

        Allergy Conflict Warning (Returns 422 if conflict, prompts override).
        □

        Issue Prescription (POST /api/prescriptions).
    □

    Schedule Manager: Set availability slots.

🧑‍💼 6. Frontend Admin & Assistant Features

(Depends on: Identity, Catalog)

    □

    Assistant Hub: Check-in patients, enter vitals.
    □

    Admin Control: Approve doctors, manage drug catalog.

🚀 The Strategy: How to Execute This

We will not build this everything at once. We will build Vertical Slices (One feature from DB to UI).

Slice 1: Auth & Profiles (Backend + Frontend)

    Create Identity Module in .NET.

    Build AuthPage and FamilyBar in Vue.

    Connect them via JWT.

Slice 2: Clinical Core (The Engine)

    Create Clinical Module in .NET (Prescriptions & Logs).

    Write the ToggleAdherence endpoint.

    Connect the Vue useAdherenceStore to the real API.

Slice 3: Doctor Workbench

    Create Queue & Prescription endpoints.

    Build the 3-column layout in Vue.

    Implement the Allergy Conflict logic (Server-side).

------------------------------------------------------------------------------------------------------------------

 المرحلة الأولى: التأسيس والهوية (The Core Foundation)

الهدف: إنشاء البنية التحتية للـ Backend، وربط الفرونت إند بأول API حقيقي، وعمل تسجيل الدخول.

1. الـ Backend (.NET):

    إنشاء الـ Solution (Api, SharedKernel, Modules).

    إعداد الـ Docker (PostgreSQL + pgAdmin).

    بناء الـ SharedKernel (BaseEntity, Result<T>).

    Module 1 (Identity): بناء الـ User, Roles, Profiles (العائلة).

    عمل Endpoints: Login, Register, GET /me, POST /profiles.


2. الـ Frontend (Vue):

    إعداد الـ API Client (Axios) وربطه بالـ Backend.

    عمل الـ App Shell (Navbar, Sidebar).

    بناء صفحة AuthPage وربطها بالـ API الحقيقي (تخزين الـ JWT).

    تحديث الـ useAuthStore و useProfileStore عشان يشتغلوا بالـ API بدل الـ Mock Data.

🔵 المرحلة الثانية: المحرك السريري (Clinical Engine - Patient Slice)

الهدف: بناء أول Vertical Slice كامل، يثبت إن المريض يقدر يشوف الكورس بتاعه ويتفاعل معاه.

1. الـ Backend (.NET):

    Module 2 (Clinical): بناء الـ Entities (Prescription, PlanItem, AdherenceLog).

    عمل Endpoints:

        GET /prescriptions/{id}/projection (السيرفر بيحسب المهام).

        PUT /prescriptions/{id}/adherence (مع تطبيق قواعد PAST_DAY_LOCKED).

        POST /prescriptions (للتجربة المبدئية).

2. الـ Frontend (Vue):

    بناء الـ FamilyBar (لاختيار المريض).

    بناء صفحة الكورسات (CoursesPage, CourseHeader).

    بناء الـ TaskList والـ HabitTracker وربطهم بالـ API.

    بناء الـ TaskDrawer والـ UndoToast.

🔴 المرحلة الثالثة: محطة عمل الطبيب (Doctor Workbench)

الهدف: بناء المكان اللي بيتم فيه إنشاء البيانات (الروشتات والطابور).

1. الـ Backend (.NET):

    إضافة الـ Queue Entitiy في الـ Clinical Module.

    بناء الـ IssuePrescriptionCommand (مع فحص الحساسية Server-Side).

    عمل Endpoints:

        GET /doctor/queue (مع دعم SignalR للتحديث اللحظي).

        POST /doctor/prescriptions (التوقيع والإصدار).

2. الـ Frontend (Vue):

    بناء شاشة الـ 3 أعمدة (DoctorWorkbench).

    بناء الـ Queue Sidebar (مع الألوان: طوارئ، انتظار، الخ).

    بناء الـ Patient Context (عرض الحساسية والتاريخ المرضي).

    بناء الـ Prescription Builder (إضافة أدوية، مهام، وفحص الحساسية).

🟡 المرحلة الرابعة: السجل الطبي والقياسات (Medical Records)

الهدف: أرشفة التاريخ المرضي والقياسات الحيوية.

1. الـ Backend (.NET):

    Module 4 (Records): بناء VitalRecord و DiagnosisRecord.

    عمل Endpoints لإضافة وقراءة القياسات (مع حساب is_abnormal في السيرفر).

2. الـ Frontend (Vue):

    بناء صفحة السجل الطبي (Tabs: Diagnoses, Medications, Vitals).

    بناء الرسوم البيانية (Charts) للقياسات الحيوية.

    بناء الـ Timeline للتشخيصات.

🟣 المرحلة الخامسة: المواعيد والدفع (Scheduling & Payments)

الهدف: إدارة الحجوزات والمواعيد.

1. الـ Backend (.NET):

    Module 3 (Scheduling): بناء Appointment و AvailabilitySlot (مع OCC لمنع الحجز المزدوج).

    بناء Endpoints الحجز وإلغاء الحجز.

2. الـ Frontend (Vue):

    بناء شاشة تقويم المواعيد للمريض.

    بناء شاشة إعداد الجدول للطبيب (Recurring / Advanced).

    بناء خطوات الحجز والدفع (InstaPay / Cash).

⚫ المرحلة السادسة: الإدارة والمساعدين (Admin & Assistant)

الهدف: إغلاق الدائرة الإدارية للنظام.

1. الـ Backend (.NET):

    Module 5 (Catalog): إدارة الأدوية وأكواد ICD-10.

    بناء Endpoints خاصة بالـ Admin (الموافقة على الأطباء، الإحصائيات).

2. الـ Frontend (Vue):

    بناء لوحة تحكم المساعد (Check-in, Vitals Entry).

    بناء لوحة تحكم الأدمن (الموافقات، الكتالوج).
