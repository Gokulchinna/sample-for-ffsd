import { Module } from '@nestjs/common';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { MockDbService } from '../../database/mock-db.service';

@Module({
  controllers: [ApplicationsController],
  providers: [ApplicationsService, MockDbService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
