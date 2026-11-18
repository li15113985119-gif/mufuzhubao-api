import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthPrincipal, CurrentUser } from '../common/auth-user.decorator';
import { UserGuard } from '../common/auth.guard';
import { CreateIssueDto } from './dto/create-issue.dto';
import { IssueFeedbackDto } from './dto/issue-feedback.dto';
import { IssuesService } from './issues.service';
@ApiTags('问题') @ApiBearerAuth() @UseGuards(UserGuard) @Controller('issues')
export class IssuesController {
  constructor(private readonly service: IssuesService) {}
  @Post() @Throttle({ default: { limit: 10, ttl: 60_000 } }) create(@CurrentUser() user: AuthPrincipal, @Body() dto: CreateIssueDto) { return this.service.create(user.sub, dto); }
  @Get('mine') mine(@CurrentUser() user: AuthPrincipal) { return this.service.mine(user.sub); }
  @Get('feedback/mine') myFeedback(@CurrentUser() user: AuthPrincipal) { return this.service.myFeedback(user.sub); }  @Get(':id') get(@CurrentUser() user: AuthPrincipal, @Param('id') id: string) { return this.service.getMine(user.sub, id); }
  @Post(':id/feedback') @Throttle({ default: { limit: 15, ttl: 60_000 } }) feedback(@CurrentUser() user: AuthPrincipal, @Param('id') id: string, @Body() dto: IssueFeedbackDto) { return this.service.feedback(user.sub, id, dto.isSolved, dto.content); }
}