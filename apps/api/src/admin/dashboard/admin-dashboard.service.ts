import { Injectable } from '@nestjs/common';
import { ContentStatus, IssueStatus } from '@prisma/client';
import { dayKey } from '../../common/helpers';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class AdminDashboardService {
  constructor(private readonly prisma: PrismaService) {}
  async stats() {
    const since = new Date(); since.setHours(0, 0, 0, 0); since.setDate(since.getDate() - 6);
    const [totalCases, publishedCases, pendingReviewCases, pendingIssues, resolvedIssues, favoriteCount, viewAggregate, downloadAggregate, issues, views, hotSoftware, hotFaultTypes] = await Promise.all([
      this.prisma.faultCase.count({ where: { deletedAt: null } }), this.prisma.faultCase.count({ where: { status: ContentStatus.PUBLISHED, deletedAt: null } }), this.prisma.faultCase.count({ where: { status: ContentStatus.PUBLISHED, deletedAt: null, verificationStatus: 'PENDING_REVIEW' } }),
      this.prisma.issue.count({ where: { status: { in: [IssueStatus.PENDING, IssueStatus.IN_PROGRESS] } } }), this.prisma.issue.count({ where: { status: IssueStatus.RESOLVED } }),
      this.prisma.favorite.count(), this.prisma.faultCase.aggregate({ _sum: { viewCount: true }, where: { deletedAt: null } }),
      this.prisma.resource.aggregate({ _sum: { downloadCount: true } }), this.prisma.issue.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
      this.prisma.caseView.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
      this.prisma.software.findMany({ select: { name: true, _count: { select: { cases: true } } }, orderBy: { cases: { _count: 'desc' } }, take: 5 }),
      this.prisma.faultType.findMany({ select: { name: true, _count: { select: { cases: true } } }, orderBy: { cases: { _count: 'desc' } }, take: 5 }),
    ]);
    const days = Array.from({ length: 7 }, (_, index) => { const date = new Date(since); date.setDate(since.getDate() + index); return dayKey(date); });
    const makeTrend = (rows: Array<{ createdAt: Date }>) => days.map((date) => ({ date, count: rows.filter((row) => dayKey(row.createdAt) === date).length }));
    return { totalCases, publishedCases, pendingReviewCases, pendingIssues, resolvedIssues, favoriteCount, caseViews: viewAggregate._sum.viewCount || 0, resourceDownloads: downloadAggregate._sum.downloadCount || 0, issueTrend: makeTrend(issues), viewTrend: makeTrend(views), hotSoftware: hotSoftware.map((item) => ({ name: item.name, count: item._count.cases })), hotFaultTypes: hotFaultTypes.map((item) => ({ name: item.name, count: item._count.cases })) };
  }
}