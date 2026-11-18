import { Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { AdminRole, CaseVerificationStatus, ContentStatus, IssueStatus, ResourceCategory } from '@prisma/client';

export class AdminQueryDto {
  @IsOptional() @Type(() => Number) @IsInt() page?: number;
  @IsOptional() @Type(() => Number) @IsInt() pageSize?: number;
  @IsOptional() @IsString() keyword?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() softwareId?: string;
  @IsOptional() @IsString() faultTypeId?: string;
  @IsOptional() @IsString() category?: string;
}
export class CreateCaseDto {
  @IsString() @MinLength(4) @MaxLength(120) title!: string;
  @IsString() softwareId!: string;
  @IsString() @MaxLength(80) softwareVersion!: string;
  @IsString() faultTypeId!: string;
  @IsOptional() @IsString() @MaxLength(100) errorCode?: string;
  @IsString() @MinLength(5) symptom!: string;
  @IsArray() possibleCauses!: string[];
  @IsArray() solutionSteps!: string[];
  @IsOptional() @IsString() systemEnvironment?: string;
  @IsOptional() @IsArray() tags?: string[];
  @IsOptional() @IsArray() screenshotUrls?: string[];
  @IsOptional() @IsString() @MaxLength(200) sourceName?: string;
  @IsOptional() @IsString() @MaxLength(500) sourceUrl?: string;
  @IsOptional() @IsIn(Object.values(CaseVerificationStatus)) verificationStatus?: CaseVerificationStatus;
  @IsOptional() @IsIn(Object.values(ContentStatus)) status?: ContentStatus;
}
export class UpdateCaseDto {
  @IsOptional() @IsString() @MinLength(4) @MaxLength(120) title?: string;
  @IsOptional() @IsString() softwareId?: string;
  @IsOptional() @IsString() @MaxLength(80) softwareVersion?: string;
  @IsOptional() @IsString() faultTypeId?: string;
  @IsOptional() @IsString() @MaxLength(100) errorCode?: string;
  @IsOptional() @IsString() @MinLength(5) symptom?: string;
  @IsOptional() @IsArray() possibleCauses?: string[];
  @IsOptional() @IsArray() solutionSteps?: string[];
  @IsOptional() @IsString() systemEnvironment?: string;
  @IsOptional() @IsArray() tags?: string[];
  @IsOptional() @IsArray() screenshotUrls?: string[];
  @IsOptional() @IsString() @MaxLength(200) sourceName?: string;
  @IsOptional() @IsString() @MaxLength(500) sourceUrl?: string;
  @IsOptional() @IsIn(Object.values(CaseVerificationStatus)) verificationStatus?: CaseVerificationStatus;
  @IsOptional() @IsIn(Object.values(ContentStatus)) status?: ContentStatus;
}
export class CatalogItemDto {
  @IsString() @MinLength(2) @MaxLength(60) name!: string;
  @IsOptional() @IsString() @MaxLength(500) description?: string;
  @IsOptional() @IsString() icon?: string;
  @IsOptional() @Type(() => Number) @IsInt() sortOrder?: number;
  @IsOptional() @IsIn(['ACTIVE', 'DISABLED']) status?: string;
}
export class UpdateIssueDto {
  @IsOptional() @IsIn(Object.values(IssueStatus)) status?: IssueStatus;
  @IsOptional() @IsString() @MaxLength(3000) internalNote?: string;
}
export class ReplyIssueDto {
  @IsString() @MinLength(2) @MaxLength(3000) reply!: string;
  @IsOptional() @IsIn(Object.values(IssueStatus)) status?: IssueStatus;
}
export class CreateResourceDto {
  @IsString() @MinLength(2) @MaxLength(120) title!: string;
  @IsIn(Object.values(ResourceCategory)) category!: ResourceCategory;
  @IsOptional() @IsString() group?: string;
  @IsOptional() @IsString() tag?: string;
  @IsOptional() @Type(() => Number) @IsInt() estimatedTime?: number;
  @IsOptional() @IsArray() content?: unknown[];
  @IsOptional() @Type(() => Number) @IsInt() sortOrder?: number;  @IsOptional() @IsString() softwareId?: string;
  @IsOptional() @IsString() softwareVersion?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() fileUrl?: string;
  @IsOptional() @IsString() externalUrl?: string;
  @IsOptional() @IsString() fileType?: string;
  @IsOptional() @Type(() => Number) @IsInt() fileSize?: number;
  @IsOptional() @IsString() source?: string;
  @IsOptional() @IsIn(Object.values(ContentStatus)) status?: ContentStatus;
}
export class UpdateResourceDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsIn(Object.values(ResourceCategory)) category?: ResourceCategory;
  @IsOptional() @IsString() group?: string;
  @IsOptional() @IsString() tag?: string;
  @IsOptional() @Type(() => Number) @IsInt() estimatedTime?: number;
  @IsOptional() @IsArray() content?: unknown[];
  @IsOptional() @Type(() => Number) @IsInt() sortOrder?: number;  @IsOptional() @IsString() softwareId?: string;
  @IsOptional() @IsString() softwareVersion?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() fileUrl?: string;
  @IsOptional() @IsString() externalUrl?: string;
  @IsOptional() @IsString() fileType?: string;
  @IsOptional() @Type(() => Number) @IsInt() fileSize?: number;
  @IsOptional() @IsString() source?: string;
  @IsOptional() @IsIn(Object.values(ContentStatus)) status?: ContentStatus;
}
export class CreateAdminDto {
  @IsString() @MinLength(3) @MaxLength(64) username!: string;
  @IsString() @MinLength(8) @MaxLength(128) password!: string;
  @IsString() @MinLength(2) @MaxLength(60) displayName!: string;
  @IsIn(Object.values(AdminRole)) role!: AdminRole;
}
export class ImportCasesDto { @IsArray() cases!: CreateCaseDto[]; }
export class UpdateSettingDto { @IsString() key!: string; @IsOptional() value?: unknown; }

