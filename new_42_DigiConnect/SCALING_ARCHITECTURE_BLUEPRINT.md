# 🏛️ DigiConnect — Pan-India Scaling Master Architecture & Implementation Roadmap

> **Document Type:** Comprehensive Architectural Design, System Specification & Execution Roadmap  
> **Target Scope:** Scaling DigiConnect from Andhra Pradesh to Telangana and Pan-India (All 28 States & 8 UTs)  
> **Technology Stack:**  
> • **Frontend:** Vanilla HTML5 / Modern CSS3 (Variables, Grids) / Modular ES6 JavaScript (Zero Framework Bloat)  
> • **Backend:** NestJS Modular REST API (Controllers, Services, Modules, Simple Guards, Filters)  
> • **Persistence:** Strongly Typed In-Memory MockDB Subsystem (Zero External DBMS requirement; instant dev startup)  
> • **Authentication:** Simple Session-State & Identity Headers (`x-user-id`, `x-role`, `x-designation`; zero JWT complexity)  
> **Status:** Active Reference & Live Implementation Tracker  

---

## 📋 Table of Contents
1. [Executive Summary & Problem Statement](#1-executive-summary--problem-statement)
2. [Constitutional & Governance Realities (Pan-India Context)](#2-constitutional--governance-realities-pan-india-context)
3. [The 3-Tier Federated Administrative Hierarchy](#3-the-3-tier-federated-administrative-hierarchy)
4. [Designation-Driven Dynamic Officer Architecture](#4-designation-driven-dynamic-officer-architecture)
5. [Dynamic Workflow & Multi-Stage Processing Engine ($N$-Stages)](#5-dynamic-workflow--multi-stage-processing-engine-n-stages)
6. [Rural vs. Urban Jurisdictional & Document Divergence](#6-rural-vs-urban-jurisdictional--document-divergence)
7. [In-Site Notification Subsystem](#7-in-site-notification-subsystem)
8. [The MockDB In-Memory Subsystem (Zero-DBMS Architecture)](#8-the-mockdb-in-memory-subsystem-zero-dbms-architecture)
9. [Complete End-to-End Directory Structure](#9-complete-end-to-end-directory-structure)
10. [Comprehensive File & Module Inventory Guide](#10-comprehensive-file--module-inventory-guide)
11. [Strategic Plan of Action & Implementation Roadmap](#11-strategic-plan-of-action--implementation-roadmap)
12. [End-to-End Service Lifecycle Walkthrough](#12-end-to-end-service-lifecycle-walkthrough)

---

## 1. Executive Summary & Problem Statement

### The Starting Point
The legacy prototype of **DigiConnect (Unified Citizen Service Delivery Platform — UCSDP)** was built around fixed Andhra Pradesh workflows (Grama/Ward Sachivalayam, MeeSeva patterns, and a hardcoded two-step approval hierarchy: Field Officer $\rightarrow$ Supervisor).

### The Pan-India Scaling Challenges
Scaling across **Telangana and all 28 States & 8 UTs** requires solving four systemic variations:
1. **Variable Workflow Chains ($1 \dots N$ Stages):** Simple certificates require only 1 approval step; complex welfare schemes or land mutations require 3 to 4 steps across field, sub-district, and district levels.
2. **State-Specific Administrative Nomenclatures:** A sub-district officer is a *Mandal Revenue Officer (MRO) / Tahsildar* in AP & Telangana, a *Mamlatdar / Tehsildar* in Maharashtra & Gujarat, a *Circle Officer (CO)* in Bihar, and an *SDM / Tehsildar* in Uttar Pradesh. Field officers are *VROs* in the South, *Patwaris / Lekhpals* in the North, and *Talathis* in Maharashtra. Hardcoded roles make national scaling impossible.
3. **Rural vs. Urban Divergence:**
   * **Rural:** District $\rightarrow$ Mandal / Block / Tehsil $\rightarrow$ Gram Panchayat / Village (requires Land Passbook / Pahani / 1-B / Gram Panchayat NOC).
   * **Urban:** District $\rightarrow$ Municipal Corporation / Municipality $\rightarrow$ Zone / Ward (requires Property Tax Assessment / Municipal Door No / Water Bill).
4. **No-Code Department Administration:** Non-technical Department Heads (IAS officers, Commissioners) must be able to visually define services, document requirements, $N$-stage pipelines, and designation permissions without touching JSON configuration files or redeploying code.

---

## 2. Constitutional & Governance Realities (Pan-India Context)

Under the **Seventh Schedule of the Indian Constitution**:
* Land, Revenue, Municipal Governance, Local Policing, and Public Health are strictly **State List subjects**.
* The Central Government cannot legally or operationally mandate a uniform approval hierarchy across all states.
* Therefore, the only viable national architecture is a **Federated Governance Model** (similar to national architectures like NIC ServicePlus, CPGRAMS, and Jan Parichay).

---

## 3. The 3-Tier Federated Administrative Hierarchy

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       1. CENTRAL ADMIN (MeitY / NIC)                        │
│          • Global Platform Health, System Security, National Audit Logs     │
│          • Creates / Authorizes 28 States + 8 UT Admins                     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                   ┌───────────────────┴───────────────────┐
                   ▼                                       ▼
┌──────────────────────────────────────┐ ┌──────────────────────────────────────┐
│  2. STATE ADMIN (Telangana ITE&C)    │ │  2. STATE ADMIN (Maharashtra DIT)    │
│  • Configures Districts & Mandals    │ │  • Configures Districts & Talukas    │
│  • Appoints State Department Heads   │ │  • Appoints State Department Heads   │
│  • Monitors Treasury Revenue Reports │ │  • Monitors Treasury Revenue Reports │
└──────────────────┬───────────────────┘ └──────────────────┬───────────────────┘
                   │                                        │
        ┌──────────┴──────────┐                  ┌──────────┴──────────┐
        ▼                     ▼                  ▼                     ▼
┌──────────────┐       ┌──────────────┐   ┌──────────────┐      ┌──────────────┐
│Revenue Head  │       │Municipal Head│   │Revenue Head  │      │Municipal Head│
│(CCLA)        │       │(CDMA)        │   │(Div. Comm.)  │      │(MCGM/Urban)  │
│• VRO->RI->MRO│       │• Ward->Comm. │   │• Talathi->SDO│      │• Ward->Officer
│• 3 Stages    │       │• 2 Stages    │   │• 2 Stages    │      │• 2 Stages    │
└──────────────┘       └──────────────┘   └──────────────┘      └──────────────┘
```

### Tier 1: Central Admin (National Level — Union Government)
* **Real-World Designations:** DG (NIC), CEO (NeGD / Digital India Corporation), Joint Secretary (MeitY).
* **Responsibilities:**
  * Pan-India platform health, national security audit trail, and global settings.
  * Authorizing and issuing credentials for the **28 State & 8 UT Admins**.

### Tier 2: State Admin (State Level)
* **Real-World Designations:** Principal Secretary (ITE&C), Commissioner of Electronic Service Delivery (ESD / MeeSeva / MahaOnline), State Informatics Officer (NIC).
* **Responsibilities:**
  * Managing state portal branding and active administrative theme.
  * Configuring master geographical jurisdictions (Districts, Mandals/Tehsils, Municipalities, Wards).
  * Appointing and delegating authority to **Department Admins** across state line departments.
  * Reviewing state treasury settlement summaries.

### Tier 3: Department Admin / Head (Line Department Level)
* **Real-World Designations:** Chief Commissioner of Land Administration (CCLA), Commissioner & Director of Municipal Administration (CDMA), Transport Commissioner (TC).
* **Responsibilities:**
  * Full ownership of the department's service catalog (Certificates, Schemes, Permits, Licenses).
  * Configuring Rural vs. Urban document requirement checklists.
  * Visually building the approval pipeline ($1$ to $N$ stages) and statutory SLA days per stage.
  * **Configuring the Designation & Action Permission Matrix** for that department's officers.
  * Onboarding field officers and assigning them to specific Mandals/Wards.

---

## 4. Designation-Driven Dynamic Officer Architecture

### The Core Innovation: Zero Hardcoded Roles
Instead of hardcoding rigid roles like `"officer"` and `"supervisor"` in frontend HTML and backend code, all government personnel belong to a unified entity: **`Officer`**.

An officer's behavior, menu tabs, application queues, and action buttons are dynamically governed by their **Designation** and the **Department Admin's Configuration Matrix**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   Department Admin Configuration Matrix                │
│  "Define designations, allowed pages, and stage review action buttons" │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│ Designation: VRO     │  │ Designation: RI      │  │ Designation: Tahsildar│
│                      │  │                      │  │                      │
│ • Pages Allowed:     │  │ • Pages Allowed:     │  │ • Pages Allowed:     │
│   - Field Queue      │  │   - Scrutiny Queue   │  │   - Approval Queue   │
│   - Citizen Queries  │  │   - Citizen Queries  │  │   - SLA Overrides    │
│                      │  │                      │  │                      │
│ • Action Buttons:    │  │ • Action Buttons:    │  │ • Action Buttons:    │
│   [✓ Verify & Forward]│  │   [✓ Recommend Pass] │  │   [✍ Sign & Approve] │
│   [? Query Citizen]  │  │   [↩ Revert to VRO]  │  │   [✕ Reject App]     │
│   [✕ Reject App]     │  │   [✕ Reject App]     │  │   [🔄 Reassign Task] │
└──────────────────────┘  └──────────────────────┘  └──────────────────────┘
```

### Dynamic UI Rendering Logic:
1. **Dynamic Navigation (`sidebar.js`):** Reads the officer's `designation` and permissions. Only renders menu tabs authorized by the Department Admin for that post.
2. **Dynamic Queue (`queue.html`):** Only queries applications where:
   $$\text{app.currentStage.assignedDesignation} == \text{officer.designation} \quad \land \quad \text{app.jurisdiction} == \text{officer.jurisdiction}$$
3. **Dynamic Review Desk (`review-application.html`):** A single, unified review desk displays application data and documents. At the bottom, it dynamically injects **only the action buttons** authorized for that officer's designation at that specific stage.

---

## 5. Dynamic Workflow & Multi-Stage Processing Engine ($N$-Stages)

### Sequential $N$-Stage Pipeline Model
Each service definition supports an ordered array of stages ($1 \dots N$):

```typescript
interface ServiceWorkflowDefinition {
  serviceId: string;
  serviceName: string;
  departmentId: string;
  areaApplicability: 'RURAL' | 'URBAN' | 'BOTH';
  requiredDocuments: {
    rural: string[]; // e.g. ['Aadhaar Card', 'Pahani / RoR-1B', 'Gram Panchayat NOC']
    urban: string[]; // e.g. ['Aadhaar Card', 'Property Tax Assessment', 'Water Bill']
  };
  stages: [
    {
      stageNumber: 1;
      stageName: 'Field Inspection & Verification';
      assignedDesignation: 'Village Revenue Officer';
      slaDays: 3;
      allowedActions: ['VERIFY_FORWARD', 'QUERY_CITIZEN', 'REJECT'];
    },
    {
      stageNumber: 2;
      stageName: 'Departmental Scrutiny';
      assignedDesignation: 'Revenue Inspector';
      slaDays: 2;
      allowedActions: ['RECOMMEND_APPROVAL', 'REVERT_TO_PREVIOUS', 'REJECT'];
    },
    {
      stageNumber: 3;
      stageName: 'Final Sanction & Digital Seal';
      assignedDesignation: 'Tahsildar';
      slaDays: 2;
      allowedActions: ['DIGITAL_SIGN_APPROVE', 'FINAL_REJECT', 'REASSIGN'];
    }
  ];
}
```

### Transition State Machine:
* When an officer at Stage $k$ triggers a forward action, the engine advances:
  $$\text{currentStageIndex} = k + 1$$
* The application automatically moves out of the current officer's queue into the queue of the officer holding `stages[k + 1].assignedDesignation` in that specific jurisdiction.
* When the final stage officer approves, the application status becomes `APPROVED`, generates a unique certificate number, and triggers a citizen notification.

---

## 6. Rural vs. Urban Jurisdictional & Document Divergence

Indian public service delivery fundamentally bifurcates based on location:

| Dimension | Rural Area Flow | Urban Area Flow |
|---|---|---|
| **Administrative Hierarchy** | State $\rightarrow$ District $\rightarrow$ Mandal / Block / Tehsil $\rightarrow$ Gram Panchayat / Village | State $\rightarrow$ District $\rightarrow$ Municipal Corporation / Municipality $\rightarrow$ Zone $\rightarrow$ Ward |
| **Field Verification Official** | Village Revenue Officer (VRO) / Patwari / Talathi | Ward Administrative Officer / Municipal Inspector |
| **Primary Land / Residence Proof** | Land Passbook / 1-B Namuna / Pahani / Gram Panchayat NOC | Property Tax Receipt / Municipal Door No / Water Bill |
| **DigiConnect UI Behavior** | `apply-service.html` dynamically updates the document upload checklist immediately upon toggling **Rural**. | `apply-service.html` dynamically updates the document upload checklist immediately upon toggling **Urban**. |

---

## 7. In-Site Notification Subsystem

DigiConnect implements a zero-dependency **In-Site Notification System** built into the top navigation bar of all dashboards:

```text
   [🔔 Topbar Notification Bell with Dynamic Unread Badge]
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
   Citizen Alert    Officer Queue     Admin Notice
  "VRO verified &  "3 new applications "New officer
   forwarded APP"   in your Mandal"   onboarding pending"
```

### Capabilities:
* **Citizen Real-Time Updates:** Instant alerts when an application transitions stages, when a query is raised, or when an approved certificate is ready.
* **Officer Workload Alerts:** Notifications when new applications enter their designation queue or when an application approaches its statutory SLA deadline.
* **Interactive Redirects:** Clicking a notification redirects directly to `track-application.html` or `review-application.html`.
* **Read State Management:** Features "Mark as Read" and "Mark All as Read".

---

## 8. The MockDB In-Memory Subsystem (Zero-DBMS Architecture)

To ensure instant developer onboarding with zero database installations or connection errors, DigiConnect runs on a **modular In-Memory Collection Subsystem**:

```text
                           ┌─────────────────────────┐
                           │   MockDB Central Store  │
                           │  (State Coordinator)    │
                           └────────────┬────────────┘
                                        │
  ┌──────────────┬──────────────┬───────┴──────┬──────────────┬──────────────┬──────────────┐
  ▼              ▼              ▼              ▼              ▼              ▼              ▼
[Users]       [States]     [Geography]    [Services]     [Workflow]   [Applications]  [Notifications]
Collection    Collection   Collection     Collection     Collection   Collection      Collection
```

### Architectural Highlights:
1. **Zero External Dependencies:** No PostgreSQL, MySQL, or Docker required; simply run `npm run start:dev`.
2. **Modular Collection Files:** Separate in-memory collections for `users`, `states`, `geography`, `services`, `workflow`, `applications`, `grievances`, and `notifications`.
3. **Repository Simulation:** Standard async helper methods (`find()`, `findById()`, `create()`, `update()`, `filterByJurisdiction()`).
4. **Pre-Seeded Master Data:** Comes pre-loaded with Andhra Pradesh, Telangana, and Maharashtra jurisdictions, standard designation chains, sample services, and ready-to-use demo accounts.

---

## 9. Complete End-to-End Directory Structure

```text
42_DigiConnect/
│
├── front-end/                              # CLEAN CLIENT (Vanilla HTML5 / CSS3 / ES6)
│   ├── index.html                          # Public Portal Landing Page
│   ├── login.html                          # Universal Login (Citizen & Personnel)
│   ├── register.html                       # Citizen Registration
│   ├── profile.html                        # User Profile & Jurisdiction Details
│   │
│   ├── css/                                # Centralized Styling
│   │   ├── style.css                       # Variables, Themes, Typography
│   │   ├── dashboard.css                   # Metrics Cards, Tables, Badges
│   │   ├── forms.css                       # Forms, Steppers & Rural/Urban Toggle
│   │   └── responsive.css                  # Mobile Breakpoints & Layouts
│   │
│   ├── js/                                 # Modular Frontend Engine
│   │   ├── api.js                          # Central Fetch Client (sends x-user-id / x-role)
│   │   ├── auth.js                         # Simple Session State (localStorage)
│   │   ├── components.js                   # Modals, Toasts, Alerts
│   │   ├── notifications.js                # Notification Bell, Dropdown Drawer & Read State
│   │   ├── sidebar.js                      # Dynamic Menu Builder (based on Designation/Role)
│   │   ├── topbar.js                       # Active Officer Badge, Jurisdiction & Bell Icon
│   │   │
│   │   └── modules/                        # Page-Specific Feature Controllers
│   │       ├── citizen.js                  # Dynamic Application Form & File Uploading
│   │       ├── officer.js                  # Dynamic Queue Loader & SLA Calculator
│   │       ├── review.js                   # Dynamic Action Button Generator for Review Screen
│   │       ├── grievance.js                # Grievance Submission & Tracking Logic
│   │       ├── workflow-config.js          # Visual N-Stage Pipeline Builder (Dept Admin)
│   │       └── designation-matrix.js       # Designation & Action Button Matrix (Dept Admin)
│   │
│   ├── citizen/                            # 👨‍💼 CITIZEN PORTAL
│   │   ├── citizen-dashboard.html          # Overview & Quick Actions
│   │   ├── apply-service.html              # Dynamic Application Form (Rural vs Urban)
│   │   ├── my-applications.html            # [SEPARATE] List of All Submitted Applications
│   │   ├── track-application.html          # [SEPARATE] Visual Stage Timeline & Tracking
│   │   ├── raise-grievance.html            # [SEPARATE] File a New Grievance
│   │   ├── my-grievances.html              # [SEPARATE] View Filed Grievances & Status
│   │   └── certificates.html               # View & Print Approved Certificates
│   │
│   ├── officer/                            # 👮 UNIFIED OFFICER WORKSPACE (Zero Hardcoded Roles)
│   │   ├── officer-dashboard.html          # Workload Metrics for the Logged-in Post
│   │   ├── queue.html                      # Dynamic Queue (Filtered by Designation + Jurisdiction)
│   │   ├── review-application.html         # Review Desk (Data + Docs + Dynamic Action Buttons)
│   │   └── queries.html                    # Citizen Queries & Clarifications Desk
│   │
│   ├── grievance/                          # ⚖️ GRIEVANCE REDRESSAL OFFICER
│   │   ├── grievance-dashboard.html        # Grievance Triage & Department Breakdown
│   │   └── investigate.html                # Timeline Audit & Resolution Orders
│   │
│   └── admin/                              # 🏢 3-TIER FEDERATED ADMIN CONSOLE
│       ├── central/                        # Tier 1: Union Admin (MeitY/NIC)
│       │   ├── dashboard.html              # Pan-India Overview & States Monitor
│       │   └── state-onboarding.html       # Onboard State Admins (AP, TS, MH, UP...)
│       │
│       ├── state/                          # Tier 2: State Admin (e.g., TS ITE&C)
│       │   ├── dashboard.html              # State-Wide Command Center
│       │   ├── dept-onboarding.html        # Appoint Dept Heads (CCLA, CDMA...)
│       │   ├── geography-config.html       # Districts, Mandals/Tehsils, Wards Masters
│       │   └── revenue-reports.html        # Treasury Settlement Reports
│       │
│       └── department/                     # Tier 3: Department Head (CCLA / CDMA)
│           ├── dashboard.html              # Department SLA Performance
│           ├── manage-services.html        # Service Builder (Fees & Rural/Urban Doc Rules)
│           ├── workflow-config.html        # Visual N-Stage Pipeline Builder
│           ├── designation-matrix.html     # Designation & Button Permission Builder
│           └── officer-onboarding.html     # Onboard Officers & Assign Mandals/Wards
│
└── back-end/                               # LEAN NESTJS BACKEND (Zero Bloat)
    ├── src/
    │   ├── main.ts                         # Bootstrap & Global Filters
    │   ├── app.module.ts                   # Root Application Module
    │   │
    │   ├── common/                         # Shared Cross-Cutting Helpers
    │   │   ├── guards/
    │   │   │   └── simple-auth.guard.ts    # Reads user/role from header/session (No JWT complexity)
    │   │   ├── middlewares/
    │   │   │   └── logging.middleware.ts   # Request Audit Logger
    │   │   └── filters/
    │   │       └── http-exception.filter.ts# Standardized Error Responses
    │   │
    │   ├── database/                       # 💾 MOCK DATABASE (In-Memory Collections)
    │   │   ├── mock-db.service.ts          # Central In-Memory Store Coordinator
    │   │   ├── collections/                # Clean, Separated In-Memory Stores
    │   │   │   ├── users.collection.ts     # Citizens, Officers, Admins
    │   │   │   ├── states.collection.ts    # 28 States & 8 UTs Master
    │   │   │   ├── geography.collection.ts # Districts, Mandals, Wards
    │   │   │   ├── services.collection.ts  # Services, Fees, Rural/Urban Doc Checklists
    │   │   │   ├── workflow.collection.ts  # N-Stage Pipeline Definitions & Designation Matrix
    │   │   │   ├── applications.collection.ts # Application Instances & History
    │   │   │   ├── grievances.collection.ts   # Grievance Records
    │   │   │   └── notifications.collection.ts# In-Site Notifications Store
    │   │   └── seeds/                      # Pre-seeded Demo Data
    │   │       ├── states.seed.ts          # Pre-loaded AP, Telangana, Maharashtra
    │   │       ├── designations.seed.ts    # VRO, RI, Tahsildar, Talathi
    │   │       ├── services.seed.ts        # Income, Caste, Land Mutation Workflows
    │   │       └── demo-users.seed.ts      # Ready-to-use Login Credentials
    │   │
    │   └── modules/                        # 7 Lean Domain Modules
    │       ├── auth/                       # Simple Login & Register
    │       ├── users/                      # Profile & Personnel Management
    │       ├── admin/                      # Central, State & Dept Admin Operations
    │       ├── services/                   # Service Catalog & Requirements
    │       ├── workflow/                   # N-Stage Pipeline & Designation Permission Matrix
    │       ├── applications/               # Submission, Queue Filtering, Review Actions & Certs
    │       ├── grievances/                 # Grievance Filing, Investigation & Resolution
    │       └── notifications/              # In-Site Notification Service & Endpoints
    │
    └── test/                               # API Test Scripts
```

---

## 10. Comprehensive File & Module Inventory Guide

### Frontend Portals & Pages

#### Root & Public Pages:
* `front-end/index.html`: Modern landing page with service discovery, department cards, and portal entrance links.
* `front-end/login.html`: Universal login supporting Citizens, Officers, and Admins with one-click demo login buttons.
* `front-end/register.html`: Citizen registration with mobile, name, and address.
* `front-end/profile.html`: Profile view showing user details, jurisdiction badges, and password change.

#### Citizen Portal (`front-end/citizen/`):
* `citizen-dashboard.html`: Citizen command center with live status counts, quick action cards, and recent applications.
* `apply-service.html`: Stepper application form featuring the **Rural vs. Urban toggle** which dynamically updates the required document upload checklist.
* `my-applications.html`: Tabular overview of all citizen applications with live status badges.
* `track-application.html`: **Dedicated visual stage timeline tracker** displaying each approval stage, designated officer, time spent, and current state.
* `raise-grievance.html`: Form to file an official grievance against a delayed or rejected application.
* `my-grievances.html`: Status list and resolution updates for filed grievances.
* `certificates.html`: Approved certificate vault allowing citizens to view and print official certificates.

#### Unified Officer Workspace (`front-end/officer/`):
* `officer-dashboard.html`: Workload counters, pending review counts, and SLA alerts tailored to the logged-in designation.
* `queue.html`: Applications queue filtered strictly by:
  `assignedDesignation == officer.designation && jurisdiction == officer.jurisdiction`.
* `review-application.html`: Reusable review desk with application details and document previewer. Injects dynamic action buttons (`[Verify & Forward]`, `[Recommend]`, `[Sign & Approve]`, `[Revert]`, `[Reject]`) based on the designation matrix.
* `queries.html`: Citizen query clarification center.

#### 3-Tier Admin Console (`front-end/admin/`):
* **Central Admin (`admin/central/`):**
  * `dashboard.html`: National map, states monitor, and platform performance.
  * `state-onboarding.html`: Interface to onboard and issue credentials to State Admins across the 28 States & 8 UTs.
* **State Admin (`admin/state/`):**
  * `dashboard.html`: State command center showing department volumes.
  * `dept-onboarding.html`: Authorizes Line Department Heads (CCLA, CDMA).
  * `geography-config.html`: Manages Districts, Mandals/Tehsils, Municipalities, and Wards.
  * `revenue-reports.html`: Daily treasury settlement split logs.
* **Department Admin (`admin/department/`):**
  * `dashboard.html`: Department SLA efficiency and pending stage diagnostics.
  * `manage-services.html`: Service builder (sets fees, statutory SLAs, and Rural/Urban document checklists).
  * `workflow-config.html`: Visual drag-and-drop $N$-stage workflow pipeline builder.
  * `designation-matrix.html`: Designation creator & review desk action button permission builder.
  * `officer-onboarding.html`: Onboards field officers and assigns them to geographical jurisdictions.

---

### Backend Modules & Endpoints

1. **`auth` Module:**
   * `POST /auth/login`: Validates user credentials against `users.collection.ts` and returns user profile + designation + jurisdiction.
   * `POST /auth/register`: Creates new citizen accounts.
2. **`users` Module:**
   * `GET /users/profile`: Retrieves active profile.
   * `GET /users/officers`: Lists department officers for assignment.
3. **`admin` Module:**
   * `POST /admin/states`: Central Admin creates state tenants.
   * `POST /admin/departments`: State Admin adds line departments.
   * `GET /admin/geography`: Fetches district/mandal/ward tree.
   * `POST /admin/geography`: Adds new administrative units.
4. **`services` Module:**
   * `GET /services`: Lists active public services with category filters.
   * `POST /services`: Department Admin creates a new service with Rural/Urban document requirements.
5. **`workflow` Module:**
   * `GET /workflow/:serviceId`: Retrieves the $N$-stage pipeline and assigned designations.
   * `POST /workflow/:serviceId`: Saves configured approval stages and stage SLA days.
   * `GET /workflow/designations/:deptId`: Returns the designation permission matrix.
   * `POST /workflow/designations/:deptId`: Updates action button permissions per designation.
6. **`applications` Module:**
   * `POST /applications/submit`: Ingests citizen application, documents, area type (Rural/Urban), and initial payment split.
   * `GET /applications/queue`: Fetches applications matching the caller's designation and jurisdiction.
   * `POST /applications/:id/action`: Executes a stage transition (forward, revert, reject, sign & approve).
   * `GET /applications/:id/track`: Returns the complete stage timeline and history for tracking.
7. **`grievances` Module:**
   * `POST /grievances`: Citizen submits a grievance.
   * `GET /grievances`: Lists grievances for citizens or grievance redressal officers.
   * `PATCH /grievances/:id/resolve`: Records investigation findings and resolution order.
8. **`notifications` Module:**
   * `GET /notifications`: Fetches in-site alerts for the logged-in user.
   * `PATCH /notifications/:id/read`: Marks an individual alert as read.
   * `PATCH /notifications/read-all`: Marks all alerts as read.

---

## 11. Strategic Plan of Action & Implementation Roadmap

To build the platform methodically and ensure that every layer has its dependencies in place, we follow a **strict 7-Phase Execution Order**:

```text
[Phase 1: MockDB Engine] ──▶ [Phase 2: Lean NestJS API] ──▶ [Phase 3: Core Frontend Engine]
                                                                      │
┌─────────────────────────────────────────────────────────────────────┘
▼
[Phase 4: Citizen Portal] ──▶ [Phase 5: Unified Officer Desk] ──▶ [Phase 6: 3-Tier Admin Console]
                                                                               │
                                                                               ▼
                                                             [Phase 7: End-to-End Verification]
```

### Phase 1: MockDB In-Memory Subsystem & Master Seeds
*Dependency: None. Serves as the foundation for the entire platform.*
- [ ] **Task 1.1:** Implement `src/database/mock-db.service.ts` with central collection management and asynchronous querying utilities.
- [ ] **Task 1.2:** Implement `src/database/collections/states.collection.ts` with all 28 States & 8 UTs.
- [ ] **Task 1.3:** Implement `src/database/collections/geography.collection.ts` with Rural (Districts $\rightarrow$ Mandals $\rightarrow$ Panchayats) and Urban (Districts $\rightarrow$ Municipalities $\rightarrow$ Wards) jurisdictions for AP, Telangana, and Maharashtra.
- [ ] **Task 1.4:** Implement `src/database/collections/designations.collection.ts` with baseline designations (VRO, RI, Tahsildar, Talathi, SDO) and action permission matrices.
- [ ] **Task 1.5:** Implement `src/database/collections/services.collection.ts` with Income, Caste, and Land Mutation services with distinct Rural vs. Urban document checklists.
- [ ] **Task 1.6:** Implement `src/database/collections/workflow.collection.ts` with multi-stage approval definitions.
- [ ] **Task 1.7:** Implement `src/database/collections/users.collection.ts` with pre-seeded demo accounts (Citizens, VRO, RI, Tahsildar, State Admin, Central Admin).
- [ ] **Task 1.8:** Implement `src/database/collections/applications.collection.ts`, `grievances.collection.ts`, and `notifications.collection.ts`.

---

### Phase 2: Lean NestJS Backend API
*Dependency: Phase 1 (MockDB).*
- [ ] **Task 2.1:** Configure `src/app.module.ts`, `main.ts`, and `simple-auth.guard.ts` for clean header-based session identification (`x-user-id`, `x-role`, `x-designation`).
- [ ] **Task 2.2:** Build `src/modules/auth/` (Login & Registration endpoints).
- [ ] **Task 2.3:** Build `src/modules/users/` (Profile and officer lookup endpoints).
- [ ] **Task 2.4:** Build `src/modules/services/` (Public service listing & Rural/Urban requirement definitions).
- [ ] **Task 2.5:** Build `src/modules/workflow/` (Stage transition state machine & designation matrix endpoints).
- [ ] **Task 2.6:** Build `src/modules/applications/` (Application submission, dynamic queue querying, review action dispatch, and certificate generation).
- [ ] **Task 2.7:** Build `src/modules/grievances/` (Submission, tracking, and resolution).
- [ ] **Task 2.8:** Build `src/modules/admin/` (Central, State, and Department administrative operations).
- [ ] **Task 2.9:** Build `src/modules/notifications/` (In-site notification queries and read-state toggles).

---

### Phase 3: Core Frontend Engine & Shared Components
*Dependency: Phase 2 (Backend API running).*
- [ ] **Task 3.1:** Create `front-end/css/` tokens (`style.css`, `dashboard.css`, `forms.css`, `responsive.css`).
- [ ] **Task 3.2:** Implement `front-end/js/api.js` (Centralized fetch client injecting `x-user-id` and `x-role`).
- [ ] **Task 3.3:** Implement `front-end/js/auth.js` (Simple session manager using `localStorage`).
- [ ] **Task 3.4:** Implement `front-end/js/components.js` (Reusable modals, alert banners, and toasts).
- [ ] **Task 3.5:** Implement `front-end/js/topbar.js` (Active officer badge, jurisdiction display, and notification bell trigger).
- [ ] **Task 3.6:** Implement `front-end/js/notifications.js` (Notification dropdown drawer, unread counter badge, and mark-as-read listener).
- [ ] **Task 3.7:** Implement `front-end/js/sidebar.js` (Dynamic navigation builder rendering menu tabs according to the logged-in designation).
- [ ] **Task 3.8:** Build `front-end/index.html`, `front-end/login.html` (with one-click demo role switcher), and `front-end/register.html`.

---

### Phase 4: Citizen Portal Implementation
*Dependency: Phase 3 (Core UI & Auth).*
- [ ] **Task 4.1:** Build `front-end/citizen/citizen-dashboard.html` & `front-end/js/modules/citizen.js`.
- [ ] **Task 4.2:** Build `front-end/citizen/apply-service.html` with the **Rural vs. Urban toggle** that dynamically swaps required document upload inputs.
- [ ] **Task 4.3:** Build `front-end/citizen/my-applications.html` with filterable application list and status badges.
- [ ] **Task 4.4:** Build `front-end/citizen/track-application.html` with a **visual multi-stage stepper timeline** showing each stage and time spent.
- [ ] **Task 4.5:** Build `front-end/citizen/raise-grievance.html` and `front-end/citizen/my-grievances.html`.
- [ ] **Task 4.6:** Build `front-end/citizen/certificates.html` for downloading and printing issued certificates.

---

### Phase 5: Unified Officer Workspace Implementation
*Dependency: Phase 3 & 4 (Dynamic queue data).*
- [ ] **Task 5.1:** Build `front-end/officer/officer-dashboard.html` displaying workload metrics for the logged-in designation.
- [ ] **Task 5.2:** Build `front-end/officer/queue.html` with dynamic queue filtering (`assignedDesignation` + `jurisdiction`).
- [ ] **Task 5.3:** Build `front-end/officer/review-application.html` & `front-end/js/modules/review.js`:
  * Embed document viewer for inspection.
  * Dynamically fetch and render only authorized action buttons (`[Verify & Forward]`, `[Recommend]`, `[Sign & Approve]`, `[Revert]`, `[Reject]`).
- [ ] **Task 5.4:** Build `front-end/officer/queries.html` for handling citizen clarifications.

---

### Phase 6: 3-Tier Federated Admin Console
*Dependency: Phase 2 (Admin & Workflow APIs).*
- [ ] **Task 6.1:** Build Central Admin portal (`front-end/admin/central/` - `dashboard.html`, `state-onboarding.html`).
- [ ] **Task 6.2:** Build State Admin portal (`front-end/admin/state/` - `dashboard.html`, `dept-onboarding.html`, `geography-config.html`, `revenue-reports.html`).
- [ ] **Task 6.3:** Build Department Admin portal (`front-end/admin/department/`):
  * `dashboard.html`: Department SLA analytics.
  * `manage-services.html`: Service & Rural/Urban document builder.
  * `workflow-config.html`: Visual $N$-stage pipeline builder.
  * `designation-matrix.html`: Designation creator & review action button permission builder.
  * `officer-onboarding.html`: Officer onboarding & jurisdiction assignment.

---

### Phase 7: End-to-End System Verification & Polish
*Dependency: Phases 1 through 6.*
- [ ] **Task 7.1:** Execute full AP Revenue Workflow: Citizen (Rural) $\rightarrow$ VRO $\rightarrow$ RI $\rightarrow$ Tahsildar $\rightarrow$ Certificate Issuance.
- [ ] **Task 7.2:** Execute full Telangana Municipal Workflow: Citizen (Urban) $\rightarrow$ Ward Officer $\rightarrow$ Municipal Commissioner.
- [ ] **Task 7.3:** Verify in-site notification triggers across all stage transitions.
- [ ] **Task 7.4:** Verify visual tracking stepper in `track-application.html`.
- [ ] **Task 7.5:** Final code cleanup and documentation freeze.

---

## 12. End-to-End Service Lifecycle Walkthrough

```text
[1. SETUP]
Department Admin logs in -> designation-matrix.html
  • Defines Designations: 'Village Revenue Officer', 'Revenue Inspector', 'Tahsildar'.
  • Assigns Action Buttons:
      - VRO: [✓ Verify & Forward], [? Query Citizen], [✕ Reject]
      - RI:  [✓ Recommend Approval], [↩ Revert to VRO], [✕ Reject]
      - MRO: [✍ Digitally Sign & Approve], [✕ Reject]
Department Admin -> workflow-config.html
  • Configures Stage 1 (VRO) -> Stage 2 (RI) -> Stage 3 (Tahsildar) with statutory SLAs.

[2. CITIZEN APPLICATION]
Citizen logs in -> apply-service.html
  • Toggles 'Rural' -> Attaches Aadhaar Card + Land Passbook / Pahani.
  • Submits application -> Pays ₹55 statutory & facilitation fee.
  • In-site notification created: "Application #APP-1042 submitted successfully."
  • Application lands in Stage 1 (VRO Queue for that Village/Mandal).

[3. FIELD INSPECTION]
VRO logs in -> queue.html -> review-application.html
  • Reviews submitted details and inspects uploaded Pahani.
  • Dynamic action buttons render [✓ Verify & Forward] and [? Query Citizen].
  • VRO enters inspection notes and clicks [✓ Verify & Forward to RI].
  • Citizen receives notification: "Application #APP-1042 verified by VRO and forwarded to RI."
  • Application advances to Stage 2 (Revenue Inspector Queue).

[4. SCRUTINY]
Revenue Inspector logs in -> review-application.html
  • Inspects field verification notes and document checklist.
  • Clicks [✓ Recommend Approval to Tahsildar].
  • Citizen receives notification: "Application #APP-1042 recommended for final approval."
  • Application advances to Stage 3 (Tahsildar Queue).

[5. FINAL APPROVAL & ISSUANCE]
Tahsildar logs in -> review-application.html
  • Clicks [✍ Digitally Sign & Approve Certificate].
  • Workflow state machine marks status as APPROVED and generates a unique Certificate Number.
  • Citizen receives notification: "🎉 Congratulations! Your Certificate is ready for download."
  • Citizen visits certificates.html and downloads the official signed certificate.
```

---
*Created as the master architectural reference and live execution roadmap for the 42_DigiConnect Unified Citizen Service Delivery Platform.*
