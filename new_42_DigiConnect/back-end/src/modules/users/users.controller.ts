import { Controller, Get, Param, Query, Headers } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@Headers('x-user-id') userId: string) {
    return this.usersService.getUserProfile(userId || 'CIT-101');
  }

  @Get('profile/:userId')
  getUserById(@Param('userId') userId: string) {
    return this.usersService.getUserProfile(userId);
  }

  @Get('officers')
  getOfficers(@Query('departmentId') deptId?: string) {
    return this.usersService.getOfficers(deptId);
  }

  @Get('all')
  getAll() {
    return this.usersService.getAllUsers();
  }
}
