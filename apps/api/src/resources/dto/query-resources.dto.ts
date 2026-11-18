import { IsIn, IsOptional, IsString } from 'class-validator';
export class QueryResourcesDto {
  @IsOptional() @IsString() keyword?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() softwareId?: string;
  @IsOptional() @IsIn(['latest', 'downloads']) sort?: 'latest' | 'downloads';
}