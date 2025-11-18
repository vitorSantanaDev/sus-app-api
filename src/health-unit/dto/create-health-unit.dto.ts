import { Type } from 'class-transformer';
import {
  IsArray,
  IsString,
  IsISO8601,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';

class DateAvailabilityDto {
  @IsISO8601(
    { strict: true },
    { message: 'A data deve estar no formato YYYY-MM-DD' },
  )
  @IsNotEmpty()
  date: string;

  @IsArray()
  @IsString({ each: true })
  times: string[];
}

class ExamAvailabilityDto {
  @IsString()
  @IsNotEmpty()
  examId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DateAvailabilityDto)
  availability: DateAvailabilityDto[];
}

export class CreateHealthUnitDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExamAvailabilityDto)
  availableExams: ExamAvailabilityDto[];
}
