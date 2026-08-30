import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MockDbService } from '../../database/mock-db.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, MockDbService],
  exports: [AdminService],
})
export class AdminModule {}
