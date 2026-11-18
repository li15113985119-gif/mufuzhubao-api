import { Injectable, NotFoundException } from '@nestjs/common';
import { IssueStatus } from '@prisma/client';
import { stringArray } from '../common/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIssueDto } from './dto/create-issue.dto';
@Injectable()
export class IssuesService {
  constructor(private readonly prisma: PrismaService) {}
  private serialize<T extends { screenshotUrls: unknown }>(item: T) { return { ...item, screenshotUrls: stringArray(item.screenshotUrls) }; }
  async create(userId: string, dto: CreateIssueDto) {
    const item = await this.prisma.issue.create({ data: { userId, ...dto, screenshotUrls: dto.screenshotUrls || [] }, include: { software: true, faultType: true } });
    await this.prisma.activityLog.create({ data: { userId, action: 'ISSUE_SUBMIT', targetType: 'ISSUE', targetId: item.id } });
    return this.serialize(item);
  }
  async mine(userId: string) {
    const items = await this.prisma.issue.findMany({ where: { userId }, include: { software: true, faultType: true }, orderBy: { createdAt: 'desc' } });
    return items.map((item) => this.serialize(item));
  }
  async getMine(userId: string, id: string) {
    const item = await this.prisma.issue.findFirst({ where: { id, userId }, include: { software: true, faultType: true } });
    if (!item) throw new NotFoundException('问题记录不存在');
    return this.serialize(item);
  }
  async myFeedback(userId: string) {
    return this.prisma.activityLog.findMany({
      where: { userId, action: { in: ['ISSUE_FEEDBACK_SOLVED', 'ISSUE_FEEDBACK_UNSOLVED'] } },
      orderBy: { createdAt: 'desc' },
    });
  }  async feedback(userId: string, id: string, isSolved: boolean, content?: string) {
    const issue = await this.prisma.issue.findFirst({ where: { id, userId } });
    if (!issue) throw new NotFoundException('问题记录不存在');
    await this.prisma.activityLog.create({ data: { userId, action: isSolved ? 'ISSUE_FEEDBACK_SOLVED' : 'ISSUE_FEEDBACK_UNSOLVED', targetType: 'ISSUE', targetId: id, metadata: { content: content || '' } } });
    if (isSolved && issue.status !== IssueStatus.RESOLVED) {
      await this.prisma.issue.update({ where: { id }, data: { status: IssueStatus.RESOLVED, resolvedAt: new Date() } });
    }
    return { success: true };
  }
}