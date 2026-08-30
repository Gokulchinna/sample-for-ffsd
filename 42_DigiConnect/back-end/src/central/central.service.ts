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

      return {
        ...state,
        departmentsCount: depts.length,
        jurisdictionNodesCount: nodes.length,
        stateAdmin: admin ? { id: admin.id, name: admin.name, email: admin.email } : null,
        totalApplications: stateApplications.length,
        totalRevenue,
      };
    });
  }

  /**
   * Get single state by ID.
   */
  getStateById(id: string): StateGovernment {
    const state = db.states.find((s) => s.id === id);
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
   * Delete / Deactivate State Government.
   */
  deleteState(id: string): { success: boolean; message: string } {
    const state = this.getStateById(id);

    // Deactivate state
    state.status = 'INACTIVE';

    // Log
    db.auditLogs.push({
      id: `AUD-${Date.now()}`,
      action: 'STATE_DEACTIVATED',
      actor: 'Central Government Admin',
      role: 'CENTRAL_ADMIN',
      date: new Date().toISOString(),
      details: `Deactivated State Government: ${state.name} (${state.code})`,
    });

    return {
      success: true,
      message: `State '${state.name}' deactivated successfully.`,
    };
  }

  /**
   * Central Government Revenue Analysis.
   * Aggregates revenue whenever citizens apply for paid services.
   */
  getStateWiseRevenue() {
    let nationalTotalRevenue = 0;
    let nationalPaidApplications = 0;
    let nationalTotalApplications = db.applications.length;

    const stateBreakdown = db.states.map((state) => {
      // Find all applications whose selected jurisdiction falls under this state
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

      nationalTotalRevenue += stateRevenue;
      nationalPaidApplications += paidCount;

      return {
        stateId: state.id,
        stateName: state.name,
        stateCode: state.code,
        totalApplications: stateApplications.length,
        paidApplications: paidCount,
        totalRevenue: stateRevenue,
        departmentsCount: db.departments.filter((d) => d.stateId === state.id).length,
      };
    });

    return {
      nationalTotalRevenue,
      nationalTotalApplications,
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
      totalCitizens: db.users.filter((u) => u.role === Role.CITIZEN || u.role === 'citizen').length,
      totalOfficers: db.officers.length,
      totalApplications: db.applications.length,
      totalRevenue: revenueData.nationalTotalRevenue,
      paidApplications: revenueData.nationalPaidApplications,
    };
  }
}
