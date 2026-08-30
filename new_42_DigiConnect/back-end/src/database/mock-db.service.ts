import { Injectable } from '@nestjs/common';
import { StateTenant, STATES_MASTER } from './collections/states.collection';
import { AdministrativeUnit, GEOGRAPHY_MASTER } from './collections/geography.collection';
import { DesignationConfig, DESIGNATIONS_MASTER, ACTION_BUTTONS_MASTER, ActionButtonDefinition } from './collections/designations.collection';
import { ServiceItem, SERVICES_MASTER } from './collections/services.collection';
import { ServiceWorkflow, WORKFLOW_CONFIG_MASTER } from './collections/workflow.collection';
import { UserProfile, USERS_MASTER } from './collections/users.collection';
import { ApplicationItem, APPLICATIONS_MASTER, StageHistoryEntry } from './collections/applications.collection';
import { GrievanceItem, GRIEVANCES_MASTER } from './collections/grievances.collection';
import { InAppNotification, NOTIFICATIONS_MASTER } from './collections/notifications.collection';

@Injectable()
export class MockDbService {
  private states: StateTenant[] = [...STATES_MASTER];
  private geography: AdministrativeUnit[] = [...GEOGRAPHY_MASTER];
  private designations: DesignationConfig[] = [...DESIGNATIONS_MASTER];
  private actionButtons: Record<string, ActionButtonDefinition> = { ...ACTION_BUTTONS_MASTER };
  private services: ServiceItem[] = [...SERVICES_MASTER];
  private workflows: Record<string, ServiceWorkflow> = { ...WORKFLOW_CONFIG_MASTER };
  private users: UserProfile[] = [...USERS_MASTER];
  private applications: ApplicationItem[] = [...APPLICATIONS_MASTER];
  private grievances: GrievanceItem[] = [...GRIEVANCES_MASTER];
  private notifications: InAppNotification[] = [...NOTIFICATIONS_MASTER];

  // ─── AUTH & USERS ────────────────────────────────────────────────────────
  findUserByLogin(loginId: string, passwordHash?: string): UserProfile | undefined {
    return this.users.find(u =>
      (u.email.toLowerCase() === loginId.toLowerCase() ||
       u.phone === loginId ||
       u.userId.toLowerCase() === loginId.toLowerCase() ||
       u.aadhaar === loginId) &&
      (!passwordHash || u.passwordHash === passwordHash)
    );
  }

  findUserById(userId: string): UserProfile | undefined {
    return this.users.find(u => u.userId === userId);
  }

  createUser(profile: UserProfile): UserProfile {
    this.users.push(profile);
    return profile;
  }

  getAllUsers(): UserProfile[] {
    return this.users;
  }

  getOfficersByDepartment(deptId?: string): UserProfile[] {
    return this.users.filter(u => u.role === 'officer' && (!deptId || u.departmentId === deptId));
  }

  // ─── STATES (TENANCY) ───────────────────────────────────────────────────
  getStates(): StateTenant[] {
    return this.states;
  }

  getStateByCode(code: string): StateTenant | undefined {
    return this.states.find(s => s.stateCode.toUpperCase() === code.toUpperCase());
  }

  createState(state: StateTenant): StateTenant {
    this.states.push(state);
    return state;
  }

  // ─── GEOGRAPHY ──────────────────────────────────────────────────────────
  getGeography(stateCode?: string, areaType?: 'RURAL' | 'URBAN'): AdministrativeUnit[] {
    return this.geography.filter(g =>
      (!stateCode || g.stateCode.toUpperCase() === stateCode.toUpperCase()) &&
      (!areaType || g.areaType === areaType)
    );
  }

  addGeographyUnit(unit: AdministrativeUnit): AdministrativeUnit {
    this.geography.push(unit);
    return unit;
  }

  // ─── DESIGNATIONS & ACTION MATRIX ───────────────────────────────────────
  getDesignations(deptId?: string): DesignationConfig[] {
    return this.designations.filter(d => !deptId || d.departmentId === deptId);
  }

  getDesignationById(designationId: string): DesignationConfig | undefined {
    return this.designations.find(d => d.designationId === designationId);
  }

  saveDesignation(config: DesignationConfig): DesignationConfig {
    const idx = this.designations.findIndex(d => d.designationId === config.designationId);
    if (idx >= 0) {
      this.designations[idx] = config;
    } else {
      this.designations.push(config);
    }
    return config;
  }

  getActionButtons(): Record<string, ActionButtonDefinition> {
    return this.actionButtons;
  }

  // ─── SERVICES ───────────────────────────────────────────────────────────
  getServices(deptId?: string, category?: string): ServiceItem[] {
    return this.services.filter(s =>
      (!deptId || s.departmentId === deptId) &&
      (!category || s.category.toLowerCase() === category.toLowerCase())
    );
  }

  getServiceById(serviceId: string): ServiceItem | undefined {
    return this.services.find(s => s.serviceId === serviceId);
  }

  createService(service: ServiceItem): ServiceItem {
    this.services.push(service);
    return service;
  }

  // ─── WORKFLOW & STAGES ──────────────────────────────────────────────────
  getWorkflow(serviceId: string): ServiceWorkflow | undefined {
    return this.workflows[serviceId];
  }

  saveWorkflow(workflow: ServiceWorkflow): ServiceWorkflow {
    this.workflows[workflow.serviceId] = workflow;
    return workflow;
  }

  // ─── APPLICATIONS ───────────────────────────────────────────────────────
  getApplications(filters?: {
    citizenId?: string;
    assignedDesignationId?: string;
    jurisdictionMandalOrWard?: string;
    status?: string;
    stateCode?: string;
  }): ApplicationItem[] {
    return this.applications.filter(app => {
      if (filters?.citizenId && app.citizenId !== filters.citizenId) return false;
      if (filters?.assignedDesignationId && app.assignedDesignationId !== filters.assignedDesignationId) return false;
      if (filters?.jurisdictionMandalOrWard && filters.jurisdictionMandalOrWard !== 'ALL' &&
          app.mandalOrWard !== filters.jurisdictionMandalOrWard) return false;
      if (filters?.status && app.status !== filters.status) return false;
      if (filters?.stateCode && app.stateCode !== filters.stateCode) return false;
      return true;
    });
  }

  getApplicationById(id: string): ApplicationItem | undefined {
    return this.applications.find(a => a.applicationId === id);
  }

  createApplication(app: ApplicationItem): ApplicationItem {
    this.applications.unshift(app);
    // Trigger in-site notification for citizen
    this.createNotification({
      recipientId: app.citizenId,
      recipientRole: 'citizen',
      title: 'Application Submitted Successfully',
      message: `Your application #${app.applicationId} for ${app.serviceName} has been submitted and routed to ${app.assignedDesignationName}.`,
      type: 'info',
      linkUrl: `citizen/track-application.html?id=${app.applicationId}`,
    });
    return app;
  }

  // State Machine transition trigger
  executeApplicationAction(
    applicationId: string,
    actionKey: string,
    officer: UserProfile,
    remarks: string
  ): ApplicationItem {
    const app = this.getApplicationById(applicationId);
    if (!app) throw new Error(`Application ${applicationId} not found`);

    const workflow = this.getWorkflow(app.serviceId);
    if (!workflow) throw new Error(`Workflow definition not found for service ${app.serviceId}`);

    const currentStageIdx = workflow.stages.findIndex(s => s.stageNumber === app.currentStageNumber);
    const actionDef = this.actionButtons[actionKey];
    if (!actionDef) throw new Error(`Invalid actionKey: ${actionKey}`);

    let newStatus = app.status;
    let nextStageNumber = app.currentStageNumber;
    let nextStageName = app.currentStageName;
    let nextDesignationId = app.assignedDesignationId;
    let nextDesignationName = app.assignedDesignationName;

    if (actionDef.targetStageChange === 'NEXT') {
      if (currentStageIdx + 1 < workflow.stages.length) {
        const nextStage = workflow.stages[currentStageIdx + 1];
        nextStageNumber = nextStage.stageNumber;
        nextStageName = nextStage.stageName;
        nextDesignationId = nextStage.assignedDesignationId;
        nextDesignationName = nextStage.assignedDesignationName;
        newStatus = 'UNDER_REVIEW';
      } else {
        // Final stage completed
        newStatus = 'APPROVED';
        app.certificateNumber = `${app.stateCode}-${app.serviceCode}-${Date.now().toString().slice(-6)}`;
        app.certificateIssuedDate = new Date().toISOString();
      }
    } else if (actionDef.targetStageChange === 'PREVIOUS') {
      if (currentStageIdx > 0) {
        const prevStage = workflow.stages[currentStageIdx - 1];
        nextStageNumber = prevStage.stageNumber;
        nextStageName = prevStage.stageName;
        nextDesignationId = prevStage.assignedDesignationId;
        nextDesignationName = prevStage.assignedDesignationName;
        newStatus = 'UNDER_REVIEW';
      }
    } else if (actionDef.targetStageChange === 'COMPLETE') {
      newStatus = 'APPROVED';
      app.certificateNumber = `${app.stateCode}-${app.serviceCode}-${Date.now().toString().slice(-6)}`;
      app.certificateIssuedDate = new Date().toISOString();
    } else if (actionDef.targetStageChange === 'REJECT') {
      newStatus = 'REJECTED';
    } else if (actionDef.targetStageChange === 'QUERY') {
      newStatus = 'QUERY_RAISED';
      app.queryDetails = {
        queryText: remarks,
        queryRaisedBy: `${officer.fullName} (${officer.designation})`,
        queryDate: new Date().toISOString(),
      };
    }

    const historyEntry: StageHistoryEntry = {
      stageNumber: app.currentStageNumber,
      stageName: app.currentStageName,
      actionTaken: actionKey,
      actedByDesignation: officer.designation || 'Officer',
      actedByOfficerName: officer.fullName,
      remarks: remarks || 'Action processed.',
      timestamp: new Date().toISOString(),
    };

    app.currentStageNumber = nextStageNumber;
    app.currentStageName = nextStageName;
    app.assignedDesignationId = nextDesignationId;
    app.assignedDesignationName = nextDesignationName;
    app.status = newStatus;
    app.stageHistory.push(historyEntry);

    // Notify citizen about stage update
    this.createNotification({
      recipientId: app.citizenId,
      recipientRole: 'citizen',
      title: newStatus === 'APPROVED'
        ? '🎉 Certificate Approved & Ready'
        : newStatus === 'QUERY_RAISED'
        ? '⚠️ Action Required: Officer Query Raised'
        : `Update on Application #${app.applicationId}`,
      message: newStatus === 'APPROVED'
        ? `Your certificate #${app.certificateNumber} has been issued and is available in your certificates vault.`
        : `${officer.designation} performed: ${actionDef.label}. Status: ${newStatus}.`,
      type: newStatus === 'APPROVED' ? 'success' : newStatus === 'QUERY_RAISED' ? 'warning' : 'info',
      linkUrl: newStatus === 'APPROVED' ? 'citizen/certificates.html' : `citizen/track-application.html?id=${app.applicationId}`,
    });

    return app;
  }

  // ─── GRIEVANCES ─────────────────────────────────────────────────────────
  getGrievances(citizenId?: string): GrievanceItem[] {
    return this.grievances.filter(g => !citizenId || g.citizenId === citizenId);
  }

  getGrievanceById(id: string): GrievanceItem | undefined {
    return this.grievances.find(g => g.grievanceId === id);
  }

  createGrievance(item: GrievanceItem): GrievanceItem {
    this.grievances.unshift(item);
    return item;
  }

  resolveGrievance(id: string, remarks: string, officerName: string): GrievanceItem {
    const grv = this.getGrievanceById(id);
    if (!grv) throw new Error(`Grievance ${id} not found`);
    grv.status = 'RESOLVED';
    grv.resolutionRemarks = remarks;
    grv.resolvedAt = new Date().toISOString();
    grv.assignedOfficerName = officerName;
    return grv;
  }

  // ─── NOTIFICATIONS ──────────────────────────────────────────────────────
  getNotifications(recipientId: string, role?: string, designationId?: string): InAppNotification[] {
    return this.notifications.filter(n =>
      n.recipientId === recipientId ||
      n.recipientId === 'ALL' ||
      (designationId && n.recipientDesignationId === designationId) ||
      (role && n.recipientRole === role)
    );
  }

  createNotification(notif: Omit<InAppNotification, 'id' | 'isRead' | 'createdAt'>): InAppNotification {
    const item: InAppNotification = {
      id: `NOTIF-${Date.now().toString().slice(-5)}`,
      isRead: false,
      createdAt: new Date().toISOString(),
      ...notif,
    };
    this.notifications.unshift(item);
    return item;
  }

  markNotificationRead(id: string): boolean {
    const n = this.notifications.find(item => item.id === id);
    if (n) {
      n.isRead = true;
      return true;
    }
    return false;
  }

  markAllNotificationsRead(recipientId: string): boolean {
    this.notifications.forEach(n => {
      if (n.recipientId === recipientId || n.recipientId === 'ALL') {
        n.isRead = true;
      }
    });
    return true;
  }
}
