import { Injectable, NotFoundException } from '@nestjs/common';
import { MockDbService } from '../../database/mock-db.service';
import { ServiceWorkflow } from '../../database/collections/workflow.collection';
import { DesignationConfig } from '../../database/collections/designations.collection';

@Injectable()
export class WorkflowService {
  constructor(private readonly mockDb: MockDbService) {}

  getWorkflowByServiceId(serviceId: string): ServiceWorkflow {
    const wf = this.mockDb.getWorkflow(serviceId);
    if (!wf) throw new NotFoundException(`Workflow for service ${serviceId} not found`);
    return wf;
  }

  saveWorkflow(workflow: ServiceWorkflow): ServiceWorkflow {
    return this.mockDb.saveWorkflow(workflow);
  }

  getDesignations(deptId?: string): DesignationConfig[] {
    return this.mockDb.getDesignations(deptId);
  }

  saveDesignation(config: DesignationConfig): DesignationConfig {
    return this.mockDb.saveDesignation(config);
  }

  getActionButtons() {
    return this.mockDb.getActionButtons();
  }
}
