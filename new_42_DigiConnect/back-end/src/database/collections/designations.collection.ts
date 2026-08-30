export interface ActionButtonDefinition {
  actionKey: string; // 'VERIFY_FORWARD', 'RECOMMEND_APPROVAL', 'DIGITAL_SIGN_APPROVE', 'REVERT_TO_PREVIOUS', 'QUERY_CITIZEN', 'REJECT'
  label: string; // e.g. 'Verify & Forward to RI'
  buttonClass: 'btn-success' | 'btn-primary' | 'btn-warning' | 'btn-danger';
  icon: string;
  targetStageChange: 'NEXT' | 'PREVIOUS' | 'COMPLETE' | 'REJECT' | 'QUERY';
  requiresRemarks: boolean;
}

export interface DesignationConfig {
  designationId: string;
  designationName: string;
  departmentId: string; // 'DEPT-REV', 'DEPT-MAUD'
  stateCode: string; // 'TS', 'AP', 'MH', or 'ALL'
  hierarchyLevel: number; // 1 = field, 2 = scrutiny, 3 = final approving authority
  allowedPages: string[]; // e.g. ['dashboard', 'queue', 'review', 'queries']
  allowedActions: string[]; // actionKeys that this designation can perform
}

export const ACTION_BUTTONS_MASTER: Record<string, ActionButtonDefinition> = {
  'VERIFY_FORWARD': {
    actionKey: 'VERIFY_FORWARD',
    label: 'Verify & Forward',
    buttonClass: 'btn-success',
    icon: '✓',
    targetStageChange: 'NEXT',
    requiresRemarks: true,
  },
  'RECOMMEND_APPROVAL': {
    actionKey: 'RECOMMEND_APPROVAL',
    label: 'Recommend Approval',
    buttonClass: 'btn-success',
    icon: '✓',
    targetStageChange: 'NEXT',
    requiresRemarks: true,
  },
  'DIGITAL_SIGN_APPROVE': {
    actionKey: 'DIGITAL_SIGN_APPROVE',
    label: 'Digitally Sign & Approve',
    buttonClass: 'btn-primary',
    icon: '✍',
    targetStageChange: 'COMPLETE',
    requiresRemarks: true,
  },
  'REVERT_TO_PREVIOUS': {
    actionKey: 'REVERT_TO_PREVIOUS',
    label: 'Revert to Previous Stage',
    buttonClass: 'btn-warning',
    icon: '↩',
    targetStageChange: 'PREVIOUS',
    requiresRemarks: true,
  },
  'QUERY_CITIZEN': {
    actionKey: 'QUERY_CITIZEN',
    label: 'Raise Query to Citizen',
    buttonClass: 'btn-warning',
    icon: '?',
    targetStageChange: 'QUERY',
    requiresRemarks: true,
  },
  'REJECT': {
    actionKey: 'REJECT',
    label: 'Reject Application',
    buttonClass: 'btn-danger',
    icon: '✕',
    targetStageChange: 'REJECT',
    requiresRemarks: true,
  },
};

export const DESIGNATIONS_MASTER: DesignationConfig[] = [
  // AP / Telangana - Revenue Department
  {
    designationId: 'DESIG-VRO',
    designationName: 'Village Revenue Officer',
    departmentId: 'DEPT-REV',
    stateCode: 'ALL',
    hierarchyLevel: 1,
    allowedPages: ['dashboard', 'queue', 'review', 'queries'],
    allowedActions: ['VERIFY_FORWARD', 'QUERY_CITIZEN', 'REJECT'],
  },
  {
    designationId: 'DESIG-RI',
    designationName: 'Revenue Inspector',
    departmentId: 'DEPT-REV',
    stateCode: 'ALL',
    hierarchyLevel: 2,
    allowedPages: ['dashboard', 'queue', 'review', 'queries'],
    allowedActions: ['RECOMMEND_APPROVAL', 'REVERT_TO_PREVIOUS', 'QUERY_CITIZEN', 'REJECT'],
  },
  {
    designationId: 'DESIG-TAHSILDAR',
    designationName: 'Tahsildar / MRO',
    departmentId: 'DEPT-REV',
    stateCode: 'ALL',
    hierarchyLevel: 3,
    allowedPages: ['dashboard', 'queue', 'review', 'queries'],
    allowedActions: ['DIGITAL_SIGN_APPROVE', 'REVERT_TO_PREVIOUS', 'REJECT'],
  },

  // Maharashtra - Revenue Department
  {
    designationId: 'DESIG-TALATHI',
    designationName: 'Talathi',
    departmentId: 'DEPT-REV',
    stateCode: 'MH',
    hierarchyLevel: 1,
    allowedPages: ['dashboard', 'queue', 'review', 'queries'],
    allowedActions: ['VERIFY_FORWARD', 'QUERY_CITIZEN', 'REJECT'],
  },
  {
    designationId: 'DESIG-SDO',
    designationName: 'Sub-Divisional Officer',
    departmentId: 'DEPT-REV',
    stateCode: 'MH',
    hierarchyLevel: 2,
    allowedPages: ['dashboard', 'queue', 'review', 'queries'],
    allowedActions: ['DIGITAL_SIGN_APPROVE', 'REVERT_TO_PREVIOUS', 'REJECT'],
  },

  // Municipal Administration (Urban)
  {
    designationId: 'DESIG-WARD-OFFICER',
    designationName: 'Ward Administrative Officer',
    departmentId: 'DEPT-MAUD',
    stateCode: 'ALL',
    hierarchyLevel: 1,
    allowedPages: ['dashboard', 'queue', 'review', 'queries'],
    allowedActions: ['VERIFY_FORWARD', 'QUERY_CITIZEN', 'REJECT'],
  },
  {
    designationId: 'DESIG-MUNICIPAL-COMM',
    designationName: 'Municipal Commissioner',
    departmentId: 'DEPT-MAUD',
    stateCode: 'ALL',
    hierarchyLevel: 2,
    allowedPages: ['dashboard', 'queue', 'review', 'queries'],
    allowedActions: ['DIGITAL_SIGN_APPROVE', 'REJECT'],
  },

  // Grievance Redressal
  {
    designationId: 'DESIG-GRIEVANCE-OFFICER',
    designationName: 'Grievance Redressal Officer',
    departmentId: 'DEPT-GRIEVANCE',
    stateCode: 'ALL',
    hierarchyLevel: 1,
    allowedPages: ['dashboard', 'investigate'],
    allowedActions: ['RECOMMEND_APPROVAL', 'REJECT'],
  }
];
