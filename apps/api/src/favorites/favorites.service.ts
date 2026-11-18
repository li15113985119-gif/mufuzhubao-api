import { Injectable } from '@nestjs/common';
import { ContentStatus } from '@prisma/client';
import { stringArray } from '../common/helpers';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}
  async list(userId: string) {
    const rows = await this.prisma.favorite.findMany({ where: { userId, case: { deletedAt: null } }, include: { case: { include: { software: true, faultType: true } } }, orderBy: { createdAt: 'desc' } });
    return rows.map(({ case: item, createdAt }) => ({ ...item, possibleCauses: stringArray(item.possibleCauses), solutionSteps: stringArray(item.solutionSteps), tags: stringArray(item.tags), screenshotUrls: stringArray(item.screenshotUrls), isFavorite: true, favoritedAt: createdAt }));
  }
  async add(userId: string, caseId: string) {
    const item = await this.prisma.faultCase.findFirst({ where: { id: caseId, status: ContentStatus.PUBLISHED, deletedAt: null } });
    if (!item) return { isFavorite: false };
    const existing = await this.prisma.favorite.findUnique({ where: { userId_caseId: { userId, caseId } } });
    if (!existing) await this.prisma.$transaction([this.prisma.favorite.create({ data: { userId, caseId } }), this.prisma.faultCase.update({ where: { id: caseId }, data: { favoriteCount: { increment: 1 } } })]);
    return { isFavorite: true };
  }
  async remove(userId: string, caseId: string) {
    const existing = await this.prisma.favorite.findUnique({ where: { userId_caseId: { userId, caseId } } });
    if (existing) await this.prisma.$transaction([this.prisma.favorite.delete({ where: { id: existing.id } }), this.prisma.faultCase.update({ where: { id: caseId }, data: { favoriteCount: { decrement: 1 } } })]);
    return { isFavorite: false };
  }
}