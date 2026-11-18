import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CaseVerificationStatus, ContentStatus, Prisma } from '@prisma/client';
import { buildSearchText, normalizePagination, stringArray } from '../../common/helpers';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminQueryDto, CreateCaseDto, UpdateCaseDto } from '../dto/admin.dto';
const include = { software: true, faultType: true } satisfies Prisma.FaultCaseInclude;
@Injectable()
export class AdminCasesService {
  constructor(private readonly prisma: PrismaService) {}
  private serialize(item: Prisma.FaultCaseGetPayload<{ include: typeof include }>) { return { ...item, possibleCauses: stringArray(item.possibleCauses), solutionSteps: stringArray(item.solutionSteps), tags: stringArray(item.tags), screenshotUrls: stringArray(item.screenshotUrls) }; }
  private async searchText(data: { title: string; symptom: string; errorCode?: string | null; tags: string[]; softwareId: string; faultTypeId: string }) { const [software, faultType] = await Promise.all([this.prisma.software.findUnique({ where: { id: data.softwareId } }), this.prisma.faultType.findUnique({ where: { id: data.faultTypeId } })]); return buildSearchText({ ...data, softwareName: software?.name || '', faultTypeName: faultType?.name || '' }); }
  async list(query: AdminQueryDto) {
    const { page, pageSize } = normalizePagination(query.page, query.pageSize);
    const where: Prisma.FaultCaseWhereInput = { deletedAt: null, ...(query.status ? { status: query.status as ContentStatus } : {}), ...(query.softwareId ? { softwareId: query.softwareId } : {}), ...(query.faultTypeId ? { faultTypeId: query.faultTypeId } : {}), ...(query.keyword ? { searchText: { contains: query.keyword.toLocaleLowerCase(), mode: 'insensitive' } } : {}) };
    const [items, total] = await Promise.all([this.prisma.faultCase.findMany({ where, include, orderBy: { updatedAt: 'desc' }, skip: (page - 1) * pageSize, take: pageSize }), this.prisma.faultCase.count({ where })]);
    return { items: items.map((item) => this.serialize(item)), total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }
  async get(id: string) {
    const item = await this.prisma.faultCase.findFirst({ where: { id, deletedAt: null }, include });
    if (!item) throw new NotFoundException('案例不存在');
    return this.serialize(item);
  }  async create(dto: CreateCaseDto, adminId: string) {
    if (!dto.possibleCauses.length || !dto.solutionSteps.length) throw new BadRequestException('可能原因和解决步骤不能为空');
    const tags = dto.tags || []; const status = dto.status || ContentStatus.DRAFT;
    const item = await this.prisma.faultCase.create({ data: { title: dto.title, softwareId: dto.softwareId, softwareVersion: dto.softwareVersion, faultTypeId: dto.faultTypeId, errorCode: dto.errorCode, symptom: dto.symptom, possibleCauses: dto.possibleCauses, solutionSteps: dto.solutionSteps, systemEnvironment: dto.systemEnvironment, tags, screenshotUrls: dto.screenshotUrls || [], sourceName: dto.sourceName, sourceUrl: dto.sourceUrl, verificationStatus: dto.verificationStatus || CaseVerificationStatus.PENDING_REVIEW, verifiedAt: dto.verificationStatus === CaseVerificationStatus.VERIFIED ? new Date() : null, status, publishedAt: status === ContentStatus.PUBLISHED ? new Date() : null, createdById: adminId, searchText: await this.searchText({ title: dto.title, symptom: dto.symptom, errorCode: dto.errorCode, tags, softwareId: dto.softwareId, faultTypeId: dto.faultTypeId }) }, include });
    await this.log(adminId, 'CASE_CREATE', item.id, { title: item.title, status }); return this.serialize(item);
  }
  async update(id: string, dto: UpdateCaseDto, adminId: string) {
    const current = await this.prisma.faultCase.findFirst({ where: { id, deletedAt: null } });
    if (!current) throw new NotFoundException('案例不存在');
    const next = { ...current, ...dto }; const tags = dto.tags || stringArray(current.tags);
    if (dto.possibleCauses && !dto.possibleCauses.length) throw new BadRequestException('可能原因不能为空');
    if (dto.solutionSteps && !dto.solutionSteps.length) throw new BadRequestException('解决步骤不能为空');
    const item = await this.prisma.faultCase.update({ where: { id }, data: { ...dto, tags, possibleCauses: dto.possibleCauses ?? (current.possibleCauses as never), solutionSteps: dto.solutionSteps ?? (current.solutionSteps as never), screenshotUrls: dto.screenshotUrls ?? (current.screenshotUrls as never), verifiedAt: dto.verificationStatus === CaseVerificationStatus.VERIFIED ? new Date() : dto.verificationStatus ? null : current.verifiedAt, publishedAt: dto.status === ContentStatus.PUBLISHED && !current.publishedAt ? new Date() : current.publishedAt, searchText: await this.searchText({ title: next.title, symptom: next.symptom, errorCode: next.errorCode, tags, softwareId: next.softwareId, faultTypeId: next.faultTypeId }) }, include });
    await this.log(adminId, dto.status === ContentStatus.PUBLISHED ? 'CASE_PUBLISH' : 'CASE_UPDATE', id, { title: item.title }); return this.serialize(item);
  }
  async remove(id: string, adminId: string) { const item = await this.prisma.faultCase.findFirst({ where: { id, deletedAt: null } }); if (!item) throw new NotFoundException('案例不存在'); await this.prisma.faultCase.update({ where: { id }, data: { deletedAt: new Date(), status: ContentStatus.OFFLINE } }); await this.log(adminId, 'CASE_DELETE', id, { title: item.title }); return { success: true }; }
  async import(items: CreateCaseDto[], adminId: string) { const created = []; for (const item of items) created.push(await this.create(item, adminId)); return { imported: created.length, items: created }; }
  async export() { const items = await this.prisma.faultCase.findMany({ where: { deletedAt: null }, include, orderBy: { createdAt: 'desc' } }); return items.map((item) => this.serialize(item)); }
  private log(adminId: string, action: string, targetId: string, metadata: Prisma.InputJsonValue) { return this.prisma.activityLog.create({ data: { adminId, action, targetType: 'CASE', targetId, metadata } }); }
}