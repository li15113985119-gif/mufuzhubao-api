import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}
  listSoftware(includeDisabled = false) {
    return this.prisma.software.findMany({ where: includeDisabled ? {} : { status: 'ACTIVE' }, orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] });
  }
  async getSoftware(id: string) {
    const item = await this.prisma.software.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('软件不存在');
    return item;
  }
  listFaultTypes(includeDisabled = false) {
    return this.prisma.faultType.findMany({ where: includeDisabled ? {} : { status: 'ACTIVE' }, orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] });
  }
  async getFaultType(id: string) {
    const item = await this.prisma.faultType.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('故障类型不存在');
    return item;
  }
}