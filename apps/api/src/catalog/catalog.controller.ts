import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
@ApiTags('软件与故障类型')
@Controller()
export class CatalogController {
  constructor(private readonly service: CatalogService) {}
  @Get('software') listSoftware() { return this.service.listSoftware(); }
  @Get('software/:id') getSoftware(@Param('id') id: string) { return this.service.getSoftware(id); }
  @Get('fault-types') listFaultTypes() { return this.service.listFaultTypes(); }
  @Get('fault-types/:id') getFaultType(@Param('id') id: string) { return this.service.getFaultType(id); }
}