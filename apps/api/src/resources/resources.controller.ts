import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QueryResourcesDto } from './dto/query-resources.dto';
import { ResourcesService } from './resources.service';
@ApiTags('资源') @Controller('resources')
export class ResourcesController {
  constructor(private readonly service: ResourcesService) {}
  @Get() list(@Query() query: QueryResourcesDto) { return this.service.list(query); }
  @Get(':id') get(@Param('id') id: string) { return this.service.get(id); }
  @Post(':id/download') download(@Param('id') id: string) { return this.service.download(id); }
}