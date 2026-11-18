import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
export class CaseFeedbackDto {
  @IsBoolean() isSolved!: boolean;
  @IsOptional() @IsString() @MaxLength(1000) content?: string;
}