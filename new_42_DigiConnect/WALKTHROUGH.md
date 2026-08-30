# DigiConnect Pan-India Scaling Architecture – Implementation Walkthrough

The complete **`new_42_DigiConnect`** platform has been built and tested in `sample-for-ffsd/new_42_DigiConnect`.

---

## 1. Executive Summary & Key Achievements

| Core Pillar | Requirement | Implementation in `new_42_DigiConnect` | Status |
| :--- | :--- | :--- | :--- |
| **Database Engine** | MockDB Only (No Postgres/DBMS) | Fully typed in-memory MockDB repository (`mock-db.service.ts`) pre-seeded with 28 States, 8 UTs, administrative geographies, 4 multi-stage public services, and live demo accounts. | **Complete** |
| **Authentication** | Zero JWT Overhead | Clean header & session-based authentication (`x-user-id`, `x-role`, `x-designation`, `x-state-code`), persistent in `localStorage`, enforced by `SimpleAuthGuard`. | **Complete** |
| **Login Desk** | Quick Role Switcher | `login.html` equipped with 8 one-click instant demo login buttons for Citizen, VRO, RI, Tahsildar, Grievance Officer, Dept Admin, State Admin, and Central Admin. | **Complete** |
| **Citizen Portal** | Rural vs Urban Verification | Separate `my-applications.html` & `track-application.html` (visual multi-stage stepper). `apply-service.html` features dynamic Rural vs Urban switching that swaps required proofs (Pahani vs Property Tax). | **Complete** |
| **Officer Portal** | Unified Dynamic Action Buttons | Single workspace (`officer-dashboard.html`, `queue.html`, `review-application.html`) that dynamically adapts action buttons (`[Verify & Forward]`, `[Recommend]`, `[Digital Sign]`, `[Revert]`, `[Reject]`) based on the logged-in officer's designation. | **Complete** |
| **Notifications** | In-Site Live Notifications | Dropdown notification bell, unread counter badge, and automated notification triggers when officers take action or raise queries. | **Complete** |
| **Federated Admin** | 3-Tier Sovereign Control | Central MeitY National Dashboard, State Command Center (Telangana), and Department Operations Control (CCLA) with pipeline builders and designation matrices. | **Complete** |

---

## 2. Architecture & File Structure

```
new_42_DigiConnect/
├── back-end/
│   ├── src/
│   │   ├── common/
│   │   │   ├── guards/simple-auth.guard.ts
│   │   │   ├── middlewares/logging.middleware.ts
│   │   │   └── filters/http-exception.filter.ts
│   │   ├── database/
│   │   │   ├── mock-db.service.ts
│   │   │   └── collections/
│   │   │       ├── states.collection.ts         # All 28 States & 8 UTs
│   │   │       ├── geography.collection.ts      # Rural & Urban units
│   │   │       ├── designations.collection.ts   # Designations & action matrix
│   │   │       ├── services.collection.ts       # Services with rural/urban doc rules
│   │   │       ├── workflow.collection.ts       # N-Stage verification pipelines
│   │   │       ├── users.collection.ts          # Pre-seeded demo user profiles
│   │   │       ├── applications.collection.ts   # Applications & stage histories
│   │   │       ├── grievances.collection.ts     # Public grievance records
│   │   │       └── notifications.collection.ts  # In-site notifications
│   │   ├── modules/
│   │   │   ├── auth/                            # Login & citizen registration
│   │   │   ├── users/                           # Profiles & officer lookups
│   │   │   ├── services/                        # Service catalog APIs
│   │   │   ├── workflow/                        # Pipelines & action button configs
│   │   │   ├── applications/                    # Submissions, queues & stage transitions
│   │   │   ├── grievances/                      # Grievance lodgement & resolution
│   │   │   ├── notifications/                   # Notification read/unread endpoints
│   │   │   └── admin/                           # Metrics, state onboarding, geography
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
│
└── front-end/
    ├── css/                                     # Reused from 42_DigiConnect
    │   ├── style.css, dashboard.css, forms.css, auth.css, landing.css
    ├── js/
    │   ├── api.js                               # Unified client passing session headers
    │   ├── auth.js                              # Session manager & demo switcher
    │   ├── components.js                        # Modals, toasts, alerts
    │   ├── notifications.js                     # In-site bell & dropdown drawer
    │   ├── sidebar.js                           # Role & designation dynamic sidebar
    │   └── topbar.js                            # User badges & notification counter
    ├── citizen/
    │   ├── citizen-dashboard.html               # Metrics & recent applications
    │   ├── apply-service.html                   # Rural vs Urban dynamic form
    │   ├── my-applications.html                 # Complete applications table
    │   ├── track-application.html               # Visual multi-stage stepper timeline
    │   ├── raise-grievance.html                 # CPGRAMS / Spandana grievance form
    │   ├── my-grievances.html                   # Grievances registry & orders
    │   └── certificates.html                    # Digitally sealed certificates vault
    ├── officer/
    │   ├── officer-dashboard.html               # Workload counters & pending queue
    │   ├── queue.html                           # Post & jurisdiction filtered queue
    │   ├── review-application.html              # Dynamic action buttons review desk
    │   └── queries.html                         # Active citizen query clarifications
    ├── grievance/
    │   └── grievance-dashboard.html             # Grievance officer command desk
    ├── admin/
    │   ├── central/
    │   │   ├── dashboard.html                   # 36 States & UTs national map/metrics
    │   │   └── state-onboarding.html            # Onboard new regional state tenant
    │   ├── state/
    │   │   ├── dashboard.html                   # State command center (TS)
    │   │   ├── dept-onboarding.html             # Line department directory
    │   │   ├── geography-config.html            # District, Mandal, Ward masters
    │   │   └── revenue-reports.html             # 70% Treasury / 20% Kiosk / 10% Ops
    │   └── department/
    │       ├── dashboard.html                   # Department SLA overview
    │       ├── manage-services.html             # Rural/urban document configuration
    │       ├── workflow-config.html             # Multi-stage pipeline builder
    │       ├── designation-matrix.html          # Action button permission matrix
    │       └── officer-onboarding.html          # Staff directory & jurisdiction mapping
    ├── index.html                               # Public landing portal
    ├── login.html                               # Modern sign-in with 1-click switcher
    ├── register.html                            # Citizen account registration
    └── profile.html                             # Universal demographic profile
```

---

## 3. How to Run and Test

Both backend and frontend are already active on the system:

1. **Backend API Server**:
   - URL: `http://localhost:3000/api`
   - Command to restart anytime:
     ```bash
     cd c:\Users\Gokul\Project\sample-for-ffsd\new_42_DigiConnect\back-end
     node dist/main
     ```
2. **Frontend Portal**:
   - URL: `http://localhost:5500/login.html`
   - Command to restart anytime:
     ```bash
     cd c:\Users\Gokul\Project\sample-for-ffsd\new_42_DigiConnect\front-end
     python -m http.server 5500
     ```

### One-Click Demo Personas:
On `http://localhost:5500/login.html`, click any of the 8 demo buttons:
* **👨‍💼 Citizen (`CIT-101`)**: Apply for Income or Mutation, toggle Rural vs Urban, track Stage 1/2/3 progress on visual stepper, print certificates.
* **👮 VRO Officer (`OFF-VRO-01`)**: Review rural applications in Ibrahimpatnam mandal, click `[✓ Verify & Forward to RI]`.
* **👮 RI Officer (`OFF-RI-01`)**: Review forwarded applications, click `[✓ Recommend Approval to Tahsildar]` or `[↩ Revert to VRO]`.
* **✍️ Tahsildar (`OFF-MRO-01`)**: Review recommended applications, click `[✍ Digitally Sign & Approve Certificate]`.
* **⚖️ Grievance Officer (`OFF-GRIEV-01`)**: Investigate complaints, record remediation orders, and resolve cases.
* **🏢 Dept Admin (`ADM-DEPT-01`)**: View department SLA adherence, manage service documents, inspect workflow stages and designation action matrix.
* **🏛️ State Admin (`ADM-STATE-01`)**: Inspect state command center, line departments, and 70-20-10 treasury revenue splits.
* **🇮🇳 Central Admin (`ADM-CENTRAL-01`)**: View national metrics across all 36 States & UTs.
