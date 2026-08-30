import { Injectable, NotFoundException } from '@nestjs/common';
import { MockDbService } from '../../database/mock-db.service';
import { ApplicationItem } from '../../database/collections/applications.collection';
import { UserProfile } from '../../database/collections/users.collection';

@Injectable()
export class ApplicationsService {
  constructor(private readonly mockDb: MockDbService) {}

  submitApplication(data: Partial<ApplicationItem>, caller?: UserProfile): ApplicationItem {
    const service = this.mockDb.getServiceById(data.serviceId || 'SRV-REV-INCOME') || this.mockDb.getServices()[0];
    const workflow = this.mockDb.getWorkflow(service?.serviceId || 'SRV-REV-INCOME');
    const initialStage = workflow?.stages[0];

    const fee = service ? service.feeAmount : 50;
    const paymentSplit = {
      treasuryAmount: Math.round(fee * 0.7),
      kioskCommission: Math.round(fee * 0.2),
      opsFund: fee - Math.round(fee * 0.7) - Math.round(fee * 0.2),
    };

    const newApp: ApplicationItem = {
      applicationId: `APP-2026-${Date.now().toString().slice(-4)}`,
      serviceId: service.serviceId,
      serviceName: service.serviceName,
      serviceCode: service.serviceCode,
      departmentId: service.departmentId,
      citizenId: caller?.userId || data.citizenId || 'CIT-101',
      citizenName: caller?.fullName || data.citizenName || 'Citizen Applicant',
      citizenPhone: caller?.phone || data.citizenPhone || '9876543210',
      areaType: data.areaType || 'RURAL',
      stateCode: caller?.stateCode || data.stateCode || 'TS',
      district: data.district || caller?.jurisdictionDistrict || 'Ranga Reddy',
      mandalOrWard: data.mandalOrWard || caller?.jurisdictionMandalOrWard || 'Ibrahimpatnam',
      villageOrLocality: data.villageOrLocality || 'Pocharam',
      formData: data.formData || {},
      documents: data.documents || [],
      feePaid: fee,
      paymentSplit: paymentSplit,
      currentStageNumber: initialStage ? initialStage.stageNumber : 1,
      currentStageName: initialStage ? initialStage.stageName : 'Field Inspection & Verification',
      assignedDesignationId: initialStage ? initialStage.assignedDesignationId : 'DESIG-VRO',
      assignedDesignationName: initialStage ? initialStage.assignedDesignationName : 'Village Revenue Officer',
      status: 'UNDER_REVIEW',
      submissionDate: new Date().toISOString(),
      slaDueAt: new Date(Date.now() + (service?.totalSlaDays || 7) * 24 * 3600 * 1000).toISOString(),
      stageHistory: [
        {
          stageNumber: 0,
          stageName: 'Citizen Online Submission',
          actionTaken: 'SUBMITTED',
          actedByDesignation: 'Citizen',
          actedByOfficerName: caller?.fullName || data.citizenName || 'Citizen Applicant',
          remarks: 'Application submitted online with required documents.',
          timestamp: new Date().toISOString(),
        },
      ],
    };

    return this.mockDb.createApplication(newApp);
  }

  getMyApplications(citizenId: string): ApplicationItem[] {
    return this.mockDb.getApplications({ citizenId });
  }

  getOfficerQueue(officer: UserProfile): ApplicationItem[] {
    // Return applications pending at this officer's designation & jurisdiction
    return this.mockDb.getApplications({
      assignedDesignationId: officer.designationId,
      jurisdictionMandalOrWard: officer.jurisdictionMandalOrWard,
      stateCode: officer.stateCode,
    });
  }

  getAllApplications(filters?: any): ApplicationItem[] {
    return this.mockDb.getApplications(filters);
  }

  getApplicationById(id: string): ApplicationItem {
    const app = this.mockDb.getApplicationById(id);
    if (!app) throw new NotFoundException(`Application ${id} not found`);
    return app;
  }

  executeAction(
    applicationId: string,
    actionKey: string,
    officer: UserProfile,
    remarks: string
  ): ApplicationItem {
    return this.mockDb.executeApplicationAction(applicationId, actionKey, officer, remarks);
  }
}
