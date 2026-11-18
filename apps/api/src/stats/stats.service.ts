import { Injectable } from '@nestjs/common';
import { CaseVerificationStatus, ContentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}
  async publicStats() {
    const [caseCount, userCount, issueCount, resourceCount, viewAggregate, downloadAggregate, demoDataCount, pendingReviewCaseCount] = await Promise.all([
      this.prisma.faultCase.count({ where: { status: ContentStatus.PUBLISHED, deletedAt: null } }),
      this.prisma.user.count(),
      this.prisma.issue.count(),
      this.prisma.resource.count({ where: { status: ContentStatus.PUBLISHED, deletedAt: null } }),
      this.prisma.caseView.count(),
      this.prisma.resource.aggregate({ _sum: { downloadCount: true } }),
      this.prisma.faultCase.count({ where: { status: ContentStatus.PUBLISHED, deletedAt: null, verificationStatus: CaseVerificationStatus.DEMO } }),
      this.prisma.faultCase.count({ where: { status: ContentStatus.PUBLISHED, deletedAt: null, verificationStatus: CaseVerificationStatus.PENDING_REVIEW } }),
    ]);
    return { caseCount, userCount, usageCount: viewAggregate + issueCount + (downloadAggregate._sum.downloadCount || 0), issueCount, resourceCount, demoDataCount, pendingReviewCaseCount };
  }
}