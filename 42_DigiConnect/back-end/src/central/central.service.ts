import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { db } from '../data/store';
import { StateGovernment } from '../models/state.model';
import { JurisdictionNode } from '../models/jurisdiction.model';
import { User } from '../models/user.model';
import { Role } from '../models/enums';
import { CreateStateDto } from './dto/create-state.dto';

const SEED_STATE_METRICS: Record<string, {
  apps: number;
  revenue: number;
  completed: number;
  pending: number;
  inProgress: number;
  rejected: number;
  queryRaised: number;
  grievances: number;
  departments: number;
  officers: number;
  citizens: number;
  districts: number;
  subDivisions: number;
  mandals: number;
  villages: number;
  municipalities: number;
  wards: number;
}> = {
  AP: {
    apps: 8420,
    revenue: 425000,
    completed: 5900,
    pending: 1650,
    inProgress: 1095,
    rejected: 580,
    queryRaised: 290,
    grievances: 1250,
    departments: 12,
    officers: 420,
    citizens: 35820,
    districts: 26,
    subDivisions: 68,
    mandals: 679,
    villages: 14200,
    municipalities: 124,
    wards: 3400,
  },
  KA: {
    apps: 7820,
    revenue: 390000,
    completed: 5400,
    pending: 1580,
    inProgress: 980,
    rejected: 550,
    queryRaised: 290,
    grievances: 1180,
    departments: 12,
    officers: 390,
    citizens: 32844,
    districts: 31,
    subDivisions: 52,
    mandals: 240,
    villages: 29340,
    municipalities: 281,
    wards: 4200,
  },
  TN: {
    apps: 5980,
    revenue: 295000,
    completed: 4200,
    pending: 1210,
    inProgress: 760,
    rejected: 410,
    queryRaised: 160,
    grievances: 890,
    departments: 12,
    officers: 360,
    citizens: 25116,
    districts: 38,
    subDivisions: 87,
    mandals: 313,
    villages: 16500,
    municipalities: 150,
    wards: 3800,
  },
  KL: {
    apps: 1980,
    revenue: 98000,
    completed: 1480,
    pending: 360,
    inProgress: 240,
    rejected: 100,
    queryRaised: 40,
    grievances: 290,
    departments: 12,
    officers: 280,
    citizens: 8316,
    districts: 14,
    subDivisions: 27,
    mandals: 77,
    villages: 1664,
    municipalities: 87,
    wards: 2100,
  },
};

@Injectable()
export class CentralService {
  /**
   * List all states with summary metrics.
   */
  listStates() {
    return db.states.map((state) => {
      const depts = db.departments.filter((d) => d.stateId === state.id);
      const nodes = db.jurisdictionNodes.filter((n) => n.stateId === state.id);
      const admin = db.users.find((u) => u.id === state.stateAdminId);

      // Revenue computation for this state
      const stateApplications = db.applications.filter((app) => {
        const leafNode = db.jurisdictionNodes.find((n) => n.id === app.jurisdiction || n.id === (app as any).selectedJurisdictionNodeId);
        return leafNode ? leafNode.stateId === state.id : false;
      });

      const totalRevenue = stateApplications.reduce((acc, a) => {
        const isPaid = a.paymentStatus === 'PAID' || a.paymentStatus === 'completed' || a.paymentStatus === 'SUCCESS';
        return isPaid ? acc + (Number(a.fee) || 0) : acc;
      }, 0);

      const seed = SEED_STATE_METRICS[state.code];
      const stateCitizens = db.users.filter((u) => u.role === Role.CITIZEN && (u.state === state.name || (u as any).stateId === state.id));

      const finalApps = (seed?.apps || 0) + stateApplications.length;
      const finalRevenue = (seed?.revenue || 0) + totalRevenue;
      const finalCitizens = (seed?.citizens || 0) + stateCitizens.length;
      const finalDepts = seed ? Math.max(depts.length, seed.departments) : depts.length;

      return {
        ...state,
        departmentsCount: finalDepts,
        jurisdictionNodesCount: nodes.length,
        stateAdmin: admin ? { id: admin.id, name: admin.name, email: admin.email } : null,
        citizensCount: finalCitizens,
        totalApplications: finalApps,
        totalRevenue: finalRevenue,
      };
    });
  }

  /**
   * Get single state by ID.
   */
  getStateById(id: string): StateGovernment {
    const state = db.states.find((s) => s.id === id || s.code.toUpperCase() === id.toUpperCase());
    if (!state) {
      throw new NotFoundException(`State '${id}' not found.`);
    }
    return state;
  }

  /**
   * Central Government creates a new State Government.
   * STRICT RULE: Only ONE State Government/Admin may exist for one state.
   */
  createState(dto: CreateStateDto): StateGovernment {
    const nameTrimmed = dto.name.trim();
    const codeUpper = dto.code.trim().toUpperCase();

    // Check duplicate name or code
    const duplicate = db.states.find(
      (s) => s.name.toLowerCase() === nameTrimmed.toLowerCase() || s.code.toUpperCase() === codeUpper,
    );
    if (duplicate) {
      throw new ConflictException(
        `A state with name '${nameTrimmed}' or code '${codeUpper}' already exists.`,
      );
    }

    const stateId = `state_${codeUpper.toLowerCase()}`;
    const rootNodeId = `node_${codeUpper.toLowerCase()}`;

    // 1. Create root JurisdictionNode for the State
    const rootNode: JurisdictionNode = {
      id: rootNodeId,
      stateId: stateId,
      parentId: null, // Root node
      name: nameTrimmed,
      governanceType: 'COMMON',
      tierLevel: 'STATE',
      code: codeUpper,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.jurisdictionNodes.push(rootNode);

    // 2. Create the Single State Admin User
    const adminId = `USR-SA-${codeUpper}`;
    const adminUser: User = {
      id: adminId,
      name: dto.stateAdminName || `${nameTrimmed} State Administrator`,
      email: dto.stateAdminEmail || `admin@${codeUpper.toLowerCase()}.gov.in`,
      phone: '9876543200',
      aadhaar: '895421670000',
      role: Role.STATE_ADMIN,
      state: nameTrimmed,
      status: 'Active',
      joinedDate: new Date().toISOString(),
    };
    db.users.push(adminUser);

    // 3. Register State
    const newState: StateGovernment = {
      id: stateId,
      name: nameTrimmed,
      code: codeUpper,
      rootNodeId: rootNodeId,
      stateAdminId: adminId,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
    db.states.push(newState);

    // 4. Audit Log
    db.auditLogs.push({
      id: `AUD-${Date.now()}`,
      action: 'STATE_CREATED',
      actor: 'Central Government Admin',
      role: 'CENTRAL_ADMIN',
      date: new Date().toISOString(),
      details: `Created new State Government: ${nameTrimmed} (${codeUpper}) with root node ${rootNodeId}`,
    });

    return newState;
  }

  /**
   * Update State Government metadata
   */
  updateState(id: string, dto: { name?: string; code?: string; stateAdminName?: string; stateAdminEmail?: string }): StateGovernment {
    const state = this.getStateById(id);
    if (dto.name) state.name = dto.name.trim();
    if (dto.code) state.code = dto.code.trim().toUpperCase();

    if (dto.stateAdminName || dto.stateAdminEmail) {
      const admin = this.getOrCreateStateAdmin(state);
      if (dto.stateAdminName) admin.name = dto.stateAdminName.trim();
      if (dto.stateAdminEmail) admin.email = dto.stateAdminEmail.trim();
    }

    db.auditLogs.push({
      id: `AUD-${Date.now()}`,
      action: 'STATE_UPDATED',
      actor: 'Central Government Admin',
      role: 'CENTRAL_ADMIN',
      date: new Date().toISOString(),
      details: `Updated State Government '${state.name}' (${state.code})`,
    });

    return state;
  }

  /**
   * Toggle State Government Active / Inactive
   */
  setStateStatus(id: string, status: 'ACTIVE' | 'INACTIVE'): { success: boolean; state: StateGovernment } {
    const state = this.getStateById(id);
    state.status = status;

    db.auditLogs.push({
      id: `AUD-${Date.now()}`,
      action: status === 'ACTIVE' ? 'STATE_ACTIVATED' : 'STATE_DEACTIVATED',
      actor: 'Central Government Admin',
      role: 'CENTRAL_ADMIN',
      date: new Date().toISOString(),
      details: `${status === 'ACTIVE' ? 'Activated' : 'Deactivated'} State Government '${state.name}' (${state.code})`,
    });

    return { success: true, state };
  }

  /**
   * Helper to ensure a State Admin User object exists for a state
   */
  private getOrCreateStateAdmin(state: StateGovernment): User {
    let admin = db.users.find((u) => u.id === state.stateAdminId);
    if (!admin) {
      const code = state.code.toUpperCase();
      admin = {
        id: state.stateAdminId || `USR-SA-${code}`,
        name: `${state.name} State Administrator`,
        email: `admin@${code.toLowerCase()}.gov.in`,
        phone: '+91 98765 43200',
        aadhaar: '895421670000',
        role: Role.STATE_ADMIN,
        state: state.name,
        status: 'Active',
        joinedDate: state.createdAt || '2026-01-01T00:00:00.000Z',
      };
      state.stateAdminId = admin.id;
      db.users.push(admin);
    }
    return admin;
  }

  /**
   * Toggle State Admin User Active / Inactive
   */
  setStateAdminStatus(id: string, status: 'Active' | 'Inactive'): { success: boolean; user: User } {
    const state = this.getStateById(id);
    const admin = this.getOrCreateStateAdmin(state);
    admin.status = status;

    db.auditLogs.push({
      id: `AUD-${Date.now()}`,
      action: status === 'Active' ? 'STATE_ADMIN_ACTIVATED' : 'STATE_ADMIN_DEACTIVATED',
      actor: 'Central Government Admin',
      role: 'CENTRAL_ADMIN',
      date: new Date().toISOString(),
      details: `${status === 'Active' ? 'Activated' : 'Deactivated'} State Admin account for '${state.name}' (${admin.name})`,
    });

    return { success: true, user: admin };
  }

  /**
   * Reset State Admin Credentials
   */
  resetStateAdminPassword(id: string): { success: boolean; message: string; tempPass: string } {
    const state = this.getStateById(id);
    const admin = this.getOrCreateStateAdmin(state);

    const tempPass = `Gov@${state.code}${Math.floor(1000 + Math.random() * 9000)}`;

    db.auditLogs.push({
      id: `AUD-${Date.now()}`,
      action: 'STATE_ADMIN_CREDENTIALS_RESET',
      actor: 'Central Government Admin',
      role: 'CENTRAL_ADMIN',
      date: new Date().toISOString(),
      details: `Reset credentials for State Admin (${admin.name}) of '${state.name}'`,
    });

    return {
      success: true,
      message: `Temporary credentials generated for ${admin.name}.`,
      tempPass,
    };
  }

  /**
   * Complete Monitoring Details for a Single State Government
   */
  getStateDetails(id: string) {
    const state = this.getStateById(id);
    const admin = this.getOrCreateStateAdmin(state);
    const nodes = db.jurisdictionNodes.filter((n) => n.stateId === state.id);
    const depts = db.departments.filter((d) => d.stateId === state.id);

    // Detailed departments overview
    const departmentsDetail = depts.map((d) => {
      const head = db.users.find((u) => u.id === (d as any).headId || (u.role === Role.DEPARTMENT_HEAD && (u as any).departmentId === d.id));
      const services = db.services.filter((s) => (s as any).departmentId === d.id);
      const officers = db.officers.filter((o) => o.departmentId === d.id);
      return {
        id: d.id,
        name: d.name,
        code: d.code,
        headName: head ? head.name : `${d.name} Director IAS`,
        headEmail: head ? head.email : `head.${d.code.toLowerCase()}@${state.code.toLowerCase()}.gov.in`,
        servicesCount: services.length || 6,
        officersCount: officers.length || 45,
        status: d.status || 'Active',
      };
    });

    // Jurisdiction counts by tier
    const districts = nodes.filter((n) => (n.tierLevel as string) === 'DISTRICT');
    const subDivisions = nodes.filter((n) => (n.tierLevel as string) === 'SUB_DIVISION');
    const mandals = nodes.filter((n) => (n.tierLevel as string) === 'MANDAL' || (n.tierLevel as string) === 'TALUK');
    const villages = nodes.filter((n) => (n.tierLevel as string) === 'VILLAGE' || (n.tierLevel as string) === 'GRAM_PANCHAYAT');
    const municipalities = nodes.filter((n) => (n.tierLevel as string) === 'MUNICIPALITY' || (n.tierLevel as string) === 'CORPORATION');
    const wards = nodes.filter((n) => (n.tierLevel as string) === 'WARD' || (n.tierLevel as string) === 'ZONE');

    // Applications & Revenue
    const stateApplications = db.applications.filter((app) => {
      const leafId = app.jurisdiction || (app as any).selectedJurisdictionNodeId;
      const leaf = db.jurisdictionNodes.find((n) => n.id === leafId);
      return leaf ? leaf.stateId === state.id : false;
    });

    let totalRevenue = 0;
    let submitted = 0;
    let inProgress = 0;
    let pending = 0;
    let completed = 0;
    let rejected = 0;
    let queryRaised = 0;

    stateApplications.forEach((a) => {
      const isPaid = a.paymentStatus === 'PAID' || a.paymentStatus === 'completed' || a.paymentStatus === 'SUCCESS';
      if (isPaid) totalRevenue += Number(a.fee) || 0;
      const st = String((a as any).currentStatus || a.status || '').toLowerCase();
      if (st.includes('completed') || st.includes('approved')) completed++;
      else if (st.includes('reject')) rejected++;
      else if (st.includes('query')) queryRaised++;
      else if (st.includes('progress') || st.includes('review')) inProgress++;
      else pending++;
      submitted++;
    });

    const seed = SEED_STATE_METRICS[state.code];
    const stateCitizens = db.users.filter((u) => u.role === Role.CITIZEN && (u.state === state.name || (u as any).stateId === state.id));
    const stateOfficers = db.officers.filter((o) => {
      const dept = db.departments.find((d) => d.id === o.departmentId);
      return dept ? dept.stateId === state.id : false;
    });
    const stateServices = db.services.filter((s) => {
      const dept = db.departments.find((d) => d.id === (s as any).departmentId);
      return dept ? dept.stateId === state.id : false;
    });

    const finalApps = (seed?.apps || 0) + submitted;
    const finalRevenue = (seed?.revenue || 0) + totalRevenue;
    const finalCitizens = (seed?.citizens || 0) + stateCitizens.length;
    const finalDepts = seed ? Math.max(depts.length, seed.departments) : depts.length;
    const finalOfficers = seed ? Math.max(stateOfficers.length, seed.officers) : stateOfficers.length;
    const finalServices = seed ? 86 : stateServices.length;

    const recentActivity = db.auditLogs
      .filter((l) => l.details?.includes(state.name) || l.details?.includes(state.code) || l.actor?.includes(state.name))
      .slice(0, 10);

    return {
      state,
      stateAdmin: admin ? {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone || '+91 98765 43200',
        username: `sa_${state.code.toLowerCase()}`,
        role: 'State Government Administrator',
        status: admin.status || 'Active',
        joinedDate: admin.joinedDate || state.createdAt,
      } : {
        id: `USR-SA-${state.code}`,
        name: `${state.name} State Administrator`,
        email: `admin@${state.code.toLowerCase()}.gov.in`,
        phone: '+91 98765 43200',
        username: `sa_${state.code.toLowerCase()}`,
        role: 'State Government Administrator',
        status: 'Active',
        joinedDate: state.createdAt,
      },
      summary: {
        totalCitizens: finalCitizens,
        totalApplications: finalApps,
        totalRevenue: finalRevenue,
        serviceFees: Math.round(finalRevenue * 0.9),
        platformFees: Math.round(finalRevenue * 0.1),
        avgRevenuePerApp: finalApps > 0 ? Math.round(finalRevenue / finalApps) : 0,
        totalDepartments: finalDepts,
        totalOfficers: finalOfficers,
        totalServices: finalServices,
        totalGrievances: seed?.grievances || 0,
      },
      jurisdiction: {
        districtsCount: seed ? Math.max(districts.length, seed.districts) : districts.length,
        subDivisionsCount: seed ? Math.max(subDivisions.length, seed.subDivisions) : subDivisions.length,
        mandalsCount: seed ? Math.max(mandals.length, seed.mandals) : mandals.length,
        villagesCount: seed ? Math.max(villages.length, seed.villages) : villages.length,
        municipalitiesCount: seed ? Math.max(municipalities.length, seed.municipalities) : municipalities.length,
        wardsCount: seed ? Math.max(wards.length, seed.wards) : wards.length,
      },
      departments: departmentsDetail.length > 0 ? departmentsDetail : (seed ? [
        { id: `dept_rev_${state.code.toLowerCase()}`, name: 'Revenue & Disaster Management', code: 'REV', headName: 'Dr. B. R. Ambedkar IAS', headEmail: `director.rev@${state.code.toLowerCase()}.gov.in`, servicesCount: 8, officersCount: 120, status: 'Active' },
        { id: `dept_trans_${state.code.toLowerCase()}`, name: 'Transport & Road Safety', code: 'TRANS', headName: 'Suresh Rao IAS', headEmail: `comm.trans@${state.code.toLowerCase()}.gov.in`, servicesCount: 5, officersCount: 80, status: 'Active' },
        { id: `dept_mun_${state.code.toLowerCase()}`, name: 'Municipal Administration & Urban Development', code: 'MAUD', headName: 'Anil Kumar IAS', headEmail: `director.maud@${state.code.toLowerCase()}.gov.in`, servicesCount: 6, officersCount: 95, status: 'Active' },
        { id: `dept_agri_${state.code.toLowerCase()}`, name: 'Agriculture & Farmers Welfare', code: 'AGRI', headName: 'P. Lakshmi Devi IAS', headEmail: `director.agri@${state.code.toLowerCase()}.gov.in`, servicesCount: 7, officersCount: 110, status: 'Active' },
      ] : []),
      services: {
        total: finalServices,
        active: seed ? 79 : stateServices.filter(s => (s as any).status !== 'INACTIVE').length,
        suspended: seed ? 7 : stateServices.filter(s => (s as any).status === 'INACTIVE').length,
      },
      officers: {
        total: finalOfficers,
        active: seed ? Math.round(finalOfficers * 0.93) : stateOfficers.filter(o => (o as any).status !== 'INACTIVE').length,
        suspended: seed ? Math.round(finalOfficers * 0.07) : stateOfficers.filter(o => (o as any).status === 'INACTIVE').length,
        designations: seed ? [
          { title: 'Village Revenue Officer (VRO)', count: 240 },
          { title: 'Mandal Revenue Officer / Tahsildar (MRO)', count: 95 },
          { title: 'Revenue Divisional Officer (RDO)', count: 45 },
          { title: 'Joint Collector / District Officer', count: 40 },
        ] : [],
      },
      applications: {
        total: finalApps,
        submitted: finalApps,
        inProgress: (seed?.inProgress || 0) + inProgress,
        pending: (seed?.pending || 0) + pending,
        completed: (seed?.completed || 0) + completed,
        rejected: (seed?.rejected || 0) + rejected,
        queryRaised: (seed?.queryRaised || 0) + queryRaised,
      },
      grievances: {
        total: seed?.grievances || 0,
        pending: Math.round((seed?.grievances || 0) * 0.23),
        inProgress: Math.round((seed?.grievances || 0) * 0.07),
        resolved: Math.round((seed?.grievances || 0) * 0.65),
        escalated: Math.round((seed?.grievances || 0) * 0.05),
      },
      recentActivity: recentActivity.length > 0 ? recentActivity : (seed ? [
        { id: 'ACT-1', action: 'STATE_ADMIN_LOGGED_IN', actor: 'State Admin', date: new Date(Date.now() - 3600000 * 2).toISOString(), details: 'State Admin updated Revenue Department configuration' },
        { id: 'ACT-2', action: 'DEPARTMENT_CREATED', actor: 'State Admin', date: new Date(Date.now() - 86400000).toISOString(), details: 'New department Agriculture & Cooperation created' },
        { id: 'ACT-3', action: 'WORKFLOW_UPDATED', actor: 'Department Head (REV)', date: new Date(Date.now() - 86400000 * 2).toISOString(), details: 'Integrated Caste & Income Certificate workflow updated' },
        { id: 'ACT-4', action: 'JURISDICTION_TREE_SYNC', actor: 'State Admin', date: new Date(Date.now() - 86400000 * 3).toISOString(), details: 'Tirupati Revenue Division nodes validated' },
      ] : [
        { id: 'ACT-INIT', action: 'STATE_CREATED', actor: 'Central Admin', date: state.createdAt || new Date().toISOString(), details: `State Government '${state.name}' and State Administrator initialized` }
      ]),
    };
  }

  /**
   * Delete / Deactivate State Government.
   */
  deleteState(id: string): { success: boolean; message: string } {
    const state = this.getStateById(id);
    state.status = 'INACTIVE';

    db.auditLogs.push({
      id: `AUD-${Date.now()}`,
      action: 'STATE_DEACTIVATED',
      actor: 'Central Administrator',
      role: 'CENTRAL_ADMIN',
      date: new Date().toISOString(),
      details: `Deactivated State Government: ${state.name} (${state.code})`,
    });

    return {
      success: true,
      message: `State Government '${state.name}' (${state.code}) deactivated successfully.`,
    };
  }

  /**
   * State-wise Revenue Aggregation
   */
  getStateWiseRevenue() {
    let nationalTotalRevenue = 0;
    let nationalPaidApplications = 0;
    let nationalTotalApplications = db.applications.length;

    const stateBreakdown = db.states.map((state) => {
      const stateApplications = db.applications.filter((app) => {
        const leafId = app.jurisdiction || (app as any).selectedJurisdictionNodeId;
        const leaf = db.jurisdictionNodes.find((n) => n.id === leafId);
        return leaf ? leaf.stateId === state.id : false;
      });

      let stateRevenue = 0;
      let paidCount = 0;

      stateApplications.forEach((app) => {
        const isPaid = app.paymentStatus === 'PAID' || app.paymentStatus === 'completed' || app.paymentStatus === 'SUCCESS';
        if (isPaid) {
          stateRevenue += Number(app.fee) || 0;
          paidCount += 1;
        }
      });

      const seed = SEED_STATE_METRICS[state.code];
      const finalRevenue = (seed?.revenue || 0) + stateRevenue;
      const finalPaidCount = paidCount + (seed ? Math.round(seed.revenue / 50) : 0);
      const finalApps = (seed?.apps || 0) + stateApplications.length;

      nationalTotalRevenue += finalRevenue;
      nationalPaidApplications += finalPaidCount;

      return {
        stateId: state.id,
        stateName: state.name,
        stateCode: state.code,
        totalApplications: finalApps,
        paidApplications: finalPaidCount,
        totalRevenue: finalRevenue,
        departmentsCount: seed ? Math.max(db.departments.filter((d) => d.stateId === state.id).length, seed.departments) : db.departments.filter((d) => d.stateId === state.id).length,
      };
    });

    return {
      nationalTotalRevenue,
      nationalTotalApplications: nationalTotalApplications || 24200,
      nationalPaidApplications,
      statesCount: db.states.length,
      stateBreakdown,
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * National Overall KPI Overview
   */
  getNationalMetrics() {
    const revenueData = this.getStateWiseRevenue();
    return {
      totalStates: db.states.length,
      totalDepartments: db.departments.length || 24,
      totalCitizens: db.users.filter((u) => u.role === Role.CITIZEN || (u.role as string) === 'citizen').length || 124560,
      totalOfficers: db.officers.length || 420,
      totalApplications: db.applications.length || 24200,
      totalRevenue: revenueData.nationalTotalRevenue,
      paidApplications: revenueData.nationalPaidApplications,
    };
  }
}
