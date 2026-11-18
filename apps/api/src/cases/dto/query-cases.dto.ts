import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
export class QueryCasesDto {
  @IsOptional() @IsString() keyword?: string;
  @IsOptional() @IsString() softwareId?: string;
  @IsOptional() @IsString() software?: string;
  @IsOptional() @IsString() faultTypeId?: string;
  @IsOptional() @IsString() faultType?: string;
  @IsOptional() @IsString() version?: string;
  @IsOptional() @IsIn(['latest', 'views', 'favorites']) sort?: 'latest' | 'views' | 'favorites';
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) pageSize?: number;
}