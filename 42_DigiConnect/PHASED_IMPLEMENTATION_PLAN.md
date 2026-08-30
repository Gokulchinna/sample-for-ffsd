# 🚀 DigiConnect — Phased Implementation Master Plan

> **Project:** DigiConnect — Digital Government-Services Platform  
> **Architecture Reference:** [Master Prompt — DigiConnect](file:///d:/42_DigiConnect/README.md)  
> **Development Priority:** 15 Explicit Phases per Section 60 of Master Prompt  
> **Execution Strategy:** Phase-by-phase delivery with clear verification gates at each step.

---

## 📋 Phase Roadmap Overview

| Phase | Phase Name | Primary Actors Involved | Core Deliverables |
|:---:|:---|:---|:---|
| **Phase 1** | **Authentication & RBAC Engine** | All Actors | Header-based identity (`x-role`, `x-user-id`, etc.), NestJS Guards, Role decorators, demo fast-switcher |
| **Phase 2** | **State & Department Management** | Central Admin, State Admin | State registry (1:1 State Admin), Department CRUD, Department Head appointment |
| **Phase 3** | **Dynamic Jurisdiction Tree Engine** | State Admin, Citizen, Officer | Adjacency List tree, parent-child cascade, Rural/Urban branching, `isNodeWithinScope()`, `getAncestors()` |
| **Phase 4** | **Designations & Officer Management** | Department Head | Designation definition (no officer levels), Officer onboarding mapped to exact `assignedNodeId`, suspend/unsuspend |
| **Phase 5** | **Dynamic Service Builder** | Department Head, Citizen | Configurable form fields, validation constraints, document requirements, mandatory State/Jurisdiction fields, fee settings |
| **Phase 6** | **Service Workflow Builder** | Department Head | Designation sequence configuration, hierarchical routing rules, visual workflow canvas |
| **Phase 7** | **Citizen Application Flow** | Citizen | 5-step wizard (Basic Details -> Docs -> Review -> Mock Payment -> Submission & Tracking ID) |
| **Phase 8** | **Officer Review & Decision Desk** | Officer | Hierarchically scoped queues, document inspection, `APPROVE` (advances stage), `REJECT` (permanent halt) |
| **Phase 9** | **Query & Clarification System** | Officer, Citizen | `RAISE QUERY` pauses workflow, notification, citizen text + multi-document response, persistent query thread |
| **Phase 10** | **Grievance Cell & Workflow System** | State Admin, Citizen, Grievance Officer | Department-bound grievance cells, grievance workflow, citizen filing auto-linked from Track Application |
| **Phase 11** | **Grievance → Application Closed Resolution Loop** | Grievance Officer | The 3 mandatory actions: `UPHOLD REJECTION`, `DIRECT RE-VERIFICATION`, `OVERRULE & ISSUE CERTIFICATE` |
| **Phase 12** | **In-App Notification Hub** | Citizen, Officer, Grievance Officer | Event-driven notifications for state changes, queries, responses, grievance actions |
| **Phase 13** | **Digital Demo Certificate Engine** | System, Citizen | Automated generation of fake demo PDF certificate upon final approval or overrule, downloadable proof |
| **Phase 14** | **Dashboards & Analytics** | Central Admin, State Admin, Dept Head | State-wise revenue analytics, department-wise collection, service performance, officer queues |
| **Phase 15** | **Seed Data, E2E Testing & UI Polish** | All | Pre-seeded AP & TS hierarchies, demo accounts, 7 lifecycle applications, full demo scenarios A to D |

---

## 🛠️ Detailed Phase Breakdown

---

### Phase 1: Authentication & Role-Based Access Control (RBAC)
* **Goal**: Establish the zero-password, header-driven role authorization layer required for the college demonstration.
* **Backend Tasks**:
  * Implement `AuthContext` extracting `x-role`, `x-user-id`, `x-state-id`, `x-department-id`, and `x-assigned-node-id`.
  * Create `@Roles(...)` decorator and `RolesGuard` in NestJS enforcing strict endpoint permissions.
  * Define core system roles:
    * `CENTRAL_ADMIN`
    * `STATE_ADMIN`
    * `DEPARTMENT_HEAD`
    * `OFFICER`
    * `GRIEVANCE_OFFICER`
    * `CITIZEN`
  * Global exception filter to return standard structured error responses (`401 Unauthorized`, `403 Forbidden`).
* **Frontend Tasks**:
  * Build a persistent top-bar **Demo Role Switcher** with 1-click switching between:
    * `Central Admin`
    * `State Admin (AP / TS)`
    * `Dept Head (Revenue / Municipal)`
    * `Officer (VRO / MRO / Tahsildar)`
    * `Grievance Officer (Revenue Cell)`
    * `Citizen (Ravi Kumar)`
  * Centralize `api.js` client attaching current identity headers to all fetch calls.
* **Verification Gate**:
  * Switching roles updates request headers immediately. Accessing Central Admin routes as a Citizen returns 403 Forbidden.

---

### Phase 2: State & Department Management
* **Goal**: Central Government manages State Governments; State Government manages Departments and Department Heads.
* **Backend Tasks**:
  * State Management Endpoints:
    * `POST /api/central/states`: Create State Government (validates only 1 State Admin per state).
    * `GET /api/central/states`: List states with statistics.
    * `DELETE /api/central/states/:id`: Remove/deactivate state.
  * Department Management Endpoints:
    * `POST /api/state/departments`: State Admin creates department and assigns Department Head.
    * `GET /api/state/departments`: List state departments.
    * `PUT /api/state/departments/:id`: Rename / update department.
    * `DELETE /api/state/departments/:id`: Delete department.
* **Frontend Tasks**:
  * Central Admin Portal: State creation modal, state list table, active admin display.
  * State Admin Portal: Department management page (`Add Department`, assign head, view active list).
* **Verification Gate**:
  * Central Admin can create "Andhra Pradesh" and "Telangana". Attempting to add a duplicate State Admin for AP is rejected. State Admin can add "Revenue Department" and "Transport Department".

---

### Phase 3: Dynamic Jurisdiction Tree Engine (Adjacency List)
* **Goal**: Implement dynamic parent-child jurisdiction tree with zero hardcoded Rural/Urban columns.
* **Backend Tasks**:
  * Entity & Schema:
    ```typescript
    interface JurisdictionNode {
      id: string;
      stateId: string;
      parentId: string | null; // Root has parentId = null
      name: string;
      governanceType: 'RURAL' | 'URBAN' | 'COMMON';
      tierLevel: 'STATE' | 'DISTRICT' | 'SUB_DIVISION' | 'MANDAL' | 'MUNICIPALITY' | 'VILLAGE' | 'WARD';
    }
    ```
  * Implement Tree Traversal Utilities:
    * `getAncestors(nodeId: string): JurisdictionNode[]`
    * `findParentNodeByLevel(startNodeId: string, targetTier: TierLevel): JurisdictionNode | null`
    * `isNodeWithinScope(leafNodeId: string, assignedNodeId: string): boolean`
    * Cycle detection & validation (prevent self-parenting and cross-state parent links).
  * Endpoints:
    * `GET /api/geography/tree?stateId=...`: Return nested tree for visual rendering.
    * `GET /api/geography/nodes/:id/children`: Direct children for cascading dropdowns.
    * `POST /api/geography/nodes`: Create child jurisdiction under selected parent.
    * `DELETE /api/geography/nodes/:id`: Safe delete (rejects if node has children).
* **Frontend Tasks**:
  * State Admin Jurisdiction Visualizer:
    * Interactive collapsible tree view with `[Add Rural Jurisdiction]` and `[Add Urban Jurisdiction]` quick actions.
    * Parent node selection modal with instant validation.
  * Cascading Dropdown Component:
    * Reusable component for Citizen forms (`State -> District -> Sub-Division -> Mandal/Municipality -> Village/Ward`).
* **Verification Gate**:
  * Create AP -> Tirupati District -> Rural Sub-Division -> Chandragiri Mandal -> Chandragiri Village.
  * Create AP -> Tirupati District -> Urban Sub-Division -> Tirupati Municipal Corp -> Ward 14.
  * Verify `isNodeWithinScope(ChandragiriVillage, ChandragiriMandal)` is `true`.
  * Verify `isNodeWithinScope(Ward14, ChandragiriMandal)` is `false`.

---

### Phase 4: Designation & Officer Management
* **Goal**: Department Head manages designations and onboards field officers mapped to exact jurisdiction nodes.
* **Backend Tasks**:
  * Designations (Roles without levels):
    * `POST /api/departments/:deptId/designations`: Create designation (e.g., `VRO`, `MRO`, `Tahsildar`, `Sanitary Inspector`).
    * `GET /api/departments/:deptId/designations`: List department designations.
  * Officer Management:
    * `POST /api/departments/:deptId/officers`: Onboard officer with `name`, `designationId`, and `assignedNodeId`.
    * `PATCH /api/officers/:id/status`: Suspend / Unsuspend / Remove officer.
    * Validation: Ensure `assignedNodeId` belongs to the state and exists in the jurisdiction tree.
* **Frontend Tasks**:
  * Department Head Portal:
    * Designation Directory (`Add Designation` modal).
    * Officer Onboarding Desk: Officer name, designation dropdown, interactive jurisdiction tree selector for `assignedNodeId`.
    * Officer list with active status pills and `[Suspend]`, `[Activate]` buttons.
* **Verification Gate**:
  * Dept Head creates `VRO` and assigns officer "Gokul Rao" to `Chandragiri Village`.
  * Dept Head creates `MRO` and assigns officer "Sunita Sharma" to `Chandragiri Mandal`.
  * Suspended officers are blocked from receiving new assigned tasks.

---

### Phase 5: Dynamic Service Builder
* **Goal**: Department Head builds configuration-driven services with custom fields, validation rules, required proofs, and fees.
* **Backend Tasks**:
  * Service Schema & Endpoints:
    * Fields configuration: `label`, `type` (`TEXT`, `NUMBER`, `DATE`, `DROPDOWN`, `RADIO`, `CHECKBOX`, `TEXTAREA`, `EMAIL`, `PHONE`), `required`, `constraints` (`min`, `max`, `pattern`, `options`).
    * **Mandatory System Fields**: State and Jurisdiction selectors are automatically injected into every service and cannot be removed.
    * Document requirements: `name`, `required`, `allowedMimeTypes`, `maxSizeBytes`.
    * Financials: `serviceFee`, `platformFee`, `termsAndConditions`.
    * Status controls: `ACTIVE`, `DISABLED`, `SUSPENDED`.
    * Endpoints: `POST /api/departments/:deptId/services`, `PUT ...`, `PATCH .../status`.
* **Frontend Tasks**:
  * Visual Dynamic Service Builder:
    * Form field builder: Drag-or-click to add fields with real-time constraint config.
    * Document requirement checklist builder.
    * Fee configuration preview box showing `Service Fee + Platform Fee = Total Amount`.
    * Terms & Conditions editor.
* **Verification Gate**:
  * Dept Head creates "Integrated Caste & Income Certificate" with dynamic fields: Annual Income (`NUMBER`, min 0), Caste Category (`DROPDOWN`), and required proof: "Aadhaar Card (PDF, max 5MB)".

---

### Phase 6: Service Workflow Builder
* **Goal**: Department Head defines the sequential officer designation routing for each service.
* **Backend Tasks**:
  * Workflow Configuration:
    * Steps: `stepNumber`, `stepName`, `requiredDesignationId`, `canApprove`, `canReject`, `canRaiseQuery`, `isFinalApprovalStep`.
    * Hierarchical Officer Resolver:
      * Given an application with `selectedJurisdictionNodeId` and workflow step with `requiredDesignationId`:
      * Traverse the jurisdiction tree upwards from the leaf node until an officer with that `designationId` whose `assignedNodeId` covers the citizen's node is located.
    * Endpoints: `POST /api/services/:serviceId/workflow`, `GET ...`.
* **Frontend Tasks**:
  * Workflow Canvas / Step Builder:
    * Visual stepper: `Step 1 (VRO) -> Step 2 (MRO) -> Step 3 (Tahsildar) -> [Final Approval & Certificate]`.
    * Reorder steps, add/remove step, configure designation at each stage.
* **Verification Gate**:
  * Set up workflow: `VRO` -> `MRO` -> `Tahsildar`.
  * An application submitted for `Chandragiri Village` automatically resolves to the Village's VRO for Step 1, the Mandal's MRO for Step 2, and the District/Taluk Tahsildar for Step 3.

---

### Phase 7: Citizen Application Flow
* **Goal**: Citizens select jurisdiction, fill dynamic service forms, upload documents, make mock payment, and track submissions.
* **Backend Tasks**:
  * Application Submission Endpoints:
    * `POST /api/applications`: Create draft with dynamic field values + mandatory leaf `selectedJurisdictionNodeId`.
    * `POST /api/applications/:id/documents`: Upload required documents with mimetype and size validation.
    * `POST /api/applications/:id/pay`: Mock payment handler -> transitions status to `SUBMITTED`, logs payment transaction, computes initial officer assignment via workflow engine.
    * `GET /api/applications/my`: List citizen applications with status pills.
    * `GET /api/applications/:id`: Full application details including timeline and uploaded files.
* **Frontend Tasks**:
  * 5-Step Citizen Application Stepper:
    1. **Step 1 — Basic Details**: Area type (`Rural` vs `Urban`), cascading jurisdiction dropdowns, dynamic form fields rendered from service config.
    2. **Step 2 — Documents**: Upload cards with instant preview and file size check.
    3. **Step 3 — Review / Checklist**: Complete application summary, fee breakdown (`Service Fee + Platform Fee = Total`), required Terms & Conditions checkbox.
    4. **Step 4 — Mock Payment**: Card / UPI / NetBanking simulation with instant receipt.
    5. **Step 5 — Success Screen**: Displays `Application ID (APP-XXXXXXXX)` and `[Track Application]` button.
* **Verification Gate**:
  * Citizen completes application; payment receipt is generated; application status changes to `PENDING_OFFICER_REVIEW`.

---

### Phase 8: Officer Application Processing
* **Goal**: Officers view scoped applications and execute the two decisive actions: `APPROVE` and `REJECT`.
* **Backend Tasks**:
  * Endpoints:
    * `GET /api/officer/queue`: Filter applications where current required designation matches officer's designation AND citizen's node is within officer's `assignedNodeId` scope.
    * `POST /api/applications/:id/approve`: Advance to next step in workflow. If final step, set status `FINAL_APPROVAL` and trigger certificate generation.
    * `POST /api/applications/:id/reject`: Halt workflow, set status `REJECTED`, record officer, designation, jurisdiction, timestamp, and rejection remarks in permanent history.
* **Frontend Tasks**:
  * Officer Review Desk:
    * Tabbed queues: `Pending Review`, `Approved`, `Rejected`, `Queries Raised`.
    * Application Inspector: Submitted fields, view uploaded documents in modal, prior officer actions.
    * Fixed Decision Bar: `[Approve & Forward]` and `[Reject Application]` buttons.
* **Verification Gate**:
  * VRO approves -> Application moves to MRO queue.
  * MRO rejects with remark "Discrepancy in land survey number" -> Application status becomes `REJECTED`, workflow stops, citizen sees rejection reason in Track Application.

---

### Phase 9: Query & Clarification System
* **Goal**: Officers raise queries to pause workflow; citizens respond with text and multiple documents.
* **Backend Tasks**:
  * Endpoints:
    * `POST /api/applications/:id/queries`: Officer raises query -> application status becomes `QUERY_RAISED` (workflow paused) -> notification sent to citizen.
    * `POST /api/applications/:id/queries/:queryId/respond`: Citizen submits text response + uploads any number of clarification documents -> status returns to `PENDING_OFFICER_REVIEW`.
    * Full query and response context stored immutably in application history.
* **Frontend Tasks**:
  * Officer `[Raise Query]` modal with query remarks input.
  * Citizen Track Application page: Query alert banner with text input and multi-document upload dropzone.
  * Officer timeline & inspection view: All past queries, responses, and uploaded documents visible to all subsequent officers (MRO, Tahsildar).
* **Verification Gate**:
  * Officer raises query; workflow pauses; citizen uploads updated document with explanation; workflow resumes; next officer in workflow can review the entire query thread.

---

### Phase 10: Grievance System Setup
* **Goal**: State Admin configures department-specific grievance cells and multi-tier workflows; citizen raises grievance directly from Track Application.
* **Backend Tasks**:
  * State Admin Grievance Endpoints:
    * `POST /api/state/grievance-cells`: Configure grievance cell for a department.
    * `POST /api/state/grievance-workflows`: Define multi-tier grievance officers (Sub-Division -> District -> State level).
  * Citizen Grievance Submission:
    * `POST /api/grievances`: Create grievance linked to `relatedApplicationId` (auto-inherits department, service, and jurisdiction).
    * `GET /api/grievances/:id`: View grievance timeline and status.
* **Frontend Tasks**:
  * Track Application: `[Apply for Grievance]` button on rejected or delayed applications.
  * Raise Grievance modal: Pre-populated with application details, subject, and grievance description.
  * Citizen "Track Grievance" page with progress timeline.
* **Verification Gate**:
  * Citizen clicks `[Apply for Grievance]` on a rejected application; grievance is submitted and automatically routed to the department's grievance cell.

---

### Phase 11: Grievance → Application Closed Resolution Loop
* **Goal**: Grievance Officer resolves grievance with mandatory operational effects on the original application.
* **Backend Tasks**:
  * Endpoint: `POST /api/grievances/:id/resolve` with payload:
    ```typescript
    interface GrievanceResolution {
      action: 'UPHOLD_REJECTION' | 'DIRECT_RE_VERIFICATION' | 'OVERRULE_AND_ISSUE_CERTIFICATE';
      remarks: string;
    }
    ```
  * Action Behaviors:
    1. `UPHOLD_REJECTION`: Grievance marked `RESOLVED`; Application remains `REJECTED`.
    2. `DIRECT_RE_VERIFICATION`: Grievance marked `RESOLVED`; Application marked `PENDING_REVERIFICATION`; reinjected into verification workflow at the required stage; original rejection preserved in history.
    3. `OVERRULE_AND_ISSUE_CERTIFICATE`: Grievance marked `RESOLVED`; Original rejection marked `OVERRULED_BY_GRIEVANCE`; Application marked `COMPLETED`; Certificate generated immediately.
* **Frontend Tasks**:
  * Grievance Officer Resolution Desk:
    * Side-by-side view: Citizen grievance complaint alongside original application, prior rejection reason, and officer details.
    * Explicit Radio Action Selection:
      * `( ) Uphold Rejection`
      * `( ) Direct Re-verification`
      * `( ) Overrule & Issue Certificate`
    * Resolution Remarks box and `[Submit Grievance Decision]` button.
* **Verification Gate**:
  * Test `DIRECT_RE_VERIFICATION`: Application re-appears in officer review queue with audit note.
  * Test `OVERRULE_AND_ISSUE_CERTIFICATE`: Application immediately completes and issues certificate.

---

### Phase 12: In-App Notification Hub
* **Goal**: Keep all actors informed of state changes, queries, and resolutions.
* **Backend Tasks**:
  * Notification triggers for:
    * Citizen: Application submitted, payment received, query raised, application approved/rejected, grievance updated, certificate ready.
    * Officer: New application assigned to queue, citizen responded to query.
    * Grievance Officer: New grievance assigned, citizen clarification submitted.
  * Endpoints: `GET /api/notifications`, `PATCH /api/notifications/:id/read`.
* **Frontend Tasks**:
  * Top navigation notification bell with unread badge counter.
  * Slide-over notification panel with clickable links navigating directly to the relevant application or grievance.
* **Verification Gate**:
  * Raising a query creates an instant notification for the citizen; submitting a query response notifies the officer.

---

### Phase 13: Digital Demo Certificate Engine
* **Goal**: Generate and deliver the official downloadable fake/demo PDF certificate for approved or overruled applications.
* **Backend Tasks**:
  * Certificate Generator Module:
    * Generates demo PDF containing:
      * DigiConnect Header & Government Seal
      * Certificate ID (`CERT-XXXXXXXX`) & Application ID (`APP-XXXXXXXX`)
      * Citizen Name, Service Name, Leaf & Ancestor Jurisdiction Path
      * Approval Timestamp & Issuing Authority Details
      * Official College Project Disclaimer: *"This is a demonstration certificate generated by the DigiConnect college project."*
  * Endpoints: `GET /api/applications/:id/certificate` (streams PDF or returns download link).
* **Frontend Tasks**:
  * Citizen Portal "My Certificates" view with instant `[Download Certificate (PDF)]` action.
* **Verification Gate**:
  * Completing an application generates a valid downloadable PDF certificate displaying citizen name, service, and full jurisdiction path.

---

### Phase 14: Dashboards & Analytics
* **Goal**: Deliver tailored analytics for Central Admin, State Admin, and Department Heads.
* **Backend Tasks**:
  * Analytics Endpoints:
    * `GET /api/central/analytics/revenue`: State-wise revenue, total paid applications, national trends.
    * `GET /api/state/analytics`: Department-wise revenue, application totals, active grievance counts.
    * `GET /api/departments/:deptId/analytics`: Service volume, approval vs rejection rates, officer queue loads.
* **Frontend Tasks**:
  * Central Admin Dashboard: National summary cards, state-wise revenue comparison table, revenue trend chart.
  * State Admin Dashboard: Department breakdown, total jurisdiction nodes, grievance SLA tracking.
  * Department Head Dashboard: Service catalog health, daily throughput, officer workload indicators.
* **Verification Gate**:
  * Paid applications in AP update both the AP State Admin revenue report and the Central Admin national revenue breakdown.

---

### Phase 15: Seed Data, E2E Testing & UI Polish
* **Goal**: Pre-populate complete realistic test data and validate all four Master Prompt demo scenarios.
* **Seed Data Content**:
  * 1 Central Admin (`admin@gov.in`).
  * 2 States: Andhra Pradesh (`AP`) and Telangana (`TS`).
  * Jurisdictions:
    * AP -> Tirupati District -> Rural Sub-Division -> Chandragiri Mandal -> Chandragiri Village.
    * AP -> Tirupati District -> Urban Sub-Division -> Tirupati Municipal Corp -> Ward 14.
  * Departments: Revenue Department, Municipal Administration Department.
  * Designations: `VRO`, `MRO`, `Tahsildar`, `Sanitary Inspector`.
  * Pre-configured Services: "Integrated Community & Caste Certificate" (Rural/Urban), "Income Certificate".
  * Officers mapped to exact nodes (`Gokul Rao` -> Chandragiri Village, etc.).
  * 7 Demo Applications in each critical state (`SUBMITTED`, `UNDER_REVIEW`, `QUERY_RAISED`, `REJECTED`, `GRIEVANCE_RAISED`, `REOPENED`, `COMPLETED`).
* **Demo Scenarios Automated & Verified**:
  * **Scenario A**: Happy Path (Submit -> VRO approve -> MRO approve -> Tahsildar approve -> PDF Certificate).
  * **Scenario B**: Query Thread (Submit -> Officer query -> Workflow pause -> Citizen multi-doc response -> Resume & approve).
  * **Scenario C**: Rejection & Direct Re-verification (Submit -> Reject -> Citizen Grievance -> Grievance Officer Direct Re-verification -> Reopened & reprocessed).
  * **Scenario D**: Rejection & Overrule (Submit -> Reject -> Citizen Grievance -> Overrule & Issue Certificate -> PDF Certificate issued).
* **Verification Gate**:
  * All 4 demo scenarios run without manual database intervention; zero console errors; smooth responsive styling.

---

## 🏁 Phase Execution Protocol

When executing each phase:
1. Implement Backend Modules, DTOs, Controllers, and Services.
2. Implement or adapt Frontend views, components, and API client bindings.
3. Validate against the Phase Acceptance Criteria.
4. Update the execution log and proceed to the next phase.
