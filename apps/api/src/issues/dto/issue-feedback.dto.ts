import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
export class IssueFeedbackDto {
  @IsBoolean() isSolved!: boolean;
  @IsOptional() @IsString() @MaxLength(1000) content?: string;
}