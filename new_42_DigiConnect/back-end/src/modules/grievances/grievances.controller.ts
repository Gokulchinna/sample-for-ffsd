import { Controller, Get, Post, Patch, Param, Body, Headers } from '@nestjs/common';
import { GrievancesService } from './grievances.service';
import { MockDbService } from '../../database/mock-db.service';

@Controller('grievances')
export class GrievancesController {
  constructor(
    private readonly grievancesService: GrievancesService,
    private readonly mockDb: MockDbService,
  ) {}

  @Get()
  getAll(@Headers('x-user-id') userId: string, @Headers('x-role') role: string) {
    if (role === 'officer' || role === 'admin') {
      return this.grievancesService.getAll(); // officers see all
    }
    return this.grievancesService.getAll(userId || 'CIT-101');
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.grievancesService.getById(id);
  }

  @Post()
  create(@Body() body: any, @Headers('x-user-id') userId: string) {
    const caller = this.mockDb.findUserById(userId);
    return this.grievancesService.createGrievance(body, caller);
  }

  @Patch(':id/resolve')
  resolve(
    @Param('id') id: string,
    @Body() body: { remarks: string },
    @Headers('x-user-id') userId: string,
  ) {
    const officer = this.mockDb.findUserById(userId || 'OFF-GRIEV-01');
    return this.grievancesService.resolveGrievance(id, body.remarks, officer?.fullName || 'Grievance Officer');
  }
}
