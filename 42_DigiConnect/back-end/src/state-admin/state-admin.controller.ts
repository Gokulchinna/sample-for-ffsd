import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { StateAdminService } from './state-admin.service';
import {
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from './dto/create-department.dto';
import { ConfigureGrievanceCellDto } from './dto/create-grievance-cell.dto';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { Role } from '../models/enums';

@ApiTags('state-admin')
@Controller('state-admin')
export class StateAdminController {
  constructor(private readonly stateAdminService: StateAdminService) {}

  @Get('departments')
  @ApiOperation({ summary: 'List departments in state' })
  listDepartments(
    @Query('stateId') stateId?: string,
    @Headers('x-state-id') headerStateId?: string,
  ) {
    const targetState = stateId || headerStateId || 'state_ap';
    return {
      success: true,
      data: this.stateAdminService.listDepartments(targetState),
    };
  }

  @Get('departments/:id')
  @ApiOperation({ summary: 'Get department details by ID' })
  getDepartment(@Param('id') id: string) {
    return {
      success: true,
      data: this.stateAdminService.getDepartmentById(id),
    };
  }

  @Post('departments')
  @UseGuards(RolesGuard)
  @Roles(Role.STATE_ADMIN, Role.CENTRAL_ADMIN)
  @ApiHeader({ name: 'x-role', description: 'STATE_ADMIN or CENTRAL_ADMIN' })
  @ApiOperation({ summary: 'State Admin creates department & appoints Department Head' })
  createDepartment(@Body() dto: CreateDepartmentDto) {
    const created = this.stateAdminService.createDepartment(dto);
    return {
      success: true,
      message: `Department '${created.name}' created and Department Head appointed.`,
      data: created,
    };
  }

  @Put('departments/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.STATE_ADMIN)
  @ApiHeader({ name: 'x-role', description: 'STATE_ADMIN' })
  @ApiOperation({ summary: 'Update department details' })
  updateDepartment(
    @Param('id') id: string,
    @Body() dto: UpdateDepartmentDto,
  ) {
    const updated = this.stateAdminService.updateDepartment(id, dto);
    return {
      success: true,
      message: `Department '${updated.name}' updated successfully.`,
      data: updated,
    };
  }

  @Delete('departments/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.STATE_ADMIN)
  @ApiHeader({ name: 'x-role', description: 'STATE_ADMIN' })
  @ApiOperation({ summary: 'Delete department (fails if services exist)' })
  deleteDepartment(@Param('id') id: string) {
    return this.stateAdminService.deleteDepartment(id);
  }

  @Post('grievance-cells')
  @UseGuards(RolesGuard)
  @Roles(Role.STATE_ADMIN)
  @ApiHeader({ name: 'x-role', description: 'STATE_ADMIN' })
  @ApiOperation({ summary: 'Configure department grievance cell & workflow' })
  configureGrievanceCell(@Body() dto: ConfigureGrievanceCellDto) {
    const cell = this.stateAdminService.configureGrievanceCell(dto);
    return {
      success: true,
      message: `Grievance cell for department '${dto.departmentId}' configured successfully.`,
      data: cell,
    };
  }

  @Get('grievance-cells/:deptId')
  @ApiOperation({ summary: 'Get grievance cell configuration for department' })
  getGrievanceCell(@Param('deptId') deptId: string) {
    const cell = this.stateAdminService.getGrievanceCellByDepartment(deptId);
    return {
      success: true,
      data: cell || null,
    };
  }

  @Get('analytics/revenue')
  @UseGuards(RolesGuard)
  @Roles(Role.STATE_ADMIN, Role.CENTRAL_ADMIN)
  @ApiOperation({ summary: 'Department-wise revenue analysis' })
  getDepartmentRevenue(
    @Query('stateId') stateId?: string,
    @Headers('x-state-id') headerStateId?: string,
  ) {
    const targetState = stateId || headerStateId || 'state_ap';
    return {
      success: true,
      data: this.stateAdminService.getDepartmentRevenue(targetState),
    };
  }

  @Get('analytics/kpis')
  @UseGuards(RolesGuard)
  @Roles(Role.STATE_ADMIN, Role.CENTRAL_ADMIN)
  @ApiOperation({ summary: 'State Admin KPI overview' })
  getStateAnalytics(
    @Query('stateId') stateId?: string,
    @Headers('x-state-id') headerStateId?: string,
  ) {
    const targetState = stateId || headerStateId || 'state_ap';
    return {
      success: true,
      data: this.stateAdminService.getStateAnalytics(targetState),
    };
  }
}
