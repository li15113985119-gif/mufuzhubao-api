import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ContentStatus, IssueStatus, Prisma } from '@prisma/client';
import { buildSearchText, normalizePagination, stringArray } from '../../common/helpers';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminQueryDto, ReplyIssueDto, UpdateIssueDto } from '../dto/admin.dto';
@Injectable()
export class AdminIssuesService {
  constructor(private readonly prisma: PrismaService) {}
  private serialize<T extends { screenshotUrls: unknown }>(item: T) { return { ...item, screenshotUrls: stringArray(item.screenshotUrls) }; }
  async list(query: AdminQueryDto) {
    const { page, pageSize } = normalizePagination(query.page, query.pageSize);
    const where: Prisma.IssueWhereInput = { ...(query.status ? { status: query.status as IssueStatus } : {}), ...(query.softwareId ? { softwareId: query.softwareId } : {}), ...(query.faultTypeId ? { faultTypeId: query.faultTypeId } : {}), ...(query.keyword ? { OR: [{ name: { contains: query.keyword, mode: 'insensitive' } }, { description: { contains: query.keyword, mode: 'insensitive' } }, { errorCode: { contains: query.keyword, mode: 'insensitive' } }] } : {}) };
    const [items, total] = await Promise.all([this.prisma.issue.findMany({ where, include: { software: true, faultType: true, user: { select: { id: true } } }, orderBy: { createdAt: 'desc' }, skip: (page - 1) * pageSize, take: pageSize }), this.prisma.issue.count({ where })]);
    return { items: items.map((item) => this.serialize(item)), total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }
  async get(id: string) { const item = await this.prisma.issue.findUnique({ where: { id }, include: { software: true, faultType: true, user: { select: { id: true, nickname: true, className: true } } } }); if (!item) throw new NotFoundException('问题不存在'); return this.serialize(item); }
  async update(id: string, dto: UpdateIssueDto) { const item = await this.prisma.issue.update({ where: { id }, data: { ...dto, resolvedAt: dto.status === IssueStatus.RESOLVED ? new Date() : undefined }, include: { software: true, faultType: true } }); return this.serialize(item); }
  async reply(id: string, dto: ReplyIssueDto, adminId: string) { const item = await this.prisma.issue.update({ where: { id }, data: { adminReply: dto.reply, status: dto.status || IssueStatus.RESOLVED, resolvedAt: dto.status === IssueStatus.RESOLVED ? new Date() : undefined }, include: { software: true, faultType: true } }); await this.prisma.activityLog.create({ data: { adminId, action: 'ISSUE_REPLY', targetType: 'ISSUE', targetId: id, metadata: { status: item.status } } }); return this.serialize(item); }
  async convert(id: string, adminId: string) {
    const issue = await this.prisma.issue.findUnique({ where: { id }, include: { software: true, faultType: true } });
    if (!issue) throw new NotFoundException('问题不存在');
    if (issue.status !== IssueStatus.RESOLVED) throw new BadRequestException('仅已解决问题可转为案例草稿');
    const title = (issue.symptom || issue.description).slice(0, 100).replace(/\s+/g, ' ').trim();
    const tags = ['问题转化', '待核验'];
    const item = await this.prisma.faultCase.create({ data: { title, softwareId: issue.softwareId, softwareVersion: issue.softwareVersion, faultTypeId: issue.faultTypeId, errorCode: issue.errorCode, symptom: issue.symptom || issue.description, possibleCauses: ['待教师核验故障原因'], solutionSteps: [issue.adminReply || '待补充核验后的解决步骤'], tags, screenshotUrls: issue.screenshotUrls as Prisma.InputJsonValue, status: ContentStatus.DRAFT, createdById: adminId, searchText: buildSearchText({ title, symptom: issue.symptom || issue.description, errorCode: issue.errorCode, tags, softwareName: issue.software.name, faultTypeName: issue.faultType.name }) }, include: { software: true, faultType: true } });
    await this.prisma.activityLog.create({ data: { adminId, action: 'ISSUE_CONVERT_CASE', targetType: 'ISSUE', targetId: id, metadata: { caseId: item.id } } });
    return this.serialize(item);
  }
}