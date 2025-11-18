import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateExamDto {
  @IsString()
  @IsOptional()
  @IsIn(['Cancelled'])
  status?: string;
}
