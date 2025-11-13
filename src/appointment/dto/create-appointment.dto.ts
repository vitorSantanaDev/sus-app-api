import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  time: string;

  @IsMongoId({ message: 'O ID da disponibilidade é inválido' })
  @IsNotEmpty()
  availabilityId: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsMongoId({ message: 'O ID do médico é inválido' })
  @IsNotEmpty()
  doctorId: string;

  @IsMongoId({ message: 'O ID da unidade de saúde é inválido' })
  @IsNotEmpty()
  healthUnitId: string;
}
