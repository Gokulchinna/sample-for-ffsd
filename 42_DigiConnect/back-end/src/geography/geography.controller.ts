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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { GeographyService } from './geography.service';
import { CreateNodeDto, UpdateNodeDto } from './dto/create-node.dto';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { Role } from '../models/enums';

@ApiTags('geography')
@Controller('geography')
export class GeographyController {
  constructor(private readonly geographyService: GeographyService) {}

  @Get('tree')
  @ApiOperation({ summary: 'Get visual hierarchical jurisdiction tree' })
  getTree(@Query('stateId') stateId?: string) {
    return {
      success: true,
      data: this.geographyService.buildTree(stateId),
    };
  }

  @Get('nodes/:id')
  @ApiOperation({ summary: 'Get jurisdiction node details by ID' })
  getNode(@Param('id') id: string) {
    const node = this.geographyService.getNodeById(id);
    const ancestors = this.geographyService.getAncestors(id);
    return {
      success: true,
      data: {
        ...node,
        ancestors,
      },
    };
  }

  @Get('nodes/:id/children')
  @ApiOperation({ summary: 'Get direct child jurisdiction nodes' })
  getChildren(@Param('id') id: string, @Query('stateId') stateId?: string) {
    const parentId = id === 'root' || id === 'null' ? null : id;
    return {
      success: true,
      data: this.geographyService.getChildren(parentId, stateId),
    };
  }

  @Get('nodes/:id/ancestors')
  @ApiOperation({ summary: 'Get ancestor path up to the State root' })
  getAncestors(@Param('id') id: string) {
    return {
      success: true,
      data: this.geographyService.getAncestors(id),
    };
  }

  @Get('scope-check')
  @ApiOperation({ summary: 'Check if a leaf node falls within an assigned officer node scope' })
  checkScope(
    @Query('leafNodeId') leafNodeId: string,
    @Query('assignedNodeId') assignedNodeId: string,
  ) {
    const inScope = this.geographyService.isNodeWithinScope(
      leafNodeId,
      assignedNodeId,
    );
    return {
      success: true,
      leafNodeId,
      assignedNodeId,
      inScope,
    };
  }

  @Post('nodes')
  @UseGuards(RolesGuard)
  @Roles(Role.STATE_ADMIN, Role.CENTRAL_ADMIN)
  @ApiHeader({ name: 'x-role', description: 'STATE_ADMIN or CENTRAL_ADMIN' })
  @ApiOperation({ summary: 'Create new dynamic jurisdiction node' })
  createNode(@Body() dto: CreateNodeDto) {
    const created = this.geographyService.createNode(dto);
    return {
      success: true,
      message: `Jurisdiction '${created.name}' created successfully.`,
      data: created,
    };
  }

  @Put('nodes/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.STATE_ADMIN, Role.CENTRAL_ADMIN)
  @ApiHeader({ name: 'x-role', description: 'STATE_ADMIN or CENTRAL_ADMIN' })
  @ApiOperation({ summary: 'Update jurisdiction node' })
  updateNode(@Param('id') id: string, @Body() dto: UpdateNodeDto) {
    const updated = this.geographyService.updateNode(id, dto);
    return {
      success: true,
      message: `Jurisdiction '${updated.name}' updated successfully.`,
      data: updated,
    };
  }

  @Delete('nodes/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.STATE_ADMIN, Role.CENTRAL_ADMIN)
  @ApiHeader({ name: 'x-role', description: 'STATE_ADMIN or CENTRAL_ADMIN' })
  @ApiOperation({ summary: 'Delete jurisdiction node (fails if children exist)' })
  deleteNode(@Param('id') id: string) {
    return this.geographyService.deleteNode(id);
  }
}
