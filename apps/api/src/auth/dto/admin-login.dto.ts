import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
export class AdminLoginDto {
  @ApiProperty() @IsString() @MinLength(3) @MaxLength(64) username!: string;
  @ApiProperty() @IsString() @MinLength(6) @MaxLength(128) password!: string;
}