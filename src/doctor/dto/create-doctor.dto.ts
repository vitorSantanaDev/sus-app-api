import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AvailabilityScheduleDto {
  @IsString()
  @IsNotEmpty()
  dayOfWeek: string;

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilityScheduleDto)
  availability: AvailabilityScheduleDto[];
}
