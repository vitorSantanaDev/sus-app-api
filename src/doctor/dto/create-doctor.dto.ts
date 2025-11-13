import {
  IsArray,
  IsISO8601,
  IsMongoId,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

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

export class CreateDoctorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  crm: string;

  @IsString()
  @IsNotEmpty()
  specialty: string;

  @IsMongoId({ message: 'O ID da unidade de saúde é inválido' })
  @IsNotEmpty()
  healthUnitId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DateAvailabilityDto)
  availability: DateAvailabilityDto[];
}
