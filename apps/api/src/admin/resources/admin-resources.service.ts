import { Injectable, NotFoundException } from '@nestjs/common';
import { ContentStatus, Prisma } from '@prisma/client';
import { normalizePagination } from '../../common/helpers';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminQueryDto, CreateResourceDto, UpdateResourceDto } from '../dto/admin.dto';
@Injectable()
export class AdminResourcesService {
  constructor(private readonly prisma: PrismaService) {}
  async list(query: AdminQueryDto) {
    const { page, pageSize } = normalizePagination(query.page, query.pageSize);
    const where: Prisma.ResourceWhereInput = { deletedAt: null, ...(query.status ? { status: query.status as ContentStatus } : {}), ...(query.category ? { category: query.category as never } : {}), ...(query.keyword ? { title: { contains: query.keyword, mode: 'insensitive' } } : {}) };
    const [items, total] = await Promise.all([this.prisma.resource.findMany({ where, include: { software: true }, orderBy: { createdAt: 'desc' }, skip: (page - 1) * pageSize, take: pageSize }), this.prisma.resource.count({ where })]);
    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }
  create(dto: CreateResourceDto, adminId: string) {
    const data: Prisma.ResourceUncheckedCreateInput = {
      ...dto,
      content: dto.content as Prisma.InputJsonValue | undefined,
      createdById: adminId,
    };
    return this.prisma.resource.create({ data, include: { software: true } });
  }
  update(id: string, dto: UpdateResourceDto) {
    const data: Prisma.ResourceUncheckedUpdateInput = {
      ...dto,
      content: dto.content as Prisma.InputJsonValue | undefined,
    };
    return this.prisma.resource.update({ where: { id }, data, include: { software: true } });
  }
  async remove(id: string) { const item = await this.prisma.resource.findFirst({ where: { id, deletedAt: null } }); if (!item) throw new NotFoundException('资源不存在'); return this.prisma.resource.update({ where: { id }, data: { deletedAt: new Date(), status: ContentStatus.OFFLINE } }); }
}
