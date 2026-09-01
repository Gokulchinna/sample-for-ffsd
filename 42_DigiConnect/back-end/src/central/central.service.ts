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
  services: number;
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
    grievances: 1240,
    departments: 2,
    services: 6,
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
    departments: 2,
    services: 6,
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
    departments: 2,
    services: 6,
    officers: 360,
    citizens: 28910,
    districts: 38,
    subDivisions: 87,
    mandals: 310,
    villages: 15979,
    municipalities: 150,
    wards: 3800,
  },
  KL: {
    apps: 4210,
    revenue: 210000,
    completed: 3100,
    pending: 820,
    inProgress: 510,
    rejected: 290,
    queryRaised: 110,
    grievances: 640,
    departments: 2,
    services: 6,
    officers: 310,
    citizens: 22100,
    districts: 14,
    subDivisions: 27,
    mandals: 78,
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
      const finalDepts = depts.length;

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

    let totalPaidRevenue = 0;
    let submitted = 0;
    let inProgress = 0;
    let pending = 0;
    let completed = 0;
    let rejected = 0;
    let queryRaised = 0;

    stateApplications.forEach((a) => {
      const isPaid = a.paymentStatus === 'PAID' || a.paymentStatus === 'completed' || a.paymentStatus === 'SUCCESS';
      if (isPaid) totalPaidRevenue += Number(a.fee) || 0;
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
    const stateGrievances = db.grievances.filter((g) => {
      return (g as any).stateId === state.id || depts.some((d) => d.id === (g as any).departmentId || d.name === (g as any).dept);
    });

    const finalApps = (seed?.apps || 8420) + stateApplications.length;
    const finalRevenue = (seed?.revenue || 425000) + totalPaidRevenue;
    const finalCitizens = (seed?.citizens || 35820) + stateCitizens.length;
    const finalDepts = depts.length;
    const finalServices = stateServices.length > 0 ? stateServices.length : (seed?.services || 6);
    const initialOfficersBaseline = 4;
    const finalOfficers = (seed?.officers || 420) + (stateOfficers.length > initialOfficersBaseline ? stateOfficers.length - initialOfficersBaseline : 0);
    const finalGrievances = (seed?.grievances || 1240) + stateGrievances.length;

    // Detailed departments overview with exact reconciled sums
    const departmentsDetail = depts.map((d) => {
      const head = db.users.find((u) => u.id === (d as any).headId || (d as any).headUserId === u.id || (u.role === Role.DEPARTMENT_HEAD && (u as any).departmentId === d.id));
      const deptServices = db.services.filter((s) => (s as any).departmentId === d.id || (s as any).dept === d.name);
      const deptOfficers = db.officers.filter((o) => o.departmentId === d.id);

      const isRev = d.code?.includes('REV') || d.name?.includes('Revenue');
      const isWel = d.code?.includes('WEL') || d.name?.includes('Welfare') || d.code?.includes('EDU');

      const baseDeptApps = isRev ? 5200 : (isWel ? 3220 : 0);
      const baseDeptRev = isRev ? 265000 : (isWel ? 160000 : 0);
      const baseDeptGrv = isRev ? 770 : (isWel ? 470 : 0);
      const baseDeptOfficers = isRev ? 230 : (isWel ? 190 : 0);

      const liveDeptApps = stateApplications.filter((a) => (a as any).departmentId === d.id || a.dept === d.name);
      const liveDeptRev = liveDeptApps.reduce((sum, a) => {
        const isPaid = a.paymentStatus === 'PAID' || a.paymentStatus === 'completed' || a.paymentStatus === 'SUCCESS';
        return isPaid ? sum + (Number(a.fee) || 0) : sum;
      }, 0);
      const liveDeptGrv = stateGrievances.filter((g) => (g as any).departmentId === d.id || (g as any).dept === d.name);

      const deptTotalApps = baseDeptApps + liveDeptApps.length;
      const deptTotalRev = baseDeptRev + liveDeptRev;
      const deptTotalGrv = baseDeptGrv + liveDeptGrv.length;
      const deptOfficersCount = baseDeptOfficers + (deptOfficers.length > 2 ? deptOfficers.length - 2 : 0);

      const deptPending = Math.round(deptTotalApps * 0.196);
      const deptCompleted = deptTotalApps - deptPending;
      const resolutionRate = deptTotalApps > 0 ? Math.round((deptCompleted / deptTotalApps) * 100) : 100;

      return {
        id: d.id,
        name: d.name,
        code: d.code,
        headName: head ? head.name : (isRev ? 'Dr. B. R. Ambedkar IAS' : (isWel ? 'Sri K. Harshavardhan IAS' : `${d.name} Director IAS`)),
        headEmail: head ? head.email : `head.${d.code.toLowerCase()}@${state.code.toLowerCase()}.gov.in`,
        servicesCount: deptServices.length > 0 ? deptServices.length : 3,
        officersCount: deptOfficersCount,
        applicationsCount: deptTotalApps,
        pendingCount: deptPending,
        completedCount: deptCompleted,
        revenue: deptTotalRev,
        grievancesCount: deptTotalGrv,
        resolutionRate,
        status: d.status || 'Active',
      };
    });

    const recentActivity = db.auditLogs
      .filter((l) => l.details?.includes(state.name) || l.details?.includes(state.code) || l.actor?.includes(state.name))
      .slice(0, 10);

    const monthlyTrend = [
      { month: 'Jan', count: 1120 },
      { month: 'Feb', count: 1240 },
      { month: 'Mar', count: 1380 },
      { month: 'Apr', count: 1460 },
      { month: 'May', count: 1580 },
      { month: 'Jun', count: 1640 + stateApplications.length },
    ];

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
        totalGrievances: finalGrievances,
      },
      jurisdiction: {
        districtsCount: districts.length,
        subDivisionsCount: subDivisions.length,
        mandalsCount: mandals.length,
        villagesCount: villages.length,
        municipalitiesCount: municipalities.length,
        wardsCount: wards.length,
      },
      departments: departmentsDetail,
      services: {
        total: finalServices,
        active: finalServices,
        suspended: 0,
        byDepartment: departmentsDetail.map((d) => ({
          departmentId: d.id,
          departmentName: d.name,
          count: d.servicesCount,
        })),
      },
      officers: {
        total: finalOfficers,
        active: Math.round(finalOfficers * 0.95),
        suspended: Math.round(finalOfficers * 0.05),
        byDepartment: departmentsDetail.map((d) => ({
          departmentId: d.id,
          departmentName: d.name,
          count: d.officersCount,
        })),
        designations: [
          { title: 'Village Revenue Officer (VRO)', count: 240 },
          { title: 'Mandal Educational Officer (MEO)', count: 95 },
          { title: 'Revenue Divisional Officer (RDO)', count: 45 },
          { title: 'District Educational Officer (DEO)', count: 40 },
        ],
      },
      applications: {
        total: finalApps,
        submitted: finalApps,
        inProgress: (seed?.inProgress || 1095) + inProgress,
        pending: (seed?.pending || 1650) + pending,
        completed: (seed?.completed || 5900) + completed,
        rejected: (seed?.rejected || 580) + rejected,
        queryRaised: (seed?.queryRaised || 290) + queryRaised,
        monthlyTrend,
      },
      grievances: {
        total: finalGrievances,
        pending: Math.round(finalGrievances * 0.25),
        inProgress: Math.round(finalGrievances * 0.15),
        resolved: Math.round(finalGrievances * 0.56),
        escalated: Math.round(finalGrievances * 0.04),
        reverificationCount: Math.round(finalGrievances * 0.08),
        overruleCount: Math.round(finalGrievances * 0.03),
        byDepartment: departmentsDetail.map((d) => ({
          departmentId: d.id,
          departmentName: d.name,
          count: d.grievancesCount,
        })),
      },
      recentActivity: recentActivity.length > 0 ? recentActivity : [
        { id: 'ACT-1', action: 'STATE_ADMIN_LOGGED_IN', actor: 'State Admin', date: new Date(Date.now() - 3600000 * 2).toISOString(), details: 'State Admin verified School Education Department configuration' },
        { id: 'ACT-2', action: 'DEPARTMENT_VERIFIED', actor: 'State Admin', date: new Date(Date.now() - 86400000).toISOString(), details: 'Secretariat verified 2 active State Departments' },
        { id: 'ACT-3', action: 'WORKFLOW_UPDATED', actor: 'Department Head (REV)', date: new Date(Date.now() - 86400000 * 2).toISOString(), details: 'Integrated Community & Nativity Certificate workflow active' },
        { id: 'ACT-4', action: 'JURISDICTION_TREE_SYNC', actor: 'State Admin', date: new Date(Date.now() - 86400000 * 3).toISOString(), details: 'Tirupati Revenue Sub-Division nodes validated' },
      ],
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
        departmentsCount: db.departments.filter((d) => d.stateId === state.id).length,
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
      totalDepartments: db.departments.length,
      totalCitizens: db.users.filter((u) => u.role === Role.CITIZEN || (u.role as string) === 'citizen').length || 124560,
      totalOfficers: db.officers.length || 420,
      totalApplications: db.applications.length || 24200,
      totalRevenue: revenueData.nationalTotalRevenue,
      paidApplications: revenueData.nationalPaidApplications,
    };
  }
}
