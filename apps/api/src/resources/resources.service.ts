import { Injectable, NotFoundException } from '@nestjs/common';
import { ContentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class ResourcesService {
  constructor(private readonly prisma: PrismaService) {}
  list(query: { keyword?: string; category?: string; softwareId?: string; sort?: string }) {
    return this.prisma.resource.findMany({
      where: {
        status: ContentStatus.PUBLISHED, deletedAt: null,
        ...(query.category ? { category: query.category as never } : {}),
        ...(query.softwareId ? { softwareId: query.softwareId } : {}),
        ...(query.keyword ? { OR: [{ title: { contains: query.keyword, mode: 'insensitive' } }, { description: { contains: query.keyword, mode: 'insensitive' } }, { tag: { contains: query.keyword, mode: 'insensitive' } }] } : {}),
      },
      include: { software: true },
      orderBy: query.sort === 'downloads' ? { downloadCount: 'desc' } : [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }
  async get(id: string) {
    const item = await this.prisma.resource.findFirst({ where: { id, status: ContentStatus.PUBLISHED, deletedAt: null }, include: { software: true } });
    if (!item) throw new NotFoundException('资源不存在');
    return item;
  }
  async download(id: string) {
    const item = await this.prisma.resource.findFirst({ where: { id, status: ContentStatus.PUBLISHED, deletedAt: null } });
    if (!item) throw new NotFoundException('资源不存在');
    await this.prisma.resource.update({ where: { id }, data: { downloadCount: { increment: 1 } } });
    return { downloadUrl: item.fileUrl || item.externalUrl, external: Boolean(item.externalUrl), downloadCount: item.downloadCount + 1 };
  }
}
