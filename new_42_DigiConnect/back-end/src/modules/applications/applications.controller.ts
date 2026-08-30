import { Controller, Get, Post, Param, Body, Headers, Query } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { MockDbService } from '../../database/mock-db.service';

@Controller('applications')
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly mockDb: MockDbService,
  ) {}

  @Post('submit')
  submit(@Body() body: any, @Headers('x-user-id') userId: string) {
    const caller = this.mockDb.findUserById(userId);
    return this.applicationsService.submitApplication(body, caller);
  }

  @Get('my')
  getMyApplications(@Headers('x-user-id') userId: string) {
    return this.applicationsService.getMyApplications(userId || 'CIT-101');
  }

  @Get('queue')
  getOfficerQueue(@Headers('x-user-id') userId: string) {
    const officer = this.mockDb.findUserById(userId || 'OFF-VRO-01');
    if (!officer) return [];
    return this.applicationsService.getOfficerQueue(officer);
  }

  @Get('all')
  getAll(@Query() query: any) {
    return this.applicationsService.getAllApplications(query);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.applicationsService.getApplicationById(id);
  }

  @Post(':id/action')
  executeAction(
    @Param('id') id: string,
    @Body() body: { actionKey: string; remarks: string },
    @Headers('x-user-id') userId: string
  ) {
    const officer = this.mockDb.findUserById(userId || 'OFF-VRO-01') || this.mockDb.getOfficersByDepartment()[0];
    return this.applicationsService.executeAction(id, body.actionKey, officer, body.remarks);
  }
}
