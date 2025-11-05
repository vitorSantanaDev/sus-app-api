import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateAppointmentDto {
  @IsString()
  @IsOptional()
  @IsIn(['Confirmed', 'Cancelled'])
  status?: string;
}
