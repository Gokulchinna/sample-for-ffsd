import { Controller, Get, Patch, Param, Headers } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { MockDbService } from '../../database/mock-db.service';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly mockDb: MockDbService,
  ) {}

  @Get()
  getNotifications(
    @Headers('x-user-id') userId: string,
    @Headers('x-role') role: string,
  ) {
    const user = this.mockDb.findUserById(userId);
    return this.notificationsService.getNotifications(
      userId || 'CIT-101',
      role || user?.role,
      user?.designationId,
    );
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string) {
    return { success: this.notificationsService.markAsRead(id) };
  }

  @Patch('read-all')
  markAllRead(@Headers('x-user-id') userId: string) {
    return { success: this.notificationsService.markAllAsRead(userId || 'CIT-101') };
  }
}
