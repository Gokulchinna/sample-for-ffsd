import { Module } from '@nestjs/common';
import { WorkflowController } from './workflow.controller';
import { WorkflowService } from './workflow.service';
import { MockDbService } from '../../database/mock-db.service';

@Module({
  controllers: [WorkflowController],
  providers: [WorkflowService, MockDbService],
  exports: [WorkflowService],
})
export class WorkflowModule {}
