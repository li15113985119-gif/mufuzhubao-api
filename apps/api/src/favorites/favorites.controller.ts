import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthPrincipal, CurrentUser } from '../common/auth-user.decorator';
import { UserGuard } from '../common/auth.guard';
import { FavoritesService } from './favorites.service';
@ApiTags('收藏') @ApiBearerAuth() @UseGuards(UserGuard) @Controller('favorites')
export class FavoritesController {
  constructor(private readonly service: FavoritesService) {}
  @Get() list(@CurrentUser() user: AuthPrincipal) { return this.service.list(user.sub); }
  @Post(':caseId') add(@CurrentUser() user: AuthPrincipal, @Param('caseId') caseId: string) { return this.service.add(user.sub, caseId); }
  @Delete(':caseId') remove(@CurrentUser() user: AuthPrincipal, @Param('caseId') caseId: string) { return this.service.remove(user.sub, caseId); }
}