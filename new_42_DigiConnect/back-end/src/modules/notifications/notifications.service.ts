import { Injectable } from '@nestjs/common';
import { MockDbService } from '../../database/mock-db.service';
import { InAppNotification } from '../../database/collections/notifications.collection';

@Injectable()
export class NotificationsService {
  constructor(private readonly mockDb: MockDbService) {}

  getNotifications(userId: string, role?: string, designationId?: string): InAppNotification[] {
    return this.mockDb.getNotifications(userId, role, designationId);
  }

  markAsRead(id: string): boolean {
    return this.mockDb.markNotificationRead(id);
  }

  markAllAsRead(userId: string): boolean {
    return this.mockDb.markAllNotificationsRead(userId);
  }
}
