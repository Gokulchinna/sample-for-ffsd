import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServiceItem } from '../../database/collections/services.collection';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  getAll(@Query('departmentId') deptId?: string, @Query('category') category?: string) {
    return this.servicesService.getAllServices(deptId, category);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.servicesService.getServiceById(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.servicesService.createService(body);
  }
}
