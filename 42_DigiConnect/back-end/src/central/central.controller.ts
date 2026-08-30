import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { CentralService } from './central.service';
import { CreateStateDto } from './dto/create-state.dto';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { Role } from '../models/enums';

@ApiTags('central')
@Controller('central')
@UseGuards(RolesGuard)
@Roles(Role.CENTRAL_ADMIN)
@ApiHeader({ name: 'x-role', description: 'Must be CENTRAL_ADMIN' })
export class CentralController {
  constructor(private readonly centralService: CentralService) {}

  @Get('states')
  @ApiOperation({ summary: 'List all State Governments with metrics' })
  listStates() {
    return {
      success: true,
      data: this.centralService.listStates(),
    };
  }

  @Get('states/:id')
  @ApiOperation({ summary: 'Get State Government by ID' })
  getState(@Param('id') id: string) {
    return {
      success: true,
      data: this.centralService.getStateById(id),
    };
  }

  @Post('states')
  @ApiOperation({ summary: 'Create new State Government (1 State Admin enforced)' })
  createState(@Body() dto: CreateStateDto) {
    const created = this.centralService.createState(dto);
    return {
      success: true,
      message: `State Government '${created.name}' (${created.code}) created successfully.`,
      data: created,
    };
  }

  @Delete('states/:id')
  @ApiOperation({ summary: 'Deactivate State Government' })
  deleteState(@Param('id') id: string) {
    return this.centralService.deleteState(id);
  }

  @Get('analytics/revenue')
  @ApiOperation({ summary: 'State-wise revenue analysis' })
  getStateWiseRevenue() {
    return {
      success: true,
      data: this.centralService.getStateWiseRevenue(),
    };
  }

  @Get('analytics/metrics')
  @ApiOperation({ summary: 'National level key performance metrics' })
  getNationalMetrics() {
    return {
      success: true,
      data: this.centralService.getNationalMetrics(),
    };
  }
}
