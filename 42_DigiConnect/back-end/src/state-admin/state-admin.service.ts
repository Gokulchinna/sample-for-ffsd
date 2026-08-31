import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { db } from '../data/store';
import { Department } from '../models/department.model';
import { User } from '../models/user.model';
import { Role, AppStatus, GrievanceStatus } from '../models/enums';
import {
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from './dto/create-department.dto';
import { ConfigureGrievanceCellDto } from './dto/create-grievance-cell.dto';
import { CentralService } from '../central/central.service';

export interface GrievanceCellConfig {
  id: string;
  stateId: string;
  departmentId: string;
  cellName: string;
  workflowSteps: {
    stepNumber: number;
    roleTitle: string;
    jurisdictionTier: string;
    assignedOfficerId?: string;
  }[];
  createdAt: string;
}

@Injectable()
export class StateAdminService {
  constructor(private readonly centralService: CentralService) {}

  // In-memory store for department grievance cells
  private grievanceCells: GrievanceCellConfig[] = [
    {
      id: 'cell_rev_ap',
      stateId: 'state_ap',
      departmentId: 'dept_rev_ap',
      cellName: 'Revenue Department Grievance Redressal Cell',
      workflowSteps: [
        {
          stepNumber: 1,
          roleTitle: 'Sub-Division Grievance Officer',
          jurisdictionTier: 'SUB_DIVISION',
          assignedOfficerId: 'GO-RSD-01',
        },
        {
          stepNumber: 2,
          roleTitle: 'District Grievance Officer',
          jurisdictionTier: 'DISTRICT',
          assignedOfficerId: 'GO-DIST-01',
        },
        {
          stepNumber: 3,
          roleTitle: 'State Grievance Officer',
          jurisdictionTier: 'STATE',
          assignedOfficerId: 'GO-STATE-01',
        },
      ],
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'cell_mun_ap',
      stateId: 'state_ap',
      departmentId: 'dept_mun_ap',
      cellName: 'Municipal Grievance Redressal Cell',
      workflowSteps: [
        {
          stepNumber: 1,
          roleTitle: 'Municipal Grievance Officer',
          jurisdictionTier: 'MUNICIPALITY',
          assignedOfficerId: 'GO-MUN-01',
        },
        {
          stepNumber: 2,
          roleTitle: 'District Urban Grievance Officer',
          jurisdictionTier: 'DISTRICT',
          assignedOfficerId: 'GO-DIST-01',
        },
      ],
      createdAt: '2026-01-01T00:00:00.000Z',
    },
  ];

  /**
   * List departments in a state.
   */
  listDepartments(stateId: string) {
    return db.departments
      .filter((d) => !stateId || d.stateId === stateId)
      .map((dept) => {
        const head = db.users.find((u) => u.id === dept.headUserId);
        const servicesCount = db.services.filter((s) => (s as any).departmentId === dept.id || s.dept === dept.name).length;
        const officersCount = db.officers.filter((o) => o.departmentId === dept.id).length;
        const designationsCount = db.designations.filter((d) => d.departmentId === dept.id).length;
        const grievanceCell = this.grievanceCells.find((c) => c.departmentId === dept.id);

        return {
          ...dept,
          headUser: head ? { id: head.id, name: head.name, email: head.email } : null,
          servicesCount,
          officersCount,
          designationsCount,
          hasGrievanceCell: !!grievanceCell,
        };
      });
  }

  /**
   * Get single department by ID.
   */
  getDepartmentById(id: string): Department {
    const dept = db.departments.find((d) => d.id === id);
    if (!dept) {
      throw new NotFoundException(`Department '${id}' not found.`);
    }
    return dept;
  }

  /**
   * State Admin creates department and appoints Department Head.
   */
  createDepartment(dto: CreateDepartmentDto): Department {
    const state = db.states.find((s) => s.id === dto.stateId);
    if (!state) {
      throw new NotFoundException(`State '${dto.stateId}' does not exist.`);
    }

    const duplicate = db.departments.find(
      (d) =>
        d.stateId === dto.stateId &&
        (d.name.toLowerCase() === dto.name.trim().toLowerCase() ||
          d.code.toUpperCase() === dto.code.trim().toUpperCase()),
    );
    if (duplicate) {
      throw new ConflictException(
        `A department with name '${dto.name}' or code '${dto.code}' already exists in this state.`,
      );
    }

    const deptId = `dept_${dto.code.trim().toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const headUserId = `USR-DH-${Date.now().toString().slice(-4)}`;

    // Create Department Head User
    const headUser: User = {
      id: headUserId,
      name: dto.headUserName || `${dto.name} Department Head`,
      email: dto.headUserEmail || `head.${dto.code.toLowerCase()}@${state.code.toLowerCase()}.gov.in`,
      phone: '9876543201',
      aadhaar: '895421670001',
      role: Role.DEPARTMENT_HEAD,
      dept: dto.name.trim(),
      state: state.name,
      status: 'Active',
      joinedDate: new Date().toISOString(),
    };
    db.users.push(headUser);

    const newDept: Department = {
      id: deptId,
      stateId: dto.stateId,
      name: dto.name.trim(),
      code: dto.code.trim().toUpperCase(),
      description: dto.description || `${dto.name} Line Department for ${state.name}`,
      headUserId: headUserId,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
    db.departments.push(newDept);

    // Auto-create default Grievance Cell for this department
    const grievanceCell: GrievanceCellConfig = {
      id: `cell_${deptId}`,
      stateId: dto.stateId,
      departmentId: deptId,
      cellName: `${dto.name} Grievance Redressal Cell`,
      workflowSteps: [
        {
          stepNumber: 1,
          roleTitle: `${dto.name} District Grievance Officer`,
          jurisdictionTier: 'DISTRICT',
        },
        {
          stepNumber: 2,
          roleTitle: `${dto.name} State Appellate Authority`,
          jurisdictionTier: 'STATE',
        },
      ],
      createdAt: new Date().toISOString(),
    };
    this.grievanceCells.push(grievanceCell);

    // Audit Log
    db.auditLogs.push({
      id: `AUD-${Date.now()}`,
      action: 'DEPARTMENT_CREATED',
      actor: `State Admin (${state.code})`,
      role: 'STATE_ADMIN',
      date: new Date().toISOString(),
      details: `Created department '${newDept.name}' and initialized default grievance cell.`,
    });

    return newDept;
  }

  /**
   * Update department name or description.
   */
  updateDepartment(id: string, dto: UpdateDepartmentDto): Department {
    const dept = this.getDepartmentById(id);
    if (dto.name) dept.name = dto.name.trim();
    if (dto.description) dept.description = dto.description;
    if (dto.headUserId) dept.headUserId = dto.headUserId;
    dept.updatedAt = new Date().toISOString();
    return dept;
  }

  /**
   * Delete department.
   */
  deleteDepartment(id: string): { success: boolean; message: string } {
    const dept = this.getDepartmentById(id);

    // Check if services exist
    const hasServices = db.services.some((s) => (s as any).departmentId === id || s.dept === dept.name);
    if (hasServices) {
      throw new BadRequestException(
        `Cannot delete department '${dept.name}' because active services are configured under it.`,
      );
    }

    const index = db.departments.findIndex((d) => d.id === id);
    if (index >= 0) {
      db.departments.splice(index, 1);
    }

    return {
      success: true,
      message: `Department '${dept.name}' deleted successfully.`,
    };
  }

  /**
   * State Admin configures Grievance Cell & Grievance Workflow for a department.
   * Section 23: Each department has one grievance cell and workflow.
   */
  configureGrievanceCell(dto: ConfigureGrievanceCellDto): GrievanceCellConfig {
    let cell = this.grievanceCells.find((c) => c.departmentId === dto.departmentId);
    if (cell) {
      cell.cellName = dto.cellName.trim();
      cell.workflowSteps = dto.workflowSteps;
    } else {
      cell = {
        id: `cell_${dto.departmentId}`,
        stateId: dto.stateId,
        departmentId: dto.departmentId,
        cellName: dto.cellName.trim(),
        workflowSteps: dto.workflowSteps,
        createdAt: new Date().toISOString(),
      };
      this.grievanceCells.push(cell);
    }
    return cell;
  }

  getGrievanceCellByDepartment(deptId: string): GrievanceCellConfig | undefined {
    return this.grievanceCells.find((c) => c.departmentId === deptId);
  }

  /**
   * Complete Monitoring Details for State Admin Dashboard (Unified with Central Admin)
   */
  getStateDashboard(stateId: string) {
    return this.centralService.getStateDetails(stateId);
  }

  /**
   * Department-wise revenue analysis for a state (Derived from shared state details).
   */
  getDepartmentRevenue(stateId: string) {
    const details = this.centralService.getStateDetails(stateId);
    const breakdown = (details.departments || []).map((d: any) => ({
      departmentId: d.id,
      departmentName: d.name,
      departmentCode: d.code,
      totalApplications: d.applicationsCount || 0,
      paidApplications: Math.round((d.applicationsCount || 0) * 0.8),
      totalRevenue: d.revenue || 0,
    }));

    return {
      stateId,
      totalStateRevenue: details.summary.totalRevenue,
      departmentBreakdown: breakdown,
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * State Admin Dashboard KPIs (Derived from shared state details).
   */
  getStateAnalytics(stateId: string) {
    const details = this.centralService.getStateDetails(stateId);
    const revData = this.getDepartmentRevenue(stateId);

    return {
      totalJurisdictions: (details.jurisdiction.districtsCount || 0) + (details.jurisdiction.mandalsCount || 0),
      totalDepartments: details.summary.totalDepartments,
      totalOfficers: details.summary.totalOfficers,
      totalApplications: details.summary.totalApplications,
      totalRevenue: details.summary.totalRevenue,
      totalGrievances: details.summary.totalGrievances,
      pendingGrievances: details.grievances.pending,
      revenueBreakdown: revData.departmentBreakdown,
    };
  }
}
