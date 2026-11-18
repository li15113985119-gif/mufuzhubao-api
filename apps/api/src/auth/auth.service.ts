import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminStatus, UserStatus } from '@prisma/client';
import { compare } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  async createAnonymous(deviceKey: string) {
    let user = await this.prisma.user.findUnique({ where: { deviceKey } });
    if (!user) {
      user = await this.prisma.user.create({ data: { deviceKey, nickname: '实训同学' } });
    }
    if (user.status !== UserStatus.ACTIVE) throw new UnauthorizedException('账号已停用');
    const accessToken = await this.jwt.signAsync({ sub: user.id, type: 'user', role: user.role });
    return { accessToken, user };
  }

  async adminLogin(username: string, password: string) {
    const admin = await this.prisma.admin.findUnique({ where: { username } });
    if (!admin || admin.status !== AdminStatus.ACTIVE) throw new UnauthorizedException('用户名或密码错误');
    const valid = await compare(password, admin.passwordHash);
    if (!valid) throw new UnauthorizedException('用户名或密码错误');
    await this.prisma.admin.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });
    await this.prisma.activityLog.create({ data: { adminId: admin.id, action: 'ADMIN_LOGIN', targetType: 'ADMIN', targetId: admin.id } });
    const accessToken = await this.jwt.signAsync({ sub: admin.id, type: 'admin', role: admin.role, username: admin.username });
    return { accessToken, admin: { id: admin.id, username: admin.username, displayName: admin.displayName, role: admin.role } };
  }

  async profile(principalId: string, type: 'user' | 'admin') {
    if (type === 'admin') {
      return this.prisma.admin.findUnique({
        where: { id: principalId },
        select: { id: true, username: true, displayName: true, role: true, status: true, lastLoginAt: true },
      });
    }
    return this.prisma.user.findUnique({
      where: { id: principalId },
      select: { id: true, deviceKey: true, nickname: true, avatarUrl: true, className: true, role: true, status: true, createdAt: true },
    });
  }

  async updateUser(id: string, data: { nickname?: string; avatarUrl?: string; className?: string }) {
    return this.prisma.user.update({ where: { id }, data });
  }
}