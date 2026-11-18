import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminRole } from '@prisma/client';
import { AuthPrincipal, CurrentUser } from '../../common/auth-user.decorator';
import { AdminGuard } from '../../common/auth.guard';
import { Roles } from '../../common/decorators';
import { AdminQueryDto, CreateAdminDto, UpdateSettingDto } from '../dto/admin.dto';
import { AdminSystemService } from './admin-system.service';
@ApiTags('管理-系统') @ApiBearerAuth() @UseGuards(AdminGuard) @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
@Controller('admin')
export class AdminSystemController {
  constructor(private readonly service: AdminSystemService) {}
  @Get('feedback') feedback(@Query() query: AdminQueryDto) { return this.service.feedback(query); }
  @Patch('feedback/:id/handled') markFeedback(@Param('id') id: string) { return this.service.markFeedbackHandled(id); }
  @Get('admins') @Roles(AdminRole.SUPER_ADMIN) admins() { return this.service.admins(); }
  @Post('admins') @Roles(AdminRole.SUPER_ADMIN) createAdmin(@Body() dto: CreateAdminDto, @CurrentUser() admin: AuthPrincipal) { return this.service.createAdmin(dto, admin.sub); }
  @Patch('admins/:id/disable') @Roles(AdminRole.SUPER_ADMIN) disableAdmin(@Param('id') id: string, @CurrentUser() admin: AuthPrincipal) { return this.service.disableAdmin(id, admin.sub); }
  @Get('activity-logs') logs(@Query() query: AdminQueryDto) { return this.service.logs(query); }
  @Get('settings') settings() { return this.service.settings(); }
  @Patch('settings') @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN) updateSetting(@Body() dto: UpdateSettingDto) { return this.service.updateSetting(dto); }
}