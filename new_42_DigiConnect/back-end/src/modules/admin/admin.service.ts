import { Injectable } from '@nestjs/common';
import { MockDbService } from '../../database/mock-db.service';
import { StateTenant } from '../../database/collections/states.collection';
import { AdministrativeUnit } from '../../database/collections/geography.collection';

@Injectable()
export class AdminService {
  constructor(private readonly mockDb: MockDbService) {}

  getStates(): StateTenant[] {
    return this.mockDb.getStates();
  }

  createState(state: StateTenant): StateTenant {
    return this.mockDb.createState(state);
  }

  getGeography(stateCode?: string, areaType?: 'RURAL' | 'URBAN'): AdministrativeUnit[] {
    return this.mockDb.getGeography(stateCode, areaType);
  }

  addGeography(unit: AdministrativeUnit): AdministrativeUnit {
    return this.mockDb.addGeographyUnit(unit);
  }

  getPlatformMetrics() {
    const apps = this.mockDb.getApplications();
    const grvs = this.mockDb.getGrievances();
    const users = this.mockDb.getAllUsers();
    const states = this.mockDb.getStates();

    return {
      totalStates: states.length,
      activeStates: states.filter(s => s.isActive).length,
      totalCitizens: users.filter(u => u.role === 'citizen').length,
      totalOfficers: users.filter(u => u.role === 'officer').length,
      totalApplications: apps.length,
      approvedApplications: apps.filter(a => a.status === 'APPROVED').length,
      underReviewApplications: apps.filter(a => a.status === 'UNDER_REVIEW').length,
      queryRaisedApplications: apps.filter(a => a.status === 'QUERY_RAISED').length,
      totalGrievances: grvs.length,
      resolvedGrievances: grvs.filter(g => g.status === 'RESOLVED').length,
      treasuryRevenueTotal: apps.reduce((sum, a) => sum + (a.paymentSplit?.treasuryAmount || 0), 0),
    };
  }
}
