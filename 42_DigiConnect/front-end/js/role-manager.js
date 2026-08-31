// ═══════════════════════════════════════════
// role-manager.js — RBAC, navigation data, permission checks
// ═══════════════════════════════════════════

/**
 * SVG icon paths for navigation items
 */
export const svgIcons = {
  'grid':           `<path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>`,
  'file-text':      `<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>`,
  'search':         `<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>`,
  'plus-circle':    `<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>`,
  'alert-circle':   `<path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>`,
  'message-square': `<path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>`,
  'check-circle':   `<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>`,
  'help-circle':    `<path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>`,
  'alert-triangle': `<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>`,
  'edit-2':         `<path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>`,
  'settings':       `<path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>`,
  'users':          `<path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>`,
  'file':           `<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>`,
  'manage-users':   `<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>`,
  'workflow':       `<path stroke-linecap="round" stroke-linejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/>`,
  'system-settings':`<path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>`,
  'users-swap':     `<path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>`,
  'user':           `<path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>`,
  'logout':         `<path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>`,
};

/**
 * Navigation configuration per role (Strict 6 Master Architecture Actors)
 */
export const roleConfig = {
  central_admin: {
    portalLabel: 'Central Government Portal',
    roleLabel: 'Central Admin',
    badge: 'badge-danger',
    dashboardHref: 'central-admin/dashboard.html',
    items: [
      { type: 'label', label: 'National Overview' },
      { type: 'link', icon: 'grid', label: 'National Dashboard', href: 'central-admin/dashboard.html' },
      { type: 'label', label: 'Federation Management' },
      { type: 'link', icon: 'manage-users', label: 'State Governments', href: 'central-admin/manage-states.html' },
    ],
  },
  state_admin: {
    portalLabel: 'State Government Portal',
    roleLabel: 'State Admin',
    badge: 'badge-orange',
    dashboardHref: 'state-admin/dashboard.html',
    items: [
      { type: 'label', label: 'State Overview' },
      { type: 'link', icon: 'grid', label: 'State Dashboard', href: 'state-admin/dashboard.html' },
      { type: 'label', label: 'Administration' },
      { type: 'link', icon: 'workflow', label: 'Dynamic Jurisdiction Tree', href: 'state-admin/jurisdictions.html' },
      { type: 'link', icon: 'settings', label: 'Departments & Heads', href: 'state-admin/departments.html' },
      { type: 'link', icon: 'alert-triangle', label: 'Department Grievance Cells', href: 'state-admin/grievance-cells.html' },
    ],
  },
  department_head: {
    portalLabel: 'Department Head Portal',
    roleLabel: 'Department Head',
    badge: 'badge-purple',
    dashboardHref: 'department-head/dashboard.html',
    items: [
      { type: 'label', label: 'Department Overview' },
      { type: 'link', icon: 'grid', label: 'Department Dashboard', href: 'department-head/dashboard.html' },
      { type: 'label', label: 'Role Designations' },
      { type: 'link', icon: 'users', label: 'Manage Designations', href: 'department-head/designations.html' },
      { type: 'label', label: 'Services & Workflows' },
      { type: 'link', icon: 'settings', label: 'Department Services', href: 'department-head/services.html' },
      { type: 'link', icon: 'plus-circle', label: 'Service & Workflow Builder', href: 'department-head/service-builder.html' },
      { type: 'label', label: 'Field Administration' },
      { type: 'link', icon: 'users-swap', label: 'Onboard Officers', href: 'department-head/officers.html' },
    ],
  },
  officer: {
    portalLabel: 'Officer Portal',
    roleLabel: 'Department Officer',
    badge: 'badge-purple',
    dashboardHref: 'officer/officer-dashboard.html',
    items: [
      { type: 'label', label: 'Overview' },
      { type: 'link', icon: 'grid', label: 'Dashboard', href: 'officer/officer-dashboard.html' },
      { type: 'label', label: 'Work Queue' },
      { type: 'link', icon: 'check-circle', label: 'Review Application', href: 'officer/review-application.html' },
    ],
  },
  grievance: {
    portalLabel: 'Grievance Redressal Portal',
    roleLabel: 'Grievance Officer',
    badge: 'badge-warning',
    dashboardHref: 'grievance/grievance-dashboard.html',
    items: [
      { type: 'label', label: 'Overview' },
      { type: 'link', icon: 'grid', label: 'Dashboard', href: 'grievance/grievance-dashboard.html' },
      { type: 'label', label: 'Grievances' },
      { type: 'link', icon: 'file-text', label: 'Grievance Detail & Resolution', href: 'grievance/grievance-detail.html' },
      { type: 'link', icon: 'file', label: 'Grievance History', href: 'grievance/grievance-history.html' },
    ],
  },
  citizen: {
    portalLabel: 'Citizen Portal',
    roleLabel: 'Citizen',
    badge: 'badge-info',
    dashboardHref: 'citizen/citizen-dashboard.html',
    items: [
      { type: 'label', label: 'Overview' },
      { type: 'link', icon: 'grid', label: 'Dashboard', href: 'citizen/citizen-dashboard.html' },
      { type: 'label', label: 'My Services' },
      { type: 'link', icon: 'file-text', label: 'My Applications', href: 'citizen/my-applications.html' },
      { type: 'link', icon: 'search', label: 'Track Application', href: 'citizen/track-application.html' },
      { type: 'link', icon: 'plus-circle', label: 'Apply for Service', href: 'citizen/apply-service.html' },
      { type: 'label', label: 'Support' },
      { type: 'link', icon: 'alert-circle', label: 'Raise Grievance', href: 'citizen/raise-grievance.html' },
      { type: 'link', icon: 'message-square', label: 'My Grievances', href: 'citizen/my-grievances.html' },
    ],
  },
};

/**
 * Pre-configured college demo personas for instantaneous 1-click role testing
 */
export const DEMO_PERSONAS = [
  {
    id: 'central_admin_1',
    name: 'N. Chandrasekhar',
    title: 'Central Government Admin',
    role: 'CENTRAL_ADMIN',
    roleKey: 'central_admin',
    stateId: '',
    departmentId: '',
    assignedNodeId: '',
    dashboardUrl: 'central-admin/dashboard.html',
    description: 'Manages States, enforces 1 State Admin per State, National Revenue',
  },
  {
    id: 'state_admin_ap',
    name: 'K. Vijayanand IAS',
    title: 'Special Chief Secretary (State Admin - AP)',
    role: 'STATE_ADMIN',
    roleKey: 'state_admin',
    stateId: 'state_ap',
    departmentId: '',
    assignedNodeId: 'node_ap',
    dashboardUrl: 'state-admin/dashboard.html',
    description: 'Manages Dynamic Jurisdiction Tree, Departments, Grievance Cells',
  },
  {
    id: 'dept_head_rev_ap',
    name: 'Dr. B. R. Ambedkar IAS',
    title: 'Director / Head of Revenue (AP)',
    role: 'DEPARTMENT_HEAD',
    roleKey: 'department_head',
    stateId: 'state_ap',
    departmentId: 'dept_rev_ap',
    assignedNodeId: 'node_ap',
    dashboardUrl: 'department-head/dashboard.html',
    description: 'Creates Designations, Dynamic Services, Form Schemas & Workflows',
  },
  {
    id: 'OFF-VRO-01',
    name: 'R. Somasekhar',
    title: 'Village Revenue Officer (Chandragiri)',
    role: 'OFFICER',
    roleKey: 'officer',
    stateId: 'state_ap',
    departmentId: 'dept_rev_ap',
    assignedNodeId: 'node_cg_vil',
    designationId: 'desig_vro',
    dashboardUrl: 'officer/officer-dashboard.html',
    description: 'Village Scope: Reviews applications, executes Approve/Reject/Query',
  },
  {
    id: 'OFF-TAH-01',
    name: 'P. Subba Rao',
    title: 'Tahsildar (Tirupati Division)',
    role: 'OFFICER',
    roleKey: 'officer',
    stateId: 'state_ap',
    departmentId: 'dept_rev_ap',
    assignedNodeId: 'node_tpt',
    designationId: 'desig_tahsildar',
    dashboardUrl: 'officer/officer-dashboard.html',
    description: 'District Scope: Final Approval & Digital Certificate generation',
  },
  {
    id: 'GO-DIST-01',
    name: 'Smt. Lakshmi Devi',
    title: 'District Grievance Redressal Officer',
    role: 'GRIEVANCE_OFFICER',
    roleKey: 'grievance',
    stateId: 'state_ap',
    departmentId: 'dept_rev_ap',
    assignedNodeId: 'node_tpt',
    dashboardUrl: 'grievance/grievance-dashboard.html',
    description: 'Closed Resolution: Uphold / Direct Re-verification / Overrule & Issue',
  },
  {
    id: 'CIT-1001',
    name: 'G. Rajesh Kumar',
    title: 'Citizen Applicant (Chandragiri Village, AP)',
    role: 'CITIZEN',
    roleKey: 'citizen',
    stateId: 'state_ap',
    departmentId: '',
    assignedNodeId: 'node_cg_vil',
    dashboardUrl: 'citizen/citizen-dashboard.html',
    description: '5-step Wizard, Document Uploads, Mock Pay, Track, Grievance Appeal',
  },
  // ─── TAMIL NADU PERSONAS ───
  {
    id: 'USR-SA-TN',
    name: 'Thiru Shiv Das Meena IAS',
    title: 'Chief Secretary (State Admin - Tamil Nadu)',
    role: 'STATE_ADMIN',
    roleKey: 'state_admin',
    stateId: 'state_tn',
    departmentId: '',
    assignedNodeId: 'node_tn',
    dashboardUrl: 'state-admin/dashboard.html',
    description: 'Tamil Nadu Administration: Coimbatore District, Pollachi Taluk, Anaimalai Village',
  },
  {
    id: 'OFF-VAO-TN-01',
    name: 'M. Selvakumar',
    title: 'Village Administrative Officer (Anaimalai, TN)',
    role: 'OFFICER',
    roleKey: 'officer',
    stateId: 'state_tn',
    departmentId: 'dept_rev_tn',
    assignedNodeId: 'node_pollachi_vil',
    designationId: 'desig_vao_tn',
    dashboardUrl: 'officer/officer-dashboard.html',
    description: 'Tamil Nadu VAO Scope: Reviews Nativity/Community applications',
  },
  // ─── KARNATAKA PERSONAS ───
  {
    id: 'USR-SA-KA',
    name: 'Smt. Vandita Sharma IAS',
    title: 'Chief Secretary (State Admin - Karnataka)',
    role: 'STATE_ADMIN',
    roleKey: 'state_admin',
    stateId: 'state_ka',
    departmentId: '',
    assignedNodeId: 'node_ka',
    dashboardUrl: 'state-admin/dashboard.html',
    description: 'Karnataka Administration: Mysuru & Bengaluru Urban, Hunsur Taluk, Bilikere Village',
  },
  {
    id: 'OFF-VA-KA-01',
    name: 'Basavaraj Patil',
    title: 'Village Accountant (Bilikere, Mysuru, KA)',
    role: 'OFFICER',
    roleKey: 'officer',
    stateId: 'state_ka',
    departmentId: 'dept_rev_ka',
    assignedNodeId: 'node_bilikere_vil',
    designationId: 'desig_va_ka',
    dashboardUrl: 'officer/officer-dashboard.html',
    description: 'Karnataka VA Scope: Nadakacheri Bhoomi caste/income verifications',
  },
  // ─── KERALA PERSONAS ───
  {
    id: 'USR-SA-KL',
    name: 'Dr. V. Venu IAS',
    title: 'Chief Secretary (State Admin - Kerala)',
    role: 'STATE_ADMIN',
    roleKey: 'state_admin',
    stateId: 'state_kl',
    departmentId: '',
    assignedNodeId: 'node_kl',
    dashboardUrl: 'state-admin/dashboard.html',
    description: 'Kerala Administration: Thiruvananthapuram, Nedumangad Taluk, Vembayam Village',
  },
  {
    id: 'OFF-VO-KL-01',
    name: 'Sajeev Kumar',
    title: 'Village Officer (Vembayam, Nedumangad, KL)',
    role: 'OFFICER',
    roleKey: 'officer',
    stateId: 'state_kl',
    departmentId: 'dept_rev_kl',
    assignedNodeId: 'node_nedumangad_vil',
    designationId: 'desig_vo_kl',
    dashboardUrl: 'officer/officer-dashboard.html',
    description: 'Kerala VO Scope: e-District land tax & possession cert verifications',
  },
];

/**
 * Switch active role session immediately and redirect to corresponding dashboard
 */
export function switchDemoPersona(personaId) {
  const persona = DEMO_PERSONAS.find((p) => p.id === personaId) || DEMO_PERSONAS[0];
  const sessionData = {
    id: persona.id,
    name: persona.name,
    role: persona.roleKey,
    roleKey: persona.roleKey,
    backendRole: persona.role,
    actualRole: persona.role,
    stateId: persona.stateId,
    departmentId: persona.departmentId,
    assignedNodeId: persona.assignedNodeId,
    designationId: persona.designationId || '',
    title: persona.title,
    email: `${persona.id.toLowerCase()}@digiconnect.gov.in`,
    token: `demo-token-${persona.id}`,
  };

  localStorage.setItem('DigiConnect_session', JSON.stringify(sessionData));
  localStorage.setItem('active_role', persona.roleKey);
  localStorage.setItem('current_user', JSON.stringify(sessionData));

  // Determine relative path based on current nesting
  const path = window.location.pathname;
  const inSubDir = path.includes('/central-admin/') ||
                   path.includes('/state-admin/') ||
                   path.includes('/department-head/') ||
                   path.includes('/citizen/') ||
                   path.includes('/officer/') ||
                   path.includes('/grievance/');

  const target = inSubDir ? `../${persona.dashboardUrl}` : persona.dashboardUrl;

  const currentFile = path.split('/').pop() || 'index.html';
  const targetFile = persona.dashboardUrl.split('/').pop();
  const currentDir = decodeURIComponent(path.split('/').slice(-2, -1)[0] || '');
  const targetDir = persona.dashboardUrl.split('/')[0];

  if (currentFile === targetFile && currentDir === targetDir) {
    window.location.reload();
  } else {
    window.location.href = target;
  }
}

/**
 * Validates if the user's role satisfies the required page role
 */
export function isRoleAllowed(userRole, requiredRole) {
  if (!requiredRole || requiredRole === false) return true;
  if (!userRole) return false;

  const u = String(userRole).toLowerCase().replace(/[\s-]+/g, '_');
  const r = String(requiredRole).toLowerCase().replace(/[\s-]+/g, '_');

  if (u === r) return true;

  // Central Government Admin
  if (['central_admin', 'super_user', 'super_admin', 'admin'].includes(u)) {
    if (['super_user', 'central_admin', 'admin', 'supervisor'].includes(r)) return true;
  }

  // State Government Admin
  if (['state_admin', 'supervisor'].includes(u)) {
    if (['state_admin', 'supervisor'].includes(r)) return true;
  }

  // Department Head
  if (['department_head', 'super_user'].includes(u)) {
    if (['department_head', 'super_user', 'supervisor'].includes(r)) return true;
  }

  // Officer / Verification Officer
  if (['officer', 'verification_officer'].includes(u)) {
    if (['officer', 'verification_officer'].includes(r)) return true;
  }

  // Grievance Redressal Officer
  if (['grievance', 'grievance_officer'].includes(u)) {
    if (['grievance', 'grievance_officer'].includes(r)) return true;
  }

  // Citizen
  if (['citizen'].includes(u)) {
    if (['citizen'].includes(r)) return true;
  }

  return false;
}

/**
 * Get role config for a given role
 * @param {string} role
 * @returns {object}
 */
export function getRoleConfig(role) {
  const norm = String(role).toLowerCase();
  return roleConfig[norm] || roleConfig['citizen'];
}

/**
 * Get the dashboard path for a role
 * @param {string} role
 * @returns {string}
 */
export function getRoleDashboardPath(role) {
  const config = getRoleConfig(role);
  return config.dashboardHref;
}

/**
 * Get redirect map for login
 * @returns {object}
 */
export function getLoginRedirectMap() {
  return {
    central_admin: 'central-admin/dashboard.html',
    state_admin: 'state-admin/dashboard.html',
    department_head: 'department-head/dashboard.html',
    officer: 'officer/officer-dashboard.html',
    citizen: 'citizen/citizen-dashboard.html',
    grievance: 'grievance/grievance-dashboard.html',
  };
}

/**
 * Check if a role has permission for an action
 * @param {string} role
 * @param {string} action
 * @returns {boolean}
 */
export function hasPermission(role, action) {
  const r = String(role).toLowerCase();
  const permissions = {
    central_admin: ['manage_states', 'view_national_revenue', 'view_audit_logs', 'system_settings'],
    state_admin: ['manage_jurisdiction_tree', 'manage_departments', 'configure_grievance_cells', 'view_state_revenue'],
    department_head: ['manage_designations', 'onboard_officers', 'manage_dynamic_services', 'configure_workflows'],
    citizen: ['view_own_applications', 'create_application', 'track_application', 'raise_grievance', 'view_own_grievances', 'update_profile', 'make_payment', 'respond_to_query'],
    officer: ['view_assigned_applications', 'review_application', 'approve_application', 'reject_application', 'raise_query', 'view_own_profile'],
    supervisor: ['view_all_applications', 'override_decision', 'reassign_application', 'view_escalations', 'manage_workload'],
    super_user: ['manage_users', 'manage_services', 'manage_workflows', 'view_audit_logs', 'system_settings', 'onboard_officers'],
    grievance: ['view_all_grievances', 'investigate_grievance', 'resolve_grievance', 'escalate_grievance', 'uphold_rejection', 'direct_reverification', 'overrule_and_issue'],
  };

  const rolePerms = permissions[r] || [];
  return rolePerms.includes(action);
}

