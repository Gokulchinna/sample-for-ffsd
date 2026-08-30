import { Module } from '@nestjs/common';
import { GrievancesController } from './grievances.controller';
import { GrievancesService } from './grievances.service';
import { MockDbService } from '../../database/mock-db.service';

@Module({
  controllers: [GrievancesController],
  providers: [GrievancesService, MockDbService],
  exports: [GrievancesService],
})
export class GrievancesModule {}
