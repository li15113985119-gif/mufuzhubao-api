import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../../common/auth.guard';
import { Roles } from '../../common/decorators';
import { AdminRole } from '@prisma/client';
import { CatalogItemDto } from '../dto/admin.dto';
import { AdminCatalogService } from './admin-catalog.service';
@ApiTags('管理-分类') @ApiBearerAuth() @UseGuards(AdminGuard) @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
@Controller('admin')
export class AdminCatalogController {
  constructor(private readonly service: AdminCatalogService) {}
  @Get('software') software() { return this.service.software(); }
  @Post('software') createSoftware(@Body() dto: CatalogItemDto) { return this.service.createSoftware(dto); }
  @Patch('software/:id') updateSoftware(@Param('id') id: string, @Body() dto: CatalogItemDto) { return this.service.updateSoftware(id, dto); }
  @Delete('software/:id') removeSoftware(@Param('id') id: string) { return this.service.removeSoftware(id); }
  @Get('fault-types') faultTypes() { return this.service.faultTypes(); }
  @Post('fault-types') createFaultType(@Body() dto: CatalogItemDto) { return this.service.createFaultType(dto); }
  @Patch('fault-types/:id') updateFaultType(@Param('id') id: string, @Body() dto: CatalogItemDto) { return this.service.updateFaultType(id, dto); }
  @Delete('fault-types/:id') removeFaultType(@Param('id') id: string) { return this.service.removeFaultType(id); }
}