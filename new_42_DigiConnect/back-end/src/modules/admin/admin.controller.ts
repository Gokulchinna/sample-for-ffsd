import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { StateTenant } from '../../database/collections/states.collection';
import { AdministrativeUnit } from '../../database/collections/geography.collection';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('states')
  getStates() {
    return this.adminService.getStates();
  }

  @Post('states')
  createState(@Body() body: any) {
    return this.adminService.createState(body);
  }

  @Get('geography')
  getGeography(
    @Query('stateCode') stateCode?: string,
    @Query('areaType') areaType?: 'RURAL' | 'URBAN',
  ) {
    return this.adminService.getGeography(stateCode, areaType);
  }

  @Post('geography')
  addGeography(@Body() body: any) {
    return this.adminService.addGeography(body);
  }

  @Get('metrics')
  getMetrics() {
    return this.adminService.getPlatformMetrics();
  }
}
