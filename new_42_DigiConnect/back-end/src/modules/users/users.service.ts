import { Injectable, NotFoundException } from '@nestjs/common';
import { MockDbService } from '../../database/mock-db.service';
import { UserProfile } from '../../database/collections/users.collection';

@Injectable()
export class UsersService {
  constructor(private readonly mockDb: MockDbService) {}

  getUserProfile(userId: string): UserProfile {
    const user = this.mockDb.findUserById(userId);
    if (!user) throw new NotFoundException(`User ${userId} not found`);
    return user;
  }

  getOfficers(deptId?: string): UserProfile[] {
    return this.mockDb.getOfficersByDepartment(deptId);
  }

  getAllUsers(): UserProfile[] {
    return this.mockDb.getAllUsers();
  }
}
