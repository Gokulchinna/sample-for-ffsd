import { Injectable, NotFoundException } from '@nestjs/common';
import { MockDbService } from '../../database/mock-db.service';
import { GrievanceItem } from '../../database/collections/grievances.collection';
import { UserProfile } from '../../database/collections/users.collection';

@Injectable()
export class GrievancesService {
  constructor(private readonly mockDb: MockDbService) {}

  getAll(citizenId?: string): GrievanceItem[] {
    return this.mockDb.getGrievances(citizenId);
  }

  getById(id: string): GrievanceItem {
    const grv = this.mockDb.getGrievanceById(id);
    if (!grv) throw new NotFoundException(`Grievance ${id} not found`);
    return grv;
  }

  createGrievance(data: Partial<GrievanceItem>, citizen?: UserProfile): GrievanceItem {
    const newGrievance: GrievanceItem = {
      grievanceId: `GRV-2026-${Date.now().toString().slice(-4)}`,
      citizenId: citizen?.userId || data.citizenId || 'CIT-101',
      citizenName: citizen?.fullName || data.citizenName || 'Citizen Applicant',
      citizenPhone: citizen?.phone || data.citizenPhone || '9876543210',
      applicationNumber: data.applicationNumber,
      departmentId: data.departmentId || 'DEPT-REV',
      departmentName: data.departmentName || 'Revenue & Land Administration',
      subject: data.subject || 'Service Delivery Grievance',
      description: data.description || '',
      status: 'OPEN',
      priority: data.priority || 'NORMAL',
      createdAt: new Date().toISOString(),
    };
    return this.mockDb.createGrievance(newGrievance);
  }

  resolveGrievance(id: string, remarks: string, officerName: string): GrievanceItem {
    return this.mockDb.resolveGrievance(id, remarks, officerName);
  }
}
