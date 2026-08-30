import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MockDbService } from '../../database/mock-db.service';
import { UserProfile } from '../../database/collections/users.collection';

@Injectable()
export class AuthService {
  constructor(private readonly mockDb: MockDbService) {}

  login(loginId: string, passwordHash?: string) {
    const user = this.mockDb.findUserByLogin(loginId, passwordHash);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials. Check your user ID / mobile / password.');
    }
    return {
      success: true,
      message: `Welcome back, ${user.fullName}`,
      user: {
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        adminTier: user.adminTier,
        designationId: user.designationId,
        designation: user.designation,
        departmentId: user.departmentId,
        departmentName: user.departmentName,
        stateCode: user.stateCode,
        jurisdictionDistrict: user.jurisdictionDistrict,
        jurisdictionMandalOrWard: user.jurisdictionMandalOrWard,
        address: user.address,
      },
    };
  }

  register(profile: UserProfile) {
    const newUser: UserProfile = {
      ...profile,
      userId: `CIT-${Date.now().toString().slice(-4)}`,
      role: 'citizen',
    };
    this.mockDb.createUser(newUser);
    return {
      success: true,
      message: 'Citizen registration successful',
      user: newUser,
    };
  }
}
