import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CatalogItemDto } from '../dto/admin.dto';
@Injectable()
export class AdminCatalogService {
  constructor(private readonly prisma: PrismaService) {}
  software() { return this.prisma.software.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] }); }
  createSoftware(dto: CatalogItemDto) { return this.prisma.software.create({ data: dto }); }
  updateSoftware(id: string, dto: CatalogItemDto) { return this.prisma.software.update({ where: { id }, data: dto }); }
  faultTypes() { return this.prisma.faultType.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] }); }
  createFaultType(dto: CatalogItemDto) { return this.prisma.faultType.create({ data: dto }); }
  updateFaultType(id: string, dto: CatalogItemDto) { return this.prisma.faultType.update({ where: { id }, data: dto }); }
  async removeSoftware(id: string) { const item = await this.prisma.software.findUnique({ where: { id } }); if (!item) throw new NotFoundException('软件不存在'); return this.prisma.software.update({ where: { id }, data: { status: 'DISABLED' } }); }
  async removeFaultType(id: string) { const item = await this.prisma.faultType.findUnique({ where: { id } }); if (!item) throw new NotFoundException('故障类型不存在'); return this.prisma.faultType.update({ where: { id }, data: { status: 'DISABLED' } }); }
}