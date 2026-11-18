import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
export class AnonymousDto {
  @ApiProperty({ description: '客户端持久化的设备标识' })
  @IsString() @MinLength(8) @MaxLength(128)
  deviceKey!: string;
}