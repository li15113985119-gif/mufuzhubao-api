import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
export class CreateIssueDto {
  @ApiProperty() @IsString() @MinLength(2) @MaxLength(30) name!: string;
  @ApiProperty() @IsString() @MinLength(2) @MaxLength(60) className!: string;
  @ApiProperty() @IsString() @MinLength(5) @MaxLength(100) contact!: string;
  @IsString() softwareId!: string;
  @IsString() @MaxLength(60) softwareVersion!: string;
  @IsString() faultTypeId!: string;
  @IsOptional() @IsString() @MaxLength(500) symptom?: string;
  @IsOptional() @IsString() @MaxLength(100) errorCode?: string;
  @IsString() @MinLength(8) @MaxLength(3000) description!: string;
  @IsOptional() @IsArray() screenshotUrls?: string[];
}