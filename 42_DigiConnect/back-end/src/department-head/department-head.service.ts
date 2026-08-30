import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { db } from '../data/store';
import { Designation, OfficerUser } from '../models/department.model';
import { GovtService } from '../models/service.model';
import { User } from '../models/user.model';
import { Role } from '../models/enums';
import {
  CreateDesignationDto,
  OnboardOfficerDto,
} from './dto/create-designation.dto';
import {
  CreateDynamicServiceDto,
  ServiceFormFieldDto,
} from './dto/create-service.dto';

export interface ExtendedDynamicService {
  id: string;
  departmentId: string;
  stateId: string;
  name: string;
  code: string;
  description: string;
  status: 'ACTIVE' | 'DISABLED' | 'SUSPENDED';
  serviceFee: number;
  platformFee: number;
  totalFee: number;
  termsAndConditions: string;
  fields: ServiceFormFieldDto[];
  documentRequirements: any[];
  workflowSteps: any[];
  createdAt: string;
  updatedAt?: string;
}

@Injectable()
export class DepartmentHeadService {
  // Dedicated in-memory store for dynamic services
  private dynamicServices: ExtendedDynamicService[] = [
    {
      id: 'srv_caste_income_ap',
      departmentId: 'dept_rev_ap',
      stateId: 'state_ap',
      name: 'Integrated Community, Nativity & Date of Birth Certificate',
      code: 'CASTE_CERT_AP',
      description: 'Official statutory certificate verifying caste, nativity, and parental ancestry.',
      status: 'ACTIVE',
      serviceFee: 35,
      platformFee: 15,
      totalFee: 50,
      termsAndConditions: 'I hereby declare that the details provided are true and verified per Revenue Act guidelines.',
      fields: [
        {
          id: 'applicant_name',
          label: 'Full Name of Applicant',
          type: 'TEXT',
          required: true,
          placeholder: 'Enter full name as per Aadhaar',
          constraints: { minLength: 3, maxLength: 80 },
        },
        {
          id: 'aadhaar_number',
          label: 'Aadhaar Card Number',
          type: 'TEXT',
          required: true,
          placeholder: '12-digit Aadhaar number',
          constraints: { pattern: '^[0-9]{12}$' },
          helpText: 'Must be exactly 12 digits',
        },
        {
          id: 'caste_category',
          label: 'Social Category / Caste',
          type: 'DROPDOWN',
          required: true,
          constraints: {
            options: ['SC', 'ST', 'BC-A', 'BC-B', 'BC-C', 'BC-D', 'BC-E', 'OC / General'],
          },
        },
        {
          id: 'annual_income',
          label: 'Annual Family Income (INR)',
          type: 'NUMBER',
          required: true,
          placeholder: 'e.g. 120000',
          constraints: { min: 0, max: 10000000 },
        },
        {
          id: 'dob',
          label: 'Date of Birth',
          type: 'DATE',
          required: true,
        },
      ],
      documentRequirements: [
        {
          id: 'doc_aadhaar',
          name: 'Aadhaar Card Proof',
          required: true,
          allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
          maxSizeBytes: 5 * 1024 * 1024,
        },
        {
          id: 'doc_address',
          name: 'Address / Residence Proof',
          required: true,
          allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
          maxSizeBytes: 5 * 1024 * 1024,
        },
        {
          id: 'doc_photo',
          name: 'Passport Size Photograph',
          required: true,
          allowedMimeTypes: ['image/jpeg', 'image/png'],
          maxSizeBytes: 2 * 1024 * 1024,
        },
      ],
      workflowSteps: [
        {
          stepNumber: 1,
          stepName: 'VRO Field Verification',
          requiredDesignationId: 'desig_vro',
          canApprove: true,
          canReject: true,
          canRaiseQuery: true,
          isFinalApprovalStep: false,
        },
        {
          stepNumber: 2,
          stepName: 'MRO Endorsement',
          requiredDesignationId: 'desig_mro',
          canApprove: true,
          canReject: true,
          canRaiseQuery: true,
          isFinalApprovalStep: false,
        },
        {
          stepNumber: 3,
          stepName: 'Tahsildar Final Approval & Digital Signature',
          requiredDesignationId: 'desig_tahsildar',
          canApprove: true,
          canReject: true,
          canRaiseQuery: true,
          isFinalApprovalStep: true,
        },
      ],
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'srv_trade_license_ap',
      departmentId: 'dept_mun_ap',
      stateId: 'state_ap',
      name: 'Municipal Trade & Commercial License',
      code: 'TRADE_LIC_AP',
      description: 'Establishment permission for retail, service, or commercial operations in urban areas.',
      status: 'ACTIVE',
      serviceFee: 150,
      platformFee: 25,
      totalFee: 175,
      termsAndConditions: 'All fire and municipal safety standards must be adhered to at all times.',
      fields: [
        {
          id: 'trade_name',
          label: 'Name of Commercial Establishment',
          type: 'TEXT',
          required: true,
          placeholder: 'e.g. Tirupati General Traders',
        },
        {
          id: 'trade_type',
          label: 'Nature of Business Activity',
          type: 'DROPDOWN',
          required: true,
          constraints: {
            options: ['Retail / Grocery', 'Restaurant / Bakery', 'Electronics', 'Healthcare / Clinic', 'Workshop / Industrial'],
          },
        },
        {
          id: 'floor_area_sqft',
          label: 'Floor Area (Square Feet)',
          type: 'NUMBER',
          required: true,
          constraints: { min: 50, max: 100000 },
        },
      ],
      documentRequirements: [
        {
          id: 'doc_lease',
          name: 'Property Tax Receipt / Rental Agreement',
          required: true,
          allowedMimeTypes: ['application/pdf'],
          maxSizeBytes: 5 * 1024 * 1024,
        },
        {
          id: 'doc_fire_noc',
          name: 'Self-Declaration / Fire Safety Compliance',
          required: true,
          allowedMimeTypes: ['application/pdf'],
          maxSizeBytes: 5 * 1024 * 1024,
        },
      ],
      workflowSteps: [
        {
          stepNumber: 1,
          stepName: 'Ward Officer Site Inspection',
          requiredDesignationId: 'desig_ward_officer',
          canApprove: true,
          canReject: true,
          canRaiseQuery: true,
          isFinalApprovalStep: false,
        },
        {
          stepNumber: 2,
          stepName: 'Municipal Commissioner Approval',
          requiredDesignationId: 'desig_commissioner',
          canApprove: true,
          canReject: true,
          canRaiseQuery: true,
          isFinalApprovalStep: true,
        },
      ],
      createdAt: '2026-01-01T00:00:00.000Z',
    },
  ];

  // ─────────────────────────────────────────────────────────────────────────────
  // DESIGNATIONS (Officer Roles without levels)
  // ─────────────────────────────────────────────────────────────────────────────
  listDesignations(departmentId: string): Designation[] {
    return db.designations.filter(
      (d) => !departmentId || d.departmentId === departmentId,
    );
  }

  createDesignation(dto: CreateDesignationDto): Designation {
    const dept = db.departments.find((d) => d.id === dto.departmentId);
    if (!dept) {
      throw new NotFoundException(`Department '${dto.departmentId}' does not exist.`);
    }

    const duplicate = db.designations.find(
      (d) =>
        d.departmentId === dto.departmentId &&
        (d.title.toLowerCase() === dto.title.trim().toLowerCase() ||
          d.code.toUpperCase() === dto.code.trim().toUpperCase()),
    );
    if (duplicate) {
      throw new ConflictException(
        `Designation '${dto.title}' or code '${dto.code}' already exists in this department.`,
      );
    }

    const newDesig: Designation = {
      id: `desig_${Date.now().toString().slice(-5)}`,
      departmentId: dto.departmentId,
      title: dto.title.trim(),
      code: dto.code.trim().toUpperCase(),
      description: dto.description || `${dto.title} for ${dept.name}`,
      createdAt: new Date().toISOString(),
    };
    db.designations.push(newDesig);
    return newDesig;
  }

  deleteDesignation(id: string): { success: boolean; message: string } {
    const desig = db.designations.find((d) => d.id === id);
    if (!desig) {
      throw new NotFoundException(`Designation '${id}' not found.`);
    }

    // Check if officers have this designation
    const hasOfficers = db.officers.some((o) => o.designationId === id);
    if (hasOfficers) {
      throw new BadRequestException(
        `Cannot delete designation '${desig.title}' because active officers are assigned to it.`,
      );
    }

    const index = db.designations.findIndex((d) => d.id === id);
    db.designations.splice(index, 1);
    return {
      success: true,
      message: `Designation '${desig.title}' deleted successfully.`,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // OFFICER MANAGEMENT (Mapped to exact jurisdiction node)
  // ─────────────────────────────────────────────────────────────────────────────
  listOfficers(departmentId?: string): OfficerUser[] {
    return db.officers.filter(
      (o) => !departmentId || o.departmentId === departmentId,
    );
  }

  onboardOfficer(dto: OnboardOfficerDto): OfficerUser {
    const dept = db.departments.find((d) => d.id === dto.departmentId);
    if (!dept) {
      throw new NotFoundException(`Department '${dto.departmentId}' not found.`);
    }

    const desig = db.designations.find((d) => d.id === dto.designationId);
    if (!desig) {
      throw new NotFoundException(`Designation '${dto.designationId}' not found.`);
    }

    const node = db.jurisdictionNodes.find((n) => n.id === dto.assignedNodeId);
    if (!node) {
      throw new NotFoundException(`Jurisdiction node '${dto.assignedNodeId}' not found.`);
    }

    // Node must match state
    if (node.stateId !== dept.stateId) {
      throw new BadRequestException(
        `Jurisdiction node '${node.name}' belongs to state '${node.stateId}', but department belongs to '${dept.stateId}'.`,
      );
    }

    const officerId = `OFF-${desig.code}-${Date.now().toString().slice(-4)}`;

    const newOfficer: OfficerUser = {
      id: officerId,
      name: dto.name.trim(),
      email: dto.email.trim(),
      phone: dto.phone || '9876543200',
      departmentId: dto.departmentId,
      designationId: dto.designationId,
      designationTitle: desig.title,
      assignedNodeId: dto.assignedNodeId,
      status: 'Active',
      createdAt: new Date().toISOString(),
    };
    db.officers.push(newOfficer);

    // Also register in users collection so they can login/switch role
    const userProfile: User = {
      id: officerId,
      name: newOfficer.name,
      email: newOfficer.email,
      phone: newOfficer.phone || '9876543200',
      aadhaar: '895421670000',
      role: Role.OFFICER,
      title: desig.title,
      dept: dept.name,
      jurisdiction: node.name,
      status: 'Active',
      joinedDate: new Date().toISOString(),
    };
    db.users.push(userProfile);

    // Audit Log
    db.auditLogs.push({
      id: `AUD-${Date.now()}`,
      action: 'OFFICER_ONBOARDED',
      actor: `Dept Head (${dept.name})`,
      role: 'DEPARTMENT_HEAD',
      date: new Date().toISOString(),
      details: `Onboarded officer '${newOfficer.name}' as '${desig.title}' assigned to '${node.name}' (${node.tierLevel})`,
    });

    return newOfficer;
  }

  updateOfficerStatus(
    id: string,
    status: 'Active' | 'Suspended' | 'Inactive',
  ): OfficerUser {
    const officer = db.officers.find((o) => o.id === id);
    if (!officer) {
      throw new NotFoundException(`Officer '${id}' not found.`);
    }
    officer.status = status;

    const user = db.users.find((u) => u.id === id);
    if (user) {
      user.status = status;
    }

    db.auditLogs.push({
      id: `AUD-${Date.now()}`,
      action: `OFFICER_${status.toUpperCase()}`,
      actor: 'Department Head',
      role: 'DEPARTMENT_HEAD',
      date: new Date().toISOString(),
      details: `Officer '${officer.name}' status set to ${status}.`,
    });

    return officer;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // DYNAMIC SERVICES & WORKFLOW ENGINE
  // ─────────────────────────────────────────────────────────────────────────────
  listServices(departmentId?: string, stateId?: string): ExtendedDynamicService[] {
    return this.dynamicServices.filter((s) => {
      const matchDept = !departmentId || s.departmentId === departmentId;
      const matchState = !stateId || s.stateId === stateId;
      return matchDept && matchState;
    });
  }

  getServiceById(id: string): ExtendedDynamicService {
    const service = this.dynamicServices.find((s) => s.id === id);
    if (!service) {
      throw new NotFoundException(`Service '${id}' not found.`);
    }
    return service;
  }

  createService(dto: CreateDynamicServiceDto): ExtendedDynamicService {
    const dept = db.departments.find((d) => d.id === dto.departmentId);
    if (!dept) {
      throw new NotFoundException(`Department '${dto.departmentId}' not found.`);
    }

    // Validate workflow designations exist
    for (const step of dto.workflowSteps) {
      const desig = db.designations.find((d) => d.id === step.requiredDesignationId);
      if (!desig) {
        throw new BadRequestException(
          `Workflow step ${step.stepNumber} references non-existent designation '${step.requiredDesignationId}'.`,
        );
      }
    }

    const sFee = Number(dto.serviceFee) || 0;
    const pFee = Number(dto.platformFee) || 0;

    const newService: ExtendedDynamicService = {
      id: `srv_${dto.code.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now().toString().slice(-4)}`,
      departmentId: dto.departmentId,
      stateId: dto.stateId,
      name: dto.name.trim(),
      code: dto.code.trim().toUpperCase(),
      description: dto.description || `${dto.name} under ${dept.name}`,
      status: 'ACTIVE',
      serviceFee: sFee,
      platformFee: pFee,
      totalFee: sFee + pFee,
      termsAndConditions:
        dto.termsAndConditions ||
        'I hereby declare that all submitted information and uploaded documents are genuine.',
      fields: dto.fields,
      documentRequirements: dto.documentRequirements,
      workflowSteps: dto.workflowSteps,
      createdAt: new Date().toISOString(),
    };

    this.dynamicServices.push(newService);

    // Also mirror to db.services for backwards compatibility
    db.services.push({
      id: newService.id,
      name: newService.name,
      dept: dept.name,
      description: newService.description,
      fee: newService.totalFee,
      status: 'Active',
      slaDays: 7,
      category: 'Certificate',
      requirements: dto.documentRequirements.map((d) => d.name),
    } as any);

    db.auditLogs.push({
      id: `AUD-${Date.now()}`,
      action: 'SERVICE_CREATED',
      actor: `Dept Head (${dept.name})`,
      role: 'DEPARTMENT_HEAD',
      date: new Date().toISOString(),
      details: `Created service '${newService.name}' with ${dto.fields.length} dynamic fields and ${dto.workflowSteps.length} workflow steps.`,
    });

    return newService;
  }

  updateServiceStatus(
    id: string,
    status: 'ACTIVE' | 'DISABLED' | 'SUSPENDED',
  ): ExtendedDynamicService {
    const service = this.getServiceById(id);
    service.status = status;
    service.updatedAt = new Date().toISOString();

    db.auditLogs.push({
      id: `AUD-${Date.now()}`,
      action: `SERVICE_STATUS_${status}`,
      actor: 'Department Head',
      role: 'DEPARTMENT_HEAD',
      date: new Date().toISOString(),
      details: `Service '${service.name}' status updated to ${status}.`,
    });

    return service;
  }

  getDepartmentAnalytics(deptId: string) {
    const dept = db.departments.find((d) => d.id === deptId);
    const services = this.dynamicServices.filter((s) => s.departmentId === deptId);
    const officers = db.officers.filter((o) => o.departmentId === deptId);
    const designations = db.designations.filter((d) => d.departmentId === deptId);

    const apps = db.applications.filter(
      (a) => (a as any).departmentId === deptId || a.dept === dept?.name,
    );

    const approved = apps.filter((a) => a.status === 'approved' || a.status === 'completed');
    const rejected = apps.filter((a) => a.status === 'rejected');
    const queries = apps.filter((a) => a.status === 'query' || a.status === 'QUERY_RAISED');

    const totalRevenue = apps.reduce((acc, a) => {
      const isPaid = a.paymentStatus === 'PAID' || a.paymentStatus === 'completed' || a.paymentStatus === 'SUCCESS';
      return isPaid ? acc + (Number(a.fee) || 0) : acc;
    }, 0);

    return {
      departmentName: dept?.name || 'Department',
      totalServices: services.length,
      activeServices: services.filter((s) => s.status === 'ACTIVE').length,
      inactiveServices: services.filter((s) => s.status !== 'ACTIVE').length,
      totalDesignations: designations.length,
      totalOfficers: officers.length,
      totalApplications: apps.length,
      approvedApplications: approved.length,
      rejectedApplications: rejected.length,
      pendingQueries: queries.length,
      totalRevenue,
    };
  }
}
