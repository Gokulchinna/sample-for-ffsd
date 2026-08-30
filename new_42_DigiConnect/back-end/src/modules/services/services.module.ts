import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { MockDbService } from '../../database/mock-db.service';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService, MockDbService],
  exports: [ServicesService],
})
export class ServicesModule {}
