export interface ApplicationDocument {
  docName: string;
  fileName: string;
  fileSize: string;
  status: 'ATTACHED' | 'VERIFIED' | 'REJECTED';
}

export interface StageHistoryEntry {
  stageNumber: number;
  stageName: string;
  actionTaken: string; // 'SUBMITTED', 'VERIFY_FORWARD', 'RECOMMEND_APPROVAL', 'DIGITAL_SIGN_APPROVE', 'QUERY_CITIZEN', 'REVERT_TO_PREVIOUS', 'REJECT'
  actedByDesignation: string;
  actedByOfficerName: string;
  remarks: string;
  timestamp: string;
}

export interface ApplicationItem {
  applicationId: string;
  serviceId: string;
  serviceName: string;
  serviceCode: string;
  departmentId: string;
  citizenId: string;
  citizenName: string;
  citizenPhone: string;
  areaType: 'RURAL' | 'URBAN';
  stateCode: string;
  district: string;
  mandalOrWard: string;
  villageOrLocality: string;
  formData: Record<string, any>;
  documents: ApplicationDocument[];
  feePaid: number;
  paymentSplit: {
    treasuryAmount: number;
    kioskCommission: number;
    opsFund: number;
  };
  currentStageNumber: number;
  currentStageName: string;
  assignedDesignationId: string;
  assignedDesignationName: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'QUERY_RAISED' | 'APPROVED' | 'REJECTED';
  queryDetails?: {
    queryText: string;
    queryRaisedBy: string;
    queryDate: string;
    citizenReply?: string;
    replyDate?: string;
  };
  submissionDate: string;
  slaDueAt: string;
  certificateNumber?: string;
  certificateIssuedDate?: string;
  stageHistory: StageHistoryEntry[];
}

export const APPLICATIONS_MASTER: ApplicationItem[] = [
  // 1. In-progress Rural Application at Stage 1 (Waiting in VRO's Queue)
  {
    applicationId: 'APP-2026-1042',
    serviceId: 'SRV-REV-INCOME',
    serviceName: 'Integrated Income Certificate',
    serviceCode: 'INC-01',
    departmentId: 'DEPT-REV',
    citizenId: 'CIT-101',
    citizenName: 'Ramesh Kumar Goud',
    citizenPhone: '9876543210',
    areaType: 'RURAL',
    stateCode: 'TS',
    district: 'Ranga Reddy',
    mandalOrWard: 'Ibrahimpatnam',
    villageOrLocality: 'Pocharam',
    formData: {
      applicantName: 'Ramesh Kumar Goud',
      fatherName: 'Late K. Venkataiah',
      annualIncome: '₹ 85,000',
      incomeSource: 'Agriculture & Daily Wage',
      rationCardNo: 'WAP154872901',
    },
    documents: [
      { docName: 'Aadhaar Card', fileName: 'aadhaar_ramesh.pdf', fileSize: '1.2 MB', status: 'ATTACHED' },
      { docName: 'Ration Card / Food Security Card', fileName: 'fsc_ration.pdf', fileSize: '850 KB', status: 'ATTACHED' },
      { docName: 'Land Pahani / 1-B Namuna', fileName: 'pahani_pocharam_sy45.pdf', fileSize: '2.1 MB', status: 'ATTACHED' },
      { docName: 'Self-Declaration Form', fileName: 'declaration_affidavit.pdf', fileSize: '450 KB', status: 'ATTACHED' },
    ],
    feePaid: 50,
    paymentSplit: { treasuryAmount: 35, kioskCommission: 10, opsFund: 5 },
    currentStageNumber: 1,
    currentStageName: 'Field Inspection & Verification',
    assignedDesignationId: 'DESIG-VRO',
    assignedDesignationName: 'Village Revenue Officer',
    status: 'UNDER_REVIEW',
    submissionDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    slaDueAt: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
    stageHistory: [
      {
        stageNumber: 0,
        stageName: 'Citizen Online Submission',
        actionTaken: 'SUBMITTED',
        actedByDesignation: 'Citizen',
        actedByOfficerName: 'Ramesh Kumar Goud',
        remarks: 'Application submitted online with required documents and fee payment.',
        timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      },
    ],
  },

  // 2. Application at Stage 2 (Forwarded by VRO, now in Revenue Inspector's Queue)
  {
    applicationId: 'APP-2026-1038',
    serviceId: 'SRV-REV-CASTE',
    serviceName: 'Integrated Community, Nativity & Date of Birth Certificate',
    serviceCode: 'CST-02',
    departmentId: 'DEPT-REV',
    citizenId: 'CIT-101',
    citizenName: 'Ramesh Kumar Goud',
    citizenPhone: '9876543210',
    areaType: 'RURAL',
    stateCode: 'TS',
    district: 'Ranga Reddy',
    mandalOrWard: 'Ibrahimpatnam',
    villageOrLocality: 'Pocharam',
    formData: {
      applicantName: 'Ramesh Kumar Goud',
      casteClaimed: 'BC-B (Goud)',
      subCaste: 'Ediga/Goud',
      purpose: 'State Government Employment Notification Verification',
    },
    documents: [
      { docName: 'Aadhaar Card', fileName: 'aadhaar_ramesh.pdf', fileSize: '1.2 MB', status: 'VERIFIED' },
      { docName: 'School Study Certificate', fileName: 'zphs_tc_certificate.pdf', fileSize: '980 KB', status: 'VERIFIED' },
      { docName: 'Father/Sibling Caste Certificate', fileName: 'father_caste_1998.pdf', fileSize: '1.5 MB', status: 'VERIFIED' },
      { docName: 'Gram Panchayat VRO Attestation', fileName: 'vro_inquiry_signed.pdf', fileSize: '650 KB', status: 'VERIFIED' },
    ],
    feePaid: 50,
    paymentSplit: { treasuryAmount: 35, kioskCommission: 10, opsFund: 5 },
    currentStageNumber: 2,
    currentStageName: 'Revenue Inspector Scrutiny',
    assignedDesignationId: 'DESIG-RI',
    assignedDesignationName: 'Revenue Inspector',
    status: 'UNDER_REVIEW',
    submissionDate: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    slaDueAt: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
    stageHistory: [
      {
        stageNumber: 0,
        stageName: 'Citizen Online Submission',
        actionTaken: 'SUBMITTED',
        actedByDesignation: 'Citizen',
        actedByOfficerName: 'Ramesh Kumar Goud',
        remarks: 'Submitted with Father caste certificate and School TC.',
        timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      },
      {
        stageNumber: 1,
        stageName: 'Field Inspection & Verification',
        actionTaken: 'VERIFY_FORWARD',
        actedByDesignation: 'Village Revenue Officer',
        actedByOfficerName: 'K. Venkatesh (VRO)',
        remarks: 'Physical inquiry conducted in Pocharam village. Family belongs to BC-B Goud community. Recommended for RI scrutiny.',
        timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      },
    ],
  },

  // 3. Approved Application (Ready for Citizen Certificate Download)
  {
    applicationId: 'APP-2026-1011',
    serviceId: 'SRV-REV-INCOME',
    serviceName: 'Integrated Income Certificate',
    serviceCode: 'INC-01',
    departmentId: 'DEPT-REV',
    citizenId: 'CIT-102',
    citizenName: 'Priya Sharma',
    citizenPhone: '9876543211',
    areaType: 'URBAN',
    stateCode: 'TS',
    district: 'Hyderabad',
    mandalOrWard: 'GHMC Khairatabad',
    villageOrLocality: 'Ward 93 (Banjara Hills)',
    formData: {
      applicantName: 'Priya Sharma',
      annualIncome: '₹ 1,80,000',
      incomeSource: 'Private IT Sector & Freelance',
    },
    documents: [
      { docName: 'Aadhaar Card', fileName: 'priya_aadhaar.pdf', fileSize: '1.1 MB', status: 'VERIFIED' },
      { docName: 'Salary Slip / IT Return', fileName: 'form16_2025.pdf', fileSize: '1.4 MB', status: 'VERIFIED' },
      { docName: 'Municipal Property Tax Receipt', fileName: 'ghmc_ptax_receipt.pdf', fileSize: '750 KB', status: 'VERIFIED' },
      { docName: 'Self-Declaration Form', fileName: 'self_declaration.pdf', fileSize: '320 KB', status: 'VERIFIED' },
    ],
    feePaid: 50,
    paymentSplit: { treasuryAmount: 35, kioskCommission: 10, opsFund: 5 },
    currentStageNumber: 3,
    currentStageName: 'Final Sanction & Digital Seal',
    assignedDesignationId: 'DESIG-TAHSILDAR',
    assignedDesignationName: 'Tahsildar / MRO',
    status: 'APPROVED',
    submissionDate: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    slaDueAt: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
    certificateNumber: 'TS-REV-INC-2026-984210',
    certificateIssuedDate: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    stageHistory: [
      {
        stageNumber: 0,
        stageName: 'Citizen Online Submission',
        actionTaken: 'SUBMITTED',
        actedByDesignation: 'Citizen',
        actedByOfficerName: 'Priya Sharma',
        remarks: 'Applied under Urban Ward 93 jurisdiction.',
        timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      },
      {
        stageNumber: 1,
        stageName: 'Field Inspection & Verification',
        actionTaken: 'VERIFY_FORWARD',
        actedByDesignation: 'Ward Administrative Officer',
        actedByOfficerName: 'Municipal Inspector',
        remarks: 'Verified salary slip and residential municipal property tax receipts.',
        timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      },
      {
        stageNumber: 2,
        stageName: 'Revenue Inspector Scrutiny',
        actionTaken: 'RECOMMEND_APPROVAL',
        actedByDesignation: 'Revenue Inspector',
        actedByOfficerName: 'M. Prabhakar Rao (RI)',
        remarks: 'Scrutiny complete. Recommended for Tahsildar digital signature.',
        timestamp: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      },
      {
        stageNumber: 3,
        stageName: 'Final Sanction & Digital Seal',
        actionTaken: 'DIGITAL_SIGN_APPROVE',
        actedByDesignation: 'Tahsildar / MRO',
        actedByOfficerName: 'Dr. S. Anjaneyulu (Tahsildar)',
        remarks: 'Approved and sealed with Digital Signature token. Valid for 1 year.',
        timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      },
    ],
  },
];
