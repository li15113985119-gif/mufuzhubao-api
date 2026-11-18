import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthPrincipal, CurrentUser } from '../../common/auth-user.decorator';
import { AdminGuard } from '../../common/auth.guard';
import { Roles } from '../../common/decorators';
import { AdminRole } from '@prisma/client';
import { AdminQueryDto, CreateCaseDto, ImportCasesDto, UpdateCaseDto } from '../dto/admin.dto';
import { AdminCasesService } from './admin-cases.service';

@ApiTags('管理-案例')
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR)
@Controller('admin/cases')
export class AdminCasesController {
  constructor(private readonly service: AdminCasesService) {}

  @Get() list(@Query() query: AdminQueryDto) { return this.service.list(query); }
  @Get('export') async export(@Res() response: Response) {
    const data = await this.service.export();
    response.setHeader('Content-Disposition', 'attachment; filename="kongxiaozhi-cases.json"');
    response.json({ code: 0, message: 'success', data });
  }
  @Get(':id') detail(@Param('id') id: string) { return this.service.get(id); }
  @Post() create(@Body() dto: CreateCaseDto, @CurrentUser() admin: AuthPrincipal) { return this.service.create(dto, admin.sub); }
  @Post('import') import(@Body() dto: ImportCasesDto, @CurrentUser() admin: AuthPrincipal) { return this.service.import(dto.cases, admin.sub); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateCaseDto, @CurrentUser() admin: AuthPrincipal) { return this.service.update(id, dto, admin.sub); }
  @Delete(':id') remove(@Param('id') id: string, @CurrentUser() admin: AuthPrincipal) { return this.service.remove(id, admin.sub); }
}