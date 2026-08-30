import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { MockDbService } from '../../database/mock-db.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, MockDbService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
