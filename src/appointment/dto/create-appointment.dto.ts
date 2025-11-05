import { Type } from 'class-transformer';
import { IsDate, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsDate({ message: 'A data e hora são inválidas' })
  @Type(() => Date)
  @IsNotEmpty()
  dateTime: Date;

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
