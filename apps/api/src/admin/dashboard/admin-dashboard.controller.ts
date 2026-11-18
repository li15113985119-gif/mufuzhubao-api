import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../../common/auth.guard';
import { AdminDashboardService } from './admin-dashboard.service';
@ApiTags('管理-看板') @ApiBearerAuth() @UseGuards(AdminGuard) @Controller('admin/dashboard')
export class AdminDashboardController { constructor(private readonly service: AdminDashboardService) {} @Get() stats() { return this.service.stats(); } }