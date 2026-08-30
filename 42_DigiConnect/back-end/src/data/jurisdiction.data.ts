import { JurisdictionNode } from '../models/jurisdiction.model';
import { StateGovernment } from '../models/state.model';
import { Department, Designation, OfficerUser } from '../models/department.model';

export const MASTER_STATES: StateGovernment[] = [
  {
    id: 'state_ap',
    name: 'Andhra Pradesh',
    code: 'AP',
    rootNodeId: 'node_ap',
    stateAdminId: 'USR-SA-AP',
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'state_ts',
    name: 'Telangana',
    code: 'TS',
    rootNodeId: 'node_ts',
    stateAdminId: 'USR-SA-TS',
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

export const MASTER_JURISDICTION_NODES: JurisdictionNode[] = [
  // ─── ANDHRA PRADESH ROOT & DISTRICT ───
  {
    id: 'node_ap',
    stateId: 'state_ap',
    parentId: null,
    name: 'Andhra Pradesh',
    governanceType: 'COMMON',
    tierLevel: 'STATE',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'node_tpt',
    stateId: 'state_ap',
    parentId: 'node_ap',
    name: 'Tirupati District',
    governanceType: 'COMMON',
    tierLevel: 'DISTRICT',
    createdAt: '2026-01-01T00:00:00.000Z',
  },

  // ─── AP RURAL BRANCH ───
  {
    id: 'node_rsd',
    stateId: 'state_ap',
    parentId: 'node_tpt',
    name: 'Tirupati Revenue Sub-Division',
    governanceType: 'RURAL',
    tierLevel: 'SUB_DIVISION',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'node_cg_mdl',
    stateId: 'state_ap',
    parentId: 'node_rsd',
    name: 'Chandragiri Mandal',
    governanceType: 'RURAL',
    tierLevel: 'MANDAL',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'node_cg_vil',
    stateId: 'state_ap',
    parentId: 'node_cg_mdl',
    name: 'Chandragiri Village',
    governanceType: 'RURAL',
    tierLevel: 'VILLAGE',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'node_pn_vil',
    stateId: 'state_ap',
    parentId: 'node_cg_mdl',
    name: 'Panakam Village',
    governanceType: 'RURAL',
    tierLevel: 'VILLAGE',
    createdAt: '2026-01-01T00:00:00.000Z',
  },

  // ─── AP URBAN BRANCH ───
  {
    id: 'node_usd',
    stateId: 'state_ap',
    parentId: 'node_tpt',
    name: 'Tirupati Urban Sub-Division',
    governanceType: 'URBAN',
    tierLevel: 'SUB_DIVISION',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'node_tmc',
    stateId: 'state_ap',
    parentId: 'node_usd',
    name: 'Tirupati Municipal Corporation',
    governanceType: 'URBAN',
    tierLevel: 'MUNICIPALITY',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'node_w14',
    stateId: 'state_ap',
    parentId: 'node_tmc',
    name: 'Ward 14',
    governanceType: 'URBAN',
    tierLevel: 'WARD',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'node_w15',
    stateId: 'state_ap',
    parentId: 'node_tmc',
    name: 'Ward 15',
    governanceType: 'URBAN',
    tierLevel: 'WARD',
    createdAt: '2026-01-01T00:00:00.000Z',
  },

  // ─── TELANGANA ROOT & DISTRICT ───
  {
    id: 'node_ts',
    stateId: 'state_ts',
    parentId: null,
    name: 'Telangana',
    governanceType: 'COMMON',
    tierLevel: 'STATE',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'node_hyd',
    stateId: 'state_ts',
    parentId: 'node_ts',
    name: 'Hyderabad District',
    governanceType: 'COMMON',
    tierLevel: 'DISTRICT',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'node_hyd_usd',
    stateId: 'state_ts',
    parentId: 'node_hyd',
    name: 'Charminar Urban Sub-Division',
    governanceType: 'URBAN',
    tierLevel: 'SUB_DIVISION',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'node_ghmc',
    stateId: 'state_ts',
    parentId: 'node_hyd_usd',
    name: 'GHMC Corporation',
    governanceType: 'URBAN',
    tierLevel: 'MUNICIPALITY',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'node_w21',
    stateId: 'state_ts',
    parentId: 'node_ghmc',
    name: 'Ward 21 - Moghalpura',
    governanceType: 'URBAN',
    tierLevel: 'WARD',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

export const MASTER_DEPARTMENTS: Department[] = [
  {
    id: 'dept_rev_ap',
    stateId: 'state_ap',
    name: 'Revenue Department',
    code: 'REV-AP',
    description: 'Land administration, caste, income, and residence certificates',
    headUserId: 'USR-DH-REV-AP',
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'dept_mun_ap',
    stateId: 'state_ap',
    name: 'Municipal Administration Department',
    code: 'CDMA-AP',
    description: 'Urban civic works, sanitation, trade licenses, and property assessments',
    headUserId: 'USR-DH-MUN-AP',
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'dept_rev_ts',
    stateId: 'state_ts',
    name: 'Revenue Department',
    code: 'REV-TS',
    description: 'Telangana revenue and land records administration',
    headUserId: 'USR-DH-REV-TS',
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

export const MASTER_DESIGNATIONS: Designation[] = [
  // AP Revenue
  {
    id: 'desig_vro',
    departmentId: 'dept_rev_ap',
    title: 'VRO',
    code: 'VRO',
    description: 'Village Revenue Officer — First Level Verification',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'desig_mro',
    departmentId: 'dept_rev_ap',
    title: 'MRO',
    code: 'MRO',
    description: 'Mandal Revenue Officer / Tehsildar — Intermediate Review',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'desig_tahsildar',
    departmentId: 'dept_rev_ap',
    title: 'Tahsildar',
    code: 'TAHSILDAR',
    description: 'Tahsildar — Issuing & Digital Approval Authority',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'desig_ri',
    departmentId: 'dept_rev_ap',
    title: 'Revenue Inspector',
    code: 'RI',
    description: 'Revenue Inspector — Field Assessment & Spot Verification',
    createdAt: '2026-01-01T00:00:00.000Z',
  },

  // AP Municipal
  {
    id: 'desig_ward_officer',
    departmentId: 'dept_mun_ap',
    title: 'Ward Administrative Officer',
    code: 'WAO',
    description: 'Ward level intake and preliminary verification officer',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'desig_sanitary_insp',
    departmentId: 'dept_mun_ap',
    title: 'Municipal Sanitary Inspector',
    code: 'MSI',
    description: 'Field inspection and hygiene verification',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'desig_commissioner',
    departmentId: 'dept_mun_ap',
    title: 'Municipal Commissioner',
    code: 'MC',
    description: 'Final municipal approval authority',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

export const MASTER_OFFICERS: OfficerUser[] = [
  {
    id: 'OFF-VRO-01',
    name: 'Gokul Rao',
    email: 'gokul.vro@ap.gov.in',
    phone: '9876543210',
    departmentId: 'dept_rev_ap',
    designationId: 'desig_vro',
    designationTitle: 'VRO',
    assignedNodeId: 'node_cg_vil', // Chandragiri Village
    status: 'Active',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'OFF-MRO-01',
    name: 'Sunita Sharma',
    email: 'sunita.mro@ap.gov.in',
    phone: '9876543211',
    departmentId: 'dept_rev_ap',
    designationId: 'desig_mro',
    designationTitle: 'MRO',
    assignedNodeId: 'node_cg_mdl', // Chandragiri Mandal (covers child villages)
    status: 'Active',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'OFF-TAH-01',
    name: 'K. V. Reddy',
    email: 'kvreddy.tah@ap.gov.in',
    phone: '9876543212',
    departmentId: 'dept_rev_ap',
    designationId: 'desig_tahsildar',
    designationTitle: 'Tahsildar',
    assignedNodeId: 'node_tpt', // Tirupati District (covers all sub-nodes)
    status: 'Active',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'OFF-WARD-01',
    name: 'R. Ramesh',
    email: 'ramesh.ward@ap.gov.in',
    phone: '9876543213',
    departmentId: 'dept_mun_ap',
    designationId: 'desig_ward_officer',
    designationTitle: 'Ward Administrative Officer',
    assignedNodeId: 'node_w14', // Ward 14
    status: 'Active',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'OFF-COMM-01',
    name: 'P. S. Murthy',
    email: 'psmurthy.mc@ap.gov.in',
    phone: '9876543214',
    departmentId: 'dept_mun_ap',
    designationId: 'desig_commissioner',
    designationTitle: 'Municipal Commissioner',
    assignedNodeId: 'node_tmc', // Tirupati Municipal Corp
    status: 'Active',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];
