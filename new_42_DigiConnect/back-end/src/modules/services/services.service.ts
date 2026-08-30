import { Injectable, NotFoundException } from '@nestjs/common';
import { MockDbService } from '../../database/mock-db.service';
import { ServiceItem } from '../../database/collections/services.collection';

@Injectable()
export class ServicesService {
  constructor(private readonly mockDb: MockDbService) {}

  getAllServices(deptId?: string, category?: string): ServiceItem[] {
    return this.mockDb.getServices(deptId, category);
  }

  getServiceById(id: string): ServiceItem {
    const srv = this.mockDb.getServiceById(id);
    if (!srv) throw new NotFoundException(`Service ${id} not found`);
    return srv;
  }

  createService(service: ServiceItem): ServiceItem {
    return this.mockDb.createService(service);
  }
}
