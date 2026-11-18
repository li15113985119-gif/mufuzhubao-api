import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ContentStatus, Prisma } from '@prisma/client';
import { AuthPrincipal } from '../common/auth-user.decorator';
import { buildSearchText, normalizePagination, stringArray } from '../common/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { QueryCasesDto } from './dto/query-cases.dto';

const include = { software: true, faultType: true } satisfies Prisma.FaultCaseInclude;

type CaseWithRelations = Prisma.FaultCaseGetPayload<{ include: typeof include }>;

@Injectable()
export class CasesService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  private serialize(item: CaseWithRelations) {
    return {
      ...item,
      possibleCauses: stringArray(item.possibleCauses),
      solutionSteps: stringArray(item.solutionSteps),
      tags: stringArray(item.tags),
      screenshotUrls: stringArray(item.screenshotUrls),
      demoNotice: stringArray(item.tags).includes('演示数据') ? '演示数据，正式提交前需替换为真实案例' : undefined,
    };
  }

  private async optionalUserId(authorization?: string): Promise<string | undefined> {
    const token = authorization?.replace(/^Bearer\s+/i, '');
    if (!token) return undefined;
    try {
      const payload = await this.jwt.verifyAsync<AuthPrincipal>(token);
      if (payload.type !== 'user') return undefined;
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub }, select: { id: true, status: true } });
      return user?.status === 'ACTIVE' ? user.id : undefined;
    } catch { return undefined; }
  }

  async list(query: QueryCasesDto, authorization?: string) {
    const { page, pageSize } = normalizePagination(query.page, query.pageSize);
    const softwareId = query.softwareId || (query.software ? (await this.prisma.software.findUnique({ where: { name: query.software } }))?.id : undefined);
    const faultTypeId = query.faultTypeId || (query.faultType ? (await this.prisma.faultType.findUnique({ where: { name: query.faultType } }))?.id : undefined);
    const where: Prisma.FaultCaseWhereInput = {
      status: ContentStatus.PUBLISHED,
      deletedAt: null,
      ...(softwareId ? { softwareId } : {}),
      ...(faultTypeId ? { faultTypeId } : {}),
      ...(query.version ? { softwareVersion: { contains: query.version, mode: 'insensitive' } } : {}),
      ...(query.keyword ? { searchText: { contains: query.keyword.toLocaleLowerCase(), mode: 'insensitive' } } : {}),
    };
    const orderBy: Prisma.FaultCaseOrderByWithRelationInput =
      query.sort === 'views' ? { viewCount: 'desc' } : query.sort === 'favorites' ? { favoriteCount: 'desc' } : { publishedAt: 'desc' };
    const [items, total, userId] = await Promise.all([
      this.prisma.faultCase.findMany({ where, include, orderBy: [orderBy, { createdAt: 'desc' }], skip: (page - 1) * pageSize, take: pageSize }),
      this.prisma.faultCase.count({ where }),
      this.optionalUserId(authorization),
    ]);
    const favoriteIds = userId && items.length ? new Set((await this.prisma.favorite.findMany({ where: { userId, caseId: { in: items.map((i) => i.id) } }, select: { caseId: true } })).map((i) => i.caseId)) : new Set<string>();
    return { items: items.map((item) => ({ ...this.serialize(item), isFavorite: favoriteIds.has(item.id) })), total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async hot(authorization?: string) { return (await this.list({ sort: 'views', page: 1, pageSize: 6 }, authorization)).items; }
  async latest(authorization?: string) { return (await this.list({ sort: 'latest', page: 1, pageSize: 6 }, authorization)).items; }

  async get(id: string, authorization?: string) {
    const item = await this.prisma.faultCase.findFirst({ where: { id, status: ContentStatus.PUBLISHED, deletedAt: null }, include });
    if (!item) throw new NotFoundException('案例不存在或已下线');
    const userId = await this.optionalUserId(authorization);
    const isFavorite = userId ? Boolean(await this.prisma.favorite.findUnique({ where: { userId_caseId: { userId, caseId: id } } })) : false;
    return { ...this.serialize(item), isFavorite };
  }

  async related(id: string) {
    const item = await this.prisma.faultCase.findUnique({ where: { id }, select: { softwareId: true } });
    if (!item) throw new NotFoundException('案例不存在');
    const rows = await this.prisma.faultCase.findMany({ where: { id: { not: id }, softwareId: item.softwareId, status: ContentStatus.PUBLISHED, deletedAt: null }, include, orderBy: { publishedAt: 'desc' }, take: 4 });
    return rows.map((row) => this.serialize(row));
  }

  async view(id: string, authorization?: string) {
    const item = await this.prisma.faultCase.findFirst({ where: { id, status: ContentStatus.PUBLISHED, deletedAt: null } });
    if (!item) throw new NotFoundException('案例不存在或已下线');
    const userId = await this.optionalUserId(authorization);
    await this.prisma.$transaction([
      this.prisma.faultCase.update({ where: { id }, data: { viewCount: { increment: 1 } } }),
      this.prisma.caseView.create({ data: { caseId: id, userId } }),
    ]);
    return { counted: true };
  }

  async favorite(id: string, userId: string) {
    const item = await this.prisma.faultCase.findFirst({ where: { id, status: ContentStatus.PUBLISHED, deletedAt: null } });
    if (!item) throw new NotFoundException('案例不存在');
    const existing = await this.prisma.favorite.findUnique({ where: { userId_caseId: { userId, caseId: id } } });
    if (!existing) {
      await this.prisma.$transaction([
        this.prisma.favorite.create({ data: { userId, caseId: id } }),
        this.prisma.faultCase.update({ where: { id }, data: { favoriteCount: { increment: 1 } } }),
      ]);
    }
    return { isFavorite: true };
  }

  async unfavorite(id: string, userId: string) {
    const existing = await this.prisma.favorite.findUnique({ where: { userId_caseId: { userId, caseId: id } } });
    if (existing) {
      await this.prisma.$transaction([
        this.prisma.favorite.delete({ where: { id: existing.id } }),
        this.prisma.faultCase.update({ where: { id }, data: { favoriteCount: { decrement: 1 } } }),
      ]);
    }
    return { isFavorite: false };
  }

  async myFeedback(userId: string) {
    const rows = await this.prisma.caseFeedback.findMany({
      where: { userId },
      include: { case: { select: { id: true, title: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return rows;
  }
  async feedback(id: string, userId: string, isSolved: boolean, content?: string) {
    const item = await this.prisma.faultCase.findUnique({ where: { id } });
    if (!item || item.deletedAt) throw new NotFoundException('案例不存在');
    await this.prisma.$transaction([
      this.prisma.caseFeedback.create({ data: { caseId: id, userId, isSolved, content } }),
      this.prisma.faultCase.update({ where: { id }, data: isSolved ? { solvedCount: { increment: 1 } } : { unsolvedCount: { increment: 1 } } }),
    ]);
    return { success: true };
  }

  static searchText(data: { title: string; symptom: string; errorCode?: string | null; tags: string[]; softwareName: string; faultTypeName: string }) {
    return buildSearchText(data);
  }
}