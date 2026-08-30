import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { ServiceWorkflow } from '../../database/collections/workflow.collection';
import { DesignationConfig } from '../../database/collections/designations.collection';

@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Get('service/:serviceId')
  getWorkflow(@Param('serviceId') serviceId: string) {
    return this.workflowService.getWorkflowByServiceId(serviceId);
  }

  @Post('service')
  saveWorkflow(@Body() body: any) {
    return this.workflowService.saveWorkflow(body);
  }

  @Get('designations')
  getDesignations(@Query('departmentId') deptId?: string) {
    return this.workflowService.getDesignations(deptId);
  }

  @Post('designations')
  saveDesignation(@Body() body: any) {
    return this.workflowService.saveDesignation(body);
  }

  @Get('action-buttons')
  getActionButtons() {
    return this.workflowService.getActionButtons();
  }
}
