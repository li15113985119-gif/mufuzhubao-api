import { Body, Controller, Delete, Get, Headers, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthPrincipal, CurrentUser } from '../common/auth-user.decorator';
import { UserGuard } from '../common/auth.guard';
import { CasesService } from './cases.service';
import { CaseFeedbackDto } from './dto/feedback.dto';
import { QueryCasesDto } from './dto/query-cases.dto';

@ApiTags('案例')
@Controller('cases')
export class CasesController {
  constructor(private readonly service: CasesService) {}
  @Get() list(@Query() query: QueryCasesDto, @Headers('authorization') authorization?: string) { return this.service.list(query, authorization); }
  @Get('hot') hot(@Headers('authorization') authorization?: string) { return this.service.hot(authorization); }
  @Get('latest') latest(@Headers('authorization') authorization?: string) { return this.service.latest(authorization); }
  @Get('feedback/mine') @ApiBearerAuth() @UseGuards(UserGuard) myFeedback(@CurrentUser() user: AuthPrincipal) { return this.service.myFeedback(user.sub); }  @Get(':id/related') related(@Param('id') id: string) { return this.service.related(id); }
  @Get(':id') get(@Param('id') id: string, @Headers('authorization') authorization?: string) { return this.service.get(id, authorization); }
  @Post(':id/view') view(@Param('id') id: string, @Headers('authorization') authorization?: string) { return this.service.view(id, authorization); }
  @Post(':id/favorite') @ApiBearerAuth() @UseGuards(UserGuard) favorite(@Param('id') id: string, @CurrentUser() user: AuthPrincipal) { return this.service.favorite(id, user.sub); }
  @Delete(':id/favorite') @ApiBearerAuth() @UseGuards(UserGuard) unfavorite(@Param('id') id: string, @CurrentUser() user: AuthPrincipal) { return this.service.unfavorite(id, user.sub); }
  @Post(':id/feedback') @ApiBearerAuth() @UseGuards(UserGuard) @Throttle({ default: { limit: 20, ttl: 60_000 } }) feedback(@Param('id') id: string, @CurrentUser() user: AuthPrincipal, @Body() dto: CaseFeedbackDto) { return this.service.feedback(id, user.sub, dto.isSolved, dto.content); }
}