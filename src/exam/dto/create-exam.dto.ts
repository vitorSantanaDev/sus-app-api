import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateExamDto {
  @IsString()
  @IsNotEmpty()
  examId: string;

  @IsMongoId({ message: 'O ID da unidade de saúde é inválido' })
  @IsNotEmpty()
  healthUnitId: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsMongoId({ message: 'O ID da disponibilidade é inválido' })
  @IsNotEmpty()
  availabilityId: string;
}
