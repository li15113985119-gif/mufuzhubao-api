import { BadRequestException, Injectable } from '@nestjs/common';
import { AdminStatus, Prisma } from '@prisma/client';
import { hash } from 'bcryptjs';
import { normalizePagination } from '../../common/helpers';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminQueryDto, CreateAdminDto, UpdateSettingDto } from '../dto/admin.dto';
@Injectable()
export class AdminSystemService {
  constructor(private readonly prisma: PrismaService) {}
  async feedback(query: AdminQueryDto) {
    const { page, pageSize } = normalizePagination(query.page, query.pageSize);
    const [items, total] = await Promise.all([this.prisma.caseFeedback.findMany({ include: { case: { select: { id: true, title: true } }, user: { select: { id: true, nickname: true } } }, orderBy: { createdAt: 'desc' }, skip: (page - 1) * pageSize, take: pageSize }), this.prisma.caseFeedback.count()]);
    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }
  markFeedbackHandled(id: string) { return this.prisma.caseFeedback.update({ where: { id }, data: { handledAt: new Date() } }); }
  admins() { return this.prisma.admin.findMany({ select: { id: true, username: true, displayName: true, role: true, status: true, lastLoginAt: true, createdAt: true }, orderBy: { createdAt: 'desc' } }); }
  async createAdmin(dto: CreateAdminDto, actorId: string) { const passwordHash = await hash(dto.password, 12); const item = await this.prisma.admin.create({ data: { username: dto.username, passwordHash, displayName: dto.displayName, role: dto.role }, select: { id: true, username: true, displayName: true, role: true, status: true, createdAt: true } }); await this.prisma.activityLog.create({ data: { adminId: actorId, action: 'ADMIN_CREATE', targetType: 'ADMIN', targetId: item.id, metadata: { username: item.username, role: item.role } } }); return item; }
  async disableAdmin(id: string, actorId: string) { if (id === actorId) throw new BadRequestException('不能禁用当前登录账号'); const item = await this.prisma.admin.update({ where: { id }, data: { status: AdminStatus.DISABLED }, select: { id: true, username: true, status: true } }); await this.prisma.activityLog.create({ data: { adminId: actorId, action: 'ADMIN_DISABLE', targetType: 'ADMIN', targetId: id } }); return item; }
  async logs(query: AdminQueryDto) { const { page, pageSize } = normalizePagination(query.page, query.pageSize); const [items, total] = await Promise.all([this.prisma.activityLog.findMany({ include: { admin: { select: { username: true, displayName: true } }, user: { select: { id: true } } }, orderBy: { createdAt: 'desc' }, skip: (page - 1) * pageSize, take: pageSize }), this.prisma.activityLog.count()]); return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }; }
  settings() { return this.prisma.systemSetting.findMany({ orderBy: { key: 'asc' } }); }
  updateSetting(dto: UpdateSettingDto) { return this.prisma.systemSetting.upsert({ where: { key: dto.key }, create: { key: dto.key, value: (dto.value ?? null) as Prisma.InputJsonValue }, update: { value: (dto.value ?? null) as Prisma.InputJsonValue } }); }
}