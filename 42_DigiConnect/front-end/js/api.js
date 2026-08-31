// ═══════════════════════════════════════════
// api.js — Centralized API client for NestJS backend
// All data fetching goes through this file.
// Session (x-role, x-user-id) is auto-appended to every request.
// ═══════════════════════════════════════════

const BASE = 'http://localhost:3000/api/v1';

/**
 * Build request headers from current session stored in localStorage
 */
function getHeaders() {
  let session = null;
  try {
    session = JSON.parse(localStorage.getItem('DigiConnect_session'));
  } catch (e) { /* ignore */ }
  return {
    'Content-Type': 'application/json',
    'x-role': session?.backendRole || session?.actualRole || session?.role || '',
    'x-user-id': session?.id || '',
    'x-state-id': session?.stateId || 'state_ap',
    'x-department-id': session?.departmentId || 'dept_rev_ap',
    'x-assigned-node-id': session?.assignedNodeId || '',
    'x-designation-id': session?.designationId || '',
  };
}

/**
 * Generic fetch wrapper — returns parsed JSON or throws on error
 */
export async function apiFetch(path, options = {}) {
  const headers = { ...getHeaders(), ...(options.headers || {}) };
  if (options.body instanceof FormData) {
    delete headers['Content-Type']; // Browser will automatically set multipart/form-data boundary
  }
  const res = await fetch(`${BASE}${path}`, {
    cache: 'no-store',
    ...options,
    headers,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 413) {
      throw new Error('File upload limit exceeded: The uploaded file is too large (maximum allowed size is 5MB).');
    }
    const msg = json?.message || `HTTP ${res.status}`;
    throw new Error(Array.isArray(msg) ? msg.join('; ') : msg);
  }
  return json;
}

// ──────────────────────────────────────────
// AUTH
// ──────────────────────────────────────────

/** Login: POST /users/login */
export async function apiLogin(email, password) {
  return apiFetch('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/** Register a new citizen: POST /users/register */
export async function apiRegister(userData) {
  return apiFetch('/users/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

/** Change password: PATCH /users/:id/password */
export async function apiChangePassword(id, currentPassword, newPassword) {
  return apiFetch(`/users/${id}/password`, {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

/** Update user profile: PATCH /users/:id */
export async function apiUpdateUserProfile(id, data) {
  return apiFetch(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// ──────────────────────────────────────────
// USERS (Admin / Super User)
// ──────────────────────────────────────────

/** Get all users: GET /users */
export async function apiGetUsers() {
  return apiFetch('/users');
}

/** Get user by ID: GET /users/:id */
export async function apiGetUserById(id) {
  return apiFetch(`/users/${id}`);
}

/** Create a user: POST /users */
export async function apiCreateUser(data) {
  return apiFetch('/users', { method: 'POST', body: JSON.stringify(data) });
}

/** Update a user: PATCH /users/:id */
export async function apiUpdateUser(id, data) {
  return apiFetch(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

/** Delete a user: DELETE /users/:id */
export async function apiDeleteUser(id) {
  return apiFetch(`/users/${id}`, { method: 'DELETE' });
}

// ──────────────────────────────────────────
// APPLICATIONS
// ──────────────────────────────────────────

/** Get citizen's own applications: GET /applications/my */
export async function apiGetMyApplications(page = 1, limit = 100) {
  return apiFetch(`/applications/my?page=${page}&limit=${limit}`);
}

/** Get all applications (admin/officer): GET /applications */
export async function apiGetAllApplications(params = '') {
  return apiFetch(`/applications${params}`);
}

/** Get application by ID: GET /applications/:id */
export async function apiGetApplicationById(id) {
  return apiFetch(`/applications/${id}`);
}

/** Track application by reference: GET /applications/track/:ref */
export async function apiTrackApplication(ref) {
  return apiFetch(`/applications/track/${ref}`);
}

/** Submit a new application: POST /applications */
export async function apiSubmitApplication(data) {
  const body = data instanceof FormData ? data : JSON.stringify(data);
  return apiFetch('/applications', { method: 'POST', body });
}

/** Update application status: PATCH /applications/:id/status */
export async function apiUpdateApplicationStatus(id, data) {
  return apiFetch(`/applications/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/** Respond to officer query: PATCH /applications/:id/query-response */
export async function apiRespondToQuery(id, data) {
  const body = data instanceof FormData ? data : JSON.stringify(typeof data === 'string' ? { response: data } : data);
  return apiFetch(`/applications/${id}/query-response`, {
    method: 'PATCH',
    body,
  });
}

/** Withdraw application: DELETE /applications/:id */
export async function apiWithdrawApplication(id) {
  return apiFetch(`/applications/${id}`, { method: 'DELETE' });
}

/** Simulate payment: POST /applications/simulate-payment */
export async function apiSimulatePayment(serviceId, citizenId, amount) {
  return apiFetch('/applications/simulate-payment', {
    method: 'POST',
    body: JSON.stringify({ serviceId, citizenId, amount }),
  });
}

// ──────────────────────────────────────────
// OFFICER-SPECIFIC
// ──────────────────────────────────────────

/** Get officer application queue: GET /applications/officer-queue */
export async function apiGetOfficerQueue() {
  return apiFetch('/applications/officer-queue');
}

/** Get officer pending queries: GET /applications/officer-queries */
export async function apiGetOfficerQueries() {
  return apiFetch('/applications/officer-queries');
}

/** Get officer recent activity: GET /applications/officer-activity */
export async function apiGetOfficerActivity() {
  return apiFetch('/applications/officer-activity');
}

/** Get SLA at-risk items: GET /applications/officer-sla-risks */
export async function apiGetOfficerSlaRisks() {
  return apiFetch('/applications/officer-sla-risks');
}

/** Get officer weekly chart: GET /applications/officer-week-chart */
export async function apiGetOfficerWeekChart() {
  return apiFetch('/applications/officer-week-chart');
}

// ──────────────────────────────────────────
// GRIEVANCES
// ──────────────────────────────────────────

/** Get citizen's grievances: GET /grievances/my */
export async function apiGetMyGrievances() {
  return apiFetch('/grievances/my');
}

/** Get all grievances (grievance officer / admin): GET /grievances */
export async function apiGetAllGrievances(page = 1, limit = 200) {
  return apiFetch(`/grievances?page=${page}&limit=${limit}`);
}

/** Get grievance by ID: GET /grievances/:id */
export async function apiGetGrievanceById(id) {
  return apiFetch(`/grievances/${id}`);
}

/** Raise a grievance: POST /grievances */
export async function apiRaiseGrievance(data) {
  const body = data instanceof FormData ? data : JSON.stringify(data);
  return apiFetch('/grievances', { method: 'POST', body });
}

/** Update grievance status: PATCH /grievances/:id/status */
export async function apiUpdateGrievanceStatus(id, data) {
  return apiFetch(`/grievances/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/** Reply to a grievance: PATCH /grievances/:id/reply */
export async function apiReplyGrievance(id, reply) {
  return apiFetch(`/grievances/${id}/reply`, {
    method: 'PATCH',
    body: JSON.stringify({ reply }),
  });
}

// ──────────────────────────────────────────
// SERVICES
// ──────────────────────────────────────────

/** Get all active services: GET /services */
export async function apiGetServices() {
  return apiFetch('/services');
}

/** Get all services including inactive: GET /services/all */
export async function apiGetAllServices() {
  return apiFetch('/services/all');
}

/** Create a service: POST /services */
export async function apiCreateService(data) {
  return apiFetch('/services', { method: 'POST', body: JSON.stringify(data) });
}

/** Update a service: PATCH /services/:id */
export async function apiUpdateService(id, data) {
  return apiFetch(`/services/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

/** Delete a service: DELETE /services/:id */
export async function apiDeleteService(id) {
  return apiFetch(`/services/${id}`, { method: 'DELETE' });
}

// ──────────────────────────────────────────
// NOTIFICATIONS
// ──────────────────────────────────────────

/** Get notifications for current user: GET /notifications */
export async function apiGetNotifications() {
  return apiFetch('/notifications');
}

/** Get unread count: GET /notifications/count */
export async function apiGetNotificationCount() {
  return apiFetch('/notifications/count');
}

/** Mark all as read: PATCH /notifications/read-all */
export async function apiMarkAllNotificationsRead() {
  return apiFetch('/notifications/read-all', { method: 'PATCH' });
}

/** Mark one as read: PATCH /notifications/:id/read */
export async function apiMarkNotificationRead(id) {
  return apiFetch(`/notifications/${id}/read`, { method: 'PATCH' });
}

/** Create manual notification: POST /notifications */
export async function apiCreateNotification(data) {
  return apiFetch('/notifications', { method: 'POST', body: JSON.stringify(data) });
}

// ──────────────────────────────────────────
// SUPERVISOR
// ──────────────────────────────────────────

/** Get supervisor dashboard data: GET /supervisor/dashboard */
export async function apiGetSupervisorDashboard() {
  return apiFetch('/supervisor/dashboard');
}

/** Get escalated cases: GET /supervisor/escalated */
export async function apiGetEscalated() {
  return apiFetch('/supervisor/escalated');
}

/** Get officer workload: GET /supervisor/workload */
export async function apiGetWorkload() {
  return apiFetch('/supervisor/workload');
}

/** Assign application to officer: POST /supervisor/assign */
export async function apiAssignApplication(appId, officerId) {
  return apiFetch('/supervisor/assign', {
    method: 'POST',
    body: JSON.stringify({ appId, officerId }),
  });
}

/** Review escalated case: PATCH /supervisor/review/:id */
export async function apiReviewEscalated(id, action, remarks) {
  return apiFetch(`/supervisor/review/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ action, remarks }),
  });
}

// ──────────────────────────────────────────
// SUPER USER (Admin)
// ──────────────────────────────────────────

/** Get admin dashboard stats: GET /super-user/dashboard */
export async function apiGetAdminDashboard() {
  return apiFetch('/super-user/dashboard');
}

/** Get system settings: GET /super-user/settings */
export async function apiGetSettings() {
  return apiFetch('/super-user/settings');
}

/** Update system settings: PATCH /super-user/settings */
export async function apiUpdateSettings(data) {
  return apiFetch('/super-user/settings', { method: 'PATCH', body: JSON.stringify(data) });
}

/** Get pending officer registrations: GET /super-user/pending-officers */
export async function apiGetPendingOfficers() {
  return apiFetch('/super-user/pending-officers');
}

/** Onboard a new officer directly: POST /super-user/onboard-officer */
export async function apiOnboardOfficer(data) {
  return apiFetch('/super-user/onboard-officer', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/** Approve pending officer: PATCH /super-user/pending-officers/:id/approve */
export async function apiApproveOfficer(id) {
  return apiFetch(`/super-user/pending-officers/${id}/approve`, { method: 'PATCH' });
}

/** Reject pending officer: PATCH /super-user/pending-officers/:id/reject */
export async function apiRejectOfficer(id) {
  return apiFetch(`/super-user/pending-officers/${id}/reject`, { method: 'PATCH' });
}

/** Get audit logs: GET /super-user/audit-logs */
export async function apiGetAuditLogs() {
  return apiFetch('/super-user/audit-logs');
}

/** Create audit log: POST /super-user/audit-logs */
export async function apiCreateAuditLog(data) {
  return apiFetch('/super-user/audit-logs', { method: 'POST', body: JSON.stringify(data) });
}

// ──────────────────────────────────────────
// WORKFLOW CONFIG
// ──────────────────────────────────────────

/** Get workflow config: GET /workflow/config */
export async function apiGetWorkflowConfig() {
  return apiFetch('/workflow/config');
}

/** Update workflow config: PATCH /workflow/config */
export async function apiUpdateWorkflowConfig(data) {
  return apiFetch('/workflow/config', { method: 'PATCH', body: JSON.stringify(data) });
}

// ──────────────────────────────────────────
// GEOGRAPHY / DYNAMIC JURISDICTION TREE
// ──────────────────────────────────────────

export async function apiGetJurisdictionStats(stateId = 'state_ap') {
  return apiFetch(`/geography/stats?stateId=${stateId}`);
}

export async function apiGetJurisdictionTree(stateId = 'state_ap') {
  return apiFetch(`/geography/tree?stateId=${stateId}`);
}

export async function apiGetJurisdictionNode(nodeId) {
  return apiFetch(`/geography/nodes/${nodeId}`);
}

export async function apiGetJurisdictionDetails(nodeId) {
  return apiFetch(`/geography/nodes/${nodeId}/details`);
}

export async function apiGetJurisdictionChildren(nodeId, stateId = 'state_ap') {
  return apiFetch(`/geography/nodes/${nodeId}/children?stateId=${stateId}`);
}

export async function apiGetJurisdictionAncestors(nodeId) {
  return apiFetch(`/geography/nodes/${nodeId}/ancestors`);
}

export async function apiCreateJurisdictionNode(data) {
  return apiFetch('/geography/nodes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiUpdateJurisdictionNode(nodeId, data) {
  return apiFetch(`/geography/nodes/${nodeId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function apiToggleJurisdictionStatus(nodeId, status) {
  return apiFetch(`/geography/nodes/${nodeId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function apiDeleteJurisdictionNode(nodeId, cascade = false) {
  const url = cascade
    ? `/geography/nodes/${nodeId}?cascade=true`
    : `/geography/nodes/${nodeId}`;
  return apiFetch(url, { method: 'DELETE' });
}

export async function apiGetJurisdictionAudit(stateId = 'state_ap') {
  return apiFetch(`/geography/audit?stateId=${stateId}`);
}

// ──────────────────────────────────────────
// CENTRAL GOVERNMENT (MAIN ADMIN)
// ──────────────────────────────────────────

export async function apiGetStates() {
  return apiFetch('/central/states');
}

export async function apiCreateState(data) {
  return apiFetch('/central/states', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiDeleteState(id) {
  return apiFetch(`/central/states/${id}`, {
    method: 'DELETE',
  });
}

export async function apiGetStateDetails(id) {
  return apiFetch(`/central/states/${id}/details`);
}

export async function apiUpdateState(id, data) {
  return apiFetch(`/central/states/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function apiSetStateStatus(id, status) {
  return apiFetch(`/central/states/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function apiSetStateAdminStatus(id, status) {
  return apiFetch(`/central/states/${id}/admin/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function apiResetStateAdminPassword(id) {
  return apiFetch(`/central/states/${id}/admin/reset-password`, {
    method: 'POST',
  });
}

export async function apiGetCentralRevenue() {
  return apiFetch('/central/analytics/revenue');
}

export async function apiGetCentralMetrics() {
  return apiFetch('/central/analytics/metrics');
}



// ──────────────────────────────────────────
// STATE GOVERNMENT (STATE ADMIN)
// ──────────────────────────────────────────

const INITIAL_LOCAL_DEPARTMENTS = [
  {
    id: 'dept_rev_ap',
    stateId: 'state_ap',
    name: 'Revenue, Registration & Stamps Department',
    code: 'REV-AP',
    description: 'Statutory revenue, land administration, caste, nativity, and income verification secretariat.',
    status: 'ACTIVE',
    headUserId: 'USR-DH-AP-REV',
    headName: 'Dr. B. R. Ambedkar IAS',
    headEmail: 'head.revenue@ap.gov.in',
    servicesCount: 4,
    officersCount: 12,
    applicationsCount: 1420,
    grievancesCount: 85,
    designationsCount: 3,
    hasGrievanceCell: true,
    grievanceCellName: 'Revenue Department Grievance Redressal Cell',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'dept_mun_ap',
    stateId: 'state_ap',
    name: 'Municipal Administration & Urban Development',
    code: 'MAUD-AP',
    description: 'Urban governance, trade licensing, building permissions, and municipal services.',
    status: 'ACTIVE',
    headUserId: 'USR-DH-AP-MUN',
    headName: 'Sri K. Praveen Kumar IAS',
    headEmail: 'head.municipal@ap.gov.in',
    servicesCount: 3,
    officersCount: 8,
    applicationsCount: 890,
    grievancesCount: 42,
    designationsCount: 2,
    hasGrievanceCell: true,
    grievanceCellName: 'Municipal Grievance Redressal Cell',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'dept_trans_ap',
    stateId: 'state_ap',
    name: 'Transport Department',
    code: 'TRANS-AP',
    description: 'Vehicle registration, driving licenses, route permits, and road safety regulations.',
    status: 'ACTIVE',
    headUserId: 'USR-DH-AP-TRANS',
    headName: 'Sri M. R. K. Prasad IAS',
    headEmail: 'head.transport@ap.gov.in',
    servicesCount: 2,
    officersCount: 5,
    applicationsCount: 650,
    grievancesCount: 18,
    designationsCount: 2,
    hasGrievanceCell: true,
    grievanceCellName: 'Transport Department Grievance Cell',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'dept_rev_ts',
    stateId: 'state_ts',
    name: 'Revenue Department',
    code: 'REV-TS',
    description: 'Revenue and land administration for Government of Telangana.',
    status: 'ACTIVE',
    headUserId: 'USR-DH-TS-REV',
    headName: 'Smt. A. Shanti Kumari IAS',
    headEmail: 'head.revenue@telangana.gov.in',
    servicesCount: 3,
    officersCount: 10,
    applicationsCount: 1100,
    grievancesCount: 50,
    designationsCount: 3,
    hasGrievanceCell: true,
    grievanceCellName: 'Telangana Revenue Grievance Cell',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

const INITIAL_LOCAL_GRIEVANCE_CELLS = [
  {
    id: 'cell_rev_ap',
    stateId: 'state_ap',
    departmentId: 'dept_rev_ap',
    deptName: 'Revenue, Registration & Stamps Department',
    cellName: 'Revenue Department Appellate Redressal Cell',
    jurisdictionTier: 'DISTRICT & STATE',
    slaDays: 7,
    workflowSummary: 'District Grievance Officer ➔ State Appellate Authority',
    status: 'ACTIVE',
  },
  {
    id: 'cell_mun_ap',
    stateId: 'state_ap',
    departmentId: 'dept_mun_ap',
    deptName: 'Municipal Administration & Urban Development',
    cellName: 'Municipal Grievance Redressal Cell',
    jurisdictionTier: 'SUB_DIVISION & DISTRICT',
    slaDays: 5,
    workflowSummary: 'Divisional Officer ➔ Municipal Commissioner',
    status: 'ACTIVE',
  },
  {
    id: 'cell_trans_ap',
    stateId: 'state_ap',
    departmentId: 'dept_trans_ap',
    deptName: 'Transport Department',
    cellName: 'Transport Department Grievance Cell',
    jurisdictionTier: 'DISTRICT',
    slaDays: 7,
    workflowSummary: 'RTO Tirupati Appellate Officer',
    status: 'ACTIVE',
  },
];

function getStoredDepartments() {
  try {
    const raw = localStorage.getItem('DigiConnect_departments');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  saveStoredDepartments(INITIAL_LOCAL_DEPARTMENTS);
  return [...INITIAL_LOCAL_DEPARTMENTS];
}

function saveStoredDepartments(list) {
  try {
    localStorage.setItem('DigiConnect_departments', JSON.stringify(list));
  } catch (e) {}
}

function getStoredGrievanceCells() {
  try {
    const raw = localStorage.getItem('DigiConnect_grievance_cells');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  saveStoredGrievanceCells(INITIAL_LOCAL_GRIEVANCE_CELLS);
  return [...INITIAL_LOCAL_GRIEVANCE_CELLS];
}

function saveStoredGrievanceCells(list) {
  try {
    localStorage.setItem('DigiConnect_grievance_cells', JSON.stringify(list));
  } catch (e) {}
}

export async function apiGetStateDashboard(stateId = 'state_ap') {
  try {
    return await apiFetch(`/state-admin/dashboard?stateId=${stateId}`);
  } catch (e) {
    const totalDepartments = getStoredDepartments().filter(d => d.stateId === stateId).length;
    return { success: true, data: { summary: { totalDepartments } } };
  }
}

export async function apiGetStateDepartments(stateId = 'state_ap') {
  try {
    const res = await apiFetch(`/state-admin/departments?stateId=${stateId}`);
    if (res && res.data && Array.isArray(res.data)) {
      saveStoredDepartments(res.data);
      return res;
    }
  } catch (e) {}
  const list = getStoredDepartments().filter(d => !stateId || d.stateId === stateId);
  return { success: true, data: list };
}

export async function apiGetDepartmentById(id) {
  try {
    const res = await apiFetch(`/state-admin/departments/${id}`);
    if (res && res.data) return res;
  } catch (e) {}
  const dept = getStoredDepartments().find(d => d.id === id);
  if (!dept) throw new Error(`Department '${id}' not found.`);
  return {
    success: true,
    data: {
      ...dept,
      metrics: {
        servicesCount: dept.servicesCount || 0,
        officersCount: dept.officersCount || 0,
        applicationsCount: dept.applicationsCount || 0,
        grievancesCount: dept.grievancesCount || 0,
        designationsCount: dept.designationsCount || 0,
      },
      headUser: dept.headName ? { id: dept.headUserId || 'DH-01', name: dept.headName, email: dept.headEmail } : null,
      grievanceCell: { cellName: dept.grievanceCellName || `${dept.name} Grievance Cell`, workflowSteps: [{ roleTitle: 'District Grievance Officer' }, { roleTitle: 'State Appellate Authority' }] },
    },
  };
}

export async function apiCreateDepartment(data) {
  let created = null;
  try {
    const res = await apiFetch('/state-admin/departments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res && res.data) created = res.data;
  } catch (e) {}

  if (!created) {
    const deptId = `dept_${data.code.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now().toString().slice(-4)}`;
    created = {
      id: deptId,
      stateId: data.stateId || 'state_ap',
      name: data.name.trim(),
      code: data.code.trim().toUpperCase(),
      description: data.description || `${data.name} Line Department`,
      status: 'ACTIVE',
      headUserId: `USR-DH-${Date.now().toString().slice(-4)}`,
      headName: data.headUserName || data.headName || `${data.name} Head`,
      headEmail: data.headUserEmail || data.headEmail || `head@gov.in`,
      servicesCount: 0,
      officersCount: 0,
      applicationsCount: 0,
      grievancesCount: 0,
      designationsCount: 0,
      hasGrievanceCell: false,
      createdAt: new Date().toISOString(),
    };
  }

  const list = getStoredDepartments();
  const existingIdx = list.findIndex(d => d.id === created.id);
  if (existingIdx >= 0) {
    list[existingIdx] = created;
  } else {
    list.unshift(created);
  }
  saveStoredDepartments(list);
  return { success: true, data: created };
}

export async function apiUpdateDepartment(id, data) {
  let updated = null;
  try {
    const res = await apiFetch(`/state-admin/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (res && res.data) updated = res.data;
  } catch (e) {}

  const list = getStoredDepartments();
  const dept = list.find(d => d.id === id);
  if (!dept && !updated) throw new Error(`Department '${id}' not found.`);
  if (dept) {
    if (data.name) dept.name = data.name.trim();
    if (data.code) dept.code = data.code.trim().toUpperCase();
    if (data.description !== undefined) dept.description = data.description;
    if (data.status) dept.status = data.status;
    saveStoredDepartments(list);
    return { success: true, data: dept };
  }
  return { success: true, data: updated };
}

export async function apiUpdateDepartmentStatus(id, status) {
  try {
    await apiFetch(`/state-admin/departments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  } catch (e) {}
  const list = getStoredDepartments();
  const dept = list.find(d => d.id === id);
  if (!dept) throw new Error(`Department '${id}' not found.`);
  dept.status = status;
  saveStoredDepartments(list);
  return { success: true, data: dept };
}

export async function apiAssignDepartmentHead(id, name, email) {
  try {
    await apiFetch(`/state-admin/departments/${id}/head`, {
      method: 'POST',
      body: JSON.stringify({ name, email }),
    });
  } catch (e) {}
  const list = getStoredDepartments();
  const dept = list.find(d => d.id === id);
  if (!dept) throw new Error(`Department '${id}' not found.`);
  dept.headUserId = `USR-DH-${Date.now().toString().slice(-4)}`;
  dept.headName = name.trim();
  dept.headEmail = email.trim();
  saveStoredDepartments(list);
  return { success: true, data: dept };
}

export async function apiRemoveDepartmentHead(id) {
  try {
    await apiFetch(`/state-admin/departments/${id}/head`, {
      method: 'DELETE',
    });
  } catch (e) {}
  const list = getStoredDepartments();
  const dept = list.find(d => d.id === id);
  if (!dept) throw new Error(`Department '${id}' not found.`);
  dept.headUserId = null;
  dept.headName = null;
  dept.headEmail = null;
  saveStoredDepartments(list);
  return { success: true, data: dept };
}

export async function apiDeleteDepartment(id) {
  try {
    await apiFetch(`/state-admin/departments/${id}`, {
      method: 'DELETE',
    });
  } catch (e) {}
  const list = getStoredDepartments();
  const index = list.findIndex(d => d.id === id);
  if (index === -1) throw new Error(`Department '${id}' not found.`);
  const dept = list[index];
  if ((dept.servicesCount && dept.servicesCount > 0) || (dept.officersCount && dept.officersCount > 0) || (dept.applicationsCount && dept.applicationsCount > 0)) {
    throw new Error(`Cannot delete department '${dept.name}' because historical/operational records depend on it: ${dept.servicesCount || 0} services, ${dept.officersCount || 0} officers, ${dept.applicationsCount || 0} applications. Please suspend/deactivate the department instead.`);
  }
  list.splice(index, 1);
  saveStoredDepartments(list);
  return { success: true, message: `Department '${dept.name}' deleted.` };
}

export async function apiGetGrievanceCells(stateId = 'state_ap') {
  try {
    const res = await apiFetch(`/state-admin/grievance-cells?stateId=${stateId}`);
    if (res && res.data && Array.isArray(res.data)) {
      saveStoredGrievanceCells(res.data);
      return res;
    }
  } catch (e) {}
  const list = getStoredGrievanceCells().filter(c => !stateId || c.stateId === stateId);
  return { success: true, data: list };
}

export async function apiConfigureGrievanceCell(data) {
  let configured = null;
  try {
    const res = await apiFetch('/state-admin/grievance-cells', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res && res.data) configured = res.data;
  } catch (e) {}

  const depts = getStoredDepartments();
  const dept = depts.find(d => d.id === data.departmentId);
  const deptName = dept ? dept.name : (data.deptName || 'Department');

  if (dept) {
    dept.hasGrievanceCell = true;
    dept.grievanceCellName = data.cellName;
    saveStoredDepartments(depts);
  }

  if (!configured) {
    configured = {
      id: `cell_${Date.now().toString().slice(-4)}`,
      stateId: data.stateId || 'state_ap',
      departmentId: data.departmentId,
      deptName: deptName,
      cellName: data.cellName,
      jurisdictionTier: data.jurisdictionTier,
      slaDays: data.slaDays || 7,
      workflowSummary: 'District Grievance Officer ➔ State Appellate Authority',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
  } else {
    configured.deptName = deptName;
    configured.workflowSummary = configured.workflowSummary || 'District Grievance Officer ➔ State Appellate Authority';
    configured.status = 'ACTIVE';
  }

  const cells = getStoredGrievanceCells();
  const existingIdx = cells.findIndex(c => c.departmentId === data.departmentId);
  if (existingIdx >= 0) {
    cells[existingIdx] = { ...cells[existingIdx], ...configured };
  } else {
    cells.unshift(configured);
  }
  saveStoredGrievanceCells(cells);
  return { success: true, data: configured };
}

export async function apiGetStateRevenue(stateId = 'state_ap') {
  return apiFetch(`/state-admin/analytics/revenue?stateId=${stateId}`);
}

export async function apiGetStateAnalytics(stateId = 'state_ap') {
  return apiFetch(`/state-admin/analytics/kpis?stateId=${stateId}`);
}

export async function apiGetStateKpis(stateId = 'state_ap') {
  return apiFetch(`/state-admin/analytics/kpis?stateId=${stateId}`);
}


// ──────────────────────────────────────────
// DEPARTMENT HEAD
// ──────────────────────────────────────────

const INITIAL_LOCAL_DESIGNATIONS = [
  {
    id: 'desig_vro',
    departmentId: 'dept_rev_ap',
    title: 'Village Revenue Officer (VRO)',
    code: 'VRO',
    description: 'Village Revenue Officer — First Level Verification & Nativity Inspection',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'desig_mro',
    departmentId: 'dept_rev_ap',
    title: 'Mandal Revenue Officer (MRO)',
    code: 'MRO',
    description: 'Mandal Revenue Officer / Tehsildar — Intermediate Review & Endorsement',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'desig_tahsildar',
    departmentId: 'dept_rev_ap',
    title: 'Tahsildar',
    code: 'TAHSILDAR',
    description: 'Tahsildar — Issuing & Digital Approval Authority with DSC Signoff',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'desig_ri',
    departmentId: 'dept_rev_ap',
    title: 'Revenue Inspector (RI)',
    code: 'RI',
    description: 'Revenue Inspector — Field Assessment & Spot Verification',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

function getStoredDesignations() {
  try {
    const raw = localStorage.getItem('DigiConnect_designations');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  saveStoredDesignations(INITIAL_LOCAL_DESIGNATIONS);
  return [...INITIAL_LOCAL_DESIGNATIONS];
}

function saveStoredDesignations(list) {
  try {
    localStorage.setItem('DigiConnect_designations', JSON.stringify(list));
  } catch (e) {}
}

export async function apiGetDesignations(departmentId = 'dept_rev_ap') {
  try {
    const res = await apiFetch(`/department-head/designations?departmentId=${departmentId}`);
    if (res && res.data && Array.isArray(res.data)) {
      saveStoredDesignations(res.data);
      return res;
    }
  } catch (e) {}
  const list = getStoredDesignations().filter(d => !departmentId || d.departmentId === departmentId);
  return { success: true, data: list };
}

export async function apiCreateDesignation(data) {
  let created = null;
  try {
    const res = await apiFetch('/department-head/designations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res && res.data) created = res.data;
  } catch (e) {}

  if (!created) {
    created = {
      id: `desig_${data.code.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now().toString().slice(-4)}`,
      departmentId: data.departmentId || 'dept_rev_ap',
      title: data.title.trim(),
      code: data.code.trim().toUpperCase(),
      description: data.description || 'Department operational job role',
      createdAt: new Date().toISOString(),
    };
  }

  const list = getStoredDesignations();
  const existingIdx = list.findIndex(d => d.id === created.id);
  if (existingIdx >= 0) {
    list[existingIdx] = created;
  } else {
    list.unshift(created);
  }
  saveStoredDesignations(list);
  return { success: true, data: created };
}

export async function apiDeleteDesignation(id) {
  try {
    await apiFetch(`/department-head/designations/${id}`, {
      method: 'DELETE',
    });
  } catch (e) {}
  const list = getStoredDesignations();
  const index = list.findIndex(d => d.id === id);
  if (index >= 0) {
    list.splice(index, 1);
    saveStoredDesignations(list);
  }
  return { success: true, message: 'Designation deleted' };
}

export async function apiGetDepartmentOfficers(deptId = 'dept_rev_ap') {
  try {
    const res = await apiFetch(`/department-head/officers?departmentId=${deptId}`);
    if (res && res.data) return res;
  } catch (e) {}
  return {
    success: true,
    data: [
      { id: 'OFF-VRO-01', name: 'R. Somasekhar', email: 'vro.chandragiri@ap.gov.in', designationId: 'desig_vro', designationTitle: 'Village Revenue Officer (VRO)', assignedNodeId: 'node_cg_vil', status: 'ACTIVE' },
      { id: 'OFF-RI-01', name: 'K. Venkataramana', email: 'ri.tirupati@ap.gov.in', designationId: 'desig_ri', designationTitle: 'Revenue Inspector (RI)', assignedNodeId: 'node_tpt', status: 'ACTIVE' },
      { id: 'OFF-MRO-01', name: 'M. Padmavathi', email: 'mro.tirupati@ap.gov.in', designationId: 'desig_mro', designationTitle: 'Mandal Revenue Officer (MRO)', assignedNodeId: 'node_tpt', status: 'ACTIVE' },
      { id: 'OFF-TAH-01', name: 'P. Subba Rao', email: 'tahsildar.tirupati@ap.gov.in', designationId: 'desig_tahsildar', designationTitle: 'Tahsildar', assignedNodeId: 'node_tpt', status: 'ACTIVE' },
    ],
  };
}

export async function apiOnboardDepartmentOfficer(data) {
  return apiFetch('/department-head/officers', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiGetDepartmentServices(deptId = 'dept_rev_ap') {
  try {
    const res = await apiFetch(`/department-head/services?departmentId=${deptId}`);
    if (res && res.data) return res;
  } catch (e) {}
  return {
    success: true,
    data: [
      {
        id: 'srv_caste_income_ap',
        departmentId: 'dept_rev_ap',
        name: 'Integrated Community, Nativity & Date of Birth Certificate',
        code: 'CASTE_CERT_AP',
        slaDays: 7,
        totalFee: 50,
        status: 'ACTIVE',
        workflowSteps: [
          { stepNumber: 1, stepName: 'VRO Verification & Field Inquiry', requiredDesignationId: 'desig_vro', canApprove: true, canReject: true, canRaiseQuery: true },
          { stepNumber: 2, stepName: 'MRO Verification & Scrutiny', requiredDesignationId: 'desig_mro', canApprove: true, canReject: true, canRaiseQuery: true },
          { stepNumber: 3, stepName: 'Tahsildar Digital Approval & DSC Signoff', requiredDesignationId: 'desig_tahsildar', canApprove: true, canReject: true, isFinalApprovalStep: true },
        ],
      },
      {
        id: 'srv_income_ap',
        departmentId: 'dept_rev_ap',
        name: 'Income & Asset Certificate',
        code: 'INCOME_CERT_AP',
        slaDays: 5,
        totalFee: 35,
        status: 'ACTIVE',
        workflowSteps: [
          { stepNumber: 1, stepName: 'VRO Income Verification', requiredDesignationId: 'desig_vro', canApprove: true, canReject: true, canRaiseQuery: true },
          { stepNumber: 2, stepName: 'Tahsildar Approval', requiredDesignationId: 'desig_tahsildar', canApprove: true, canReject: true, isFinalApprovalStep: true },
        ],
      },
      {
        id: 'srv_land_mutation_ap',
        departmentId: 'dept_rev_ap',
        name: 'Agricultural Land Mutation & Pattadar Passbook',
        code: 'LAND_MUTATION_AP',
        slaDays: 14,
        totalFee: 100,
        status: 'ACTIVE',
        workflowSteps: [
          { stepNumber: 1, stepName: 'Revenue Inspector Spot Survey', requiredDesignationId: 'desig_ri', canApprove: true, canReject: true, canRaiseQuery: true },
          { stepNumber: 2, stepName: 'MRO Endorsement', requiredDesignationId: 'desig_mro', canApprove: true, canReject: true, canRaiseQuery: true },
          { stepNumber: 3, stepName: 'Tahsildar Record Mutation & Issue', requiredDesignationId: 'desig_tahsildar', canApprove: true, canReject: true, isFinalApprovalStep: true },
        ],
      },
    ],
  };
}

export async function apiCreateDynamicService(data) {
  return apiFetch('/department-head/services', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ──────────────────────────────────────────
// THE 3 PRIMARY OFFICER ACTIONS (Sections 18-22)
// ──────────────────────────────────────────

export async function apiOfficerApprove(appId, remarks = '') {
  return apiFetch(`/applications/${appId}/approve`, {
    method: 'POST',
    body: JSON.stringify({ remarks }),
  });
}

export async function apiOfficerReject(appId, reason = '') {
  return apiFetch(`/applications/${appId}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export async function apiOfficerRaiseQuery(appId, queryText = '') {
  return apiFetch(`/applications/${appId}/raise-query`, {
    method: 'POST',
    body: JSON.stringify({ queryText }),
  });
}

// ──────────────────────────────────────────
// CLOSED GRIEVANCE REDRESSAL LOOP (Sections 28-32)
// ──────────────────────────────────────────

export async function apiResolveGrievance(grievanceId, action, remarks = '') {
  return apiFetch(`/grievances/${grievanceId}/resolve`, {
    method: 'POST',
    body: JSON.stringify({ action, remarks }),
  });
}

// ──────────────────────────────────────────
// DEMO CERTIFICATES
// ──────────────────────────────────────────

export async function apiGetCertificate(certId) {
  return apiFetch(`/certificates/${certId}`);
}

export async function apiGetAppCertificate(appId) {
  return apiFetch(`/certificates/application/${appId}`);
}

