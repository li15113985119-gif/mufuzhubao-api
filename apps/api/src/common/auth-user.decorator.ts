import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export interface AuthPrincipal { sub: string; type: 'user' | 'admin'; role?: string; username?: string; }
export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext): AuthPrincipal | undefined => context.switchToHttp().getRequest().user);