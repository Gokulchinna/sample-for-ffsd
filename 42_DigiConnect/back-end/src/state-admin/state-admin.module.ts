import { Module } from '@nestjs/common';
import { StateAdminService } from './state-admin.service';
import { StateAdminController } from './state-admin.controller';

@Module({
  controllers: [StateAdminController],
  providers: [StateAdminService],
  exports: [StateAdminService],
})
export class StateAdminModule {}
