import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthPrincipal, CurrentUser } from '../../common/auth-user.decorator';
import { AdminGuard } from '../../common/auth.guard';
import { Roles } from '../../common/decorators';
import { AdminRole } from '@prisma/client';
import { AdminQueryDto, ReplyIssueDto, UpdateIssueDto } from '../dto/admin.dto';
import { AdminIssuesService } from './admin-issues.service';
@ApiTags('管理-问题') @ApiBearerAuth() @UseGuards(AdminGuard) @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
@Controller('admin/issues')
export class AdminIssuesController {
  constructor(private readonly service: AdminIssuesService) {}
  @Get() list(@Query() query: AdminQueryDto) { return this.service.list(query); }
  @Get(':id') get(@Param('id') id: string) { return this.service.get(id); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateIssueDto) { return this.service.update(id, dto); }
  @Post(':id/reply') reply(@Param('id') id: string, @Body() dto: ReplyIssueDto, @CurrentUser() admin: AuthPrincipal) { return this.service.reply(id, dto, admin.sub); }
  @Post(':id/convert-to-case') convert(@Param('id') id: string, @CurrentUser() admin: AuthPrincipal) { return this.service.convert(id, admin.sub); }
}