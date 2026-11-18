import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthPrincipal, CurrentUser } from '../../common/auth-user.decorator';
import { AdminGuard } from '../../common/auth.guard';
import { Roles } from '../../common/decorators';
import { AdminRole } from '@prisma/client';
import { AdminQueryDto, CreateResourceDto, UpdateResourceDto } from '../dto/admin.dto';
import { AdminResourcesService } from './admin-resources.service';
@ApiTags('管理-资源') @ApiBearerAuth() @UseGuards(AdminGuard) @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR)
@Controller('admin/resources')
export class AdminResourcesController {
  constructor(private readonly service: AdminResourcesService) {}
  @Get() list(@Query() query: AdminQueryDto) { return this.service.list(query); }
  @Post() create(@Body() dto: CreateResourceDto, @CurrentUser() admin: AuthPrincipal) { return this.service.create(dto, admin.sub); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateResourceDto) { return this.service.update(id, dto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(id); }
}