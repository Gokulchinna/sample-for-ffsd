import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { MockDbService } from '../../database/mock-db.service';

@Injectable()
export class SimpleAuthGuard implements CanActivate {
  constructor(private readonly mockDb: MockDbService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userId = request.headers['x-user-id'] as string;
    const role = request.headers['x-role'] as string;

    if (userId) {
      const user = this.mockDb.findUserById(userId);
      if (user) {
        request['user'] = user;
        return true;
      }
    }

    // Fallback: attach a mock user profile if headers are provided
    if (role) {
      request['user'] = {
        userId: userId || 'MOCK-USER',
        role: role,
        designation: request.headers['x-designation'] || '',
        stateCode: request.headers['x-state-code'] || 'TS',
      };
    }

    return true; // Allow request through for prototype simplicity
  }
}
