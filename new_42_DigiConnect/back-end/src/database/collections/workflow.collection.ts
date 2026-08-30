export interface WorkflowStage {
  stageNumber: number;
  stageName: string;
  assignedDesignationName: string; // e.g. 'Village Revenue Officer'
  assignedDesignationId: string; // e.g. 'DESIG-VRO'
  slaDays: number;
  isFinalStage: boolean;
  allowedActions: string[];
}

export interface ServiceWorkflow {
  serviceId: string;
  departmentId: string;
  totalStages: number;
  stages: WorkflowStage[];
}

export const WORKFLOW_CONFIG_MASTER: Record<string, ServiceWorkflow> = {
  'SRV-REV-INCOME': {
    serviceId: 'SRV-REV-INCOME',
    departmentId: 'DEPT-REV',
    totalStages: 3,
    stages: [
      {
        stageNumber: 1,
        stageName: 'Field Inspection & Verification',
        assignedDesignationName: 'Village Revenue Officer',
        assignedDesignationId: 'DESIG-VRO',
        slaDays: 3,
        isFinalStage: false,
        allowedActions: ['VERIFY_FORWARD', 'QUERY_CITIZEN', 'REJECT'],
      },
      {
        stageNumber: 2,
        stageName: 'Revenue Inspector Scrutiny',
        assignedDesignationName: 'Revenue Inspector',
        assignedDesignationId: 'DESIG-RI',
        slaDays: 2,
        isFinalStage: false,
        allowedActions: ['RECOMMEND_APPROVAL', 'REVERT_TO_PREVIOUS', 'QUERY_CITIZEN', 'REJECT'],
      },
      {
        stageNumber: 3,
        stageName: 'Final Sanction & Digital Seal',
        assignedDesignationName: 'Tahsildar / MRO',
        assignedDesignationId: 'DESIG-TAHSILDAR',
        slaDays: 2,
        isFinalStage: true,
        allowedActions: ['DIGITAL_SIGN_APPROVE', 'REVERT_TO_PREVIOUS', 'REJECT'],
      },
    ],
  },
  'SRV-REV-CASTE': {
    serviceId: 'SRV-REV-CASTE',
    departmentId: 'DEPT-REV',
    totalStages: 3,
    stages: [
      {
        stageNumber: 1,
        stageName: 'Genealogy & Field Inquiry',
        assignedDesignationName: 'Village Revenue Officer',
        assignedDesignationId: 'DESIG-VRO',
        slaDays: 5,
        isFinalStage: false,
        allowedActions: ['VERIFY_FORWARD', 'QUERY_CITIZEN', 'REJECT'],
      },
      {
        stageNumber: 2,
        stageName: 'Community Records Verification',
        assignedDesignationName: 'Revenue Inspector',
        assignedDesignationId: 'DESIG-RI',
        slaDays: 4,
        isFinalStage: false,
        allowedActions: ['RECOMMEND_APPROVAL', 'REVERT_TO_PREVIOUS', 'QUERY_CITIZEN', 'REJECT'],
      },
      {
        stageNumber: 3,
        stageName: 'Statutory Issuance & Digital Seal',
        assignedDesignationName: 'Tahsildar / MRO',
        assignedDesignationId: 'DESIG-TAHSILDAR',
        slaDays: 5,
        isFinalStage: true,
        allowedActions: ['DIGITAL_SIGN_APPROVE', 'REVERT_TO_PREVIOUS', 'REJECT'],
      },
    ],
  },
  'SRV-MAUD-TAX-MUTATION': {
    serviceId: 'SRV-MAUD-TAX-MUTATION',
    departmentId: 'DEPT-MAUD',
    totalStages: 2,
    stages: [
      {
        stageNumber: 1,
        stageName: 'Physical Site & Measurement Verification',
        assignedDesignationName: 'Ward Administrative Officer',
        assignedDesignationId: 'DESIG-WARD-OFFICER',
        slaDays: 5,
        isFinalStage: false,
        allowedActions: ['VERIFY_FORWARD', 'QUERY_CITIZEN', 'REJECT'],
      },
      {
        stageNumber: 2,
        stageName: 'Assessment Sanction & Property Register Update',
        assignedDesignationName: 'Municipal Commissioner',
        assignedDesignationId: 'DESIG-MUNICIPAL-COMM',
        slaDays: 5,
        isFinalStage: true,
        allowedActions: ['DIGITAL_SIGN_APPROVE', 'REJECT'],
      },
    ],
  },
};
