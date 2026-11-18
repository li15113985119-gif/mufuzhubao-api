import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { AdminRole } from '@prisma/client';
import { AuthPrincipal } from './auth-user.decorator';
import { ROLES_KEY } from './decorators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(protected readonly jwt: JwtService, protected readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace(/^Bearer\s+/i, '');
    if (!token) throw new UnauthorizedException('请先登录');
    try { request.user = await this.jwt.verifyAsync<AuthPrincipal>(token); return true; }
    catch { throw new UnauthorizedException('登录状态已失效'); }
  }
}

@Injectable()
export class UserGuard extends AuthGuard {
  async canActivate(context: ExecutionContext) {
    await super.canActivate(context);
    const user = context.switchToHttp().getRequest().user as AuthPrincipal;
    if (user.type !== 'user') throw new ForbiddenException('用户端接口不适用于管理员账号');
    return true;
  }
}

@Injectable()
export class AdminGuard extends AuthGuard {
  async canActivate(context: ExecutionContext) {
    await super.canActivate(context);
    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthPrincipal;
    if (user.type !== 'admin') throw new ForbiddenException('需要管理员账号');
    const roles = this.reflector.getAllAndOverride<AdminRole[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (roles?.length && !roles.includes(user.role as AdminRole)) throw new ForbiddenException('当前角色无权执行此操作');
    return true;
  }
}