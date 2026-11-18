import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
export class UpdateProfileDto {
  @IsOptional() @IsString() @MaxLength(30) nickname?: string;
  @IsOptional() @IsUrl({ require_tld: false }) @MaxLength(500) avatarUrl?: string;
  @IsOptional() @IsString() @MaxLength(50) className?: string;
}