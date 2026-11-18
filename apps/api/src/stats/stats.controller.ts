import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StatsService } from './stats.service';
@ApiTags('公开统计') @Controller('public')
export class StatsController {
  constructor(private readonly service: StatsService) {}
  @Get('stats') stats() { return this.service.publicStats(); }
}