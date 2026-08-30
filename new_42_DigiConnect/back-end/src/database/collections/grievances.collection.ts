export interface GrievanceItem {
  grievanceId: string;
  citizenId: string;
  citizenName: string;
  citizenPhone: string;
  applicationNumber?: string;
  departmentId: string;
  departmentName: string;
  subject: string;
  description: string;
  status: 'OPEN' | 'INVESTIGATING' | 'ESCALATED' | 'RESOLVED' | 'REJECTED';
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  createdAt: string;
  assignedOfficerName?: string;
  resolutionRemarks?: string;
  resolvedAt?: string;
}

export const GRIEVANCES_MASTER: GrievanceItem[] = [
  {
    grievanceId: 'GRV-2026-501',
    citizenId: 'CIT-101',
    citizenName: 'Ramesh Kumar Goud',
    citizenPhone: '9876543210',
    applicationNumber: 'APP-2026-1038',
    departmentId: 'DEPT-REV',
    departmentName: 'Revenue & Land Administration',
    subject: 'Delay in Caste Certificate Field Verification inquiry',
    description: 'Applied 10 days ago for Caste Certificate for upcoming govt job notification. Field inquiry was delayed by 3 days.',
    status: 'INVESTIGATING',
    priority: 'HIGH',
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    assignedOfficerName: 'B. Sudhakar (Grievance Officer)',
    resolutionRemarks: 'Instructed Revenue Inspector to expedite scrutiny within 24 hours.',
  },
];
