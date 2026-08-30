export interface ServiceItem {
  serviceId: string;
  serviceName: string;
  serviceCode: string;
  departmentId: string;
  departmentName: string;
  category: 'Certificate' | 'Revenue' | 'Municipal' | 'Welfare';
  feeAmount: number;
  totalSlaDays: number;
  areaApplicability: 'RURAL' | 'URBAN' | 'BOTH';
  requiredDocuments: {
    rural: string[];
    urban: string[];
  };
  description: string;
  icon: string;
  isActive: boolean;
}

export const SERVICES_MASTER: ServiceItem[] = [
  {
    serviceId: 'SRV-REV-INCOME',
    serviceName: 'Integrated Income Certificate',
    serviceCode: 'INC-01',
    departmentId: 'DEPT-REV',
    departmentName: 'Revenue & Land Administration',
    category: 'Certificate',
    feeAmount: 50,
    totalSlaDays: 7,
    areaApplicability: 'BOTH',
    requiredDocuments: {
      rural: ['Aadhaar Card', 'Ration Card / Food Security Card', 'Land Pahani / 1-B Namuna', 'Self-Declaration Form'],
      urban: ['Aadhaar Card', 'Salary Slip / IT Return', 'Municipal Property Tax Receipt', 'Self-Declaration Form'],
    },
    description: 'Official certification of family income for scholarships, fee reimbursement, and government schemes.',
    icon: 'document-text',
    isActive: true,
  },
  {
    serviceId: 'SRV-REV-CASTE',
    serviceName: 'Integrated Community, Nativity & Date of Birth Certificate',
    serviceCode: 'CST-02',
    departmentId: 'DEPT-REV',
    departmentName: 'Revenue & Land Administration',
    category: 'Certificate',
    feeAmount: 50,
    totalSlaDays: 14,
    areaApplicability: 'BOTH',
    requiredDocuments: {
      rural: ['Aadhaar Card', 'School Study Certificate', 'Father/Sibling Caste Certificate', 'Gram Panchayat VRO Attestation'],
      urban: ['Aadhaar Card', 'School Study Certificate', 'Father/Sibling Caste Certificate', 'Ward Member Attestation'],
    },
    description: 'Statutory certificate for SC/ST/BC/EWS category verification and educational/employment reservations.',
    icon: 'badge-check',
    isActive: true,
  },
  {
    serviceId: 'SRV-REV-MUTATION',
    serviceName: 'Agricultural Land Title Mutation & e-Pattadar Passbook',
    serviceCode: 'MUT-03',
    departmentId: 'DEPT-REV',
    departmentName: 'Revenue & Land Administration',
    category: 'Revenue',
    feeAmount: 150,
    totalSlaDays: 21,
    areaApplicability: 'RURAL',
    requiredDocuments: {
      rural: ['Registered Sale Deed / Gift Deed', 'Previous Pattadar Passbook', 'Encumbrance Certificate (EC)', 'Boundary Sketch (Tippan)'],
      urban: ['Not Applicable for Urban land (Use Municipal Property Mutation)'],
    },
    description: 'Update of land revenue records, ownership transfer in RoR, and digital passbook issuance.',
    icon: 'map',
    isActive: true,
  },
  {
    serviceId: 'SRV-MAUD-TAX-MUTATION',
    serviceName: 'Municipal Property Assessment & Name Transfer',
    serviceCode: 'MUN-04',
    departmentId: 'DEPT-MAUD',
    departmentName: 'Municipal Administration & Urban Development',
    category: 'Municipal',
    feeAmount: 100,
    totalSlaDays: 10,
    areaApplicability: 'URBAN',
    requiredDocuments: {
      rural: ['Not Applicable for Rural area (Use Agricultural Land Mutation)'],
      urban: ['Registered Sale Deed', 'Latest Property Tax Paid Receipt', 'Building Sanction Plan', 'Indemnity Bond'],
    },
    description: 'Transfer of title in municipal tax books for residential/commercial urban properties.',
    icon: 'office-building',
    isActive: true,
  },
];
