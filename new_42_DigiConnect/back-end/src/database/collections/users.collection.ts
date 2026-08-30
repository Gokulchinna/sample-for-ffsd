export interface UserProfile {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string; // plain for mock
  role: 'citizen' | 'officer' | 'admin';
  adminTier?: 'CENTRAL' | 'STATE' | 'DEPARTMENT';
  designationId?: string;
  designation?: string;
  departmentId?: string;
  departmentName?: string;
  stateCode: string;
  jurisdictionDistrict?: string;
  jurisdictionMandalOrWard?: string;
  aadhaar?: string;
  address?: string;
}

export const USERS_MASTER: UserProfile[] = [
  // 1. Citizen
  {
    userId: 'CIT-101',
    fullName: 'Ramesh Kumar Goud',
    email: 'ramesh.citizen@gmail.com',
    phone: '9876543210',
    passwordHash: 'password123',
    role: 'citizen',
    stateCode: 'TS',
    jurisdictionDistrict: 'Ranga Reddy',
    jurisdictionMandalOrWard: 'Ibrahimpatnam',
    aadhaar: '987654321012',
    address: 'H.No 3-45, Pocharam Village, Ibrahimpatnam Mandal, Ranga Reddy District, Telangana',
  },
  {
    userId: 'CIT-102',
    fullName: 'Priya Sharma',
    email: 'priya.sharma@gmail.com',
    phone: '9876543211',
    passwordHash: 'password123',
    role: 'citizen',
    stateCode: 'TS',
    jurisdictionDistrict: 'Hyderabad',
    jurisdictionMandalOrWard: 'GHMC Khairatabad',
    aadhaar: '123456789099',
    address: 'Flat 402, Green Meadows, Banjara Hills Road No 12, Hyderabad, Telangana',
  },

  // 2. Field Officer: Village Revenue Officer (VRO)
  {
    userId: 'OFF-VRO-01',
    fullName: 'K. Venkatesh (VRO)',
    email: 'vro.ibrahimpatnam@telangana.gov.in',
    phone: '9848011221',
    passwordHash: 'password123',
    role: 'officer',
    designationId: 'DESIG-VRO',
    designation: 'Village Revenue Officer',
    departmentId: 'DEPT-REV',
    departmentName: 'Revenue & Land Administration',
    stateCode: 'TS',
    jurisdictionDistrict: 'Ranga Reddy',
    jurisdictionMandalOrWard: 'Ibrahimpatnam',
  },

  // 3. Scrutiny Officer: Revenue Inspector (RI)
  {
    userId: 'OFF-RI-01',
    fullName: 'M. Prabhakar Rao (RI)',
    email: 'ri.ibrahimpatnam@telangana.gov.in',
    phone: '9848011222',
    passwordHash: 'password123',
    role: 'officer',
    designationId: 'DESIG-RI',
    designation: 'Revenue Inspector',
    departmentId: 'DEPT-REV',
    departmentName: 'Revenue & Land Administration',
    stateCode: 'TS',
    jurisdictionDistrict: 'Ranga Reddy',
    jurisdictionMandalOrWard: 'Ibrahimpatnam',
  },

  // 4. Final Approving Authority: Tahsildar / MRO
  {
    userId: 'OFF-MRO-01',
    fullName: 'Dr. S. Anjaneyulu (Tahsildar)',
    email: 'mro.ibrahimpatnam@telangana.gov.in',
    phone: '9848011223',
    passwordHash: 'password123',
    role: 'officer',
    designationId: 'DESIG-TAHSILDAR',
    designation: 'Tahsildar / MRO',
    departmentId: 'DEPT-REV',
    departmentName: 'Revenue & Land Administration',
    stateCode: 'TS',
    jurisdictionDistrict: 'Ranga Reddy',
    jurisdictionMandalOrWard: 'Ibrahimpatnam',
  },

  // 5. Grievance Redressal Officer
  {
    userId: 'OFF-GRIEV-01',
    fullName: 'B. Sudhakar (Grievance Officer)',
    email: 'grievance.officer@telangana.gov.in',
    phone: '9848011224',
    passwordHash: 'password123',
    role: 'officer',
    designationId: 'DESIG-GRIEVANCE-OFFICER',
    designation: 'Grievance Redressal Officer',
    departmentId: 'DEPT-GRIEVANCE',
    departmentName: 'Public Grievance Redressal Wing',
    stateCode: 'TS',
    jurisdictionDistrict: 'Ranga Reddy',
    jurisdictionMandalOrWard: 'ALL',
  },

  // 6. Tier 3: Department Admin (CCLA / Head of Department)
  {
    userId: 'ADM-DEPT-01',
    fullName: 'P. Rajeshwar IAS (CCLA Dept Head)',
    email: 'ccla.admin@telangana.gov.in',
    phone: '9848011225',
    passwordHash: 'password123',
    role: 'admin',
    adminTier: 'DEPARTMENT',
    departmentId: 'DEPT-REV',
    departmentName: 'Revenue & Land Administration',
    stateCode: 'TS',
  },

  // 7. Tier 2: State Admin (Principal Secretary ITE&C / ESD MeeSeva)
  {
    userId: 'ADM-STATE-01',
    fullName: 'Jayesh Ranjan IAS (State IT Secretary)',
    email: 'itsecretary@telangana.gov.in',
    phone: '9848011226',
    passwordHash: 'password123',
    role: 'admin',
    adminTier: 'STATE',
    stateCode: 'TS',
  },

  // 8. Tier 1: Central Admin (Union Government / MeitY / NIC)
  {
    userId: 'ADM-CENTRAL-01',
    fullName: 'Dr. Neeta Verma (National Director MeitY/NIC)',
    email: 'dg@nic.in',
    phone: '9811001100',
    passwordHash: 'password123',
    role: 'admin',
    adminTier: 'CENTRAL',
    stateCode: 'ALL',
  },
];
