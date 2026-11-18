import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthPrincipal, CurrentUser } from '../common/auth-user.decorator';
import { UserGuard } from '../common/auth.guard';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AnonymousDto } from './dto/anonymous.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthService } from './auth.service';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('anonymous')
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  anonymous(@Body() dto: AnonymousDto) { return this.service.createAnonymous(dto.deviceKey); }

  @Post('admin/login')
  @Throttle({ default: { limit: 8, ttl: 60_000 } })
  adminLogin(@Body() dto: AdminLoginDto) { return this.service.adminLogin(dto.username, dto.password); }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  profile(@CurrentUser() user: AuthPrincipal) { return this.service.profile(user.sub, user.type); }

  @Patch('profile')
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  updateProfile(@CurrentUser() user: AuthPrincipal, @Body() dto: UpdateProfileDto) { return this.service.updateUser(user.sub, dto); }

  @Post('logout')
  logout() { return { success: true }; }
}